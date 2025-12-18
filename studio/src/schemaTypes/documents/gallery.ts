import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'displayTitle',
      title: 'Display Title',
      type: 'string',
      description: "Title that will be displayed on Folio index page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photographer',
      title: 'Photographer or Collaborator',
      description: "Title for photographer. Example: 'Shot by John Doe'",
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: "URL-friendly version of the title.",
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: "Date of the photoshoot or project. This will be used for the order on the Folio index page.",
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
     defineField({
      name: "displayImage",
      title: "Display Image (Thumbnail)",
      type: "image",
      description: "Display image for the folio index page.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "landingImage",
      title: "Landing Image",
      type: "image",
      description:
        "Image to be used as the landing image on the landing page for a gallery. If not set, the first image from the full gallery will be used.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'credit',
              title: 'Credit',
              type: 'string',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(12)
    }),
  ],
})
