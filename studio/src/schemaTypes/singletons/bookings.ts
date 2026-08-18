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
    {
      name: 'imageSecondary',
      title: 'Second Image',
      type: 'image',
      description:
        'Desktop/tablet only: the left image swaps to this one once the form is scrolled past halfway. Leave empty to keep a single image.',
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