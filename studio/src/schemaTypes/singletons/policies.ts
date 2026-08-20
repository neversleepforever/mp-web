import { defineType, defineField, defineArrayMember } from "sanity"
import { ImageIcon, HelpCircleIcon } from "@sanity/icons"

export const policies = defineType({
  name: "policies",
  title: "Policies & FAQs",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Main image for the left side of the Policies page (and the mobile hero).",
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
      name: "sections",
      title: "Policy Sections",
      description:
        "The boxed policy stack, in order. Add an Image between sections to place a framed photo in the flow (the page renders it in the horizontal vignette).",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "policySection",
          title: "Policy Section",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [{ title: "Bullet", value: "bullet" }],
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                      { title: "Emphasis", value: "em" },
                    ],
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        }),
        defineArrayMember({
          type: "image",
          icon: ImageIcon,
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      description: "Accordion items under the Policies stack.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          title: "FAQ",
          icon: HelpCircleIcon,
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "question" },
          },
        }),
      ],
    }),
  ],
})
