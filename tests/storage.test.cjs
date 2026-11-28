const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8');
const extract=(a,b)=>{const i=html.indexOf(a),j=html.indexOf(b,i);assert.ok(i>=0&&j>i,`missing extract ${a} .. ${b}`);return html.slice(i,j)};
const ctx=vm.createContext({URL,console});
vm.runInContext(
  extract('const safeNoteImg=','const DEF=')+
  extract('const DEF=','const KEY=')+
  extract('function ensureGroceries','function save()')+
  extract('function validBackup(p)','function doRestore()')+
  ';globalThis.api={DEF,norm,validBackup,ensureGroceries,safeNoteColor,safeNoteImg,safeEmoji,COLORS,safeWebLink}',
  ctx
);
const {DEF,norm,validBackup,ensureGroceries,safeNoteColor,safeNoteImg,safeEmoji,COLORS,safeWebLink}=ctx.api;

test('default backup accepted',()=>assert.equal(validBackup(DEF()),true));
test('malformed records rejected',()=>{for(const key of ['tasks','notes','appts','pills']){const d=DEF();d[key]=[null];assert.equal(validBackup(d),false)}});
test('nested malformed shopping records rejected',()=>{const d=DEF();d.lists[0].items=[null];assert.equal(validBackup(d),false)});
test('history and unknown fields survive normalisation',()=>{const d=DEF();d.tasks=[{id:'old',done:true,date:'2020-01-01',doneOn:{'2020-01-01':true}}];for(const k of ['wins','rlog','meals'])d[k]['2020-01-01']={value:1};d.futureField={keep:true};const n=norm(JSON.parse(JSON.stringify(d)));assert.equal(n.tasks.length,1);assert.equal(n.tasks[0].doneOn['2020-01-01'],true);for(const k of ['wins','rlog','meals'])assert.equal(n[k]['2020-01-01'].value,1);assert.equal(n.futureField.keep,true)});
test('storage key unchanged',()=>assert.ok(html.includes("const KEY='myday-v1'")));

test('unsafe nested backup keys rejected',()=>{const d=DEF();d.settings=JSON.parse('{"__proto__":{"polluted":true}}');assert.equal(validBackup(d),false)});
test('empty shopping lists rejected',()=>{const d=DEF();d.lists=[];assert.equal(validBackup(d),false)});
test('Bloom data survives migration',()=>{const d=DEF();d.bloomInbox=[{id:'a',text:'remember'}];d.bloomEnergy={'2026-11-27':'okay'};d.bloomFaith=[1];d.meTime={'2026-11-27':{reflection:'hello'}};assert.equal(validBackup(d),true);const n=norm(JSON.parse(JSON.stringify(d)));for(const k of ['bloomInbox','bloomEnergy','bloomFaith','meTime'])assert.equal(JSON.stringify(n[k]),JSON.stringify(d[k]))});

test('reject imported identifiers that escape HTML handlers',()=>{const d=DEF();d.notes=[{id:"x');alert(1);//",text:'test'}];assert.equal(validBackup(d),false);d.notes[0].id='safe-id_123';assert.equal(validBackup(d),true)});

test('sticky note image must be a safe data URL',()=>{
 const d=DEF();
 d.notes=[{id:'safe-id_1',text:'hi',img:"javascript:alert(1)"}];
 assert.equal(validBackup(d),false);
 d.notes[0].img='data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==';
 assert.equal(validBackup(d),false);
 d.notes[0].img='data:image/jpeg;base64,/9j/4AAQ';
 assert.equal(validBackup(d),true);
 d.notes[0].img='';
 assert.equal(validBackup(d),true);
});

test('sticky note colour must be allowlisted',()=>{
 const d=DEF();
 d.notes=[{id:'safe-id_2',text:'hi',color:'red;background:url(javascript:alert(1))'}];
 assert.equal(validBackup(d),false);
 d.notes[0].color='expression(alert(1))';
 assert.equal(validBackup(d),false);
 d.notes[0].color='#fff3a8';
 assert.equal(validBackup(d),true);
 d.notes[0].color='#FFE0B8';
 assert.equal(validBackup(d),true);
});

test('safeNoteColor only returns allowlisted hex',()=>{
 assert.equal(safeNoteColor('#fff3a8'),'#fff3a8');
 assert.equal(safeNoteColor('#CFE4FF'),'#cfe4ff');
 assert.equal(safeNoteColor('red"),url(x)'),COLORS[0]);
 assert.equal(safeNoteColor('"><img src=x onerror=alert(1)>'),COLORS[0]);
 assert.ok(COLORS.every(c=>safeNoteColor(c)===c));
});

test('safeNoteImg rejects scriptable schemes',()=>{
 assert.equal(safeNoteImg('javascript:alert(1)'),'');
 assert.equal(safeNoteImg('data:image/svg+xml;base64,PHN2Zz4='),'');
 assert.ok(safeNoteImg('data:image/png;base64,aaa=').startsWith('data:image/png'));
});

test('norm restores missing Groceries without wiping other lists',()=>{
 const d=DEF();
 d.lists=[{id:'custom',name:'Party',emoji:'🎉',items:[{id:'i1',t:'cups',done:false}]}];
 const n=norm(JSON.parse(JSON.stringify(d)));
 assert.equal(n.lists[0].id,'groc');
 assert.equal(n.lists[0].name,'Groceries');
 assert.equal(n.lists.some(l=>l.id==='custom'&&l.items[0].t==='cups'),true);
 assert.equal(n.lists.filter(l=>l.id==='groc').length,1);
});

test('ensureGroceries keeps existing grocery items',()=>{
 const lists=[{id:'groc',name:'Groceries',emoji:'🛒',items:[{id:'m',t:'milk',done:false}]},{id:'x',name:'X',emoji:'📝',items:[]}];
 const out=ensureGroceries(lists);
 assert.equal(out[0].items[0].t,'milk');
 assert.equal(out.length,2);
});

test('ensureGroceries inserts default when absent',()=>{
 const out=ensureGroceries([{id:'only',name:'Only',emoji:'📝',items:[]}]);
 assert.equal(out[0].id,'groc');
 assert.equal(out[1].id,'only');
});

test('norm sanitises malicious note colour and keeps text',()=>{
 const d=DEF();
 d.notes=[{id:'n1',text:'Parked level 3',color:'#ff0000;}</style><script>alert(1)</script>',img:"javascript:alert(1)"}];
 const n=norm(d);
 assert.equal(n.notes[0].color,COLORS[0]);
 assert.equal(n.notes[0].img,'');
 assert.equal(n.notes[0].text,'Parked level 3');
});

test('norm sanitises settings links and list emoji',()=>{
 const d=DEF();
 d.settings.cal='javascript:alert(1)';
 d.settings.babyUrl='data:text/html,hi';
 d.lists[1].emoji='<img src=x onerror=alert(1)>';
 const n=norm(d);
 assert.equal(n.settings.cal,'https://calendar.google.com/');
 assert.equal(n.settings.babyUrl,'');
 assert.equal(n.lists.find(l=>l.id==='baby').emoji,'🛒');
 assert.equal(safeEmoji('<b>x</b>'),'🛒');
 assert.equal(safeWebLink('https://example.com/path','') ,'https://example.com/path');
});

test('Delete list UI is hidden for Groceries and delList is guarded in source',()=>{
 assert.ok(html.includes("l.id!=='groc'?`<button class=\"a-del\" onclick=\"delList()\">"));
 assert.ok(html.includes("if(curList==='groc'){toast('Groceries stays in My Day')"));
 assert.ok(!/function delList\(\)\{if\(S\.lists\.length/.test(html));
});
