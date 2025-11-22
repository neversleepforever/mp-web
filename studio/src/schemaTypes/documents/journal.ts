import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const journal = defineType({
  name: 'journal',
  title: 'Journal',
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
        source: 'title', // auto-generate from title
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
      validation: (Rule) => Rule.max(5)
    }),
  ],
})
