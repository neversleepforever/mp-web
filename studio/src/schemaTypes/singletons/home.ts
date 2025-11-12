import { defineType, defineField } from "sanity"
import { DocumentIcon, ImageIcon } from "@sanity/icons"

export const home = defineType({
  name: "home",
  title: "Home",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "image1",
      title: "Image 1 (Left)",
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
    }),
    defineField({
      name: "image2",
      title: "Image 2",
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
    }),
    defineField({
      name: "image3",
      title: "Image 3",
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
    }),
    defineField({
      name: "image4",
      title: "Image 4 (Right)",
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Home Page",
        subtitle: "Singleton document",
      }
    },
  },
})
