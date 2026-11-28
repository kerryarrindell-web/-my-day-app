const {test,expect}=require('@playwright/test');
test('mobile home and faith navigation render without runtime errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8080/');
 await expect(page.locator('#app')).toContainText('How are you feeling?');
 await page.evaluate(()=>{tab='me';render()});
 await expect(page.getByText('My faith & prayers',{exact:true})).toBeVisible();
 await page.getByText('My faith & prayers',{exact:true}).click();
 await expect(page.locator('.bloom-daily-prayer')).toContainText('Amen.');
 await expect(page.locator('#bloom-prayer')).toHaveCount(0);
 await page.reload();
 await expect(page.locator('#app')).toBeVisible();
 expect(errors).toEqual([]);
});
test('energy selection persists across reload',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.getByRole('button',{name:'Tired',exact:true}).first().click();
 await page.reload();
 await expect(page.getByRole('button',{name:'Tired',exact:true}).first()).toHaveAttribute('aria-pressed','true');
});

test('offline shell reload preserves energy and prayer',async({page,context})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(async()=>{await navigator.serviceWorker.ready});
 await page.reload();
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await page.getByRole('button',{name:'Tired',exact:true}).first().click();
 await context.setOffline(true);
 await page.reload();
 await expect(page.getByRole('button',{name:'Tired',exact:true}).first()).toHaveAttribute('aria-pressed','true');
 await page.evaluate(()=>{tab='me';meNavigate('faith')});
 await expect(page.locator('.bloom-daily-prayer')).toContainText('Amen.');
});
test('day and night hero and verse gradients match',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 for(const dark of [false,true]){
 await page.evaluate(d=>{S.settings.dark=d;S.settings.theme=d?'midnight':'blossom';render()},dark);
 const hero=await page.locator('.bg-home-hero').first().evaluate(e=>getComputedStyle(e).backgroundImage);
 const verse=await page.locator('.bg-verse').first().evaluate(e=>getComputedStyle(e).backgroundImage);
 expect(hero).toEqual(verse);
 expect(await page.locator('.bloom-journey').first().evaluate(e=>getComputedStyle(e).boxShadow)).not.toBe('none');
 }
});

test('LED glow is restricted to night mode',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 const card=page.locator('.bloom-journey').first();
 await page.evaluate(()=>{S.settings.dark=false;S.settings.theme='blossom';render()});
 const day=await card.evaluate(e=>getComputedStyle(e).boxShadow);
 const dayLed=await page.evaluate(()=>document.body.classList.contains('bloom-led'));
 await page.evaluate(()=>{S.settings.dark=true;S.settings.theme='midnight';render()});
 const night=await card.evaluate(e=>getComputedStyle(e).boxShadow);
 const nightLed=await page.evaluate(()=>document.body.classList.contains('bloom-led')&&document.body.dataset.theme==='midnight');
 expect(dayLed).toBe(false);
 expect(nightLed).toBe(true);
 expect(day).not.toContain('inset');
 expect(night).toContain('inset');
 expect(day).not.toEqual(night);
 await page.evaluate(()=>{S.settings.dark=false;S.settings.theme='blossom';render()});
 const navDay=await page.locator('#tabs').evaluate(e=>getComputedStyle(e).boxShadow);
 expect(navDay.includes('140, 100, 200')||navDay.includes('140,100,200')).toBe(false);
 await page.evaluate(()=>{S.settings.dark=true;S.settings.theme='midnight';render()});
 const navNight=await page.locator('#tabs').evaluate(e=>getComputedStyle(e).boxShadow);
 expect(navNight.includes('140, 100, 200')||navNight.includes('140,100,200')).toBe(true);
});

test('inbox converts a thought into a pinned sticky note',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.locator('.bloom-inbox summary').first().click();
 await page.locator('#bloom-inbox-input').fill('Synthetic reminder');
 await page.locator('.bloom-inbox').first().getByRole('button',{name:'Save',exact:true}).click();
 await page.locator('.bloom-inbox summary').first().click();
 await page.locator('.bloom-inbox').first().getByRole('button',{name:'Sticky note',exact:true}).click();
 expect(await page.evaluate(()=>S.notes.some(n=>n.text==='Synthetic reminder'&&n.pin))).toBe(true);
 await page.reload();
 expect(await page.evaluate(()=>S.notes.some(n=>n.text==='Synthetic reminder'&&n.pin))).toBe(true);
});
test('storage failure is reported instead of claiming a successful save',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 expect(await page.evaluate(()=>{const original=Storage.prototype.setItem;try{Storage.prototype.setItem=function(){throw new Error('synthetic quota failure')};return save()}finally{Storage.prototype.setItem=original}})).toBe(false);
});

test('small mobile viewport has no horizontal page overflow',async({page})=>{
 await page.setViewportSize({width:360,height:800});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:8080/');
 for(const section of ['today','appts','me','lists']){
 await page.evaluate(t=>{tab=t;render()},section);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
});
test('journal entries persist independently by date',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{tab='me';meNavigate('journal')});
 const field=page.locator('#bloom-journal-text');
 await field.fill('Synthetic reflection today');
 await page.getByRole('button',{name:'Save reflection',exact:true}).click();
 await page.evaluate(()=>bloomJournalSelect(addDays(todayStr(),-1)));
 await expect(field).not.toHaveValue('Synthetic reflection today');
 await field.fill('Synthetic reflection yesterday');
 await page.getByRole('button',{name:'Save reflection',exact:true}).click();
 await page.evaluate(()=>bloomJournalSelect(todayStr()));
 await expect(field).toHaveValue('Synthetic reflection today');
});

test('rapid navigation settles without persistent screen animation',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{for(const t of ['me','appts','lists','today','me','today']){tab=t;render()}});
 await page.waitForFunction(()=>document.querySelector('#app').getAnimations().every(a=>a.playState!=='running'));
 await expect(page.locator('#app')).toContainText('How are you feeling?');
 expect(await page.evaluate(()=>getComputedStyle(document.querySelector('#app')).opacity)).toBe('1');
});
test('reduced motion disables screen transition',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{tab='me';render()});
 expect(await page.evaluate(()=>document.querySelector('#app').getAnimations().length)).toBe(0);
 await expect(page.locator('#myday-opening')).toBeHidden();
});

test('unsafe imported external links cannot become executable links',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{S.settings.babyUrl='javascript:alert(1)';S.settings.cal='javascript:alert(1)';render()});
 await expect(page.getByText('Open baby tracker',{exact:false})).toHaveCount(0);
 await page.evaluate(()=>{tab='appts';render()});
 await expect(page.getByText('Open my Google Calendar')).toHaveAttribute('href','https://calendar.google.com/');
});

test('dark mode toggle applies during settings sheet slide-in',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{localStorage.setItem('myday-opening','1');S.settings.dark=false;S.settings.openingSeen=true;render()});
 await page.locator('.gear').click();
 await expect(page.locator('#modalwrap')).toBeVisible();
 // Click Dark immediately while sheetin (~500ms) is still running
 await page.getByRole('button',{name:'Dark',exact:true}).click({trial:false});
 await expect.poll(async()=>page.evaluate(()=>!!(S.settings.dark&&document.body.classList.contains('dark')))).toBe(true);
 await expect(page.locator('#modalwrap')).toBeVisible();
 await expect(page.getByRole('heading',{name:'Settings'})).toBeVisible();
});

test('scrim cannot dismiss settings during sheet slide-in',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.locator('.gear').click();
 await expect(page.locator('#modalwrap')).toBeVisible();
 await page.locator('#modalwrap .scrim').click({force:true,position:{x:8,y:8}});
 await expect(page.locator('#modalwrap')).toBeVisible();
 await expect(page.getByRole('heading',{name:'Settings'})).toBeVisible();
});

test('grocery input clears only after a successful save',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{tab='lists';curList='groc';render()});
 await page.locator('#ni').fill('Synthetic milk');
 await page.getByRole('button',{name:'Add',exact:true}).click();
 await expect(page.locator('#app')).toContainText('Synthetic milk');
 await expect(page.locator('#ni')).toHaveValue('');
 // Failed save keeps the typed text for retry
 await page.locator('#ni').fill('Synthetic bread');
 await page.evaluate(()=>{const o=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new Error('synthetic quota')};window.__restoreSetItem=()=>{Storage.prototype.setItem=o}});
 await page.getByRole('button',{name:'Add',exact:true}).click();
 await expect(page.locator('#ni')).toHaveValue('Synthetic bread');
 await page.evaluate(()=>window.__restoreSetItem());
});

test('home shows daily prayer before check-in',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{const s=document.getElementById('myday-opening');if(s)s.hidden=true});
 const faith=page.locator('.bloom-home-faith').first();
 const journey=page.locator('.bloom-journey').first();
 await expect(faith).toBeVisible();
 await expect(faith).toContainText('Amen.');
 await expect(faith.locator('.bloom-home-verse')).toContainText('KJV');
 const order=await page.evaluate(()=>{
  const f=document.querySelector('.bloom-home-faith');
  const j=document.querySelector('.bloom-journey');
  return !!(f&&j&&(f.compareDocumentPosition(j)&Node.DOCUMENT_POSITION_FOLLOWING));
 });
 expect(order).toBe(true);
});

test('sticky note rejects unsafe image src in render',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{
  S.notes=[{id:'n1',text:'Synthetic',color:'#fff3a8',pin:false,img:'javascript:alert(1)'}];
  tab='more';render();
 });
 const bad=await page.locator('.notes img').count();
 expect(bad).toBe(0);
 await page.evaluate(()=>{
  S.notes=[{id:'n2',text:'Photo note',color:'#fff3a8',pin:false,img:'data:image/png;base64,iVBORw0KGgo='}];
  tab='more';render();
 });
 await expect(page.locator('.notes img').first()).toHaveAttribute('src',/data:image\/png;base64,/);
});

test('garden and moments panels keep light text for contrast',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 for(const theme of ['blossom','lavender','sage','peach','midnight']){
  await page.evaluate(th=>{setBloomTheme(th);tab='me';meNavigate('garden')},theme);
  const color=await page.locator('.md131-panel.green h2').evaluate(e=>getComputedStyle(e).color);
  const rgb=color.match(/\d+/g).map(Number);
  const luminance=(0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2])/255;
  expect(luminance,'garden h2 '+theme).toBeGreaterThan(0.7);
  await page.evaluate(()=>meNavigate('moments'));
  const mColor=await page.locator('.md131-panel.purple h2').evaluate(e=>getComputedStyle(e).color);
  const mrgb=mColor.match(/\d+/g).map(Number);
  const mLum=(0.2126*mrgb[0]+0.7152*mrgb[1]+0.0722*mrgb[2])/255;
  expect(mLum,'moments h2 '+theme).toBeGreaterThan(0.7);
 }
});

test('quick add fab sits above tab bar clearance',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{tab='today';render();const s=document.getElementById('myday-opening');if(s)s.hidden=true});
 await expect(page.locator('#md11-fab')).toBeVisible({timeout:5000});
 const ok=await page.evaluate(()=>{
  const fab=document.getElementById('md11-fab').getBoundingClientRect();
  const tabs=document.getElementById('tabs').getBoundingClientRect();
  return fab.bottom <= tabs.top - 4;
 });
 expect(ok).toBe(true);
});

test('sticky note colour XSS is blocked by allowlist styling',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 const payload='red; background-image:url("javascript:alert(1)"); color:expression(alert(1))';
 await page.evaluate(color=>{
  S.notes=[{id:'xss1',text:'Colour probe',color,pin:true,img:''}];
  S=norm(S);save();tab='more';render();
 },payload);
 const bg=await page.locator('.notes .note').first().evaluate(e=>e.style.backgroundColor||e.style.background);
 const norm=s=>String(s).toLowerCase().replace(/\s/g,'');
 expect(['#fff3a8','rgb(255,243,168)']).toContain(norm(bg));
 expect(bg).not.toMatch(/javascript|expression|url\(/i);
 const attr=await page.locator('.notes .note').first().getAttribute('style');
 expect(attr||'').toMatch(/background:\s*#fff3a8/i);
 expect(attr||'').not.toMatch(/javascript|expression|url\(/i);
});

test('Groceries list cannot be deleted and restores if missing',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{
  S.lists=[{id:'party',name:'Party',emoji:'🎉',items:[{id:'c1',t:'cups',done:false}]}];
  S=norm(S);save();
  curList='groc';tab='lists';confirmDel=false;render();
 });
 await expect(page.locator('#app')).toContainText('Groceries');
 await expect(page.getByRole('button',{name:'Delete list'})).toHaveCount(0);
 const blocked=await page.evaluate(()=>{
  const before=S.lists.find(l=>l.id==='groc');
  curList='groc';confirmDel=true;delList();
  const after=S.lists.find(l=>l.id==='groc');
  return !!(before&&after&&S.lists.some(l=>l.id==='party'&&l.items[0].t==='cups'));
 });
 expect(blocked).toBe(true);
 await page.evaluate(()=>{
  curList='party';confirmDel=false;render();
 });
 await expect(page.getByRole('button',{name:'Delete list'})).toBeVisible();
 await page.getByRole('button',{name:'Delete list'}).click();
 await expect(page.getByRole('button',{name:'Tap again to delete list'})).toBeVisible();
 await page.getByRole('button',{name:'Tap again to delete list'}).click();
 await expect(page.locator('#app')).not.toContainText('Party');
 await expect(page.locator('#app')).toContainText('Groceries');
 const grocAlive=await page.evaluate(()=>!!S.lists.find(l=>l.id==='groc'));
 expect(grocAlive).toBe(true);
});

test('eight themes persist including Christmas Seasonal Collection',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{const s=document.getElementById('myday-opening');if(s)s.hidden=true});
 const ids=['blossom','lavender','sage','peach','midnight','xmas-rose','xmas-enchanted','xmas-midnight'];
 for(const id of ids){
  await page.evaluate(th=>{setBloomTheme(th);tab='more';render()},id);
  await expect(page.locator('body')).toHaveAttribute('data-theme',id);
  const led=await page.evaluate(()=>document.body.classList.contains('bloom-led'));
  expect(led).toBe(id==='midnight'||id==='xmas-midnight');
 }
 await page.reload();
 await page.evaluate(()=>{const s=document.getElementById('myday-opening');if(s)s.hidden=true});
 await expect(page.locator('body')).toHaveAttribute('data-theme','xmas-midnight');
 await page.evaluate(()=>{tab='more';render()});
 await expect(page.getByText(/Seasonal Collection/)).toBeVisible();
});

test('Christmas home shows countdown prayer and festive greeting',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{
  const s=document.getElementById('myday-opening');if(s)s.hidden=true;
  setBloomTheme('xmas-rose');tab='today';render();
 });
 await expect(page.locator('.xmas-greet')).toContainText('Christmas Rose');
 await expect(page.locator('.xmas-countdown')).toBeVisible();
 const faith=page.locator('.bloom-home-faith').first();
 await expect(faith).toContainText('Christmas prayer');
 await expect(faith).toContainText('KJV');
 const order=await page.evaluate(()=>{
  const g=document.querySelector('.xmas-greet');
  const c=document.querySelector('.xmas-countdown');
  const f=document.querySelector('.bloom-home-faith');
  const j=document.querySelector('.bloom-journey');
  return !!(g&&c&&f&&j&&(g.compareDocumentPosition(c)&Node.DOCUMENT_POSITION_FOLLOWING)&&
   (c.compareDocumentPosition(f)&Node.DOCUMENT_POSITION_FOLLOWING)&&
   (f.compareDocumentPosition(j)&Node.DOCUMENT_POSITION_FOLLOWING));
 });
 expect(order).toBe(true);
});

test('Christmas gift list supports add edit delete without new tab',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{
  const s=document.getElementById('myday-opening');if(s)s.hidden=true;
  tab='lists';curList='xmasgifts';render();
 });
 await page.locator('#xg-name').fill('Soft blanket');
 await page.locator('#xg-for').fill('Mum');
 await page.locator('#xg-cost').fill('£20');
 await page.getByRole('button',{name:'Add gift',exact:true}).click();
 await expect(page.locator('#app')).toContainText('Soft blanket');
 await expect(page.locator('#app')).toContainText('Mum');
 await page.locator('.xmas-gift-row').first().click();
 await page.locator('#eg-name').fill('Cashmere socks');
 await page.getByRole('button',{name:'Save',exact:true}).click();
 await expect(page.locator('#app')).toContainText('Cashmere socks');
 await page.getByRole('button',{name:'Delete Cashmere socks'}).click();
 await expect(page.locator('#app')).not.toContainText('Cashmere socks');
 const tabs=await page.locator('#tabs button').count();
 expect(tabs).toBe(5);
});

test('festive garden preserves blossom count across theme switch',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{
  const s=document.getElementById('myday-opening');if(s)s.hidden=true;
  S.meTime=S.meTime||{};S.meTime['2099-01-01']={littleWins:['a','b','c']};save();
  setBloomTheme('blossom');tab='me';meNavigate('garden');
 });
 await expect(page.locator('.md131-total')).toContainText('3 blossoms');
 await page.evaluate(()=>{setBloomTheme('xmas-enchanted');tab='me';meNavigate('garden')});
 await expect(page.getByRole('heading',{name:'Festive Blossom Garden'})).toBeVisible();
 await expect(page.locator('.md131-total')).toContainText('3 blossoms');
 await expect(page.locator('.xmas-garden-stage')).toHaveCount(1);
});

test('Christmas opening uses seasonal stage for xmas themes',async({page})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('myday-v1',JSON.stringify({settings:{theme:'xmas-enchanted',dark:false,size:'m'},lists:[{id:'groc',name:'Groceries',emoji:'🛒',items:[]}],tasks:[],appts:[],notes:[],xmasGifts:[]}));
 });
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.goto('http://127.0.0.1:8080/');
 const cls=await page.locator('#myday-opening').getAttribute('class');
 expect(cls||'').toContain('xmas-open');
 await expect(page.locator('#myday-xmas-opening')).toBeVisible();
 await expect(page.locator('#myday-opening-video')).toBeHidden();
});

test('gift fields reject angle-bracket injection on save',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 await page.evaluate(()=>{
  S.xmasGifts=[];tab='lists';curList='xmasgifts';render();
  document.getElementById('xg-name').value='Gift<script>';
  document.getElementById('xg-for').value='A<b>B';
  document.getElementById('xg-cost').value='£1>';
  addGift();
 });
 const g=await page.evaluate(()=>S.xmasGifts[0]);
 expect(g.t).toBe('Giftscript');
 expect(g.for).toBe('AbB');
 expect(g.cost).toBe('£1');
 await expect(page.locator('#app script')).toHaveCount(0);
});
