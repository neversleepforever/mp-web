import { defineType, defineField } from "sanity"
import { DocumentIcon } from "@sanity/icons"

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } }, 
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "About Page",
        subtitle: "Singleton document",
      }
    },
  },
})
