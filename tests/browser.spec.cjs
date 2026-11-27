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
