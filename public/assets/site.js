// Progressive enhancement: navigation and all content work without this file.
const root = document.documentElement;
const fallback = document.body.dataset.imageFallback;
const header = document.querySelector('.site-header');

function useImageFallback(image) {
  if (!fallback || image.dataset.fallbackApplied || !image.getAttribute('src')) return;
  image.dataset.fallbackApplied = 'true';
  image.removeAttribute('srcset');
  image.removeAttribute('sizes');
  image.alt = 'Project image unavailable';
  image.src = fallback;
  const zoom = image.closest('[data-zoom]');
  if (zoom) {
    zoom.removeAttribute('href');
    zoom.removeAttribute('data-zoom');
    zoom.removeAttribute('aria-label');
    zoom.querySelector('.zoom-indicator')?.remove();
  }
}
document.addEventListener('error', event => {
  if (event.target instanceof HTMLImageElement) useImageFallback(event.target);
}, true);
document.querySelectorAll('img[src]').forEach(image => {
  if (image.complete && image.naturalWidth === 0) useImageFallback(image);
});

// The sticky header and native anchor scrolling use the same measured offset.
let headerOffset = 104;
function updateHeaderOffset() {
  headerOffset = Math.ceil(header?.getBoundingClientRect().height || 84) + 16;
  root.style.setProperty('--header-offset', headerOffset + 'px');
}
updateHeaderOffset();
if ('ResizeObserver' in window && header) new ResizeObserver(updateHeaderOffset).observe(header);
else window.addEventListener('resize', updateHeaderOffset, {passive:true});

if (document.body.dataset.page === 'home') {
  const links = [...document.querySelectorAll('.main-nav [data-section]')];
  const sections = links.map(link => document.getElementById(link.dataset.section)).filter(Boolean);
  let previousActive;
  function updateNavigation() {
    const marker = headerOffset + Math.min(window.innerHeight * .18, 120);
    let active;
    for (const section of sections) if (section.getBoundingClientRect().top <= marker) active = section.id;
    if (window.scrollY + window.innerHeight >= root.scrollHeight - 8) active = sections.at(-1)?.id;
    if (active === previousActive) return;
    previousActive = active;
    for (const link of links) {
      const selected = link.dataset.section === active;
      link.classList.toggle('is-active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      updateNavigation();
    });
  }, {passive:true});
  window.addEventListener('hashchange', updateNavigation);
  window.addEventListener('resize', updateNavigation, {passive:true});
  window.addEventListener('pageshow', updateNavigation);
  updateNavigation();
}

// Switch only the collection, keeping the document and scroll position intact.
// Real links still support direct visits, modified clicks, and no-JS navigation.
const collectionNav = document.querySelector('.work-tabs');
if (collectionNav && typeof history.pushState === 'function') {
  const tabs = [...collectionNav.querySelectorAll('[data-work-collection]')];
  const panels = [...document.querySelectorAll('[data-work-panel]')];
  const intros = [...document.querySelectorAll('[data-work-intro]')];
  const title = document.getElementById('work-title');
  const ready = tabs.length > 0 && tabs.every(tab =>
    panels.some(panel => panel.dataset.workPanel === tab.dataset.workCollection) &&
    intros.some(intro => intro.dataset.workIntro === tab.dataset.workCollection)
  );

  function showCollection(tab) {
    const key = tab.dataset.workCollection;
    const panel = panels.find(item => item.dataset.workPanel === key);
    for (const item of panels) item.hidden = item !== panel;
    for (const intro of intros) intro.setAttribute('aria-hidden', String(intro.dataset.workIntro !== key));
    for (const link of tabs) {
      if (link === tab) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    if (title) title.textContent = tab.textContent.trim();
    document.title = panel.dataset.pageTitle;
    const canonical = new URL(tab.href);
    canonical.hash = '';
    const metadata = [
      ['link[rel="canonical"]', 'href', canonical.href],
      ['meta[name="description"]', 'content', panel.dataset.pageDescription],
      ['meta[property="og:title"]', 'content', panel.dataset.pageTitle],
      ['meta[property="og:description"]', 'content', panel.dataset.pageDescription],
      ['meta[property="og:url"]', 'content', canonical.href]
    ];
    for (const [selector, attribute, value] of metadata) {
      document.querySelector(selector)?.setAttribute(attribute, value);
    }
  }

  if (ready) {
    collectionNav.addEventListener('click', event => {
      const tab = event.target instanceof Element ? event.target.closest('a[data-work-collection]') : null;
      if (!tab || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (new URL(tab.href).origin !== location.origin) return;
      event.preventDefault();
      if (tab.hasAttribute('aria-current')) return;
      history.pushState(null, '', tab.href);
      showCollection(tab);
    });
    window.addEventListener('popstate', () => {
      const tab = tabs.find(item => new URL(item.href).pathname === location.pathname);
      if (tab) showCollection(tab);
    });
    window.addEventListener('pageshow', () => {
      const tab = tabs.find(item => new URL(item.href).pathname === location.pathname);
      if (tab) showCollection(tab);
    });
  }
}

// Native dialog supplies focus containment and Escape behavior; links remain
// ordinary full-size image links when dialog support or JavaScript is absent.
const dialog = document.querySelector('.image-dialog');
if (dialog && typeof dialog.showModal === 'function') {
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('figcaption');
  const closeButton = dialog.querySelector('button');
  let opener;
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[data-zoom]') : null;
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    const source = link.querySelector('img');
    image.removeAttribute('data-fallback-applied');
    image.src = link.href;
    image.alt = source?.alt || 'Project image';
    image.width = source?.naturalWidth || Number(source?.getAttribute('width')) || 640;
    image.height = source?.naturalHeight || Number(source?.getAttribute('height')) || 420;
    caption.textContent = link.dataset.caption || source?.alt || '';
    dialog.showModal();
    root.classList.add('has-dialog');
    closeButton.focus({preventScroll:true});
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    root.classList.remove('has-dialog');
    image.removeAttribute('src');
    opener?.focus({preventScroll:true});
  });
}
