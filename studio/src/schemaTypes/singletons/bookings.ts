export default {
  name: 'bookings',
  title: 'Bookings',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Left Side Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    },
  ],
}