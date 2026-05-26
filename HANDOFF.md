## Stack

- **Next.js** — framework
- **Sanity CMS** — content management (text, images, page sections)
- **Vercel** — hosting and deployment
- **Tailwind CSS** — styling

---

## Running Locally

### 1. Clone the repo

```bash
git clone <repo-url>
cd <project-folder>
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root with the following keys. Values are available from the Sanity project dashboard and Vercel project settings.

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_STUDIO_URL=        # Optional — defaults to http://localhost:3333
SANITY_API_HOST=
SANITY_API_READ_TOKEN=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
```

### 3. Run the dev server

```bash
npm run dev
```

Site runs at `http://localhost:3000`  
Sanity Studio runs at `http://localhost:3333`

---

## Content Management

Most page content (text, images, sections) is managed through **Sanity Studio**. You do not need to touch code to update copy, swap images, or reorder sections — log into the Studio and edit from there.

What **is** hardcoded (requires code changes):
- Layout structure and page templates
- Navigation
- Styling — fonts, colours, spacing, effects

---

## Project Structure

```
/app
  /components       # Reusable UI components
  /[page folders]   # One folder per page (about, services, folio, etc.)
/sanity
  /lib
    queries.ts      # GROQ queries that fetch content from Sanity
    live.ts         # Sanity live content client
/public
  /images           # Static assets (textures, badges, etc.)
```

---

## Key Components

### `TextDistortFilter`
Wraps page content in an SVG displacement filter that gives the text a subtle distortion effect. It handles Safari separately since Safari's SVG filter support differs from other browsers. **Do not remove the SVG block at the top of this component** — it must be defined before the content div or some mobile browsers will render the page blank.

### `FadeInImage`
A wrapper around Next.js `<Image>` that fades in once loaded. Use this instead of a plain `<img>` or `<Image>` tag anywhere on the site for consistency.

### `Rates`
A standalone component that renders the rates section. Takes a `title` prop.

---

## Styling Notes

- All styles use **Tailwind utility classes** directly on elements
- Custom heading styles (`heading-1`, `heading-2`, etc.) are defined in the global CSS — check `globals.css` for those class definitions
- Page backgrounds use texture images from `/public/images/` via Tailwind's `bg-[url(...)]` syntax
- The `mix-blend-*` classes (e.g. `mix-blend-exclusion`, `mix-blend-screen`) create the layered photo effects — be careful changing these as they interact with the background colours

---

## Deployment

Pushing to the `main` branch on GitHub triggers an automatic deploy on Vercel. There is no manual deploy step needed.

To preview changes before merging, push to a separate branch — Vercel will generate a preview URL automatically.

---

## Notes

- **MUX** is used for video — the `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` are only needed if working with video content
- The `NEXT_PUBLIC_` prefix on some variables means they are exposed to the browser — do not put secrets in variables with that prefix
- Content changes in Sanity go live immediately without a redeploy