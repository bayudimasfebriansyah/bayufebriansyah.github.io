# Bayu Febriansyah · Engineering portfolio

A static portfolio built around engineering decisions, personal contributions, and evidence. Eight standalone projects cover structures, materials, manufacturing, mechanical design, and systems architecture. The IEEE PELS University Lab Kit leads the collection, followed by seven technical projects.

The site is plain HTML and CSS with a small progressive-enhancement script. A dependency-free Node build produces the pages from editable JSON. There is no database, subscription, external font request, or client-side framework.

## Run locally

Install Node.js 22 or newer, then run:

```sh
npm run dev
```

Open the URL printed by the server. The default build uses the root path, matching the custom domain. After editing source, rebuild with `npm run build` and refresh the browser. `npm run check` verifies local links, responsive image sources, fragments, image dimensions, unique IDs, content boundaries, and original report hashes. `npm test` covers missing media, stale previews, and shared action links. Both checks run in the deployment workflow.

## Edit the portfolio

| File | Purpose |
| --- | --- |
| `content/projects.json` | Card descriptions, project overviews, narrative sections and their image references, roles, captions, report metadata |
| `site.config.json` | Contact links and the default local build URL |
| `scripts/build.mjs` | Home page and case-study templates |
| `scripts/components.mjs` | Shared image and action-link rendering, safe fallbacks, responsive media |
| `content/image-variants.json` | Original image hashes and optional responsive previews |
| `scripts/portfolio-preview.svg` | Editable source for the BF logo sharing card |
| `public/assets/portfolio-preview.png` | 1200 × 627 logo card used by every page for Open Graph and Twitter/X previews |
| `public/assets/styles.css` | Responsive visual design |
| `public/assets/site.js` | Section navigation feedback, image failure handling, native image dialog |
| `public/assets/projects/` | Optimized report figures and selected MakerLab project photographs and CAD views |
| `public/reports/` | Seven original technical PDFs, unchanged |
| `public/resume/` | Supplied resume PDF |
| `content/report-manifest.json` | SHA-256 hashes and original report filenames |

Keep opening overviews under 160 words. Match claims to the supplied evidence, credit collaborators, and distinguish simulation, physical testing, proposed systems, and production estimates. Add new projects as standalone entries in `content/projects.json`, with narrative sections and supporting figures. The `featured` flag selects the home-page image and story link; when it is absent, the first project is used. `featuredCaption` optionally supplies its caption. Employment examples outside MakerLab are omitted. Customer documents, invoices, shipping details, original third-party CAD libraries, and the watch-cleaner manual stay outside the public assets.

## Publish with GitHub Pages

Repository: [bayudimasfebriansyah/bayufebriansyah.github.io](https://github.com/bayudimasfebriansyah/bayufebriansyah.github.io).

The repository already uses GitHub Actions to publish the portfolio. Cloudflare manages the domain and DNS; GitHub Pages hosts the website.

1. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
2. Push changes to `main`. The deployment workflow builds, checks, and publishes `dist/`.
3. Review the workflow under **Actions** and open the deployment URL when it succeeds.

The custom address is:

[bayufebriansyah.com](https://bayufebriansyah.com/)

To update the project text, edit `content/projects.json`, run `npm run build` and `npm run check`, then commit and push to `main`:

```sh
git add content/projects.json
git commit -m "Update portfolio content"
git push origin main
```

Stage any other source files you changed too. Each push starts a new deployment. You can also edit a text file directly on GitHub and commit it to `main`. Check the Actions run before sharing a change. Do not edit `dist/`; the workflow regenerates it from the source.

The workflow reads the site's origin and base path from GitHub Pages, so internal links also work when a verified custom domain is added. A custom domain requires a new deployment after the Pages setting changes. See [DOMAIN_SETUP.md](DOMAIN_SETUP.md).

For Cloudflare Pages, run `node build-cloudflare.mjs` to build and check the site at the root of `https://bayufebriansyah.com`. Publish `dist/`. [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md) contains the Git integration settings and the alternative DNS setup for retaining GitHub hosting.

For a manual root-domain build, set `BASE_PATH` to an empty string and `SITE_ORIGIN` to the domain before running the build. To preview that build, stop the current preview server and restart it. The server reads the base path when starting.

## Accessibility and performance

All project content and report links are available without JavaScript. All eight entries appear in a single Selected Works list, with IEEE PELS first. Each compact desktop row pairs a consistent image with its title, summary, and story/report links. On small screens the image stacks above the text. Rows are generated from the project data and flow automatically as entries change. Image links open the original image without JavaScript and use a modal dialog when supported, with Escape dismissal and focus restoration. Images have alternative text, the layout supports narrow screens, focus indicators are visible, and motion respects the reduced-motion preference.

Public project images are optimized WebP files. Browsers choose among optional 480- and 768-pixel previews and the original using `srcset` and `sizes`. Originals retain their bytes; project images are lazy-loaded except for the featured image. Reports download only when requested; their original bytes are preserved. Source PDFs and their figures retain their authors' attribution. No blanket open-source license is applied to third-party report content.

## Frontend maintenance

The stylesheet is organized by live components and uses shared palette, typography, spacing, and transition tokens. The original paper, navy, orange, and muted green palette is retained. The header remains available while scrolling, with section feedback on the home page and Work selected on project pages. All navigation destinations remain visible on mobile.

Every action has a visible keyboard focus state. Repeated story and report links include project names for assistive technology. Image enlargement uses the native dialog, preserves modified-click behavior, closes with Escape, and returns focus without moving the page. The skip link targets a focusable main landmark. Reduced-motion preferences disable smooth scrolling, transitions, and entrance motion.

Keep `imageWidth`, `imageHeight`, and descriptive alternative text with every new project image. Missing imagery uses the neutral fallback; a failed enlarged image does not leave a broken zoom action. Optional reports, project references, and scope notes render only when supplied. The next-project component is omitted when only one project remains.

Responsive previews are optional: a new original works immediately without them, and an original with a changed hash automatically bypasses stale previews. To regenerate previews, use `node scripts/prepare-images.mjs` with Sharp available in your local Node environment, or set `PORTFOLIO_SHARP_MODULE` to its module directory. This optional authoring tool is separate from the dependency-free build and does not run during deployment. It preserves the originals.

Browser verification uses Chromium-based desktop, tablet, and phone viewports. The build checks and small regression suite complement manual keyboard, focus, contrast, and download checks; they do not constitute a full screen-reader or cross-browser audit.
