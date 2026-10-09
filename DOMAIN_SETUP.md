# Connect bayufebriansyah.com

The site can run on its free GitHub Pages address before a domain is purchased. Registration and ownership must be confirmed before changing the Pages custom-domain field or publishing DNS records.

## Register and protect the domain

Search for `bayufebriansyah.com` at your preferred registrar, such as [Cloudflare Registrar](https://domains.cloudflare.com/). A registry lookup on October 9, 2026 returned no registration, but checkout is the authoritative availability and price check. Review the first-year and renewal cost before paying. Enable WHOIS privacy/redaction where available and auto-renew, and confirm the registrant email.

## Verify ownership in GitHub

In your GitHub account **Settings → Pages**, add the domain for verification. Copy GitHub's exact TXT name and value into your registrar's DNS panel, then complete verification. Do not invent the TXT token. Keep the verification record in place.

## Add the domain to the repository

In repository **Settings → Pages → Custom domain**, enter `bayufebriansyah.com` and save. Keep the source set to **GitHub Actions**. The Pages settings and DNS control the domain for this workflow; it does not require a `CNAME` file in the published artifact.

## Configure DNS

Use the following records at the registrar. The `@` notation means the root of the domain. Remove conflicting parking records for the same host, while preserving unrelated mail and verification records.

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | bayudimasfebriansyah.github.io |

The `www` target contains your GitHub username, without the repository path. If using Cloudflare DNS, initially use **DNS only** while GitHub checks records and issues its certificate.

Wait for the DNS check and HTTPS certificate, then enable **Enforce HTTPS** in GitHub Pages. DNS changes may take up to 24 hours. With both apex and `www` configured correctly, GitHub redirects the alternate host to the selected custom domain.

## Rebuild and verify

Run the deployment workflow again after configuring the domain. It obtains the new root URL from GitHub Pages. Update `site.config.json` to use `https://bayufebriansyah.com` as `origin` and an empty `basePath` for future local builds.

Check the home page, a directly opened project URL, a report download, the resume, video playback, HTTPS, and the `www` redirect. Only then use the domain on applications.

## Optional custom email

The current website uses the working address `bayudf2@illinois.edu`. After owning the domain, a forwarding address such as `hello@bayufebriansyah.com` can be created with an email-routing service. Verify forwarding before replacing the site contact address. Forwarding by itself does not configure outbound sending from that address.

Official instructions: [GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [GitHub domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages), and [Cloudflare WHOIS redaction](https://developers.cloudflare.com/registrar/account-options/whois-redaction/).
