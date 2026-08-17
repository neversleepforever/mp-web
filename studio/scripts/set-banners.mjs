/**
 * Sets the Contact page's banners directly through the Sanity API, bypassing
 * the Studio's image input — which hangs on "Loading" after an upload even
 * though the asset is created and fully processed.
 *
 * The four GIFs below are already uploaded to the project; this only attaches
 * them to the contact document and sets each link.
 *
 * Usage:
 *   1. Create a token with Editor permissions:
 *      sanity.io/manage → mp-web → API → Tokens → Add API token
 *   2. Edit BANNERS below — set each link, drop any you don't want, reorder freely.
 *   3. Run from the studio directory:
 *      SANITY_WRITE_TOKEN=your_token node scripts/set-banners.mjs
 *
 * The token is read from the environment and never stored in the repo.
 */
import {createClient} from '@sanity/client'

// Order here is the order they appear on the page.
const BANNERS = [
  {
    assetId: 'image-33aebd840d37235ca9ae01c4af8c6a2cf128c063-468x65-gif', // Banner_03.gif
    linkUrl: 'https://www.dickievirgin.com/home-listing',
    alt: 'dickie virgin FemDom Guide',
  },
  {
    assetId: 'image-5a548ff05f59282105ec8968d6b821ccfec216be-468x60-gif', // 8dd51c_...gif
    linkUrl: 'https://dansfemdomlinks.com',
    alt: "Dan's Femdom Links",
  },
  {
    assetId: 'image-94270b55f28b8c56811291f504f792f4234a1c76-468x60-gif', // London Mistress Zone
    linkUrl: 'https://www.ukmistressguide.co.uk/index11.html',
    alt: 'London Mistress Zone',
  },
  // {
  //   assetId: 'image-f809e85ca657655e7d2a30a81bd6eb72232a95cf-468x60-gif', // banner-3.gif
  //   linkUrl: '',
  //   alt: '',
  // },
]

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error('Set SANITY_WRITE_TOKEN — see the header of this file.')
  process.exit(1)
}

const client = createClient({
  projectId: '6gvn5tfv',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const banners = BANNERS.map((b, i) => ({
  _type: 'image',
  _key: `banner-${i}-${b.assetId.slice(6, 14)}`,
  asset: {_type: 'reference', _ref: b.assetId},
  ...(b.linkUrl ? {linkUrl: b.linkUrl} : {}),
  ...(b.alt ? {alt: b.alt} : {}),
}))

const doc = await client.fetch(`*[_type == "contact"][0]{_id}`)
if (!doc?._id) {
  console.error('No contact document found.')
  process.exit(1)
}

await client.patch(doc._id).set({banners}).commit()
console.log(`Set ${banners.length} banners on ${doc._id}.`)
console.log('Published directly — reload the Studio to see them.')
