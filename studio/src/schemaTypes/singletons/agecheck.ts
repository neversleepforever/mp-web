export default {
  name: 'ageCheck',
  title: 'Age Check',
  type: 'document',
  fields: [
    {
      name: 'marqueeText',
      title: 'Marquee Text',
      type: 'string',
      initialValue: 'For Adults Only 🍑',
    },
    {
      name: 'bodyText',
      title: 'Body Text',
      type: 'string',
      initialValue: 'The following content is for 18+ adults only —',
    },
    {
      name: 'buttonText',
      title: 'Button / Proceed Text',
      type: 'string',
      initialValue: 'Proceed',
    },
  ],
}