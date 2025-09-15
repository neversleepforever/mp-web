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
      of: [{ type: "link" }],
    }),
    defineField({
      name: "socials2",
      title: "Socials 2",
      type: "array",
      of: [{ type: "link" }],
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
