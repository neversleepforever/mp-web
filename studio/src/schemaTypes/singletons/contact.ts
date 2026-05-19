import { defineField, defineType } from "sanity"
import { DocumentIcon } from "@sanity/icons"

export const contact = defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "socials1",
      title: "Socials 1",
      type: "array",
      description: "Social media links for first block",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "socials2",
      title: "Socials 2",
      type: "array",
      description: "Social media links for second block",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "siteCredits",
      title: "Site Credits",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                  {
                    name: "openInNewTab",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Contact Page",
        subtitle: "Singleton document",
      }
    },
  },
})
