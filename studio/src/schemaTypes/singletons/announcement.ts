import { defineField, defineType } from "sanity"
import { BellIcon } from "@sanity/icons"

export const announcement = defineType({
  name: "announcement",
  title: "Announcement Banner",
  type: "document",
  icon: BellIcon,
  fields: [
    defineField({
      name: "enabled",
      title: "Show banner",
      type: "boolean",
      description: "Turn the black bar above the navigation on or off.",
      initialValue: true,
    }),
    defineField({
      name: "newsletterText",
      title: "Newsletter CTA text",
      type: "string",
      description: 'The underlined link, e.g. "Newsletter Sign-up".',
      initialValue: "Newsletter Sign-up",
    }),
    defineField({
      name: "newsletterUrl",
      title: "Newsletter CTA link",
      type: "url",
      description: "Where the underlined link goes. Include https://",
    }),
    defineField({
      name: "bookingText",
      title: "Announcement text",
      type: "string",
      description: 'Plain text beside the link, e.g. "Now Booking in Mexico City".',
      initialValue: "Now Booking in Mexico City",
    }),
    defineField({
      name: "bookingUrl",
      title: "Announcement text link",
      type: "url",
      description:
        "Optional. When set, the announcement text becomes a link. Include https://",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https", "mailto"] }),
    }),
  ],
  preview: {
    select: { enabled: "enabled", subtitle: "bookingText" },
    prepare({ enabled, subtitle }) {
      return {
        title: `Announcement Banner ${enabled ? "(on)" : "(off)"}`,
        subtitle,
      }
    },
  },
})
