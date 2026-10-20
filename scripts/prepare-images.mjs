// Optional authoring tool; deployment and normal builds do not need Sharp.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
let sharp;
try {
  sharp = createRequire(import.meta.url)(process.env.PORTFOLIO_SHARP_MODULE || 'sharp');
} catch {
  console.error('Optional image preparation needs Sharp. Install it locally or set PORTFOLIO_SHARP_MODULE to its module directory. Normal builds do not require it.');
  process.exit(1);
}
const projects = JSON.parse(await readFile(path.join(root, 'content/projects.json'), 'utf8'));
const imageRoot = path.join(root, 'public/assets/projects');
await mkdir(path.join(imageRoot, 'previews'), {recursive:true});
const manifest = {};
for (const project of projects) {
  if (!project.image) continue;
  let bytes;
  try { bytes = await readFile(path.join(imageRoot, project.image)); }
  catch { continue; } // The page renderer supplies a fallback for missing media.
  const metadata = await sharp(bytes).metadata();
  const variants = [];
  for (const width of [480, 768].filter(width => width < metadata.width)) {
    const file = 'previews/' + project.image.replace(/\.[^.]+$/, '') + '-' + width + '.webp';
    const result = await sharp(bytes).resize({width, withoutEnlargement:true}).webp({quality:80}).toFile(path.join(imageRoot, file));
    variants.push({file, width:result.width, height:result.height});
  }
  manifest[project.image] = {sha256:createHash('sha256').update(bytes).digest('hex'), variants};
}
await writeFile(path.join(root, 'content/image-variants.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Prepared responsive project previews. Originals are unchanged.');
