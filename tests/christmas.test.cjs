const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('bloom-christmas.css','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('Christmas build markers and SW 015',()=>{
 assert.ok(html.includes('content="xmas-015"'));
 assert.ok(sw.includes("CACHE=PREFIX+'015'"));
 assert.ok(sw.includes('bloom-christmas.css'));
 assert.ok(html.includes('bloom-christmas.css?v=xmas-6'));
 assert.ok(html.includes('xa-garland-2'));
 assert.ok(html.includes('xmas-rail')||html.includes('xmasRail'));
 assert.ok(html.includes('xa-bauble')||html.includes('xa-ornaments'));
 assert.ok(html.includes('xa-side'));
 assert.ok(css.includes('xa-ambient')||html.includes('xa-ambient'));
});

test('eight themes registered including seasonal trio',()=>{
 for(const id of ['blossom','lavender','sage','peach','midnight','xmas-rose','xmas-enchanted','xmas-midnight']){
  assert.ok(html.includes(`'${id}'`)||html.includes(`${id}:`),id);
 }
 assert.ok(html.includes('Seasonal Collection'));
 assert.ok(css.includes('data-theme="xmas-rose"'));
 assert.ok(css.includes('data-theme="xmas-enchanted"'));
 assert.ok(css.includes('data-theme="xmas-midnight"'));
});

test('immersive decorations use SVG/CSS atmosphere not emoji-only',()=>{
 assert.ok(html.includes('id="xmas-atmosphere"'));
 assert.ok(css.includes('#xmas-atmosphere'));
 assert.ok(css.includes('xa-garland'));
 assert.ok(css.includes('xa-flake'));
 assert.ok(css.includes('data:image/svg+xml'));
 assert.ok(html.includes('xo-tree'));
 assert.ok(html.includes('xoNeedles'));
 assert.ok(css.includes('xg-lights'));
 assert.ok(!css.includes('content:"🎄"'));
 assert.ok(!css.includes('content:"🎀"'));
});

test('seasonal effects toggle and reduced-motion hooks exist',()=>{
 assert.ok(html.includes('function setXmasFx'));
 assert.ok(html.includes('xmasFx'));
 assert.ok(css.includes('xmas-fx-off'));
 assert.ok(css.includes('xmas-fx-paused'));
 assert.ok(html.includes("xmas-fx-paused"));
 assert.ok(css.includes('prefers-reduced-motion:reduce'));
});

test('Christmas countdown boundaries',()=>{
 const extract=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);assert.ok(i>=0&&j>i);return html.slice(i,j)};
 const ctx=vm.createContext({});
 vm.runInContext(
  'const pad=n=>String(n).padStart(2,"0");'+
  'const ymd=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());'+
  'const pd=s=>{const a=s.split("-").map(Number);return new Date(a[0],a[1]-1,a[2])};'+
  extract('function christmasCountdown(day){','function xmasCountdownCard(){')+
  ';globalThis.christmasCountdown=christmasCountdown',
  ctx
 );
 const day=ctx.christmasCountdown('2026-12-25');
 assert.equal(day.title,'Merry Christmas');
 const before=ctx.christmasCountdown('2026-12-24');
 assert.equal(before.n,'1');
 assert.match(before.title,/1 day until Christmas/);
 const after=ctx.christmasCountdown('2026-12-26');
 assert.ok(Number(after.n)>300);
 assert.match(after.title,/memories/i);
});

test('Christmas opening markup and reduced-motion path exist',()=>{
 assert.ok(html.includes('myday-xmas-opening'));
 assert.ok(html.includes('xmas-open'));
 assert.ok(html.includes("prefers-reduced-motion: reduce"));
 assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
});

test('gift list helpers sanitize and groceries stay permanent',()=>{
 assert.ok(html.includes('function vXmasGifts'));
 assert.ok(html.includes("curList==='xmasgifts'"));
 assert.ok(html.includes('safeGiftText'));
 assert.ok(html.includes("curList==='groc'")&&html.includes('Groceries stays in My Day'));
 assert.ok(html.includes("l.id!=='groc'?`<button class=\"a-del\" onclick=\"delList()\">"));
});

test('storage key and security helpers preserved',()=>{
 assert.ok(html.includes("const KEY='myday-v1'"));
 assert.ok(html.includes('safeNoteColor'));
 assert.ok(html.includes('safeNoteImg'));
 assert.ok(html.includes('ensureGroceries'));
 assert.ok(html.includes('xmasGifts'));
});

test('non-Christmas themes stay free of bloom-xmas atmosphere class wiring in CSS isolation',()=>{
 assert.ok(css.includes('body.bloom-xmas'));
 assert.ok(css.includes('body:not(.bloom-xmas) #xmas-atmosphere')||css.includes('body:not(.bloom-xmas)'));
});
