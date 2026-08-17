import { permanentRedirect } from "next/navigation"

/** The folio grid now lives at the root. Old /folio links land there; the
 *  project pages under /folio/gallery|journal|video are unaffected. */
export default function FolioRedirect() {
  permanentRedirect("/")
}
