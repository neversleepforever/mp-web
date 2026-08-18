import { defineType, defineField } from "sanity"
import { ImageIcon } from "@sanity/icons"

export const services = defineType({
  name: "services",
  title: "Services",
  type: "document",
  fields: [
      defineField({
          name: "image",
          title: "Image",
          type: "image",
          description: "Main image for the left side of the Services page.",
          icon: ImageIcon,
          options: { hotspot: true },
        }),
      defineField({
          name: "imageSecondary",
          title: "Second Image",
          type: "image",
          description:
            "Desktop/tablet only: the left image steps to this one as the text is scrolled. Leave empty to keep a single image.",
          icon: ImageIcon,
          options: { hotspot: true },
        }),
      defineField({
          name: "imageTertiary",
          title: "Third Image",
          type: "image",
          description:
            "Desktop/tablet only: the final step of the scroll sequence. Leave empty to swap between two.",
          icon: ImageIcon,
          options: { hotspot: true },
        }),
        defineField({
          name: "bannerEmail",
          title: "Banner Email",
          type: "string",
          validation: (Rule) => Rule.required().email(),
        }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 1", value: "h1" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },

        {
          type: "object",
          name: "servicesSection",
          title: "Services Section",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] }),
          ],
        },
        {
          type: "object",
          name: "ratesSection",
          title: "Rates Section",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "Banner", title: "Banner", type: "array", of: [{ type: "block" }] }),
            defineField({ name: "rates", title: "Rates", type: "array", of: [{ type: "block" }] }),
          ],
        },
        {
          type: "object",
          name: "outcallSection",
          title: "Outcall Section",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] }),
          ],
        },
        {
          type: "object",
          name: "virtualSection",
          title: "Virtual Section",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] }),
          ],
        },
      ],
    }),
  ],
})
