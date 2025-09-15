import { defineType, defineField } from "sanity"

export const services = defineType({
  name: "services",
  title: "Services",
  type: "document",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "object",
          name: "servicesSection",
          title: "Services Section",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [{ type: "block" }],
            }),
          ],
          preview: {
            select: { title: "title" },
            prepare: ({ title }) => ({
              title: title || "Services Section",
              subtitle: "Custom section",
            }),
          },
        },
        {
          type: "object",
          name: "ratesSection",
          title: "Rates Section",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
                name: "banner",
                title: "Banner",
                type: "string",
              }),
            defineField({
              name: "rates",
              title: "Rates",
              type: "array",
              of: [{ type: "block" }],
            }),
          ],
          preview: {
            select: { title: "title" },
            prepare: ({ title }) => ({
              title: title || "Rates Section",
              subtitle: "Custom section",
            }),
          },
        },
        {
          type: "object",
          name: "borderedImage",
          title: "Bordered Image",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "caption", media: "image" },
            prepare: ({ title, media }) => ({
              title: title || "Bordered Image",
              media,
            }),
          },
        },
      ],
    }),
  ],
})
