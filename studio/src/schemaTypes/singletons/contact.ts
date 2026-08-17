import { defineField, defineType } from "sanity"
import { DocumentIcon } from "@sanity/icons"

export const contact = defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        'Title at the top of the page — e.g. "Contact" or "Directory". Defaults to "Contact" if left empty.',
      initialValue: "Contact",
    }),
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
    defineField({
      name: "banners",
      title: "Banners",
      description:
        "Banner images shown under Site Credits. Animated GIFs are kept animated. Drag to reorder — each opens its link in a new tab.",
      type: "array",
      of: [
        defineField({
          name: "banner",
          title: "Banner",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              description: "GIF, PNG or JPG.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "Link URL",
              type: "url",
              description: "Opens in a new tab.",
            }),
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "alt", subtitle: "url", media: "image" },
            prepare({ title, subtitle, media }) {
              return { title: title || "Banner", subtitle, media }
            },
          },
        }),
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
