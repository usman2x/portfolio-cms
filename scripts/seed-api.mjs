import { readFile, readdir } from "node:fs/promises";
import { extname } from "node:path";
import { globals, posts, richText, tags, testimonials, workExperience } from "./seed-data.mjs";
import { markdownRichText } from "./markdown-rich-text.mjs";

const mode = process.argv.includes("--core") ? "core" : "dev";
const refreshMedia = process.argv.includes("--refresh-media");
const selectedPosts = mode === "core"
  ? posts.filter((post) => post.tagSlugs.includes("case-study"))
  : posts;
const selectedTagSlugs = new Set(selectedPosts.flatMap((post) => post.tagSlugs));
const selectedTags = tags.filter((tag) => selectedTagSlugs.has(tag.slug));

const postContent = async (sample) => {
  if (!sample.referenceCaseStudy) return richText(sample.sections);
  const source = new URL(`./core-content/case-studies/${sample.referenceCaseStudy}`, import.meta.url);
  return markdownRichText(await readFile(source, "utf8"));
};

const baseUrl = (
  process.env.CMS_API_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "http://localhost:3001"
).replace(/\/+$/, "");
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required.");
}

const target = new URL(baseUrl);
const isLocalTarget = ["127.0.0.1", "::1", "localhost"].includes(
  target.hostname
);
if (!isLocalTarget && process.env.ALLOW_REMOTE_SEED !== "true") {
  throw new Error(
    "Refusing to seed a non-local CMS. Set ALLOW_REMOTE_SEED=true to override."
  );
}

const request = async (pathname, { body, form, method = "GET", token } = {}) => {
  const response = await fetch(new URL(pathname, `${baseUrl}/`), {
    method,
    headers: {
      ...(body && !form ? { "content-type": "application/json" } : {}),
      ...(token ? { authorization: `JWT ${token}` } : {}),
    },
    body: form || (body ? JSON.stringify(body) : undefined),
  });
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { data, ok: response.ok, status: response.status };
};

const requireSuccess = (result, label) => {
  if (result.ok) return result.data;
  throw new Error(
    `${label} failed (${result.status}): ${JSON.stringify(result.data)}`
  );
};

const login = () =>
  request("/api/users/login", {
    method: "POST",
    body: { email, password },
  });

let auth = await login();
if (!auth.ok) {
  const registration = await request("/api/users/first-register", {
    method: "POST",
    body: {
      email,
      password,
      name: "Local CMS Admin",
      role: "admin",
      isActive: true,
    },
  });

  if (!registration.ok) {
    throw new Error(
      `Could not log in or create the first admin. Check the seed credentials. Login: ${
        auth.status
      }; registration: ${registration.status} ${JSON.stringify(
        registration.data
      )}`
    );
  }

  auth = registration;
}

const token = auth.data?.token;
const authorID = auth.data?.user?.id;
if (!token || !authorID) {
  throw new Error(
    "Payload authentication succeeded without returning a token and user id."
  );
}

const findBySlug = async (collection, slug) => {
  const query = new URLSearchParams({
    depth: "0",
    limit: "1",
    "where[slug][equals]": slug,
  });
  const result = requireSuccess(
    await request(`/api/${collection}?${query.toString()}`, { token }),
    `Find ${collection}/${slug}`
  );
  return result.docs?.[0] || null;
};

const findByName = async (collection, name) => {
  const query = new URLSearchParams({
    depth: "0",
    limit: "1",
    "where[name][equals]": name,
  });
  const result = requireSuccess(
    await request(`/api/${collection}?${query.toString()}`, { token }),
    `Find ${collection}/${name}`
  );
  return result.docs?.[0] || null;
};

const findMediaByAlt = async (alt) => {
  const query = new URLSearchParams({ depth: "0", limit: "1", "where[alt][equals]": alt });
  const result = requireSuccess(
    await request(`/api/media?${query.toString()}`, { token }),
    `Find media/${alt}`
  );
  return result.docs?.[0] || null;
};

const mediaMimeType = (filename) => ({
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
})[extname(filename).toLowerCase()] || "application/octet-stream";

const gallerySources = async (sample) => {
  const base = new URL("./core-content/images/", import.meta.url);
  if (sample.projectGalleryDirectory) {
    const directory = new URL(`${sample.projectGalleryDirectory}/`, base);
    const names = (await readdir(directory)).filter((name) => /\.(gif|jpe?g|png)$/i.test(name)).sort();
    return names.map((name) => ({ name, source: new URL(name, directory) }));
  }
  return (sample.projectGalleryFiles || []).map((name) => ({ name, source: new URL(name, base) }));
};

const uploadProjectGallery = async (sample) => {
  const sources = await gallerySources(sample);
  const saved = [];
  for (const [index, asset] of sources.entries()) {
    const filename = `${sample.slug}-${String(index + 1).padStart(2, "0")}${extname(asset.name).toLowerCase()}`;
    const alt = `${sample.title} screenshot ${index + 1}`;
    const existing = await findMediaByAlt(alt);
    if (existing && !refreshMedia) {
      saved.push({ ...existing, sourceName: asset.name });
      continue;
    }

    const bytes = await readFile(asset.source);
    const form = new FormData();
    form.append("file", new Blob([bytes], { type: mediaMimeType(asset.name) }), filename);
    form.append("_payload", JSON.stringify({
      alt,
      caption: `${sample.title} — screenshot ${index + 1}`,
      usageType: index === 0 ? "cover" : "inline",
      isPublic: true,
    }));
    const uploaded = requireSuccess(
      await request(existing ? `/api/media/${existing.id}` : "/api/media", {
        method: existing ? "PATCH" : "POST",
        token,
        form,
      }),
      `${existing ? "Refresh" : "Upload"} media ${filename}`
    );
    saved.push({ ...(uploaded.doc || uploaded), sourceName: asset.name });
    console.log(`${existing ? "refreshed" : "uploaded"} media: ${filename}`);
  }

  if (sample.projectGalleryCoverMatch) {
    saved.sort((a, b) => Number(!a.sourceName.includes(sample.projectGalleryCoverMatch)) - Number(!b.sourceName.includes(sample.projectGalleryCoverMatch)));
  }
  return saved;
};

const findByCompany = async (company) => {
  const query = new URLSearchParams({
    depth: "0",
    limit: "1",
    "where[company][equals]": company,
  });
  const result = requireSuccess(
    await request(`/api/work-experience?${query.toString()}`, { token }),
    `Find work-experience/${company}`
  );
  return result.docs?.[0] || null;
};

const tagIDs = new Map();
for (const tag of selectedTags) {
  const existing = await findBySlug("tags", tag.slug);
  const saved = existing
    ? requireSuccess(
        await request(`/api/tags/${existing.id}`, {
          method: "PATCH",
          token,
          body: tag,
        }),
        `Update tag ${tag.slug}`
      )
    : requireSuccess(
        await request("/api/tags", {
          method: "POST",
          token,
          body: tag,
        }),
        `Create tag ${tag.slug}`
      );

  tagIDs.set(tag.slug, saved.doc?.id || saved.id || existing?.id);
}

const postIDs = new Map();
for (const sample of selectedPosts) {
  const existing = await findBySlug("posts", sample.slug);
  const gallery = sample.tagSlugs.includes("case-study") ? await uploadProjectGallery(sample) : [];
  const galleryIDs = gallery.map((media) => media.id).filter(Boolean);
  const body = {
    title: sample.title,
    slug: sample.slug,
    excerpt: sample.excerpt,
    content: await postContent(sample),
    author: authorID,
    tags: sample.tagSlugs.map((slug) => tagIDs.get(slug)),
    status: "published",
    _status: "published",
    seoTitle: sample.seoTitle,
    seoDescription: sample.seoDescription,
    readingTimeMinutes: sample.readingTimeMinutes,
    featured: sample.featured,
    projectRole: sample.projectRole,
    coverImage: galleryIDs[0] || undefined,
    projectGallery: galleryIDs,
  };

  if (existing) {
    const saved = requireSuccess(
      await request(`/api/posts/${existing.id}`, {
        method: "PATCH",
        token,
        body,
      }),
      `Update post ${sample.slug}`
    );
    postIDs.set(sample.slug, saved.doc?.id || saved.id || existing.id);
    console.log(`updated post: ${sample.slug}`);
  } else {
    const saved = requireSuccess(
      await request("/api/posts", {
        method: "POST",
        token,
        body,
      }),
      `Create post ${sample.slug}`
    );
    postIDs.set(sample.slug, saved.doc?.id || saved.id);
    console.log(`created post: ${sample.slug}`);
  }
}

for (const entry of mode === "dev" ? workExperience : []) {
  const existing = await findByCompany(entry.company);
  const body = { ...entry, highlights: entry.highlights.map((text) => ({ text })) };
  const result = existing
    ? await request(`/api/work-experience/${existing.id}`, { method: "PATCH", token, body })
    : await request("/api/work-experience", { method: "POST", token, body });
  requireSuccess(result, `${existing ? "Update" : "Create"} work experience ${entry.company}`);
  console.log(`${existing ? "updated" : "created"} work experience: ${entry.company}`);
}

for (const testimonial of testimonials) {
  const existing = await findByName("testimonials", testimonial.name);
  const result = existing
    ? await request(`/api/testimonials/${existing.id}`, {
        method: "PATCH",
        token,
        body: testimonial,
      })
    : await request("/api/testimonials", {
        method: "POST",
        token,
        body: testimonial,
      });
  requireSuccess(result, `${existing ? "Update" : "Create"} testimonial ${testimonial.name}`);
  console.log(`${existing ? "updated" : "created"} testimonial: ${testimonial.name}`);
}

for (const [slug, seed] of mode === "dev" ? Object.entries(globals) : []) {
  const body = { ...seed };
  if (slug === "home-page") {
    body.featuredProjects = body.featuredProjectSlugs.map((projectSlug) => postIDs.get(projectSlug)).filter(Boolean);
    delete body.featuredProjectSlugs;
  }
  requireSuccess(await request(`/api/globals/${slug}`, { method: "POST", token, body }), `Update global ${slug}`);
  console.log(`updated global: ${slug}`);
}

const publicPosts = requireSuccess(
  await request("/api/posts?depth=1&limit=100&where[status][equals]=published"),
  "Verify public posts"
);

console.log(
  `${mode} seed complete: ${
    publicPosts.totalDocs ?? publicPosts.docs?.length ?? 0
  } public posts`
);
console.log(`public API: ${baseUrl}/api/posts`);
