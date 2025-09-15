import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {folio} from './documents/folio'
import {services} from "./singletons/services"
import {contact} from "./singletons/contact"
import { about } from './singletons/about'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'


// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  services,
  contact,
  about,
  // Documents
  page,
  post,
  person,
  folio,

  // Objects
  blockContent,
  infoSection,
  callToAction,
  link,
]
