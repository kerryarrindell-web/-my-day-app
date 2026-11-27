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
 await page.evaluate(d=>{S.settings.dark=d;render()},dark);
 const hero=await page.locator('.bg-home-hero').first().evaluate(e=>getComputedStyle(e).backgroundImage);
 const verse=await page.locator('.bg-verse').first().evaluate(e=>getComputedStyle(e).backgroundImage);
 expect(hero).toEqual(verse);
 expect(await page.locator('.bloom-journey').first().evaluate(e=>getComputedStyle(e).boxShadow)).not.toBe('none');
 }
});

test('LED glow is restricted to night mode',async({page})=>{
 await page.goto('http://127.0.0.1:8080/');
 const card=page.locator('.bloom-journey').first();
 await page.evaluate(()=>{S.settings.dark=false;render()});
 const day=await card.evaluate(e=>getComputedStyle(e).boxShadow);
 await page.evaluate(()=>{S.settings.dark=true;render()});
 const night=await card.evaluate(e=>getComputedStyle(e).boxShadow);
 expect(day).not.toContain('inset');
 expect(night).toContain('inset');
 expect(day).not.toEqual(night);
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
