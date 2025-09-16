import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

export const folioPagesSlugs: string = defineQuery(`
  *[_type == "folio" && defined(slug.current)]{
    "slug": slug.current
  }
`)

export const folioQuery: string = defineQuery(`
  *[_type == "folio" && slug.current == $slug][0]{
    _id,
    title,
    subtitle,
    photographer,
    date,
    description,
    "slug": slug.current,
    images[]{
      asset->{ url },
      alt,
      credit
    }
  }
`)

export const allFoliosQuery = defineQuery(`
  *[_type == "folio" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    _id,
    title,
    subtitle,
    photographer,
    date,
    "slug": slug.current,
    images[]{
      asset->{
        url
      },
      credit
    }
  }
`)

export const servicesQuery = defineQuery(`
  *[_type == "services"][0]{
    content[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{
          url
        }
      },
      _type == "servicesSection" => {
        ...,
        body[]{
          ...,
          _type == "image" => {
            ...,
            "asset": asset->{
              url
            }
          }
        }
      },
      _type == "ratesSection" => {
        ...,
        rates[]{
          ...,
          _type == "image" => {
            ...,
            "asset": asset->{
              url
            }
          }
        }
      },
      _type == "outcallSection" => {
        ...,
        body[]{
          ...,
          _type == "image" => {
            ...,
            "asset": asset->{
              url
            }
          }
        }
      },
      _type == "virtualSection" => {
        ...,
        body[]{
          ...,
          _type == "image" => {
            ...,
            "asset": asset->{
              url
            }
          }
        }
      }
    }
  }
`)


export const aboutQuery = defineQuery(`
  *[_type == "about"][0]{
    _id,
    content[]{
      ...,
      _type == "image" => {
        asset->{
          url,
          metadata { dimensions }
        },
        alt
      }
    }
  }
`)