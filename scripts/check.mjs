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
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${f}: duplicate IDs`);
  for (const control of html.matchAll(/\baria-controls="([^"]+)"/g)) {
    if (!ids.includes(control[1])) errors.push(`${f}: missing controlled region ${control[1]}`);
  }
  const collectionPanels = [...html.matchAll(/<div\b[^>]*\bdata-work-panel="([^"]+)"[^>]*>/g)];
  if (collectionPanels.length) {
    const visible = collectionPanels.filter(match=>!/\bhidden(?:\s|>)/.test(match[0]));
    const current = [...html.matchAll(/<a\b[^>]*\bdata-work-collection="([^"]+)"[^>]*>/g)].filter(match=>match[0].includes('aria-current="page"'));
    const intro = [...html.matchAll(/<span\b[^>]*\bdata-work-intro="([^"]+)"[^>]*>/g)].filter(match=>!match[0].includes('aria-hidden="true"'));
    if (visible.length !== 1 || current.length !== 1 || intro.length !== 1 || visible[0]?.[1] !== current[0]?.[1] || visible[0]?.[1] !== intro[0]?.[1]) errors.push(`${f}: inconsistent default collection state`);
  }
  const references = [...html.matchAll(/(?:href|src|poster)="([^"]+)"/g)].map(match=>match[1]);
  for (const match of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    references.push(...match[1].split(',').map(candidate=>candidate.trim().split(/\s+/)[0]));
  }
  for (const reference of references) {
    let value = reference.replace(/&amp;/g,'&');
    if (/^(mailto:|tel:|https?:|data:)/.test(value)) continue;
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
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(match[0])) errors.push(`${f}: missing image alternative`);
    if (/\bsrc=/.test(match[0]) && !(/\bwidth="[1-9]\d*"/.test(match[0]) && /\bheight="[1-9]\d*"/.test(match[0]))) errors.push(`${f}: image dimensions are not reserved`);
  }
  for (const match of html.matchAll(/<a\b[^>]*>/g)) {
    if (/target="_blank"/.test(match[0]) && !/rel="[^"]*noopener/.test(match[0])) errors.push(`${f}: new-tab link lacks noopener`);
  }
}
if (errors.length) {console.error(errors.join('\n'));process.exit(1);}
const manifest = JSON.parse(await readFile(new URL('../content/report-manifest.json',import.meta.url),'utf8'));
for (const report of manifest) {
  const bytes = await readFile(path.join(root,'reports',report.file));
  if (createHash('sha256').update(bytes).digest('hex') !== report.sha256 || bytes.length !== report.bytes) throw Error(`Original report changed: ${report.file}`);
}
console.log(`Checked ${pages.length} HTML pages and ${count} local references. All linked files and fragments exist.`);
console.log(`Verified ${manifest.length} reports against original-file SHA-256 hashes.`);
