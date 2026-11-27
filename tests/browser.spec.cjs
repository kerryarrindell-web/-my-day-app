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
