# Validation record

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
