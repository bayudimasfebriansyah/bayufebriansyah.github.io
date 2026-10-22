import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

// Static originals remain the source of truth. Stale or absent previews are ignored.
export function createMediaRenderer({ publicDir, url, variants = {} }) {
  const cache = new Map();
  const fallback = url('/assets/image-unavailable.svg');

  function info(file) {
    if (cache.has(file)) return cache.get(file);
    const original = file && path.join(publicDir, 'assets/projects', file);
    const available = Boolean(original && existsSync(original));
    const entry = variants[file];
    let previews = [];
    if (available && entry?.variants?.length) {
      const hash = createHash('sha256').update(readFileSync(original)).digest('hex');
      if (hash === entry.sha256) {
        previews = entry.variants.filter(v => Number.isFinite(v.width) && existsSync(path.join(publicDir, 'assets/projects', v.file)));
      }
    }
    const result = { available, src: available ? url('/assets/projects/' + file) : fallback, previews };
    cache.set(file, result);
    return result;
  }

  function image({ file, alt, width = 640, height = 420, sizes, priority = false, position }) {
    const media = info(file);
    const candidates = media.previews.filter(v => v.width < width).map(v => `${url('/assets/projects/' + v.file)} ${v.width}w`);
    if (candidates.length) candidates.push(`${media.src} ${width}w`);
    const dimensions = `width="${Number(width) || 640}" height="${Number(height) || 420}"`;
    return `<img src="${escapeHTML(media.src)}" alt="${escapeHTML(media.available ? alt : 'Project image unavailable')}" ${dimensions} loading="${priority ? 'eager' : 'lazy'}" decoding="async"${priority ? ' fetchpriority="high"' : ''}${candidates.length && sizes ? ` srcset="${escapeHTML(candidates.join(', '))}" sizes="${escapeHTML(sizes)}"` : ''}${position ? ` style="object-position:${escapeHTML(position)}"` : ''}>`;
  }

  return { image, info, fallback };
}

export function actionLink({ href, label, context, className = 'text-link', newTab = false, download = false }) {
  const note = [context, newTab ? 'PDF, opens in a new tab' : ''].filter(Boolean).join(' · ');
  return `<a class="${escapeHTML(className)}" href="${escapeHTML(href)}"${newTab ? ' target="_blank" rel="noopener"' : ''}${download ? ' download' : ''}>${escapeHTML(label)} <span class="arrow" aria-hidden="true">${download ? '↓' : '↗'}</span>${note ? `<span class="sr-only"> (${escapeHTML(note)})</span>` : ''}</a>`;
}

export function technicalTable(table, id) {
  if (!table.caption || !table.columns?.length || !table.rows?.length || table.rows.some(row=>row.length !== table.columns.length)) {
    throw Error('Incomplete technical comparison: ' + id);
  }
  const captionId = id + '-caption';
  return `<div class="table-scroll" role="region" aria-labelledby="${escapeHTML(captionId)}" tabindex="0"><table class="technical-table" style="--table-min:${Math.max(480, table.columns.length * 160)}px"><caption id="${escapeHTML(captionId)}">${escapeHTML(table.caption)}</caption><thead><tr>${table.columns.map(text=>`<th scope="col">${escapeHTML(text)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row=>`<tr>${row.map((text,index)=>index===0?`<th scope="row">${escapeHTML(text)}</th>`:`<td>${escapeHTML(text)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function equationBlock(equation) {
  if (!equation.expression || !equation.spoken || !equation.explanation) throw Error('Equation needs a readable expression, spoken form, and explanation');
  return `<figure class="equation-card"><div class="equation-expression" role="math" aria-label="${escapeHTML(equation.spoken)}"><span aria-hidden="true">${escapeHTML(equation.expression)}</span></div><figcaption>${escapeHTML(equation.explanation)}</figcaption></figure>`;
}

export function collectionNavigation(collections, current, url) {
  if (!collections.some(item => item.key === current)) throw Error('Unknown active collection: ' + current);
  return `<nav class="work-tabs" aria-label="Project collections">${collections.map(item => `<a href="${escapeHTML(url(item.pathname + '#work'))}"${item.key === current ? ' aria-current="page"' : ''}>${escapeHTML(item.label)}</a>`).join('')}</nav>`;
}

export function projectVideo(video, url) {
  if (!video.file || !video.poster || !video.label || !video.caption || !(video.width > 0 && video.height > 0)) throw Error('Incomplete project video');
  return `<figure class="project-video"><video controls playsinline preload="none" width="${Number(video.width)}" height="${Number(video.height)}" poster="${escapeHTML(url('/assets/projects/' + video.poster))}" aria-label="${escapeHTML(video.label)}"><source src="${escapeHTML(url('/assets/video/' + video.file))}" type="video/mp4"><p><a href="${escapeHTML(url('/assets/video/' + video.file))}">Open the robot demonstration</a></p></video><figcaption><p>${escapeHTML(video.caption)}</p><a class="text-link" href="${escapeHTML(url('/assets/video/' + video.file))}">Open video <span aria-hidden="true">↗</span></a></figcaption></figure>`;
}
