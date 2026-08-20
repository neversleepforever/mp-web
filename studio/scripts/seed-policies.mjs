/**
 * Seeds the "Policies & FAQs" singleton with the full launch copy, so nothing
 * has to be retyped into the Studio. Creates the document if it doesn't exist,
 * or overwrites its sections + faqs if it does.
 *
 * Images are NOT set here — after seeding, open the document in the Studio and
 * add: the three hero images, and an Image item inside "Policy Sections"
 * wherever a framed photo should sit in the flow (the launch layout puts one
 * after Screening and one after Gifts & Tips).
 *
 * Usage:
 *   1. Create a token with Editor permissions:
 *      sanity.io/manage → mp-web → API → Tokens → Add API token
 *   2. Run from the studio directory:
 *      SANITY_WRITE_TOKEN=your_token node scripts/seed-policies.mjs
 *
 * The token is read from the environment and never stored in the repo.
 */
import {createClient} from '@sanity/client'

const block = (text) => ({
  _type: 'block',
  _key: Math.random().toString(36).slice(2, 10),
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: Math.random().toString(36).slice(2, 10), text, marks: []}],
})

const bullet = (text) => ({
  ...block(text),
  listItem: 'bullet',
  level: 1,
})

const spacer = () => block('')

const SECTIONS = [
  {
    title: 'Deposits',
    body: [
      block('A 50% deposit secures in-person sessions. Virtual sessions require 100% tribute before we begin.'),
      block('Deposit methods are shared privately once your application is accepted; session details aren’t discussed before deposit clears.'),
      block('If I have to cancel for any reason, your deposit is returned promptly or applied to a rescheduled time, your choice.'),
    ],
  },
  {
    title: 'Booking Notice',
    body: [
      block('Minimum 48 hours notice for in-person sessions. Same-day requests are rarely accommodated. For cities I’m travelling to, please apply at least one week in advance.'),
    ],
  },
  {
    title: 'Cancellation & Rescheduling',
    body: [
      block('Tell me as early as you can if your schedule has shifted, and I’ll do the same.'),
      spacer(),
      bullet('48+ hours notice: deposit transfers to a rescheduled session.'),
      bullet('Less than 48 hours: deposit is forfeit, and a new one is required to rebook.'),
      bullet('Less than 24 hours, or no-show: full session fee is due. Future bookings require a new deposit.'),
    ],
  },
  {
    title: 'Screening',
    body: [
      block('Before any in-person session, I require one of the following:'),
      bullet('Photo ID showing your name and date of birth (other details may be obscured).'),
      bullet('A verifiable professional site (LinkedIn, company directory) clearly showing your full name and photo, plus a brief email sent to me from the work address tied to that site so I can confirm the link is yours.'),
      bullet('A reference from another professional provider you have seen within the last twelve months.'),
      spacer(),
      block('This is a hard requirement. Information is held privately and never shared.'),
    ],
  },
  {
    title: 'Preparation',
    body: [
      block('Arrive fresh and well-fed. If specific preparation is needed for what we’ve agreed to, I’ll let you know in advance.'),
    ],
  },
  {
    title: 'Punctuality',
    body: [
      block('Sessions begin and end at the agreed time. If you arrive late, our time runs from the original start. In the unlikely event I’m running late, the missing minutes are added to the end or applied to your next session, as you wish.'),
    ],
  },
  {
    title: 'Hard Limits',
    body: [block('Scat and Roman showers.')],
  },
  {
    title: 'Discretion & Recording',
    body: [
      block('Photos and recording during sessions are not permitted unless agreed in writing in advance. Discretion runs both ways: yours is protected as carefully as mine.'),
    ],
  },
  {
    title: 'Information Handling',
    body: [
      block('Anything you submit through screening or the application form is held privately, used only to verify identity and prepare for our time together, and never shared, sold, or kept beyond what’s needed.'),
    ],
  },
  {
    title: 'Communication',
    body: [
      block('Response time is up to 48 hours. If a week passes with no reply, you may follow up once. Please check your junk folder first.'),
      spacer(),
      block('Once a session is confirmed and deposit is received, session details and logistics are handled through the channel I’ve shared with you, and never through DMs on social.'),
    ],
  },
  {
    title: 'FMTY (Fly Me to You)',
    body: [
      block('I take FMTY bookings. Travel and accommodation are at your expense and arranged in advance. These are bespoke by nature; please inquire.'),
    ],
  },
  {
    title: 'Honorifics',
    body: [
      block('You may address me as Mistress, Mistress Maggie, Maggie Peach, Miss Maggie, or Miss Peach. Other titles may be earned through ongoing dynamics.'),
    ],
  },
  {
    title: 'Gifts & Tips',
    body: [
      block('Tips above the agreed tribute are welcomed and remembered. My Throne wishlist lives on the Contact page; favourites include latex and leather (size XS), shoes (size 6), spa services, coffee and flowers.'),
    ],
  },
]

const FAQS = [
  {
    question: 'Where do you session from?',
    answer: 'Incall is held in a private Toronto dungeon. For outcall, you book a 4- or 5-star hotel, or another location I’ve approved in advance.',
  },
  {
    question: 'I’m new to this. Can I still apply?',
    answer: 'First-timers are most welcome. Some of my favourite ongoing dynamics started with someone who’d never seen a Pro-Domme. Be honest about that on the form so I can hold our time accordingly. If a full session feels like too much to begin with, a social date is a gentler way to meet first; some clients book a social followed by a session as a way to ease in.',
  },
  {
    question: 'What’s the shortest session you take?',
    answer: 'Ninety minutes for in-person; thirty minutes for virtual. Longer bookings are preferred and prioritised.',
  },
  {
    question: 'Do you travel?',
    answer: 'Yes. See FMTY above. Tour cities are announced on Tryst and on my socials.',
  },
  {
    question: 'Do you see couples?',
    answer: 'Yes, I very much enjoy seeing couples and other configurations of people in relationship. The session is shaped around your shared desires. Apply individually, and note in the form that you’re inquiring as a couple.',
  },
  {
    question: 'Can I make outfit requests?',
    answer: 'You may ask. Note any wardrobe interests in the form, politely, and if your request aligns with my own taste, I may oblige.',
  },
  {
    question: 'How do I see your creative work, or book editorial?',
    answer: 'Selected past work lives on the Folio page. For editorial, performance, film, and custom content inquiries, see the bottom of the Services page.',
  },
]

// Token from the environment, or prompted interactively — pasting a long
// token inline on the command line is easy to mangle (a wrapped line makes the
// shell execute token fragments as commands).
let token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  const readline = await import('node:readline/promises')
  const rl = readline.createInterface({input: process.stdin, output: process.stdout})
  token = (await rl.question('Paste your Sanity write token (Editor permissions): ')).trim()
  rl.close()
}
if (!token) {
  console.error('No token provided — see the header of this file.')
  process.exit(1)
}

const client = createClient({
  projectId: '6gvn5tfv',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const key = () => Math.random().toString(36).slice(2, 10)

const sections = SECTIONS.map((s) => ({
  _type: 'policySection',
  _key: key(),
  title: s.title,
  body: s.body,
}))

const faqs = FAQS.map((f) => ({
  _type: 'faqItem',
  _key: key(),
  question: f.question,
  answer: f.answer,
}))

const existing = await client.fetch(`*[_type == "policies"][0]{_id}`)
if (existing?._id) {
  await client.patch(existing._id).set({sections, faqs}).commit()
  console.log(`Updated sections + faqs on ${existing._id}.`)
} else {
  const created = await client.create({_type: 'policies', sections, faqs})
  console.log(`Created policies document ${created._id}.`)
}
console.log('Published directly — reload the Studio, then add the hero images')
console.log('and the two in-flow Image items (after Screening and after Gifts & Tips).')
