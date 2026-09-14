export type QuoteRequestInput = {
  budget?: string;
  company?: string;
  context: string;
  email?: string;
  helpType: string;
  name?: string;
  phone?: string;
  preferredContact?: string;
  sourceUrl?: string;
  timeline?: string;
  wantsReply: boolean;
  workType?: string;
};

export type QuoteRequestOptions = Record<
  "budget" | "helpType" | "preferredContact" | "timeline" | "workType",
  string[]
>;

const clean = (value: unknown, max: number): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export const parseQuoteRequest = (
  body: Record<string, unknown>,
  quoteOptions: QuoteRequestOptions,
): QuoteRequestInput => {
  const input = {
    name: clean(body.name, 120),
    email: clean(body.email, 254).toLowerCase(),
    phone: clean(body.phone, 40),
    company: clean(body.company, 160),
    helpType: clean(body.help_type, 120),
    workType: clean(body.work_type, 120),
    timeline: clean(body.timeline, 80),
    budget: clean(body.budget, 80),
    context: clean(body.context, 5000),
    preferredContact: clean(body.preferred_contact, 80),
    wantsReply: body.wants_reply === true || body.wants_reply === "true",
    sourceUrl: clean(body.source_url, 500),
  };

  const isCommercial =
    input.helpType === "Project or services" ||
    input.helpType === "Consultancy";

  if (input.context.length < 10) {
    throw new Error("Please provide a message with at least 10 characters.");
  }

  if (isCommercial) input.wantsReply = true;

  if (input.wantsReply && !input.name) {
    throw new Error("Please provide your name so I can reply.");
  }

  if (
    input.wantsReply &&
    input.preferredContact === "WhatsApp" &&
    !/^\+?[\d\s().-]{7,30}$/.test(input.phone)
  ) {
    throw new Error("Please provide a valid WhatsApp phone number.");
  }

  if (
    input.wantsReply &&
    input.preferredContact !== "WhatsApp" &&
    !/^\S+@\S+\.\S+$/.test(input.email)
  ) {
    throw new Error("Please provide a valid email address so I can reply.");
  }

  if (!quoteOptions.helpType.includes(input.helpType)) {
    throw new Error("The selected intent is invalid.");
  }

  const requiredOptionKeys: (keyof QuoteRequestOptions)[] = isCommercial
    ? ["workType", "timeline", "budget", "preferredContact"]
    : input.wantsReply
      ? ["preferredContact"]
      : [];

  for (const key of requiredOptionKeys) {
    if (!quoteOptions[key].includes(input[key] || ""))
      throw new Error("One or more selected options are invalid.");
  }

  return input;
};
