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
const footer = `<footer class="site-footer"><div class="container footer-inner"><a href="${url('/')}" class="footer-name">Bayu Febriansyah<span>Aerospace engineering · Design, build, test.</span></a><div><a href="${config.linkedin}">LinkedIn ${arrow}</a><a href="${config.github}">GitHub ${arrow}</a><a href="mailto:${config.email}">Email ${arrow}</a><a href="${url(config.resume)}" download>Resume ↓</a></div></div></footer>`;
const dialog = `<dialog class="image-dialog" aria-label="Enlarged project image"><button class="dialog-close" type="button" aria-label="Close image">Close <span aria-hidden="true">×</span></button><figure><img alt=""><figcaption></figcaption></figure></dialog>`;

function page({title, description, pathname, body, image = '/assets/projects/composite-beam-tooling.webp', home = false, noindex = false}) {
  const canonical = absolute(pathname);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="theme-color" content="#f5f4ee"><title>${e(title)}</title><meta name="description" content="${e(description)}">${noindex ? '<meta name="robots" content="noindex">' : ''}<link rel="canonical" href="${e(canonical)}"><meta property="og:type" content="website"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:url" content="${e(canonical)}"><meta property="og:image" content="${e(absolute(image))}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${url('/assets/favicon.svg')}" type="image/svg+xml"><link rel="stylesheet" href="${url('/assets/styles.css')}"><script src="${url('/assets/site.js')}" defer></script></head><body><a class="skip-link" href="#main">Skip to content</a>${header(home)}${body}${footer}${dialog}</body></html>`;
}

function card(p, i) {
  return `<article class="project-card" data-category="${e(p.filters.join(' '))}"><a class="card-link" href="${projectUrl(p)}"><div class="card-image ${p.imageFit === 'contain' ? 'contain' : ''}"><img src="${url('/assets/projects/' + p.image)}" alt="${e(p.imageAlt)}" width="${p.imageWidth}" height="${p.imageHeight}" loading="lazy" style="object-position:${e(p.imagePosition || 'center')}"><span class="card-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span class="card-arrow" aria-hidden="true">↗</span></div><div class="card-copy"><p class="eyebrow">${e(p.category)} <span>· ${e(p.year)}</span></p><h3>${e(p.title)}</h3><p class="card-description">${e(p.description)}</p><div class="card-bottom"><span>${e(p.role)}</span><span class="read-case">Explore ${arrow}</span></div></div></a></article>`;
}

const filters = [['all','All work'], ['build','Build & integrate'], ['analysis','Model & analyze'], ['testing','Test & learn'], ['systems','Systems & software']];
const homeBody = `<main id="main"><section class="hero container" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> Aerospace engineer · UIUC graduate student</p><h1 id="hero-title">From an idea <br>to something <br><em>you can test.</em></h1><p class="hero-intro">I’m Bayu. I connect structural analysis, hands-on fabrication, and software to build things—and understand how they behave.</p><div class="hero-actions"><a class="button primary" href="#work">Explore my work <span aria-hidden="true">↓</span></a><a class="text-link" href="${url(config.resume)}" target="_blank" rel="noopener">View resume ${arrow}<span class="sr-only"> (PDF, opens in a new tab)</span></a></div><p class="hero-note">Composite structures. Deployable mechanisms. Robotics. Systems thinking.</p></div><figure class="hero-visual"><div class="hero-image"><img src="${url('/assets/projects/composite-beam-tooling.webp')}" alt="A carbon-fiber beam bagged and restrained in its fabrication tooling" width="799" height="599" fetchpriority="high"><span class="image-label">01 / Making the design real</span></div><figcaption><span>Inside the work</span><p>Manufacturing a composite beam revealed constraints the ideal model couldn’t show.</p><a href="${projectUrl(projects[0])}" aria-label="Read the composite beam case study">Read the story ${arrow}</a></figcaption><div class="hero-stamp" aria-hidden="true">DESIGN<br><span>↘</span> BUILD<br>TEST <span>↗</span></div></figure></section>
  <section class="work-section" id="work" aria-labelledby="work-title"><div class="container"><div class="section-heading"><div><p class="eyebrow">Selected work / 2023–2026</p><h2 id="work-title">Decisions. Experiments.<br>Things I’ve learned.</h2></div><p>Seven technical projects and my work at Illinois MakerLab. Explore the challenge, my contribution, and the evidence behind each outcome.</p></div><div class="filter-bar" hidden data-filters role="group" aria-label="Filter projects">${filters.map(([key,label]) => `<button type="button" data-filter="${key}" aria-pressed="${key === 'all'}">${label}</button>`).join('')}<span class="filter-count" role="status" aria-live="polite">${projects.length} projects</span></div><div class="project-grid">${projects.map(card).join('')}</div></div></section>
  <section class="about-section container" id="about" aria-labelledby="about-title"><div><p class="eyebrow">A little about me</p><h2 id="about-title">Curious about the model.<br>Committed to the build.</h2><p>I’m pursuing an M.S. in Aerospace Engineering at the University of Illinois Urbana-Champaign, after earning my bachelor’s degree at Institut Teknologi Bandung.</p><p>My projects move between analysis and physical work: composite fabrication, structural testing, folding mechanisms, robot integration, and engineering software. I’m interested in roles where thoughtful design decisions meet practical constraints.</p><a class="text-link" href="${url(config.resume)}" target="_blank" rel="noopener">My background in one page ${arrow}<span class="sr-only"> (PDF, opens in a new tab)</span></a></div><dl class="education-list"><div><dt>University of Illinois Urbana-Champaign</dt><dd>M.S. Aerospace Engineering<br><span>Expected May 2027</span></dd></div><div><dt>Institut Teknologi Bandung</dt><dd>B.S. Aerospace Engineering<br><span>2023</span></dd></div><div><dt>Illinois MakerLab</dt><dd>3D Printing Engineer<br><span>May 2026–present</span></dd></div></dl></section>
  <section class="contact-section" id="contact"><div class="container contact-inner"><div><p class="eyebrow">Let’s connect</p><h2>Have an engineering<br>challenge in mind?</h2><p>I’d be glad to talk about my projects and how I could contribute to your team.</p></div><a class="contact-email" href="mailto:${config.email}">${config.email} ${arrow}</a></div></section></main>`;

function figure(f, p, i) {
  const src = url('/assets/projects/' + f.file);
  return `<figure class="evidence-figure ${f.wide ? 'wide' : ''}"><a class="zoom-link" href="${src}" data-zoom data-caption="${e(f.caption)}" aria-label="Enlarge: ${e(f.alt)}"><img src="${src}" alt="${e(f.alt)}" width="${f.width}" height="${f.height}" loading="lazy"><span class="zoom-indicator" aria-hidden="true">↗</span></a><figcaption><span class="figure-number">${String(i+1).padStart(2,'0')}</span><div><strong>${e(f.title)}</strong><p>${e(f.caption)}</p>${f.source ? `<small>${e(f.source)}</small>` : ''}</div></figcaption></figure>`;
}

function makerlabExamples(p) {
  return `<section class="container makerlab-examples" aria-labelledby="makerlab-examples-title"><div class="section-label"><p class="eyebrow">More from the MakerLab</p><h2 id="makerlab-examples-title">The details that make a build possible.</h2></div>${p.examples.map((example,index)=>`<article class="makerlab-example" id="${e(example.id)}" aria-labelledby="${e(example.id)}-title"><div class="makerlab-example-intro"><div><p class="eyebrow">${String(index+2).padStart(2,'0')} / ${e(example.category)}</p><h3 id="${e(example.id)}-title">${e(example.title)}</h3><p class="example-summary">${e(example.summary)}</p></div><div class="example-copy">${example.paragraphs.map(paragraph=>`<p>${e(paragraph)}</p>`).join('')}${example.credit?`<p class="example-credit">${e(example.credit)}</p>`:''}</div></div>${example.facts?`<dl class="makerlab-facts">${example.facts.map(f=>`<div><dt>${e(f.label)}</dt><dd>${e(f.value)}</dd></div>`).join('')}</dl>`:''}<div class="evidence-grid makerlab-figures ${example.figures.length===3?'three-figures':''}">${example.figures.map((f,i)=>figure(f,p,i)).join('')}</div></article>`).join('')}</section>`;
}

function caseBody(p, index) {
  const next = projects[(index+1) % projects.length];
  return `<main id="main"><div class="container case-top"><a class="back-link" href="${url('/#work')}"><span aria-hidden="true">←</span> All projects</a><p class="eyebrow">${e(p.category)} / ${e(p.setting)} / ${e(p.year)}</p><h1>${e(p.title)}</h1><p class="case-takeaway">${e(p.takeaway)}</p><dl class="case-meta"><div><dt>My contribution</dt><dd>${e(p.role)}</dd></div><div><dt>Tools & methods</dt><dd>${e(p.tools)}</dd></div><div><dt>Evidence</dt><dd>${e(p.evidence)}</dd></div></dl></div>
  <section class="case-story container" aria-labelledby="overview-title"><div class="story-label"><p class="eyebrow">The project in a minute</p><h2 id="overview-title">${e(p.overviewHeading)}</h2></div><div class="overview-copy">${p.overview.map(x=>`<p>${e(x)}</p>`).join('')}</div></section>
  ${p.makerlab ? `<nav class="container makerlab-nav" aria-label="MakerLab examples"><a href="#so101">LeRobot SO-101</a>${p.examples.map(example=>`<a href="#${e(example.id)}">${e(example.title)}</a>`).join('')}</nav>` : ''}
  ${p.video ? `<section class="video-section container" id="so101" aria-labelledby="video-title"><div class="video-copy"><p class="eyebrow">01 / LeRobot SO-101</p><h2 id="video-title">From printed parts<br>to a trained task.</h2><p>The short demonstration shows the SO-101 arms in the MakerLab setup. The build, calibration, software, and training were my work; the robot platform is LeRobot’s design.</p><p class="video-note">21-second silent video · Playback controls included</p><a class="text-link" href="${url('/assets/video/so101-demo.mp4')}" download>Download the clip ↓</a></div><figure class="video-figure"><video controls playsinline preload="none" poster="${url('/assets/projects/so101-robot.webp')}" width="406" height="720" aria-label="SO-101 trained-arm task demonstration"><source src="${url('/assets/video/so101-demo.mp4')}" type="video/mp4">Your browser cannot play this video. <a href="${url('/assets/video/so101-demo.mp4')}">Download the demonstration</a>.</video><figcaption>The trained arm performs tasks after fabrication, assembly, calibration, software setup, and training.</figcaption></figure></section>` : ''}
  ${p.makerlab ? makerlabExamples(p) : ''}
  ${p.figures.length ? `<section class="container evidence-section" aria-labelledby="evidence-title"><div class="section-label"><p class="eyebrow">A closer look</p><h2 id="evidence-title">${e(p.figureHeading || 'The work, in view.')}</h2><span>Click an image to enlarge ${arrow}</span></div><div class="evidence-grid">${p.figures.map((f,i)=>figure(f,p,i)).join('')}</div></section>` : ''}
  <section class="decision-section"><div class="container"><div class="section-label"><p class="eyebrow">Behind the outcome</p><h2>How I approached it.</h2></div><div class="decision-grid">${p.details.map((d,i)=>`<article><span class="decision-number">0${i+1}</span><h3>${e(d.heading)}</h3><p>${e(d.body)}</p></article>`).join('')}</div>${p.attribution ? `<p class="attribution">${e(p.attribution)}</p>` : ''}</div></section>
  ${p.report ? `<section class="container report-section" id="report" aria-labelledby="report-title"><div><p class="eyebrow">Go deeper / Full technical report</p><h2 id="report-title">${e(p.report.title)}</h2><p>Open the original report for the methodology, calculations, and detailed results behind this overview.</p><span class="report-meta">PDF · ${p.report.pages} pages · ${e(p.report.size)}</span></div><div class="report-actions"><a class="button primary" href="${reportUrl(p)}" target="_blank" rel="noopener">Read full report ${arrow}<span class="sr-only"> (PDF, opens in a new tab)</span></a><a class="button secondary" href="${reportUrl(p)}" download>Download PDF ↓</a></div></section>` : `<section class="container scope-note"><p class="eyebrow">${p.video ? 'Project documentation' : 'Public project summary'}</p><p>${e(p.scopeNote)}</p></section>`}
  <section class="next-project"><a class="container" href="${projectUrl(next)}"><div><p class="eyebrow">Next project</p><h2>${e(next.title)}</h2></div><span aria-hidden="true">↗</span></a></section></main>`;
}

const ids = new Set();
for (const p of projects) {
  if (!/^[a-z0-9-]+$/.test(p.slug) || ids.has(p.slug)) throw Error('Invalid or duplicate project slug');
  ids.add(p.slug);
  for (const key of ['title','role','description','takeaway','overviewHeading','image','imageAlt']) if (!p[key]) throw Error(`Missing ${key}: ${p.slug}`);
  if (!p.details.length || p.details.some(d => !d.heading || !d.body)) throw Error(`Incomplete approach sections: ${p.slug}`);
  if (p.overview.join(' ').split(/\s+/).length > 160) throw Error(`Overview too long: ${p.slug}`);
}
const out = path.join(root, 'dist');
await rm(out, {recursive:true, force:true});
await mkdir(out, {recursive:true});
await cp(path.join(root, 'public'), out, {recursive:true});
await writeFile(path.join(out, 'index.html'), page({title:'Bayu Febriansyah — Engineering Portfolio',description:'Aerospace engineering through structural analysis, composite fabrication, hands-on testing, robotics, and systems design. Explore the decisions and evidence behind my projects.',pathname:'/',body:homeBody,home:true}));
for (const [i,p] of projects.entries()) {
  const dest = path.join(out, 'projects', p.slug);
  await mkdir(dest, {recursive:true});
  await writeFile(path.join(dest, 'index.html'), page({title:`${p.title} — Bayu Febriansyah`,description:p.description,pathname:`/projects/${p.slug}/`,image:'/assets/projects/'+p.image,body:caseBody(p,i)}));
}
await writeFile(path.join(out, '404.html'), page({title:'Page not found — Bayu Febriansyah',description:'Return to the engineering portfolio.',pathname:'/404.html',noindex:true,body:`<main id="main" class="container not-found"><p class="eyebrow">404 / Page not found</p><h1>Let’s get you<br>back to the work.</h1><a class="button primary" href="${url('/#work')}">Explore projects →</a></main>`}));
await writeFile(path.join(out,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...projects.map(p=>`/projects/${p.slug}/`)].map(p=>`<url><loc>${e(absolute(p))}</loc></url>`).join('')}</urlset>`);
await writeFile(path.join(out,'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${absolute('/sitemap.xml')}\n`);
await writeFile(path.join(out,'.nojekyll'), '');
await writeFile(path.join(out,'build-info.json'), JSON.stringify({basePath:base,origin,projects:projects.length},null,2));
console.log(`Built ${projects.length + 2} pages for ${origin}${base}/`);
