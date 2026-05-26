# Website Handoff

This document has two parts:
1. **[Developer Setup](#developer-setup)** — running the project locally and making code changes
2. **[Content Guide](#content-guide)** — managing website content through the CMS (no coding needed)

---

## Developer Setup

### Stack

- **Next.js** — framework
- **Sanity CMS** — content management (text, images, page sections)
- **Vercel** — hosting and deployment
- **Tailwind CSS** — styling

---

### Prerequisites

Make sure you have these installed:

- **Node.js** — download from [nodejs.org](https://nodejs.org) (choose the LTS version)
- **Git** — download from [git-scm.com](https://git-scm.com)
- A code editor — [VS Code](https://code.visualstudio.com) is recommended

To check if they're already installed, open Terminal and run:
```
node --version
git --version
```
If you see version numbers, you're good.

---

### 1. Clone the Repo

```bash
git clone <repo-url>
cd mp-web
npm install
```

Replace `<repo-url>` with the GitHub repository URL (ask Daniel for this).

---

### 2. Set Up Environment Variables

The project needs **two** separate env files — one for the frontend, one for the Studio. These are not in the repo; ask Daniel for the values.

**File 1:** Create `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-10-28"
NEXT_PUBLIC_SANITY_STUDIO_URL=        # Optional — defaults to http://localhost:3333
SANITY_API_READ_TOKEN=
```

**File 2:** Create `studio/.env`:

```dotenv
SANITY_STUDIO_PROJECT_ID=
SANITY_STUDIO_DATASET="production"
```

The `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_STUDIO_PROJECT_ID` are the same value — your Sanity project ID.

> **Note:** The `NEXT_PUBLIC_` prefix means those variables are exposed to the browser — never put secrets in variables with that prefix.

> **Video only:** If working with video content, you'll also need `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` in `frontend/.env.local`. Ask Daniel for these.

---

### 3. Run Locally

From the root `mp-web` folder:

```bash
npm run dev
```

This starts both the website and the Studio at the same time:

| URL | What it is |
|---|---|
| `http://localhost:3000` | The website |
| `http://localhost:3333` | Sanity Studio (CMS) |

Leave Terminal running while you work. Press `Ctrl + C` to stop.

---

### 4. Making and Deploying Changes

> **Important: never commit directly to `main`.** The `main` branch is the live site. Always work on a separate branch and merge it in once you're happy with it.

**The full workflow:**

```bash
# 1. Make sure you're on main and have the latest code
git checkout main
git pull

# 2. Create a new branch for your changes (give it a short descriptive name)
git checkout -b my-branch-name

# 3. Make your changes in the code editor

# 4. Check what files you changed
git status

# 5. Stage your changes
git add .

# 6. Commit with a short description
git commit -m "describe what you changed"

# 7. Push your branch to GitHub
git push -u origin my-branch-name
```

After pushing, GitHub will show a link to **open a pull request**. A pull request (PR) is just a way of saying "I'd like to merge these changes into main" — it gives a chance to review before anything goes live. Open the PR on GitHub and tag Daniel to review and merge it.

**Previewing your changes**

When you push a branch, Vercel automatically builds it and posts a **preview URL** in the GitHub pull request (it looks like `https://mp-web-git-my-branch-name-xxx.vercel.app`). Use this to check that everything looks right before merging.

**Checking for build errors before pushing**

You won't have access to the Vercel dashboard, so run a build locally first to catch any errors that would cause the deployment to fail:

```bash
cd frontend
npm run build
```

If it completes without errors, it should deploy cleanly. If it shows errors, fix them before pushing. Common issues are TypeScript type errors or missing required fields — the error output will tell you exactly what file and line to look at.

---

### Project Structure

```
mp-web/
├── frontend/
│   └── app/
│       ├── page.tsx            # Homepage
│       ├── about/              # About page
│       ├── services/           # Services page
│       ├── bookings/           # Bookings page
│       ├── contact/            # Contact page
│       ├── folio/              # Folio (galleries, journals, videos)
│       ├── components/         # Reusable UI components
│       └── globals.css         # Global styles and custom classes
└── studio/
    └── src/
        └── schemaTypes/        # CMS field definitions
```

---

### Key Components

**`TextDistortFilter`** — Wraps content in an SVG displacement filter for the text distortion effect. Handles Safari separately since its SVG filter support differs. **Do not remove the SVG block at the top of this component** — it must be defined before the content div or some mobile browsers will render the page blank.

**`FadeInImage`** — A wrapper around Next.js `<Image>` that fades in on load. Use this instead of a plain `<img>` or `<Image>` tag anywhere on the site for consistency.

**`TransitionLink`** — A wrapper around Next.js `<Link>` that handles page transition animations. Use instead of `<Link>` for internal navigation.

---

### Styling Notes

- All styles use **Tailwind utility classes** directly on elements
- Custom heading styles (`heading-1`, `heading-2`, etc.) are defined in `globals.css`
- The `mix-blend-*` classes (e.g. `mix-blend-exclusion`, `mix-blend-screen`) create the layered photo effects — be careful changing these as they interact with background colours

---

## Content Guide

Most page content (text, images, sections) is managed through **Sanity Studio**. You do not need to touch code to update copy, swap images, or reorder sections.

What **does** require code changes:
- Layout structure and page templates
- Navigation
- Styling — fonts, colours, spacing, effects

---

### How to Access the CMS

The Studio is available at the deployed URL you were given (or at `http://localhost:3333` when running locally). Log in with your Google or email account.

> **Important:** Changes only go live on the website after you click **Publish**. Saving a draft does not update the live site.

---

### Overview of Sections

| Section | What it controls |
|---|---|
| **Home** | The 4 images on the homepage |
| **About** | The image and body text on the About page |
| **Services** | The image, email banner, and all services/rates text |
| **Bookings** | The image on the left side of the Bookings page |
| **Contact** | Social media links and site credits text |
| **Age Checks** | The text on the age verification splash screen |
| **Galleries** | Photo gallery entries in the Folio |
| **Journals** | Journal-style photo entries in the Folio |
| **Videos** | Video entries in the Folio |
| **Site Settings** | Site title, description, and social share image |

---

### Home

The Home page has **4 image slots** (Image 1 through Image 4, left to right).

Each slot has:
- **Image** — Upload or select a photo. After uploading, drag the focal point (hotspot) to control which part stays visible when cropped on different screen sizes.
- **Link (URL or Slug)** — Where the image links when clicked. Use a full URL (`https://...`) or a relative path (`/folio/gallery/my-gallery-slug`).

---

### About

- **Image** — The main photo shown on the left side of the page.
- **Content** — Rich text editor for the body on the right. Supports bold, italics, headings, and inline images.

---

### Services

- **Image** — The main photo shown on the left side of the page.
- **Banner Email** — The email address shown in the top banner. Must be a valid email format.
- **Content** — A rich text area where you can add and reorder content blocks:
  - **Services Section** — Title + body text
  - **Rates Section** — Title, banner text, and rates text
  - **Outcall Section** — Title + body text
  - **Virtual Section** — Title + body text
  - **Image** — An inline image with optional caption

  Click the **"+"** at the bottom of the content area to add a new block.

---

### Bookings

- **Left Side Image** — The photo displayed on the left side of the Bookings page. You can set alt text for accessibility.

---

### Contact

- **Socials 1** — First group of social media links. Each link has a **title** (display text) and a **URL**.
- **Socials 2** — Second group of social media links, shown in a separate block.
- **Site Credits** — Small print text at the bottom. You can add links by selecting text and clicking the link icon.

---

### Age Check

Controls the text on the age verification splash screen.

- **Marquee Text** — The scrolling ticker text (default: `For Adults Only 🍑`)
- **Body Text** — The sentence above the button (default: `The following content is for 18+ adults only —`)
- **Button / Proceed Text** — The label on the confirm button (default: `Proceed`)

---

### Site Settings

Controls how the site appears in search engines and when shared on social media.

- **Title** — The site's name.
- **Description** — Short description used by search engines and shown on the homepage.
- **Open Graph Image** — The image that appears when someone shares a link on social media. Should be at least 1200×630px. Add alt text once uploaded.

---

### Folio: Galleries, Journals, and Videos

The **Folio** page is an index of all portfolio work, sorted by date (newest first). It pulls from three content types:

---

#### Galleries

A collection of photos from a single shoot. **Maximum 12 images.**

| Field | Description |
|---|---|
| **Title** | Internal name for the shoot. |
| **Display Title** | The title shown on the Folio index page. |
| **Subtitle** | Optional secondary line of text. |
| **Photographer or Collaborator** | Credit line, e.g. `Shot by John Doe` |
| **Slug** | The URL path (e.g. `/folio/gallery/my-gallery`). Click **Generate** to auto-fill from the title. Don't change this after publishing — it will break existing links. |
| **Date** | Date of the shoot. Used for sorting. Required. |
| **Description** | Optional text on the gallery page. |
| **Display Image (Thumbnail)** | The thumbnail shown on the Folio index page. Required. |
| **Landing Image** | Large image at the top of the gallery page. If blank, the first gallery image is used. |
| **Images** | The full set of photos. Up to 12. Each image can have a **Credit** field. |

---

#### Journals

A shorter editorial-style set of photos. **Maximum 5 images.**

| Field | Description |
|---|---|
| **Title** | Internal name. |
| **Display Title** | Title shown on the Folio index page. |
| **Subtitle** | Optional secondary line. |
| **Photographer or Collaborator** | Credit line. |
| **Slug** | URL path. Click **Generate** to auto-fill. Don't change after publishing. |
| **Date** | Date of the shoot. Used for sorting. Required. |
| **Description** | Optional body text on the journal page. |
| **Display Image (Thumbnail)** | Thumbnail on the Folio index page. Required. |
| **Images** | Photos for the journal. Up to 5. Each can have a **Credit** field. |

---

#### Videos

A single video entry hosted via Mux.

| Field | Description |
|---|---|
| **Title** | Internal name. |
| **Display Title** | Title shown on the Folio index page. |
| **Subtitle** | Optional secondary line. |
| **Photographer or Collaborator** | Credit line. |
| **Slug** | URL path. Click **Generate** to auto-fill. Don't change after publishing. |
| **Date** | Date of the project. Used for sorting. Required. |
| **Description** | Optional body text on the video page. |
| **Mux Video** | Upload the video file here. Mux processes and hosts it. |
| **Video Caption** | Optional text shown below the video. |
| **Display Image (Thumbnail)** | Thumbnail on the Folio index page. Required. |

---

### Tips

**What's a slug?**
A slug is the URL-friendly version of a title — lowercase, dashes instead of spaces, no special characters. Example: `Summer Shoot 2024` → `summer-shoot-2024` → URL becomes `/folio/gallery/summer-shoot-2024`. Always click **Generate** after setting the title, and don't change it once the entry is live.

**What's a hotspot?**
After uploading an image you can set a focal point by clicking on the most important part of the photo. The site uses this to keep that part visible when the image is cropped for different screen sizes.

**Draft vs Published**
Edits are saved as a draft automatically. Nothing changes on the live site until you click **Publish**.

**Reordering images**
In any image list you can drag and drop to reorder.

**Content changes don't need a redeploy**
Sanity content goes live immediately after publishing — no code push needed.
