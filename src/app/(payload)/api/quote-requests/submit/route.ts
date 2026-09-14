import config from "@payload-config";
import { getPayload } from "payload";

import { parseQuoteRequest } from "@/lib/quoteRequests";

const attempts = new Map<string, { count: number; expires: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const allowedOrigins = (): Set<string> =>
  new Set(
    [
      process.env.UI_PUBLIC_URL,
      ...(process.env.QUOTE_ALLOWED_ORIGINS || "").split(","),
      "http://localhost:3000",
    ]
      .map((value) => value?.trim().replace(/\/$/, ""))
      .filter(Boolean) as string[],
  );

const corsHeaders = (origin: string | null): HeadersInit =>
  origin && allowedOrigins().has(origin)
    ? {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Origin": origin,
        Vary: "Origin",
      }
    : {};

export const OPTIONS = async (request: Request): Promise<Response> => {
  const origin = request.headers.get("origin");
  if (!origin || !allowedOrigins().has(origin)) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, { headers: corsHeaders(origin), status: 204 });
};

export const POST = async (request: Request): Promise<Response> => {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);
  if (origin && !allowedOrigins().has(origin)) {
    return Response.json(
      { message: "Origin not allowed." },
      { headers, status: 403 },
    );
  }

  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const client = forwarded || request.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const previous = attempts.get(client);
  const rate =
    !previous || previous.expires <= now
      ? { count: 1, expires: now + WINDOW_MS }
      : { count: previous.count + 1, expires: previous.expires };
  attempts.set(client, rate);
  if (rate.count > MAX_ATTEMPTS) {
    return Response.json(
      { message: "Too many requests. Please try again later." },
      { headers, status: 429 },
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (body.website) {
      return Response.json({ ok: true }, { headers, status: 201 });
    }

    const payload = await getPayload({ config });
    const quotePage = await payload.findGlobal({
      slug: "quote-page",
      overrideAccess: true,
    });
    const values = (options: typeof quotePage.helpTypes) =>
      (options || []).map((option) => option.value).filter(Boolean);
    const input = parseQuoteRequest(body, {
      helpType: [
        ...new Set([
          ...values(quotePage.helpTypes),
          "Feedback",
          "Project or services",
          "Consultancy",
          "General message",
        ]),
      ],
      workType: values(quotePage.workTypes),
      timeline: values(quotePage.timelines),
      budget: values(quotePage.budgets),
      preferredContact: values(quotePage.contactMethods),
    });
    await payload.create({
      collection: "quote-requests",
      data: {
        ...input,
        status: "new",
        userAgent: (request.headers.get("user-agent") || "").slice(0, 500),
      },
      overrideAccess: true,
    });

    return Response.json({ ok: true }, { headers, status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to submit your request.";
    return Response.json({ message }, { headers, status: 400 });
  }
};
