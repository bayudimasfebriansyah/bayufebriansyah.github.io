import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
const projects = JSON.parse(await readFile(path.join(root, 'content/projects.json'), 'utf8'));
const base = (process.env.BASE_PATH ?? config.basePath).replace(/\/$/, '');
const origin = (process.env.SITE_ORIGIN ?? config.origin).replace(/\/$/, '');
if ((base && !/^\/[a-zA-Z0-9._/-]+$/.test(base)) || !/^https?:\/\//.test(origin)) throw Error('Invalid site URL configuration');
const url = p => `${base}${p}`;
const absolute = p => `${origin}${url(p)}`;
const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const arrow = '<span aria-hidden="true">↗</span>';
const reportUrl = p => url(`/reports/${p.report.file}`);
const projectUrl = p => url(`/projects/${p.slug}/`);

const header = home => `<header class="site-header"><div class="container header-inner">
  <a class="wordmark" href="${url('/')}" aria-label="Bayu Febriansyah, home"><span class="monogram" aria-hidden="true">BF<span>.</span></span><span>Bayu Febriansyah<small>Engineering portfolio</small></span></a>
  <nav aria-label="Main navigation"><a href="${url('/#work')}"${home ? ' aria-current="page"' : ''}>Work</a><a href="${url('/#about')}">About</a><a href="${url(config.resume)}" target="_blank" rel="noopener">Resume ${arrow}<span class="sr-only"> (PDF, opens in a new tab)</span></a><a class="nav-contact" href="mailto:${e(config.email)}">Let’s connect ${arrow}</a></nav>
</div></header>`;
const footer = `<footer class="site-footer"><div class="container footer-inner"><p class="footer-copyright">© ${new Date().getUTCFullYear()} ${e(config.name)}. All rights reserved.</p><p class="footer-rights">Third-party designs and materials belong to their respective owners.</p></div></footer>`;
const dialog = `<dialog class="image-dialog" aria-label="Enlarged project image"><button class="dialog-close" type="button" aria-label="Close image">Close <span aria-hidden="true">×</span></button><figure><img alt=""><figcaption></figcaption></figure></dialog>`;

function page({title, description, pathname, body, home = false, noindex = false}) {
  const canonical = absolute(pathname);
  const previewImage = absolute('/assets/portfolio-preview.png');
  const previewAlt = 'BF logo — Bayu Febriansyah, Engineering Portfolio';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="theme-color" content="#f5f4ee"><title>${e(title)}</title><meta name="description" content="${e(description)}">${noindex ? '<meta name="robots" content="noindex">' : ''}<link rel="canonical" href="${e(canonical)}"><meta property="og:type" content="website"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${e(canonical)}"><meta property="og:image" content="${e(previewImage)}"><meta property="og:image:secure_url" content="${e(previewImage)}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="627"><meta property="og:image:alt" content="${e(previewAlt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${e(previewImage)}"><meta name="twitter:image:alt" content="${e(previewAlt)}"><link rel="icon" href="${url('/assets/favicon.svg')}" type="image/svg+xml"><link rel="stylesheet" href="${url('/assets/styles.css')}"><script src="${url('/assets/site.js')}" defer></script></head><body><a class="skip-link" href="#main">Skip to content</a>${header(home)}${body}${footer}${dialog}</body></html>`;
}

function projectRow(p) {
  const titleId = 'project-' + p.slug;
  return `<article class="project-row" aria-labelledby="${e(titleId)}"><a class="project-thumbnail ${p.imageFit === 'contain' ? 'contain' : ''}" href="${projectUrl(p)}" aria-label="View ${e(p.title)}"><img src="${url('/assets/projects/' + p.image)}" alt="${e(p.imageAlt)}" width="${p.imageWidth}" height="${p.imageHeight}" loading="lazy" style="object-position:${e(p.imagePosition || 'center')}"></a><div class="project-summary"><p class="eyebrow">${e(p.category)} <span>· ${e(p.year)}</span></p><h3 id="${e(titleId)}"><a href="${projectUrl(p)}">${e(p.title)}</a></h3><p class="project-description">${e(p.description)}</p><div class="project-links"><a class="text-link" href="${projectUrl(p)}">Read the story ${arrow}</a>${p.report ? `<a class="text-link" href="${reportUrl(p)}" target="_blank" rel="noopener">Full report ${arrow}<span class="sr-only"> (PDF, opens in a new tab)</span></a>` : ''}${p.reference ? `<a class="text-link" href="${e(p.reference.url)}">Project website ${arrow}</a>` : ''}</div></div></article>`;
}

const featured = projects.find(p=>p.featured) ?? projects[0];
if (!featured) throw Error('Featured project is missing');
const homeBody = `<main id="main"><section class="hero container" aria-labelledby="hero-title"><div class="hero-copy"><h1 id="hero-title">I’m Bayu, <br>an <em>engineer.</em></h1><p class="hero-intro">I study aerospace engineering at Illinois and work at MakerLab. My projects cover structures, materials, and manufacturing, from analysis and CAD to fabrication and testing.</p><div class="hero-actions"><a class="button primary" href="#work">Explore my work <span aria-hidden="true">↓</span></a></div></div><figure class="hero-visual"><div class="hero-image"><img src="${url('/assets/projects/' + featured.image)}" alt="${e(featured.imageAlt)}" width="${featured.imageWidth}" height="${featured.imageHeight}" fetchpriority="high"><span class="image-label">Featured / ${e(featured.title)}</span></div><figcaption><span>${e(featured.setting)}</span><p>${e(featured.featuredCaption || featured.description)}</p><a href="${projectUrl(featured)}" aria-label="Read about ${e(featured.title)}">Read the story ${arrow}</a></figcaption><div class="hero-stamp" aria-hidden="true">DESIGN<br><span>↘</span> BUILD<br>TEST <span>↗</span></div></figure></section>
  <section class="work-section" id="work" aria-labelledby="work-title"><div class="container"><div class="section-heading"><div><p class="eyebrow">Projects & experience</p><h2 id="work-title">Selected Works</h2></div><p class="work-intro"><span>Projects from Illinois MakerLab and my engineering studies.</span> <span>Each story covers what I worked on, the choices I made, and what I found.</span></p></div><div class="project-list">${projects.map(projectRow).join('')}</div></div></section>
  <section class="about-section container" id="about" aria-labelledby="about-title"><div><p class="eyebrow">A little about me</p><h2 id="about-title">My background<br>in engineering.</h2><p>I’m pursuing an M.S. in Aerospace Engineering at the University of Illinois Urbana-Champaign, after earning my bachelor’s degree at Institut Teknologi Bandung.</p><p>I enjoy working through both the analysis and the build: making composite parts, testing structures, assembling mechanisms, and setting up robots. At MakerLab, I also work with clients on requirements, CAD changes, and print preparation.</p><a class="text-link" href="${url(config.resume)}" target="_blank" rel="noopener">My resume ${arrow}<span class="sr-only"> (PDF, opens in a new tab)</span></a></div><dl class="education-list"><div><dt>University of Illinois Urbana-Champaign</dt><dd>M.S. Aerospace Engineering<br><span>Expected May 2027</span></dd></div><div><dt>Institut Teknologi Bandung</dt><dd>B.S. Aerospace Engineering<br><span>2023</span></dd></div><div><dt>Illinois MakerLab</dt><dd>3D Printing Engineer<br><span>May 2026–present</span></dd></div></dl></section>
  <section class="contact-section" id="contact" aria-labelledby="contact-title"><div class="container contact-inner"><figure class="contact-profile"><img src="${url('/assets/bayu-headshot.webp')}" alt="Bayu Febriansyah" width="640" height="640" loading="lazy"><figcaption><strong>${e(config.name)}</strong><span>${e(config.location)}</span></figcaption></figure><div class="contact-copy"><p class="eyebrow">Let’s connect</p><h2 id="contact-title">Have an engineering<br>challenge in mind?</h2><p>I’d be glad to talk about my projects and how I could contribute to your team.</p></div><dl class="contact-details"><div><dt>Email</dt><dd><a class="contact-email" href="mailto:${e(config.email)}">${e(config.email)} ${arrow}</a></dd></div><div><dt>Phone</dt><dd><a class="contact-phone" href="${e(config.phoneHref)}">${e(config.phone)} ${arrow}</a></dd></div><div><dt>Find me online</dt><dd class="contact-links"><a href="${e(config.linkedin)}">LinkedIn ${arrow}</a><a href="${e(config.github)}">GitHub ${arrow}</a></dd></div></dl></div></section></main>`;

function figure(f, p, i) {
  const src = url('/assets/projects/' + f.file);
  return `<figure class="evidence-figure ${f.wide ? 'wide' : ''}"><a class="zoom-link"${f.wide ? ` style="aspect-ratio:${f.width}/${f.height}"` : ''} href="${src}" data-zoom data-caption="${e(f.caption)}" aria-label="Enlarge: ${e(f.alt)}"><img src="${src}" alt="${e(f.alt)}" width="${f.width}" height="${f.height}" loading="lazy"><span class="zoom-indicator" aria-hidden="true">↗</span></a><figcaption><div><strong>${e(f.title)}</strong><p>${e(f.caption)}</p>${f.source ? `<small>${e(f.source)}</small>` : ''}</div></figcaption></figure>`;
}

function projectStory(p) {
  // Accept the previous content shape while source and content updates deploy.
  const sections = p.story ?? p.details.map(d=>({heading:d.heading,paragraphs:[d.body],figures:[]}));
  const used = new Set();
  const stories = sections.map((s,i)=> {
    const figures = s.figures.map(file=> {
      const f = p.figures.find(f=>f.file===file);
      if (!f || used.has(file)) throw Error(`Missing or repeated story image: ${p.slug}/${file}`);
      used.add(file);
      return f;
    });
    return `<section class="story-section container" aria-labelledby="story-${i}"><div class="story-section-intro"><h2 id="story-${i}">${e(s.heading)}</h2><div>${s.paragraphs.map(text=>`<p>${e(text)}</p>`).join('')}</div></div>${figures.length ? `<div class="evidence-grid ${figures.length===1?'single-figure':''}">${figures.map(f=>figure(f,p)).join('')}</div>` : ''}</section>`;
  }).join('');
  const remaining = p.figures.filter(f=>!used.has(f.file));
  return stories + (remaining.length ? `<section class="container evidence-section"><div class="evidence-grid">${remaining.map(f=>figure(f,p)).join('')}</div></section>` : '');
}

function caseBody(p, index) {
  const next = projects[(index+1) % projects.length];
  return `<main id="main"><div class="container case-top"><a class="back-link" href="${url('/#work')}"><span aria-hidden="true">←</span> Selected Works</a><p class="eyebrow">${e(p.category)} / ${e(p.setting)} / ${e(p.year)}</p><h1>${e(p.title)}</h1><p class="case-takeaway">${e(p.takeaway)}</p><dl class="case-meta"><div><dt>My contribution</dt><dd>${e(p.role)}</dd></div><div><dt>Tools & methods</dt><dd>${e(p.tools)}</dd></div><div><dt>Evidence</dt><dd>${e(p.evidence)}</dd></div></dl></div>
  <section class="case-story container" aria-labelledby="overview-title"><div class="story-label"><p class="eyebrow">Overview</p><h2 id="overview-title">${e(p.overviewHeading)}</h2></div><div class="overview-copy">${p.overview.map(x=>`<p>${e(x)}</p>`).join('')}</div></section>
  ${p.facts ? `<div class="container"><dl class="project-facts">${p.facts.map(f=>`<div><dt>${e(f.label)}</dt><dd>${e(f.value)}</dd></div>`).join('')}</dl></div>` : ''}
  ${projectStory(p)}
  ${p.attribution ? `<div class="container"><p class="attribution case-credit">${e(p.attribution)}</p></div>` : ''}
  ${p.report ? `<section class="container report-section" id="report" aria-labelledby="report-title"><div><p class="eyebrow">Go deeper / Full technical report</p><h2 id="report-title">${e(p.report.title)}</h2><p>Open the original report for the methodology, calculations, and detailed results behind this overview.</p><span class="report-meta">PDF · ${p.report.pages} pages · ${e(p.report.size)}</span></div><div class="report-actions"><a class="button primary" href="${reportUrl(p)}" target="_blank" rel="noopener">Read full report ${arrow}<span class="sr-only"> (PDF, opens in a new tab)</span></a><a class="button secondary" href="${reportUrl(p)}" download>Download PDF ↓</a></div></section>` : `<section class="container scope-note"><p class="eyebrow">${p.reference ? 'Project reference' : 'Project documentation'}</p><p>${e(p.scopeNote)}</p>${p.reference ? `<a class="text-link" href="${e(p.reference.url)}">${e(p.reference.label)} ${arrow}</a>` : ''}</section>`}
  <section class="next-project"><a class="container" href="${projectUrl(next)}"><div><p class="eyebrow">Next project</p><h2>${e(next.title)}</h2></div><span aria-hidden="true">↗</span></a></section></main>`;
}

const ids = new Set();
for (const p of projects) {
  if (!/^[a-z0-9-]+$/.test(p.slug) || ids.has(p.slug)) throw Error('Invalid or duplicate project slug');
  ids.add(p.slug);
  for (const key of ['title','role','description','takeaway','overviewHeading','image','imageAlt']) if (!p[key]) throw Error(`Missing ${key}: ${p.slug}`);
  if (!(p.story?.length || p.details?.length)) throw Error(`Missing project narrative: ${p.slug}`);
  if (p.story?.some(s=>!s.heading || !s.paragraphs?.length || !Array.isArray(s.figures))) throw Error(`Incomplete project narrative: ${p.slug}`);
  if (p.description.split(/\s+/).length > 35) throw Error(`Card description too long: ${p.slug}`);
  if (p.overview.join(' ').split(/\s+/).length > 160) throw Error(`Overview too long: ${p.slug}`);
}
const out = path.join(root, 'dist');
await rm(out, {recursive:true, force:true});
await mkdir(out, {recursive:true});
await cp(path.join(root, 'public'), out, {recursive:true});
await writeFile(path.join(out, 'index.html'), page({title:'Bayu Febriansyah | Engineering Portfolio',description:'Bayu Febriansyah’s engineering portfolio: structures, materials, manufacturing, mechanical design, fabrication, and testing.',pathname:'/',body:homeBody,home:true}));
for (const [i,p] of projects.entries()) {
  const dest = path.join(out, 'projects', p.slug);
  await mkdir(dest, {recursive:true});
  await writeFile(path.join(dest, 'index.html'), page({title:`${p.title} — Bayu Febriansyah`,description:p.description,pathname:`/projects/${p.slug}/`,body:caseBody(p,i)}));
}
await writeFile(path.join(out, '404.html'), page({title:'Page not found — Bayu Febriansyah',description:'Return to the engineering portfolio.',pathname:'/404.html',noindex:true,body:`<main id="main" class="container not-found"><p class="eyebrow">404 / Page not found</p><h1>Let’s get you<br>back to the work.</h1><a class="button primary" href="${url('/#work')}">Explore projects →</a></main>`}));
await writeFile(path.join(out,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...projects.map(p=>`/projects/${p.slug}/`)].map(p=>`<url><loc>${e(absolute(p))}</loc></url>`).join('')}</urlset>`);
await writeFile(path.join(out,'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${absolute('/sitemap.xml')}\n`);
await writeFile(path.join(out,'.nojekyll'), '');
await writeFile(path.join(out,'build-info.json'), JSON.stringify({basePath:base,origin,projects:projects.length},null,2));
console.log(`Built ${projects.length + 2} pages for ${origin}${base}/`);
