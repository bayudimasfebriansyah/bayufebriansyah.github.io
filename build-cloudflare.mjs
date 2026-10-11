// Build the existing portfolio at the domain root, then check every local link
// and the original report hashes. No deployment or account access is performed.
const origin = new URL(process.env.SITE_ORIGIN || 'https://bayufebriansyah.com');
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) {
  throw new Error('SITE_ORIGIN must be an HTTPS origin, such as https://bayufebriansyah.com');
}
process.env.SITE_ORIGIN = origin.origin;
process.env.BASE_PATH = '';
await import('./scripts/build.mjs');
await import('./scripts/check.mjs');
