import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createMediaRenderer, actionLink, technicalTable, equationBlock, collectionNavigation, projectVideo } from './components.mjs';
import { COLLECTIONS, collectionFor, nextInCollection } from './collections.mjs';

function fixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'portfolio-media-'));
  mkdirSync(path.join(root, 'assets/projects/previews'), {recursive:true});
  t.after(()=> {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('portfolio-media-'));
    rmSync(root, {recursive:true, force:true});
  });
  return root;
}

test('missing project imagery keeps reserved space and a real fallback URL', t=> {
  const publicDir = fixture(t);
  const renderer = createMediaRenderer({publicDir, url:p=>'/portfolio'+p});
  const image = renderer.image({file:'missing.webp', alt:'Original photograph', width:900, height:600});
  assert.equal(renderer.info('missing.webp').available, false);
  assert.match(image, /src="\/portfolio\/assets\/image-unavailable.svg"/);
  assert.match(image, /width="900" height="600"/);
  assert.match(image, /alt="Project image unavailable"/);
  assert.doesNotMatch(image, /undefined|srcset/);
});

test('responsive sources are used only when they match the current original', t=> {
  const publicDir = fixture(t);
  writeFileSync(path.join(publicDir, 'assets/projects/photo.webp'), 'current image');
  writeFileSync(path.join(publicDir, 'assets/projects/previews/photo-480.webp'), 'preview');
  const entry = {sha256:createHash('sha256').update('current image').digest('hex'), variants:[{file:'previews/photo-480.webp',width:480}]};
  const render = sha256 => createMediaRenderer({publicDir, url:p=>p, variants:{'photo.webp':{...entry,sha256}}}).image({file:'photo.webp',alt:'A photograph',width:1024,height:768,sizes:'224px'});
  assert.match(render(entry.sha256), /srcset="[^\"]*photo-480.webp 480w, [^\"]*photo.webp 1024w"/);
  assert.doesNotMatch(render('old-source-hash'), /srcset/);
});

test('repeated action labels retain project context and safe new-tab behavior', ()=> {
  const link = actionLink({href:'/report.pdf',label:'Full report',context:'Beam & tooling',newTab:true});
  assert.match(link, /target="_blank" rel="noopener"/);
  assert.match(link, /Beam &amp; tooling · PDF, opens in a new tab/);
  assert.doesNotMatch(actionLink({href:'/project/',label:'Story'}), /undefined|target=/);
});

test('technical comparisons reject missing cells and preserve accessible table relationships', ()=> {
  assert.throws(()=>technicalTable({caption:'Comparison',columns:['State','Radius'],rows:[['Deployed']]},'radius'), /Incomplete technical comparison/);
  const markup = technicalTable({caption:'Measured & predicted',columns:['State','Radius'],rows:[['<baseline>','16 mm']]},'radius');
  assert.match(markup, /role="region" aria-labelledby="radius-caption" tabindex="0"/);
  assert.match(markup, /<caption id="radius-caption">Measured &amp; predicted<\/caption>/);
  assert.match(markup, /<th scope="col">State<\/th>/);
  assert.match(markup, /<th scope="row">&lt;baseline&gt;<\/th>/);
});

test('equations require a spoken form and a contextual explanation', ()=> {
  assert.throws(()=>equationBlock({expression:'C = 1/R'}), /spoken form/);
  const markup = equationBlock({expression:'C = 1/R',spoken:'Curvature equals one divided by radius.',explanation:'Used for both model and measurements.'});
  assert.match(markup, /role="math" aria-label="Curvature equals one divided by radius\."/);
  assert.match(markup, /aria-hidden="true">C = 1\/R/);
  assert.match(markup, /<figcaption>Used for both model and measurements\.<\/figcaption>/);
});

test('selected is the default collection and unknown collections cannot disappear silently', ()=> {
  assert.equal(collectionFor({slug:'beam'}).key,'selected');
  assert.equal(collectionFor({slug:'robot',collection:'other'}).pathname,'/other-works/');
  assert.throws(()=>collectionFor({collection:'typo'}),/Unknown project collection/);
});

test('next-project links stay inside the current collection as entries change', ()=> {
  const projects=[{slug:'beam'},{slug:'robot',collection:'other'},{slug:'boom'},{slug:'clamp',collection:'other'}];
  assert.equal(nextInCollection(projects,projects[0]).slug,'boom');
  assert.equal(nextInCollection(projects,projects[2]).slug,'beam');
  assert.equal(nextInCollection(projects,projects[1]).slug,'clamp');
  assert.equal(nextInCollection(projects,projects[3]).slug,'robot');
  assert.equal(nextInCollection([projects[1]],projects[1]),null);
});

test('collection tabs use real URLs and expose exactly one current destination', ()=> {
  const nav=collectionNavigation(COLLECTIONS,'other',p=>'/portfolio'+p);
  assert.match(nav,/href="\/portfolio\/#work"/);
  assert.match(nav,/href="\/portfolio\/other-works\/#work" aria-current="page"/);
  assert.equal((nav.match(/aria-current=/g)||[]).length,1);
  assert.match(nav,/id="work-tab-other" data-work-collection="other" aria-controls="work-panel-other"/);
  assert.throws(()=>collectionNavigation(COLLECTIONS,'unknown',p=>p),/Unknown active collection/);
});

test('project video reserves its dimensions and loads only on request', ()=> {
  const video=projectVideo({file:'robot.mp4',poster:'robot.webp',width:406,height:720,label:'Robot demonstration',caption:'Trained arm task.'},p=>p);
  assert.match(video,/controls playsinline preload="none" width="406" height="720"/);
  assert.match(video,/poster="\/assets\/projects\/robot.webp" aria-label="Robot demonstration"/);
  assert.match(video,/href="\/assets\/video\/robot.mp4"/);
  assert.doesNotMatch(video,/autoplay/);
  assert.throws(()=>projectVideo({file:'robot.mp4'},p=>p),/Incomplete project video/);
});
