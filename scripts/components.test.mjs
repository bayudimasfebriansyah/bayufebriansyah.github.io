import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createMediaRenderer, actionLink } from './components.mjs';

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
