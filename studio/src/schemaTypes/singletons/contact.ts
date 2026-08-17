import { defineField, defineType } from "sanity"
import { DocumentIcon } from "@sanity/icons"

export const contact = defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        'Title at the top of the page — e.g. "Contact" or "Directory". Defaults to "Contact" if left empty.',
      initialValue: "Contact",
    }),
    defineField({
      name: "socials1",
      title: "Socials 1",
      type: "array",
      description: "Social media links for first block",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "socials2",
      title: "Socials 2",
      type: "array",
      description: "Social media links for second block",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "siteCredits",
      title: "Site Credits",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                  {
                    name: "openInNewTab",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "banners",
      title: "Banners",
      description:
        "Banner images shown under Site Credits. Animated GIFs are kept animated. Drag to reorder — each opens its link in a new tab.",
      type: "array",
      // An array of images with extra fields on each, exactly like the gallery
      // document's `images`. An earlier version wrapped each image in a custom
      // object; that shape misbehaved in the Studio — uploads hung and row
      // controls vanished — so this mirrors the structure already proven here.
      of: [
        {
          type: "image",
          // Deliberately identical in shape to gallery.images / video.images,
          // which upload reliably: hotspot enabled and plain string fields. A
          // version of this without options and with a `url`-typed field left
          // the image input spinning on "Loading" after every upload.
          options: { hotspot: true },
          fields: [
            defineField({
              name: "linkUrl",
              title: "Link URL",
              type: "string",
              description: "Opens in a new tab. Include https://",
            }),
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        },
      ],
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
