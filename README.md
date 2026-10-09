# Bayu Febriansyah · Engineering portfolio

A static portfolio built around engineering decisions, personal contributions, and evidence. Seven technical projects and one Illinois MakerLab case study cover composites, deployable structures, impact simulation, robotics, fabrication, and systems architecture.

The site is plain HTML and CSS with a small progressive-enhancement script. A dependency-free Node build produces the pages from editable JSON. There is no database, subscription, external font request, or client-side framework.

## Run locally

Install Node.js 22 or newer, then run:

```sh
npm run dev
```

Open the URL printed by the server. It includes the repository subpath. After editing source, rebuild with `npm run build` and refresh the browser. `npm run check` verifies local links, fragments, content boundaries, and original report hashes.

## Edit the portfolio

| File | Purpose |
| --- | --- |
| `content/projects.json` | Card descriptions, project overviews, roles, methods, evidence, captions, report metadata |
| `site.config.json` | Contact links and the default local build URL |
| `scripts/build.mjs` | Home page and case-study templates |
| `public/assets/styles.css` | Responsive visual design |
| `public/assets/site.js` | Project filtering and keyboard-accessible image enlargement |
| `public/assets/projects/` | Optimized report figures and selected MakerLab project photographs and CAD views |
| `public/assets/video/so101-demo.mp4` | Compressed, silent, browser-compatible copy of the supplied SO-101 demonstration |
| `public/reports/` | Seven original technical PDFs, unchanged |
| `public/resume/` | Supplied resume PDF |
| `content/report-manifest.json` | SHA-256 hashes and original report filenames |

Keep opening overviews under 160 words. Match claims to the supplied evidence, credit collaborators, and distinguish simulation, physical testing, proposed systems, and production estimates. Add new MakerLab examples within the `examples` array in its existing case study. Employment examples outside MakerLab are omitted. Customer documents, invoices, shipping details, original third-party CAD libraries, and the watch-cleaner manual stay outside the public assets.

## Publish with GitHub Pages

Repository: [bayudimasfebriansyah/bayufebriansyah.github.io](https://github.com/bayudimasfebriansyah/bayufebriansyah.github.io).

On Windows, after the source is committed locally, run `powershell -ExecutionPolicy Bypass -File .\Publish-Portfolio.ps1`. This applies the policy only to that process. Git Credential Manager opens the normal GitHub sign-in if needed; complete it on GitHub. The script pushes `main`, configures Pages for Actions, and starts a deployment. It never asks you to paste a token into source code. If your account prevents automatic Pages setup, use the manual steps below.

1. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
2. Push changes to `main`. The deployment workflow builds, checks, and publishes `dist/`.
3. Review the workflow under **Actions** and open the deployment URL when it succeeds.

The default address for this repository is:

[bayudimasfebriansyah.github.io/bayufebriansyah.github.io/](https://bayudimasfebriansyah.github.io/bayufebriansyah.github.io/)

The workflow reads the site's origin and base path from GitHub Pages, so internal links also work when a verified custom domain is added. A custom domain requires a new deployment after the Pages setting changes. See [DOMAIN_SETUP.md](DOMAIN_SETUP.md).

For a manual root-domain build, set `BASE_PATH` to an empty string and `SITE_ORIGIN` to the domain before running the build. To preview that build, stop the current preview server and restart it. The server reads the base path when starting.

## Accessibility and performance

All project content and report links are available without JavaScript. Filters only appear when their script runs. Image links open the original image without JavaScript and use a modal dialog when supported, with Escape dismissal and focus restoration. Images have alternative text, the layout supports narrow screens, focus indicators are visible, and motion respects the reduced-motion preference. Video uses a poster and native controls with no autoplay or initial video download.

Public project images are optimized WebP files. The 21-second demonstration is approximately 2 MB. Reports download only when requested; their original bytes are preserved. Source PDFs and their figures retain their authors' attribution. No blanket open-source license is applied to third-party report content.
