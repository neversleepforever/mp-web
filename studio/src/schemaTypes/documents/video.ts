import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const video = defineType({
  name: 'video',
  title: 'Video',
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
      type: 'string',
      description: "Name of the photographer or collaborator for video or photoshoot.",
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
        name: "muxVideo",
        title: "Mux Video",
        type: "mux.video", 
      }),
    defineField({
      name: "caption",
      title: "Video Caption",
      type: "string",
      description: "Optional caption or description to appear under the video.",
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
    // Same shape and 12-image cap as the gallery document, so both use the one
    // Gallery component. Leave empty and the video page hides its stills link.
    defineField({
      name: 'images',
      title: 'Images',
      description:
        'Stills from the video. When empty, the "View Stills" link is hidden on the video page.',
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
