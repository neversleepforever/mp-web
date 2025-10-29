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
      title: 'Photographer/Collaborator',
      type: 'string',
      description: "Name of the photographer or collaborator for video or photoshoot.",
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
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
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
  ],
})
