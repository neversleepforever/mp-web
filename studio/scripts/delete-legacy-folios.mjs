/**
 * One-shot cleanup: deletes the seven legacy "Test Folio" documents (the old
 * `folio` type from before the gallery/journal/video split). They no longer
 * appear anywhere in the Studio's structure, but they are still published and
 * reference ~48 image assets, blocking those assets' deletion in the media
 * plugin ("Unable to delete 1 asset").
 *
 * Run from studio/:
 *   SANITY_WRITE_TOKEN=<token> node scripts/delete-legacy-folios.mjs
 * or run without the env var to be prompted; the token is never stored.
 */
import { createClient } from "@sanity/client"
import readline from "node:readline/promises"

const token =
  process.env.SANITY_WRITE_TOKEN ||
  (await (async () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    const t = await rl.question("Sanity write token: ")
    rl.close()
    return t.trim()
  })())

const client = createClient({
  projectId: "6gvn5tfv",
  dataset: "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
})

const docs = await client.fetch(`*[_type == "folio"]{_id, title}`)
if (!docs.length) {
  console.log("No legacy folio documents found — nothing to do.")
  process.exit(0)
}

console.log(`Deleting ${docs.length} legacy folio documents:`)
for (const d of docs) console.log(`  - ${d.title} (${d._id})`)

const tx = client.transaction()
for (const d of docs) {
  tx.delete(d._id)
  tx.delete(`drafts.${d._id}`)
}
await tx.commit()
console.log(
  "Done. Their image assets are now unreferenced and deletable in the media plugin."
)
