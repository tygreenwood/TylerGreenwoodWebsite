# tyler-greenwood-website

Personal site for Tyler Greenwood — a static, prerendered React Router app
deployed to fly.io behind nginx.

## Stack

- **React Router 8** in framework mode, with `ssr: false` and every route
  prerendered to HTML at build time (`react-router.config.ts`)
- **Tailwind CSS 4** with light/dark themes driven by CSS custom properties
- **nginx** serving `build/client` from a small container — no Node process
  runs in production

## Pages

| Route       | File                    |
| ----------- | ----------------------- |
| `/`         | `app/routes/home.tsx`   |
| `/projects` | `app/routes/projects.tsx` |
| `/about`    | `app/routes/about.tsx`  |

## Editing the site

Almost everything you'd want to change lives in **`app/content.ts`** — your
name and links, the home page headline and skills, the About paragraphs, and
the list of projects. The route components just read from it.

### Adding a project

Append an entry to the `projects` array in `app/content.ts`:

```ts
{
  slug: "trail-conditions",
  name: "Trail Conditions",
  tagline: "Snowpack and closure data for Cascades trailheads.",
  description: "What the problem was, what you built, what it changed.",
  stack: ["TypeScript", "React", "PostgreSQL"],
  repo: "https://github.com/you/trail-conditions",
  demo: "https://trail-conditions.example.com",
  period: "2025",
  featured: true,
}
```

The card, the tech pills, the links, and the featured section on the home page
are all wired up already. While the array is empty the Projects page shows a
placeholder instead of an empty grid.

### Photos

Drop your images into `public/images/`, keeping the filenames listed in
[`public/images/README.md`](public/images/README.md). The files in there now
are labeled placeholders.

### Theme

The theme follows the OS preference by default and can be overridden with the
toggle in the header, which persists to `localStorage`. An inline script in
`app/root.tsx` applies it before first paint so there's no flash of the wrong
theme on a prerendered page. Colours are defined once as custom properties in
`app/app.css` (`:root` and `.dark`).

**Both themes meet WCAG AAA (7:1) for text.** That constraint shapes the
palette, so a few tokens exist specifically to keep it:

| Token             | Why it exists                                                     |
| ----------------- | ----------------------------------------------------------------- |
| `--on-accent`     | Label colour on accent buttons — white in light, near-black in dark. A single accent can't carry white text at 7:1 in both themes. |
| `--accent-hover`  | Button hover. The old `opacity-90` *lowered* contrast to 6.41:1; this darkens (light) or lightens (dark) instead. |
| `--border-strong` | Outlines on interactive controls, at the 3:1 that WCAG 1.4.11 asks for. `--border` stays subtle for decorative card edges, which that rule doesn't cover. |

Run the checker after changing any colour:

```bash
npm run check:contrast
```

It parses the tokens straight out of `app/app.css` and tests every pair the UI
actually renders. If you introduce a new foreground/background combination in a
component, add it to `PAIRS` in [`scripts/check-contrast.mjs`](scripts/check-contrast.mjs)
so it's covered too.

## Development

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build      # static output in build/client/
npm run preview    # serve the production build locally
npm run typecheck
npm run check:contrast   # WCAG AAA check on the theme tokens
```

## Deploying to fly.io

One-time setup — `fly launch` will ask to overwrite `fly.toml`, so decline, or
just create the app directly:

```bash
fly apps create tyler-greenwood
```

If that name is taken, pick another and update `app` in `fly.toml`. Then:

```bash
fly deploy --remote-only
```

`--remote-only` builds the image on Fly's builders, so you don't need Docker
locally. The machine is configured to stop when idle and start on the next
request (`auto_stop_machines` in `fly.toml`), which keeps a static site like
this in free-tier territory.

To put it on your own domain:

```bash
fly certs add tylergreenwood.dev
```

then add the DNS records Fly prints.
