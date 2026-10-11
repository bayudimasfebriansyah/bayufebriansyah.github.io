# Launch bayufebriansyah.com with Cloudflare

The portfolio is prepared for `https://bayufebriansyah.com`. Buy the domain and complete Cloudflare's registration and email-verification steps before connecting it. The current GitHub Pages site can continue serving while the domain is prepared.

## Option A: Cloudflare domain with the existing GitHub hosting

Use this if Cloudflare will manage registration and DNS while GitHub continues to host the portfolio. Future pushes to `main` keep publishing automatically.

1. In your **GitHub account → Settings → Pages**, verify `bayufebriansyah.com`. Add the exact TXT name and token GitHub supplies in **Cloudflare → bayufebriansyah.com → DNS → Records**. Keep that TXT record after verification.
2. In the **repository → Settings → Pages**, set **Custom domain** to `bayufebriansyah.com`. Keep **Source: GitHub Actions**.
3. Add these records in Cloudflare. Use **DNS only** while GitHub validates DNS and issues HTTPS. TTL can remain **Auto**.

| Type | Name | Content | Proxy status |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | DNS only |
| A | @ | 185.199.109.153 | DNS only |
| A | @ | 185.199.110.153 | DNS only |
| A | @ | 185.199.111.153 | DNS only |
| CNAME | www | bayudimasfebriansyah.github.io | DNS only |

Replace conflicting web-hosting or parking records for `@` and `www`; retain unrelated mail and verification records. The CNAME target is the GitHub username host, without a repository path.

4. Wait for GitHub's DNS and certificate checks, then enable **Enforce HTTPS**. With both root and `www` correctly configured, GitHub redirects `www` to the selected root domain.
5. In **Actions → Deploy portfolio to GitHub Pages → Run workflow**, run a new deployment on `main`. The existing workflow reads the domain and base path from GitHub Pages, so project and download links use the new address automatically. This custom Actions workflow does not need a `CNAME` file.

See the official [GitHub custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) and [ownership verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

## Option B: Cloudflare domain and Cloudflare Pages hosting

Use this if Cloudflare will host the portfolio as well as manage the domain.

For automatic updates, use a Git-connected Pages project from the outset. Cloudflare's Direct Upload projects cannot later be switched to Git integration; that requires a new project.

In **Cloudflare → Workers & Pages**, create a **Pages** application and import the existing GitHub repository. When authorizing GitHub access, select only `bayudimasfebriansyah/bayufebriansyah.github.io`.

| Setting | Value |
| --- | --- |
| Production branch | main |
| Framework preset | None |
| Root directory | Repository root / leave blank |
| Build command | node build-cloudflare.mjs |
| Build output directory | dist |
| Environment variable | NODE_VERSION = 24 |

`build-cloudflare.mjs` must be present in the selected Git commit. It builds the site at `/`, sets canonical and sitemap URLs to `https://bayufebriansyah.com`, and checks links plus original report hashes. To use another domain, set `SITE_ORIGIN` to its HTTPS origin in Cloudflare's build environment.

Alternatively, for manual uploads, create a Direct Upload Pages project and upload the prepared ZIP or the contents of `dist/`. The ZIP has `index.html` at its top level and contains only the built public site. Rebuild with `node build-cloudflare.mjs` after future content changes; uploading the source repository itself will not run the build.

After a successful deployment:

1. Open the assigned `pages.dev` address and check the home page and a direct project link.
2. Under **Pages project → Custom domains → Set up a domain**, add `bayufebriansyah.com`. For a domain in the same Cloudflare account, complete the offered DNS setup. Use the project's actual assigned `pages.dev` target. The GitHub A records in Option A do not apply to this hosting choice.
3. Add `www.bayufebriansyah.com` through **Custom domains** too. Once both hosts are active, use Cloudflare's **Redirect from www to apex** instructions to create a permanent redirect that preserves the path and query string.
4. Wait until the domain is active with HTTPS, then repeat the checks below. Keep GitHub Pages available until the custom domain works.

Official references: [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), and [www-to-root redirect](https://developers.cloudflare.com/pages/how-to/www-redirect/).

## Final checks

- `https://bayufebriansyah.com/` loads the home page.
- `/projects/illinois-makerlab/` opens directly and its images enlarge.
- Each of the seven report links and the resume downloads correctly.
- The SO-101 video plays.
- `https://www.bayufebriansyah.com/projects/illinois-makerlab/` redirects to the matching root-domain path.
- HTTPS is valid and no links retain the old `/bayufebriansyah.github.io/` prefix on the new domain.

The current working contact email stays `bayudf2@illinois.edu`. A custom forwarding address can be added after its delivery is tested.
