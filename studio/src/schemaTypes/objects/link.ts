import { defineField, defineType } from 'sanity'
import { LinkIcon } from '@sanity/icons'

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'displayTitle',
      title: 'Display Title',
      type: 'string',
      description: 'Text shown on the site (e.g. "Instagram", "Contact Us")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ allowRelative: false }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'displayTitle',
      subtitle: 'href',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled Link',
        subtitle,
      }
    },
  },
})
