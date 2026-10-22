# Validation record

## Image framing polish — 22 October 2026

- Removed inset padding from collection previews and case-study figures, matched technical-image canvases to the existing white palette, and gave the featured image a matching border. Retained the layout, spacing, typography, project text, and collection membership.
- Tightened the tissue-clamp preview with a presentation-only focal crop and framed its two case figures to fill their borders. Aligned the watch-cleaner preview to the top of the source, preserving its material/time summary while cropping the lower options area. Diagrams and plots retain their complete labels and data.
- Added a bounded thumbnail scale and retained the crop during hover; missing-image fallbacks bypass it. Original image files and full-size enlargement are unchanged. Verified that enlargement of the prototype still opens the complete 1024 × 768 source and closes with Escape.
- Reviewed 1366 × 900, 768 × 1024, 390 × 844, and 320 × 740. Preview frames have equal heights within each layout and no horizontal overflow. Checked the centered CAD crop, watch-cleaner summary, complete technical thumbnails, and the preserved crop during hover.
- Built 15 pages, checked 446 local references and seven original report hashes, and passed all nine existing tests. Project content was compared with the previous commit after excluding presentation fields and is unchanged.

## Selected Works and Other Works — 22 October 2026

- Added an Other Works collection beside Selected Works. The homepage defaults to the original eight Selected Works, with their content, order, and I-beam feature unchanged. Other Works has its own shareable `/other-works/#work` route and uses the same balanced row layout.
- Added standalone SO-101 robot arms, Tissue Clamp Assembly, Functional Hand Grips, and Watch-Cleaner Print Planning pages using existing project material and prior confirmed copy. Restored the two original tissue-clamp images from repository history. Kept Functional Hand and watch-cleaner design credits, prototype/estimate limitations, and the corrected grip-image orientation. Aering, Gexcon, the trophy, and the MakerLab umbrella remain excluded.
- Collection links are native links with current-page feedback, so they work without a JavaScript tab controller. Back and Next project links stay within the current collection. Membership is content-driven: omitted `collection` means Selected Works; `collection: "other"` means Other Works. Unknown keys fail the build.
- Restored the existing SO-101 video in its standalone page with native controls, reserved dimensions, a poster, `preload="none"`, and a direct-video fallback. Confirmed the video remained at readyState 0 before activation, then played the approximately 21-second demonstration through to completion without a media error. The page does not claim repeated-trial reliability or original robot-platform design.
- Reviewed both collections at 1366 × 900, 390 × 844, and 320 × 740. The two collection links remain side by side with at least 52-pixel target heights at 320 pixels. Checked all four new project pages at 320 pixels with no horizontal overflow. Verified keyboard Enter navigation, browser Back, and collection-specific case links.
- Built 15 pages, checked 446 local references and all seven original report hashes, and passed nine regression tests. New coverage checks default/unknown collection membership, next-project isolation, real collection URLs/current state, and deferred video loading. Original selected-project objects were compared directly with the prior commit and are unchanged.
- Verification remains Chromium-based. Additional projects can be added to the content file without changing layout code; only supported project details should be published.

## Alignment and visual balance — 20 October 2026

- Replaced the narrow fixed project-image column with proportional image/text tracks. The Work section heading uses the same grid, aligning its introduction with the project summaries. Removed the summary width cap that left unused space at the right of the rows.
- Reserved equal scrollbar gutters to keep the page visually centered. At 1366 pixels, the Work container has equal 63.33-pixel outer margins. Project images are approximately 507 × 280 pixels and rows approximately 333 pixels high, retaining roughly two visible projects.
- Moved project stacking to 720 pixels so smaller browser panes do not squeeze the text beside an image. Updated responsive image sizes to match the new tracks. Project content, ordering, palette, reports, resume, and featured I-beam are unchanged.
- Reviewed 1600 × 1000, 1366 × 900, 768 × 1024, 654 × 764, 390 × 844, and 320 × 740. No horizontal overflow. Confirmed equal margins, aligned desktop text columns, stacked intermediate/phone layouts, 44-pixel navigation controls at 320 pixels, and a contained technical comparison on a phone case page.
- Built 10 pages, checked 339 local references and seven original report hashes, and passed the five existing regression tests. Verification remains Chromium-based.

## Expanded project presentation and technical cases — 20 October 2026

- Enlarged the existing horizontal rows without changing the palette or project order. At 1366 × 900, seven rows measure approximately 315 pixels high and the longer UAV row measures 339 pixels. Images occupy a consistent 340 × 232 frame. Roughly two projects appear at the Work section entrance; phone layouts stack imagery above text.
- Added concise 45–51-word homepage summaries and explicit personal roles, with “Explore the project” links. Kept the I-beam as the homepage feature and retained the Engineer heading, contact section, resume, and BF sharing image.
- Expanded all eight narratives using the original reports and confirmed responsibilities. Added seven comparison tables, five explained equations, section navigation, direct PDF-page links, and five original report figures. The additional WebP figures total 381,218 bytes. No runtime library, client script, or build dependency was added.
- IEEE PELS now includes Bayu's confirmation of PLA, 4-40 × ¾-inch screws, qualitative fit checks, and iterative adjustments. Numerical tolerances, load ratings, yield, and time/cost savings are not inferred. Printed-part sets remain distinct from complete electronics kits, and the kit team's design credit remains visible.
- Reviewed report methods/results and visually checked newly extracted figures, the thick-origami Bennett equation page, and the crash-box comparison page. Distinguished physical specimens from simulations, repeated captures from repeated builds, calibration from independent validation, and proposed follow-up work from completed iterations. Crash-box SEA uses crushed mass; ambiguous absolute force units are omitted. The UAV remains a proposed architecture with unfinished targets.
- Reviewed the homepage at 1366 × 900, 768 × 1024, 390 × 844, and 320 × 740. Checked all eight case pages at 390 pixels with no page-level horizontal overflow. Reviewed representative I-beam and UAV sections at desktop width, the boom comparison at tablet width, and equation containment at phone widths.
- Verified keyboard activation of the case outline, section-heading clearance under the sticky header, keyboard horizontal scrolling of a narrow comparison table, and enlargement/Escape/focus return for a newly added I-beam photograph. Inspected browser logs on reviewed pages without console errors.
- Built 10 pages, checked 339 local references, and verified all seven original report SHA-256 hashes. All five regression tests pass, including malformed table rejection and the required spoken equation representation. Original report PDFs remain unchanged.
- Remaining limits: Chromium-based viewport checks only; no Safari/Firefox, real-device, or native screen-reader audit. Source gaps are recorded privately in `portfolio-planning/CASE_STUDY_GAPS.md`, outside the website repository/public build. Several source figures have limited original resolution; they are preserved without inventing or redrawing data.

## Frontend refinement — 20 October 2026

- Consolidated accumulated style overrides into readable component styles and shared palette, spacing, type, and motion tokens. Retained the existing paper, navy, orange, and muted green identity, eight compact project rows, project facts, original reports, resume, and BF sharing image.
- Added sticky section navigation with current-section feedback, all destinations available on phones, 44-pixel controls, contextual screen-reader labels, a working keyboard skip link, and visible focus states. Improved hover/active states without hiding content behind JavaScript.
- Added optional responsive WebP previews. The small preview set totals 163,552 bytes versus 491,122 bytes for the original project images. Browser selection uses `srcset`/`sizes`; full-size originals and their bytes are preserved. CSS and JavaScript are approximately 5.3 KB and 1.6 KB gzipped, respectively; no build or frontend dependencies were added.
- Verified a broken-image fixture in the browser: the fallback loaded within reserved dimensions and the unusable zoom action was removed. Checked stale/missing preview behavior and contextual links in three regression tests. Shared components handle optional media and documentation; one-project collections omit the next-project action.
- Reviewed Chromium-based previews at 1366 × 900, 768 × 1024, 390 × 844, and 320 × 740. No horizontal overflow. Desktop rows measured 186–190 pixels high; phone images stack above the text. Checked active About/Work navigation and heading clearance below the sticky header.
- Verified skip-link focus, visible keyboard focus, image-dialog focus return, Escape dismissal, scroll unlocking, and an actual report download. The downloaded PDF matches its original SHA-256. Browser console inspection found no errors on the inspected page.
- Calculated text contrast ratios of 13.24:1 for body text, 6.33:1 for muted text, 4.74:1 for orange links, and 8.94:1 for contact text; the contact focus color is 8.31:1 against navy. Reviewed the reduced-motion rule disabling smooth scrolling, transitions, and entrance motion; the system preference was not emulated in the browser.
- Built 10 pages, checked 239 local references including responsive sources, image dimensions, unique IDs, and new-tab link safety, and verified all seven report hashes. All three regression tests pass and run in CI. A byte comparison confirms project content is unchanged.
- Remaining verification limits: no Safari/Firefox, real-device, or native screen-reader audit. The optional preview-generation helper needs Sharp locally; normal builds and deployments do not.

## Compact project list — 20 October 2026

- Removed the Tissue Clamp Assembly entry, its generated page, and its two public images. IEEE PELS now supplies the featured image and story link; the feature falls back to the first project if no entry is marked featured.
- Changed the homepage heading to “I’m Bayu, an engineer.” Retained the education details and other project descriptions.
- Replaced the card grid with eight data-driven rows. Each desktop row has a 224 × 150 image, a title, a short description, and separate story/report or project-website links. Rows use natural document flow and resize to their content.
- Reviewed a 1366 × 900 desktop viewport: all eight rows measured about 187 pixels high, with matching thumbnails and no horizontal overflow. At 390 × 844, images stack above the text, with consistent 175.5-pixel heights and no overflow. Also reviewed the intermediate-width row layout and followed a project link through to its case study.
- Built 10 pages, checked all 207 local references, and verified all seven original report SHA-256 hashes.

## Standalone MakerLab projects — 16 October 2026

- Replaced the Illinois MakerLab umbrella entry with two standalone cases: IEEE PELS University Lab Kit and Tissue Clamp Assembly. These lead Selected Works, followed by the seven existing technical projects. The umbrella page is no longer generated.
- Retained the current IEEE PELS photographs and the tissue-clamp CAD and prototype images. Preserved the supplied-kit attribution, the distinction between printed-part sets and complete electronics kits, and the tissue clamp's unmeasured clamping performance.
- Updated the home introduction to structures, materials, and manufacturing. The featured tissue-clamp CAD image now links directly to its standalone case. MakerLab employment context remains in About.
- Built 11 pages, checked all 200 local references, and verified the seven original report hashes. Reviewed both new pages and the project grid at desktop width; checked all three at a 390-pixel viewport with no horizontal overflow. Verified image enlargement, Escape dismissal, and focus restoration.

## Logo sharing preview — October 12, 2026

- Created a 1200 × 627 PNG sharing card from the existing BF monogram, with the portfolio name and domain. Visually checked the rendered card; file size is 42,531 bytes.
- Set a single absolute logo-image URL in the shared page template, including Open Graph image type, dimensions and alternative text, plus Twitter/X image metadata. All 10 generated HTML pages use the card.
- Compared every generated page body with the published site; visible content is identical. All 225 local references and seven original report hashes pass.
- Social platforms may cache earlier previews. LinkedIn Post Inspector can refresh metadata for new shares; existing posts may retain their original preview.

## Custom-domain launch — October 12, 2026

- Confirmed the purchased domain in Cloudflare Registrar and verified ownership in the GitHub account's Pages settings using its issued TXT record. Retained that record.
- Set the repository custom domain to `bayufebriansyah.com`, then added the four GitHub Pages A records and the `www` CNAME in Cloudflare, all DNS only. Both Cloudflare and Google public DNS resolve the records correctly.
- Deployment `38299874187` succeeded for commit `fb2480e`. Before HTTPS was ready, checked 53 live pages and files on the new domain, including all eight projects, original report hashes, resume, video, and project images. The three excluded resources returned 404.
- GitHub issued a usable certificate. Enabled **Enforce HTTPS** and verified a valid HTTPS 200 response at the root domain, HTTP-to-HTTPS redirection, and HTTPS `www` redirection preserving a project path and query string.
- A final deployment after enabling HTTPS updates the generated canonical, sitemap, and social-sharing URLs from HTTP to HTTPS. The site retains an empty base path for the custom domain.

## Editorial revision — October 12, 2026

- Rewrote all eight card descriptions (16–21 words) and opening overviews (87–103 words), using specific contributions, choices, and results.
- Featured Illinois MakerLab in the existing home-page hero and placed it first in one All Works collection. Removed category-filter controls and their JavaScript.
- Replaced the numbered approach cards with descriptive narrative sections. Removed figure counters and MakerLab section numbers; retained card index badges as part of the existing visual design.
- Placed photographs, CAD, and results alongside the corresponding narrative. Added eight figures extracted from the supplied reports and used the existing thick-origami prototype image in its story.
- Preserved original reports and the robot video. Seven report SHA-256 hashes and all 225 local references pass.
- Checked the home page and technical stories at desktop size, and the home, tape-spring, and MakerLab pages at 390-pixel phone width. No horizontal overflow; all five MakerLab anchors remain visible. Verified image enlargement, Escape dismissal, and focus restoration.
- MakerLab management examples are limited to supported requirements, client communication and approval, CAD changes, and material/machine-time planning. Additional deadline, material-purchasing, and delivery claims await the user's clarification; Gmail is disconnected.
- The ordering uses the report months for now. Relative completion order within the April origami pair and March I-beam/boom pair awaits the user's confirmation. The user authorized publication with the current content.
- Published the revised source in commit `9bbb4f3`, then changed the default origin to `https://bayufebriansyah.com` with an empty base path in commit `fb2480e`. The domain-root build passes all 225 local references and the seven original report hashes.

## Previous published version

Checked October 9, 2026 against the supplied reports, resume, project-role clarifications, video, and MakerLab project folder.

- Built seven technical case studies, the MakerLab page, the home page, and a 404 page with Node.js 24.
- Verified 207 local page, image, report, video, resume, and fragment references across 10 HTML files.
- Rebuilt and checked both `/bayufebriansyah.github.io/` and an empty base path with `https://bayufebriansyah.com` as the origin. The latter is a configuration check, not evidence of domain ownership or live hosting.
- Verified seven report copies against original SHA-256 hashes. No report pages were rewritten or recompressed.
- Reviewed the original technical cases at phone width. Reviewed the expanded MakerLab page at desktop size and 390-pixel phone width, with no horizontal overflow.
- Checked the revised project filter: two systems/software entries and eight entries after reset.
- Checked image enlargement, Escape dismissal, and focus return to the original image link.
- Played the compressed SO-101 clip through its approximately 21-second duration in the preview browser. H.264 video decoded at 406 × 720 pixels with no playback error.
- Confirmed that the original HTML includes all project stories, PDF links, and image links independently of the enhancement script. Filters stay hidden until JavaScript runs.
- Removed the Aering case and its illustration. Gexcon and trophy work remain excluded.
- Added four MakerLab example sections covering Functional Hand, tissue-clamp prototyping, reusable PCB mounts, and watch-cleaner print planning, with eight optimized images.
- Used the earlier client correspondence to distinguish the square-nut pocket view from the CAD assembly with hardware; neither is labeled as a before/after comparison. Client approval is documented; sample fit tests remain planned.
- Checked all five MakerLab navigation links on mobile. Scoped the header's mobile navigation rule so it cannot hide an example link.
- Prepared a domain-root build for `https://bayufebriansyah.com` using `node build-cloudflare.mjs`; all 207 local references and seven original report hashes passed. Confirmed the home page and MakerLab navigation in the local root preview. Packaged and byte-verified 51 public files in a 13.3 MB ZIP, with `index.html` at the archive root and every file below Cloudflare's 25 MiB limit. This preparation does not establish domain ownership or a Cloudflare deployment.
- Kept invoices, shipping information, customer documents, original third-party CAD libraries, and the watch-cleaner manual outside the public assets. Slicer figures are labeled as estimates and platform designs are credited separately.

The expanded MakerLab content was deployed successfully to GitHub Pages. Verified 28 live pages and files over HTTPS, including all eight project pages, eight new MakerLab images, seven original report hashes, the resume, the robot clip, and the CSS/JavaScript assets. Confirmed that the retired Aering page and illustration, and the excluded trophy image, return 404. Custom-domain DNS and redirects remain pending domain ownership and setup.

## IEEE PELS MakerLab update — 16 October 2026

- Expanded the existing PCB-mount example into the IEEE PELS University Lab Kit story and preserved its `kit-cad-revisions` anchor. Added it to the MakerLab overview and navigation.
- Used Bayu's confirmed contribution for the square-nut mounting design, printing without supports, and management of manufacturing and shipping of more than 200 complete printed-part sets. Kept electronics and other kit components outside his scope.
- Added two optimized photographs of the current printed base. Removed the two older CAD views and their public files after Bayu clarified that they show an earlier version. Linked the public project website, which acknowledges Bayu and Illinois MakerLab.
- Built 10 pages, checked 205 local references, and verified all seven original report hashes. Reviewed the section at desktop width and confirmed image enlargement and Escape dismissal. The existing responsive layout was also checked at 390 pixels with no horizontal overflow.
