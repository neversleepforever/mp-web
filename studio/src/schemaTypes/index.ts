import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {gallery} from './documents/gallery'
import {journal} from './documents/journal'
import {video} from './documents/video'
import {services} from "./singletons/services"
import {contact} from "./singletons/contact"
import { about } from './singletons/about'
import { home } from './singletons/home'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import { portableText } from "./objects/portableText"
import agecheck from './singletons/agecheck'
import bookings from './singletons/bookings'

export const schemaTypes = [
  // Singletons
  settings,
  services,
  contact,
  about,
  home,
  agecheck,
  bookings,
  // Documents
  page,
  post,
  person,
  gallery,
  journal,
  video,
  // Objects
  blockContent,
  infoSection,
  callToAction,
  link,
  portableText,
]
