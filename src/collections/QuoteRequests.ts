import type { CollectionConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";

export const QuoteRequests: CollectionConfig = {
  slug: "quote-requests",
  labels: { singular: "Contact Request", plural: "Contact Requests" },
  admin: {
    useAsTitle: "context",
    defaultColumns: ["helpType", "name", "email", "status", "createdAt"],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    { name: "name", type: "text" },
    { name: "email", type: "email", index: true },
    { name: "phone", type: "text" },
    { name: "company", type: "text" },
    { name: "helpType", type: "text", required: true, label: "Intent" },
    { name: "workType", type: "text", label: "Engagement type" },
    { name: "timeline", type: "text" },
    { name: "budget", type: "text" },
    { name: "context", type: "textarea", required: true },
    {
      name: "wantsReply",
      type: "checkbox",
      defaultValue: false,
      label: "Reply requested",
    },
    {
      name: "preferredContact",
      type: "text",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Closed", value: "closed" },
        { label: "Spam", value: "spam" },
      ],
    },
    { name: "sourceUrl", type: "text" },
    { name: "userAgent", type: "text", admin: { readOnly: true } },
  ],
};
