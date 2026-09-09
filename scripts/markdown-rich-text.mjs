const textNode = (text) => ({ detail: 0, format: 0, mode: "normal", style: "", text, type: "text", version: 1 });
const cleanInlineMarkdown = (text) => text
  .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
  .replace(/[*_`~]+/g, "")
  .trim();

const inlineNodes = (text) => {
  const cleaned = cleanInlineMarkdown(text);
  const nodes = [];
  const expression = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s]+)/g;
  let cursor = 0;
  for (const match of cleaned.matchAll(expression)) {
    if (match.index > cursor) nodes.push(textNode(cleaned.slice(cursor, match.index)));
    const url = match[2] || match[3];
    const label = match[1] || url.replace(/[.,;:!?]+$/, "");
    const trailing = match[3]?.slice(label.length) || "";
    nodes.push({ children: [textNode(label)], direction: "ltr", fields: { linkType: "custom", newTab: true, url }, format: "", indent: 0, type: "link", version: 3 });
    if (trailing) nodes.push(textNode(trailing));
    cursor = match.index + match[0].length;
  }
  if (cursor < cleaned.length) nodes.push(textNode(cleaned.slice(cursor)));
  return nodes.length ? nodes : [textNode(cleaned)];
};

const blockNode = (type, text, extra = {}) => ({ children: inlineNodes(text), direction: "ltr", format: "", indent: 0, type, version: 1, ...extra });

export const markdownRichText = (markdown) => {
  const children = [];
  let paragraphLines = [];
  let list = null;
  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    children.push(blockNode("paragraph", paragraphLines.join(" ")));
    paragraphLines = [];
  };
  const flushList = () => {
    if (!list) return;
    children.push({
      children: list.items.map((item) => ({ children: [blockNode("paragraph", item)], direction: "ltr", format: "", indent: 0, type: "listitem", value: 1, version: 1 })),
      direction: "ltr", format: "", indent: 0, listType: list.type,
      start: 1, tag: list.type === "number" ? "ol" : "ul", type: "list", version: 1,
    });
    list = null;
  };

  for (const rawLine of markdown.replace(/\r/g, "").split("\n")) {
    const line = rawLine.trim();
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    const numberedMatch = line.match(/^\d+[.)]\s+(.+)$/);
    if (headingMatch) {
      flushParagraph(); flushList();
      if (headingMatch[1].length > 1) children.push(blockNode("heading", headingMatch[2], { tag: headingMatch[1].length === 2 ? "h2" : "h3" }));
    } else if (bulletMatch || numberedMatch) {
      flushParagraph();
      const type = numberedMatch ? "number" : "bullet";
      if (list && list.type !== type) flushList();
      if (!list) list = { type, items: [] };
      list.items.push((bulletMatch || numberedMatch)[1]);
    } else if (!line) {
      flushParagraph(); flushList();
    } else if (!/^(!\[|---+$)/.test(line)) {
      flushList(); paragraphLines.push(line);
    }
  }
  flushParagraph(); flushList();
  return { root: { children, direction: "ltr", format: "", indent: 0, type: "root", version: 1 } };
};
