import { defineType, defineField } from "sanity"
import { DocumentIcon, ImageIcon, LinkIcon } from "@sanity/icons"

export const home = defineType({
  name: "home",
  title: "Home",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "image1",
      title: "Image 1 (Left)",
      type: "object",
      fields: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          icon: ImageIcon,
          options: { hotspot: true },
        }),
        defineField({
          name: "link",
          title: "Link (URL or Slug)",
          type: "url",
          description: "Link to a folio page or external URL.",
          icon: LinkIcon,
          validation: (Rule) => Rule.uri({ allowRelative: true }),
        }),
      ],
    }),
    defineField({
      name: "image2",
      title: "Image 2",
      type: "object",
      fields: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          icon: ImageIcon,
          options: { hotspot: true },
        }),
        defineField({
          name: "link",
          title: "Link (URL or Slug)",
          type: "url",
          description: "Link to a folio page or external URL.",
          icon: LinkIcon,
          validation: (Rule) => Rule.uri({ allowRelative: true }),
        }),
      ],
    }),
    defineField({
      name: "image3",
      title: "Image 3",
      type: "object",
      fields: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          icon: ImageIcon,
          options: { hotspot: true },
        }),
        defineField({
          name: "link",
          title: "Link (URL or Slug)",
          type: "url",
          description: "Link to a folio page or external URL.",
          icon: LinkIcon,
          validation: (Rule) => Rule.uri({ allowRelative: true }),
        }),
      ],
    }),
    defineField({
      name: "image4",
      title: "Image 4 (Right)",
      type: "object",
      fields: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          icon: ImageIcon,
          options: { hotspot: true },
        }),
        defineField({
          name: "link",
          title: "Link (URL or Slug)",
          type: "url",
          description: "Link to a folio page or external URL.",
          icon: LinkIcon,
          validation: (Rule) => Rule.uri({ allowRelative: true }),
        }),
      ],
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
