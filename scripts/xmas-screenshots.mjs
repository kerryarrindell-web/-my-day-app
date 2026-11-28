import {chromium} from '@playwright/test';
import fs from 'fs';
import path from 'path';

const base=process.env.BLOOM_URL||'http://127.0.0.1:8080/';
const out=path.resolve('docs/xmas-screens');
fs.mkdirSync(out,{recursive:true});
const themes=['blossom','lavender','sage','peach','midnight','xmas-rose','xmas-enchanted','xmas-midnight'];
const tabs=[
  ['today','home'],
  ['appts','calendar'],
  ['me','metime'],
  ['lists','shopping'],
  ['more','more']
];

const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto(base,{waitUntil:'networkidle'});
await page.evaluate(()=>{const s=document.getElementById('myday-opening');if(s)s.hidden=true;
  S.meTime=S.meTime||{};S.meTime[todayStr()]={littleWins:['a','b','c','d']};
  S.xmasGifts=[{id:'g1',t:'Soft blanket',for:'Mum',cost:'£20',done:false}];save();
});

for(const theme of themes){
  await page.evaluate(th=>{setBloomTheme(th)},theme);
  for(const [tab,name] of tabs){
    await page.evaluate(t=>{
      tab=t;
      if(t==='me')meNavigate('garden');
      if(t==='lists')curList='xmasgifts';
      render();
    },tab);
    await page.waitForTimeout(120);
    const file=`${theme}-${name}.png`;
    await page.screenshot({path:path.join(out,file),fullPage:false});
    console.log('saved',file);
  }
}
await browser.close();
console.log('done',out);
