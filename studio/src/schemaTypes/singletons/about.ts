import { defineType, defineField } from "sanity"
import { DocumentIcon, ImageIcon } from "@sanity/icons"

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  icon: DocumentIcon,
  fields: [
      defineField({
          name: "image",
          title: "Image",
          type: "image",
          description: "Main image for the left side of the About page.",
          icon: ImageIcon,
          options: { hotspot: true },
        }),
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
