const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
test('all inline scripts compile',()=>{const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];assert.ok(scripts.length>=2);for(const [,source] of scripts)new vm.Script(source)});
test('daily prayers rotate deterministically offline',()=>{const start=html.indexOf('const BLOOM_PRAYERS='),end=html.indexOf('function bloomFaithCard()',start);assert.ok(start>=0&&end>start);const ctx=vm.createContext({});vm.runInContext(html.slice(start,end)+';globalThis.prayer=bloomDailyPrayer',ctx);const days=Array.from({length:14},(_,i)=>'2026-11-'+String(i+1).padStart(2,'0'));const prayers=days.map(d=>ctx.prayer(d)[1]);assert.equal(new Set(prayers).size,14);assert.equal(ctx.prayer(days[0])[1],prayers[0]);assert.equal(ctx.prayer('2026-11-15')[1],prayers[0]);assert.ok(prayers.every(p=>p.endsWith('Amen.')))});
test('faith no longer asks for typed prayers',()=>{assert.ok(!html.includes('id="bloom-prayer"'));assert.ok(html.includes('Today’s prayer ·'))});
