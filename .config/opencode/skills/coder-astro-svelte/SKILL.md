---
name: coder-astro-svelte
description: Building a static website using Astro, Svelte, and Tailwind CSS.
compatibility: opencode
---
> Coding guidelines for AI agents producing clean, performant Astro websites with Svelte interactive islands.
> **Svelte 5 component rules are defined in the companion `coder-svelte` SKILL file**. This document covers only Astro-specific patterns and the boundary between Astro and Svelte.

## Project Stack

| Layer | Technology |
|---|---|
| Runtime | **Bun** (v1.1+) |
| Framework | **Astro** (v5+) |
| Islands | **Svelte 5** (interactive components) |
| Styling | **UnoCSS with Wind4** (utility-first) |
| UI primitives | **Bits UI** (inside Svelte islands) |
| Content | **Astro Content Collections** (Markdown / MDX) |
| i18n | **Astro built-in i18n routing** + manual dictionaries |

## Project Scaffolding

To initialize a new project:

```bash
# Create a new Astro project
bunx create-astro@latest --template minimal --no-git --yes --skip-houston <MY-SITE>
cd <MY-SITE>

# Add integrations
bun astro add svelte
bun astro add mdx
bun astro add sitemap
bun add -D unocss @unocss/astro @unocss/preset-wind4 @unocss/preset-icons
```

Initialize `tsconfig.json` as:

```json
{
  "extends": "astro/tsconfigs/strictest",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

Add to `astro.config.ts`: 

```ts
import UnoCSS from 'unocss/astro'

export default defineConfig({
  integrations: [
    UnoCSS({ injectReset: true }),
  ],
});
```

Create `uno.config.ts`:

```ts
import { defineConfig, presetWind4, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons(),
  ],
});
```

## Main shell commands

- `bun astro sync` to generate TypeScript tpes for all Astro modules. Also done as part of `astro build`.
- `bun astro check` to validate source code for syntax and typing issues.
- `bun astro build` to build the website for deployment. Output goes to `./dist`.

## Sample Project Structure

Hypothesis of the structure below: multi-lingual website in English and French.

```
src/
├── assets/ # Local images, fonts (processed by Astro)
├── components/
│   ├── Header.astro # Static layout components
│   ├── Footer.astro
│   ├── LanguageSwitcher.astro
│   └── interactive/
│       ├── MobileMenu.svelte # Svelte island — client:media
│       ├── ContactForm.svelte # Svelte island — client:visible
│       └── ThemeToggle.svelte # Svelte island — client:load
├── content/
│   ├── blog/
│   │   ├── en/
│   │   └── fr/
│   └── content.config.ts
├── layouts/
│   ├── Base.astro # <html>, <head>, global meta
│   └── BlogPost.astro # Wraps Base, adds article chrome
├── lib/
│   ├── i18n/
│   │   └── translations.ts # Typed t() function and dictionaries
│   ├── data/
│   │   └── posts.ts # Shared data-fetching helpers
│   └── utils.ts # cn(), formatDate(), etc.
├── pages/
│   ├── index.astro # English home
│   ├── about.astro
│   ├── blog/
│   │   ├── index.astro
│   │   └── [slug].astro
│   ├── fr/
│   │   ├── index.astro # French home
│   │   ├── about.astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── 404.astro
├── styles/
│   └── global.css
astro.config.mjs
tsconfig.json
uno.config.ts
```

Make sure that all `client:only` components are also placed in the `components` directory, so that UnoCSS will process them.

## Architecture — Astro vs Svelte Boundary

This is the most important decision framework in an Astro + Svelte project.

### Decision Rule

Use an **`.astro` component** when:
- Content is static or server-rendered
- No JavaScript is needed in the browser
- It's a page layout, shell, or wrapper
- It renders Markdown/MDX content
- It only needs data at build time
- It's a simple presentational card, hero, footer

Use a **`.svelte` component** when:
- The component needs client-side **interactivity**
- It manages local state (`$state`, `$derived`)
- It responds to user events (click, input, drag)
- It uses browser APIs (IntersectionObserver, etc.)
- It wraps a Bits UI primitive (Dialog, Popover, ...)
- It needs transitions or animations tied to state

**Default to `.astro`.** Reach for Svelte only when you need a client-side island.

### What Must NOT Go in Svelte

- **Full page layouts** — use `.astro` layout components.
- **`<head>` management** — Astro owns `<html>`, `<head>`, `<body>`. Svelte islands render inside `<body>`.
- **Data fetching at build time** — use Astro frontmatter (`---` block) or content collections, not Svelte `$effect` + `fetch`.
- **Static lists, cards, grids** that have zero interactivity — pure markup belongs in `.astro`.

## Astro Fundamentals

### Mental model

- Astro is a **static-site generator first**. Every page ships **zero JavaScript** by default. JS only reaches the browser when you explicitly opt in via client directives on interactive components.
- Think of Astro as the **shell and routing layer**. Svelte components are **islands of interactivity** embedded inside that shell.
- Write as much as possible in `.astro` files (markup, data fetching, layout). Reach for `.svelte` only when the browser needs reactivity or event handling.

### `.astro` files

- Astro components are **server-only by default**. The frontmatter fence (`---`) runs at build time; the template below it produces static HTML.
- Frontmatter is regular TypeScript — import modules, fetch data, declare variables. Everything is available in the template.
- Template expressions use `{}` (single curly braces), not `${}`. There is no reactivity — values are resolved once at build time.
- Use `set:html={rawString}` for injecting pre-sanitized HTML. Never use it with user input.
- Astro components **do not accept client-side interactivity** — no `onclick`, no state. If you need that, use a Svelte island.

### Differences from Svelte templates

- No `{#if}` / `{#each}`. Use TypeScript expressions and `.map()` directly in the template:
  - Conditional: `{condition && <p>Yes</p>}` or a ternary.
  - Loop: `{items.map(item => <li>{item.name}</li>)}`.
- No two-way binding, no event directives. Astro markup is static output.
- Class attributes use `class:list={['base', { active: isActive }]}` instead of Svelte's `class:active` directive.
- Astro uses `<Fragment>` or `<>` for wrapper-free grouping.

### Writing Astro components

- **Never** use `set:html` with user-generated content. XSS risk.

Frontmatter:
- Always define an explicit `Props` interface.
- Access props via `Astro.props` with destructuring.

HTML elements:
- Use `class:list` for conditional classes in Astro templates (equivalent to `cn()` in Svelte).

### Sitemap

- Use `@astrojs/sitemap`. It picks up all generated pages automatically, including locale-prefixed ones.
- Configure `site` in `astro.config.mjs` so absolute URLs are correct.

## Svelte Integration

### Setup

- Enable the Svelte integration: `bun astro add svelte`. This adds `@astrojs/svelte` to `astro.config.mjs`.
- Svelte components live alongside Astro components in `src/components/` — no special directory needed.

### Client directives — the island contract

- A Svelte component imported into an `.astro` file **renders to static HTML at build time** unless a `client:*` directive is added.
- Choose the right directive:
  - `client:load` — hydrate immediately on page load. Use for above-the-fold interactive elements (nav menus, auth-dependent UI).
  - `client:visible` — hydrate when the component enters the viewport. **Default choice** for most interactive blocks (carousels, comment sections, accordions).
  - `client:idle` — hydrate once the browser is idle. Good for non-critical interactive widgets (newsletter forms, chat bubbles).
  - `client:media="(max-width: 768px)"` — hydrate only when a media query matches. Great for mobile-only interactive menus.
  - `client:only="svelte"` — skip SSR entirely, render only on the client. Use **only** when the component relies on browser APIs during initial render and cannot be server-rendered at all.
- **Omit the directive** when the component needs no interactivity (e.g., a styled card that just receives props and renders markup). It will be static HTML with zero JS cost.
- Never add `client:load` out of habit. Every directive you add increases the JS bundle.

### Passing data to islands

- Pass serializable props only: strings, numbers, booleans, plain objects, arrays. No functions, no class instances, no reactive stores.
- For complex data, serialize in the Astro frontmatter and pass as a JSON-friendly prop.
- You **cannot** pass Astro slots into Svelte components as snippets. If a Svelte island needs projected content, pass it as an HTML string prop and render with `{@html}`, or restructure so the Astro template handles the layout and the Svelte island handles only the interactive part.

### Sharing state between islands

- Islands are isolated by default. Each is hydrated independently — they do not share Svelte component tree context.
- For cross-island state (e.g., a cart counter in the nav that updates when an "Add to Cart" island is clicked), use **Svelte's module-level `$state`** in a shared `.svelte.ts` file. Both islands import the same module; the bundler deduplicates it.
- Alternative: use `nanostores` (framework-agnostic, tiny, designed for Astro islands).
- **Never** reach for global `window` events or DOM manipulation to sync islands.

### Bits UI in islands

- Bits UI components (Dialog, Popover, DropdownMenu, etc.) work inside Svelte islands exactly as described in the `coder-svelte` SKILL file.
- The trigger and the content **must** live inside the same Svelte island — you cannot split them across Astro and Svelte boundaries.
- If a Bits UI component is purely decorative with no interactive behavior needed (e.g., an Accordion that should be open by default and never collapse), consider replacing it with plain HTML/UnoCSS in an `.astro` file instead.

## Routing & Pages

### File-based routing

- Pages live in `src/pages/`. File names map to URL paths: `src/pages/about.astro` → `/about`.
- Dynamic routes use bracket syntax: `src/pages/blog/[slug].astro`.
- For static sites, every dynamic route **must** export `getStaticPaths()` returning all valid parameter combinations.
- Always type params: `const { slug } = Astro.params as { slug: string }`.

### `getStaticPaths`

- Returns an array of `{ params, props }` objects.
- **Pre-compute everything** — query your CMS, read files, call APIs — and return the full list. This runs once at build time.
- Pass heavy data via `props` to avoid re-fetching in the page frontmatter.

```ts
export async function getStaticPaths() {
  const posts = await fetchPosts();
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
```

- Paginate with the built-in `paginate()` helper for list pages.

### Layouts

- Create layouts in `src/layouts/`. A layout is a regular `.astro` component that uses `<slot />` (Astro still uses slots, not Svelte snippets).
- Apply a layout in a page's frontmatter: `import Layout from '../layouts/Base.astro'` then wrap the page content in `<Layout>`.
- Layouts can be nested: a `BlogPost.astro` layout wraps itself in `Base.astro`.
- Pass page-specific metadata as props to the layout: `<Layout title="About" description="...">`.

### 404 page

- Create `src/pages/404.astro`. Astro uses it automatically for unknown routes.

## Content Collections

### When to use

- Use content collections for any structured content authored as Markdown, MDX, JSON, or YAML files (blog posts, docs, team members, FAQs, changelogs).
- Do **not** use content collections for page chrome or dynamic data from an external API at request time.

### Setup

- Define collections in `src/content.config.ts` using `defineCollection` and `z` (Zod) schemas from `astro:content`.
- Place content files in `src/content/<collection>/` (e.g., `src/content/blog/first-post.md`).

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content', // Markdown/MDX
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### Querying

- Use `getCollection('blog')` to get all entries.
- **Never** include draft pages for production build. Filter at query time: `getCollection('blog', ({ data }) => !data.draft)`.
- Use `getEntry('blog', slug)` for a single entry.
- Render Markdown content with `const { Content } = await entry.render()` then `<Content />` in the template.
- Content collections are **fully typed** — frontmatter fields are validated by Zod at build time, and TypeScript knows the shape.

### Content + dynamic routes

- Combine collections with `getStaticPaths()` to generate a page per entry.
- Let the collection be the single source of truth — don't duplicate slugs or metadata.

## Multilingual Static Sites

### Astro's built-in i18n routing

- Configure in `astro.config.mjs`:

```ts
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'nl'],
    routing: {
      prefixDefaultLocale: false, // /about = English, /fr/about = French
    },
  },
});
```

- Astro provides `Astro.currentLocale` in every `.astro` page and `getRelativeLocaleUrl()` / `getAbsoluteLocaleUrl()` helpers from `astro:i18n`.

### Page structure

- Mirror pages per locale using folder-based routing:

```
src/pages/
├── about.astro ← English (default, no prefix)
├── fr/
│   └── about.astro ← French
├── nl/
│   └── about.astro ← Dutch
├── blog/
│   └── [slug].astro ← English blog
├── fr/
│   └── blog/
│       └── [slug].astro ← French blog
```

- For pages with identical structure and only translated text, create a single shared component and import it in each locale's page file, passing the locale as a prop — avoids duplicating layout logic.

### Translation dictionary

- Create `src/lib/i18n/translations.ts` with a typed dictionary:

```ts
const translations = {
  en: { nav_home: 'Home', nav_about: 'About', read_more: 'Read more' },
  it: { nav_home: 'Home', nav_about: 'Chi siamo', read_more: 'Leggi tutto' },
  de: { nav_home: 'Startseite', nav_about: 'Über uns', read_more: 'Weiterlesen' },
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)['en'];

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key];
}
```

- Import `t` and call with the current locale: `{t(locale, 'nav_home')}`.
- This function is **build-time only** in `.astro` files — no runtime cost. The resolved strings are baked into static HTML.
- For Svelte islands that need translated strings, pass them as props from the Astro template rather than importing the dictionary inside the island. This keeps the island unaware of the i18n system and avoids bundling the full dictionary into client JS.

### Translated content collections

- Organize content by locale within the collection:

```
src/content/blog/
├── en/
│   ├── first-post.md
│   └── second-post.md
├── fr/
│   ├── first-post.md
│   └── second-post.md
```

- Add a `locale` field to the collection schema, or derive it from the file path.
- Filter at query time: `getCollection('blog', ({ id }) => id.startsWith('en/'))`.
- In `getStaticPaths`, generate locale-aware slugs so each translated post gets the correct URL prefix.

### Language switcher

- Build in an `.astro` component (static, no JS needed).
- Use `getRelativeLocaleUrl(locale, currentPath)` from `astro:i18n` to compute equivalent paths.
- Render as plain `<a>` tags — static site, full page navigation is expected.
- Highlight the current locale using `Astro.currentLocale`.

## Performance Rules

### Client-Side

- Every Svelte component has the **most restrictive** `client:*` directive that still works.
- Components with no interactivity have **no** `client:*` directive.
- `client:only="svelte"` is used **only** when SSR is genuinely impossible.
- Heavy islands use `client:visible` to defer hydration.
- Cross-island state uses nanostores, not duplicated state.

### Assets

- All images use `<Image />` from `astro:assets` with `widths` and `sizes`.
- Hero / LCP images use `loading="eager"`, everything else `loading="lazy"`.
- Fonts are self-hosted or preloaded with `<link rel="preload">`.

### SEO & Accessibility

- Every page has a unique `<title>` and `meta description` in the current locale.
- Open Graph and Twitter Card meta tags are present.
- `<html lang>` reflects the current locale, `Astro.currentLocale`.
- `hreflang` alternate links are in `<head>` for all locales.
- Generate `<link rel="alternate" hreflang="en" href="..." />` for every locale in the `<head>`. Loop over your locale list in the layout frontmatter.
- All images have descriptive, translated `alt` text.
- Heading hierarchy is sequential (`h1` → `h2` → `h3`, no skips).

## Static-Site Specific Patterns

### Data fetching

- All `fetch()` calls in `.astro` frontmatter and `getStaticPaths` run **at build time**. There is no server at runtime.
- For CMS data, fetch in `getStaticPaths` or page frontmatter. If the same data is used across pages, extract into a shared `src/lib/data/*.ts` module — Astro deduplicates identical fetches within a build.
- **Never** assume `fetch` runs on every user request. Cache invalidation = rebuild + redeploy.

### Images

- Use Astro's `<Image />` component from `astro:assets` for all local images. It optimizes format, dimensions, and generates responsive `srcset`.
- Import images in frontmatter: `import hero from '../assets/hero.jpg'` then `<Image src={hero} alt="..." />`.
- For content collection images, reference them in frontmatter and use the `image()` Zod helper in the schema.
- For remote images, configure `image.domains` or `image.remotePatterns` in `astro.config.mjs`. Prefer local assets when possible.
- Always provide meaningful `alt` text. Use `alt=""` only for purely decorative images.

### Prefetching

- Astro v4+ includes built-in prefetching. Configure in `astro.config.mjs`:

```ts
prefetch: {
  prefetchAll: false,
  defaultStrategy: 'hover',
}
```

- Add `data-astro-prefetch` to critical navigation links for faster transitions.
- Use `data-astro-prefetch="viewport"` for links likely to be clicked (e.g., primary CTAs).

### View transitions

- Add `<ViewTransitions />` from `astro:transitions` in the base layout `<head>` for SPA-like page transitions without shipping a framework router.
- Use `transition:name="unique-id"` on elements that should animate between pages (e.g., hero images, headings).
- Be aware: view transitions enable client-side navigation, meaning Svelte islands **persist** across navigations unless their DOM is replaced. Test island cleanup carefully.
- When view transitions are active and a Svelte island must re-initialize on navigation, listen to `astro:after-swap` on `document` inside the island's `$effect`.

## UnoCSS in Astro

- Use UnoCSS classes directly in `.astro` templates, just as in `.svelte` files.
- Astro supports `class:list` for conditional classes: `<div class:list={['p-4', { 'bg-red-500': hasError }]}>`.
- Global styles go in `src/styles/global.css` imported in the base layout.

## Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Astro components/layouts/pages | `kebab-case.astro` | `head-seo.astro` |
| Svelte components | `kebab-case.svelte` | `search-bar.svelte` |
| Content files | `kebab-case.mdx` | `first-post.mdx` |
| i18n dictionaries | `{locale}.ts` | `en.ts`, `fr.ts` |

## Building & Deploying with Bun

- Use `bun` as the package manager and build runner.
- Set the output mode in `astro.config.mjs`: `output: 'static'` (the default — produces a fully pre-rendered site).
- Use `@astrojs/static` adapter (or no adapter — static mode needs none by default). Do **not** use SSR adapters.
- Build with `bun run build`. Output goes to `dist/`.
- Preview locally with `bun run preview`.
- Deploy the `dist/` folder to any static hosting.

## 13. Final Checklist — Before Submitting Code

- [ ] Static content is in `.astro` components, interactive content in `.svelte` islands.
- [ ] No Svelte component is rendered without a `client:*` directive unless intentionally static.
- [ ] No full page layouts or `<head>` management in Svelte.
- [ ] Props passed to islands are JSON-serializable (no functions, classes, Dates).
- [ ] Content collections have Zod schemas in `src/content/config.ts`.
- [ ] All `[param].astro` pages define `getStaticPaths()` (when `output: 'static'`).
- [ ] User-facing strings come from i18n dictionaries, not hardcoded.
- [ ] `class:list` used in `.astro` files; `cn()` used in `.svelte` files.
- [ ] `<Image />` used for all images (not raw `<img>`).
- [ ] Svelte component code follows the companion `coder-svelte` SKILL file for runes, snippets, events, and Bits UI patterns.
