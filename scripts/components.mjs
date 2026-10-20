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
