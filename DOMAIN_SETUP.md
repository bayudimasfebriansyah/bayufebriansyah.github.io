# Connect bayufebriansyah.com

For Cloudflare-specific setup, including the existing GitHub host and optional Cloudflare Pages hosting, use [CLOUDFLARE_SETUP.md](CLOUDFLARE_SETUP.md).

The domain was purchased through Cloudflare and verified in GitHub on October 12, 2026. The repository's custom domain is `bayufebriansyah.com`, with **Enforce HTTPS** enabled. Cloudflare DNS holds the four GitHub Pages A records, the `www` CNAME, and the GitHub ownership-verification TXT record. Keep that TXT record in place. HTTPS and the path-preserving `www` redirect have been verified publicly.

## Maintain the domain

Manage renewal and registration details in Cloudflare Registrar. The setup below documents the existing GitHub Pages configuration so it can be maintained later.

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
