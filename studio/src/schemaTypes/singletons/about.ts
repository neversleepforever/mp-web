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
          name: "imageSecondary",
          title: "Second Image",
          type: "image",
          description:
            "Desktop/tablet only: the left image swaps to this one once the text is scrolled past halfway. Leave empty to keep a single image.",
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
