const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const extract=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);assert.ok(i>=0&&j>i);return html.slice(i,j)};
const ctx=vm.createContext({});
vm.runInContext(extract('const DEF=','const KEY=')+extract('function safeFields(o)','function save()')+extract('function validBackup(p)','function doRestore()')+';globalThis.api={DEF,norm,validBackup}',ctx);
const {DEF,norm,validBackup}=ctx.api;
test('default backup accepted',()=>assert.equal(validBackup(DEF()),true));
test('malformed records rejected',()=>{for(const key of ['tasks','notes','appts','pills']){const d=DEF();d[key]=[null];assert.equal(validBackup(d),false)}});
test('nested malformed shopping records rejected',()=>{const d=DEF();d.lists[0].items=[null];assert.equal(validBackup(d),false)});
test('history and unknown fields survive normalisation',()=>{const d=DEF();d.tasks=[{id:'old',done:true,date:'2020-01-01',doneOn:{'2020-01-01':true}}];for(const k of ['wins','rlog','meals'])d[k]['2020-01-01']={value:1};d.futureField={keep:true};const n=norm(JSON.parse(JSON.stringify(d)));assert.equal(n.tasks.length,1);assert.equal(n.tasks[0].doneOn['2020-01-01'],true);for(const k of ['wins','rlog','meals'])assert.equal(n[k]['2020-01-01'].value,1);assert.equal(n.futureField.keep,true)});
test('storage key unchanged',()=>assert.ok(html.includes("const KEY='myday-v1'")));

test('unsafe nested backup keys rejected',()=>{const d=DEF();d.settings=JSON.parse('{"__proto__":{"polluted":true}}');assert.equal(validBackup(d),false)});
test('empty shopping lists rejected',()=>{const d=DEF();d.lists=[];assert.equal(validBackup(d),false)});
test('Bloom data survives migration',()=>{const d=DEF();d.bloomInbox=[{id:'a',text:'remember'}];d.bloomEnergy={'2026-11-27':'okay'};d.bloomFaith=[1];d.meTime={'2026-11-27':{reflection:'hello'}};assert.equal(validBackup(d),true);const n=norm(JSON.parse(JSON.stringify(d)));for(const k of ['bloomInbox','bloomEnergy','bloomFaith','meTime'])assert.equal(JSON.stringify(n[k]),JSON.stringify(d[k]))});

test('reject imported identifiers that escape HTML handlers',()=>{const d=DEF();d.notes=[{id:"x');alert(1);//",text:'test'}];assert.equal(validBackup(d),false);d.notes[0].id='safe-id_123';assert.equal(validBackup(d),true)});
