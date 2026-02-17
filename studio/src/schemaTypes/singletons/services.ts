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
        defineField({
          name: "email",
          title: "Banner Email",
          type: "string",
          description: "Email address for the banner.",
          validation: (Rule) =>
            Rule.required().email().error("Please enter a valid email address"),
        }),
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
