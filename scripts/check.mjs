import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../dist/',import.meta.url));
const {basePath,origin} = JSON.parse(await readFile(path.join(root,'build-info.json'),'utf8'));
async function walk(dir) {return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(d=>d.isDirectory()?walk(path.join(dir,d.name)):path.join(dir,d.name)))).flat();}
const files = await walk(root);
const pages = files.filter(f=>f.endsWith('.html'));
const errors = [];
let count = 0;
for (const f of pages) {
  const html = await readFile(f,'utf8');
  if ((html.match(/<h1(?:\s|>)/g)||[]).length !== 1) errors.push(`${f}: expected one h1`);
  if (/C:[\\/]|Editorial source and integration|Gexcon|Aering|aering-flight-data|hello@bayufebriansyah/.test(html)) errors.push(`${f}: private or excluded content leaked`);
  for (const match of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
    let value = match[1].replace(/&amp;/g,'&');
    if (/^(mailto:|https?:|data:)/.test(value)) continue;
    let u = new URL(value,origin+basePath+'/'+path.relative(root,f).replaceAll('\\','/'));
    if (basePath && !u.pathname.startsWith(basePath+'/')) {errors.push(`${f}: link escapes site base: ${value}`);continue;}
    let target = path.join(root,decodeURIComponent(u.pathname.slice(basePath.length)));
    try {
      const info = await stat(target);
      if (info.isDirectory()) target = path.join(target,'index.html');
      await stat(target);
      if (u.hash && target.endsWith('.html')) {
        const contents = await readFile(target,'utf8');
        if (!contents.includes(`id="${decodeURIComponent(u.hash.slice(1))}"`)) errors.push(`${f}: missing fragment ${value}`);
      }
    } catch { errors.push(`${f}: missing link ${value}`); }
    count++;
  }
  for (const match of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(match[0])) errors.push(`${f}: missing image alternative`);
}
if (errors.length) {console.error(errors.join('\n'));process.exit(1);}
const manifest = JSON.parse(await readFile(new URL('../content/report-manifest.json',import.meta.url),'utf8'));
for (const report of manifest) {
  const bytes = await readFile(path.join(root,'reports',report.file));
  if (createHash('sha256').update(bytes).digest('hex') !== report.sha256 || bytes.length !== report.bytes) throw Error(`Original report changed: ${report.file}`);
}
console.log(`Checked ${pages.length} HTML pages and ${count} local references. All linked files and fragments exist.`);
console.log(`Verified ${manifest.length} reports against original-file SHA-256 hashes.`);
