const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('bloom-christmas.css','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('Christmas build markers and SW 014',()=>{
 assert.ok(html.includes('content="xmas-014"'));
 assert.ok(sw.includes("CACHE=PREFIX+'014'"));
 assert.ok(sw.includes('bloom-christmas.css'));
 assert.ok(html.includes('bloom-christmas.css?v=xmas-1'));
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
