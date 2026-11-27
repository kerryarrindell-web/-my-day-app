import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const out = '/opt/cursor/artifacts';
const themes = ['blossom','lavender','sage','peach','midnight'];
const tabs = [
  ['today','home'],
  ['appts','calendar'],
  ['me','metime'],
  ['lists','shopping'],
  ['more','more'],
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
await page.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
await page.evaluate(() => { localStorage.setItem('myday-opening','1'); if (S.settings) { S.settings.openingSeen = true; } });

const results = { screenshots: [], persistence: {}, led: {} };

for (const theme of themes) {
  await page.evaluate((th) => { setBloomTheme(th); }, theme);
  await page.waitForTimeout(200);
  // For Me Time go to garden for more visual interest on one capture path — still capture main home of Me Time
  for (const [tabId, label] of tabs) {
    await page.evaluate((t) => { tab = t; if (t === 'me') meSection = 'home'; render(); window.scrollTo(0,0); }, tabId);
    await page.waitForTimeout(180);
    const file = `bloom-${label}-${theme}.png`;
    const full = path.join(out, file);
    await page.screenshot({ path: full, fullPage: false });
    results.screenshots.push(file);
  }
}

// Theme persistence after reload
await page.evaluate(() => setBloomTheme('sage'));
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(300);
results.persistence.afterReload = await page.evaluate(() => ({
  theme: document.body.dataset.theme,
  dark: document.body.classList.contains('dark'),
  led: document.body.classList.contains('bloom-led'),
  saved: S.settings.theme,
}));

// Offline restart simulation: go offline, reload
await context.setOffline(true);
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(400);
results.persistence.afterOfflineReload = await page.evaluate(() => ({
  theme: document.body.dataset.theme,
  saved: S.settings.theme,
  led: document.body.classList.contains('bloom-led'),
}));
await context.setOffline(false);

// LED presence matrix
results.led = {};
for (const theme of themes) {
  await page.evaluate((th) => setBloomTheme(th), theme);
  await page.waitForTimeout(100);
  results.led[theme] = await page.evaluate(() => {
    const el = document.querySelector('.bloom-journey');
    const cs = el ? getComputedStyle(el) : null;
    return {
      bloomLed: document.body.classList.contains('bloom-led'),
      theme: document.body.dataset.theme,
      hasInset: !!(cs && cs.boxShadow.includes('inset')),
      afterPseudo: el ? getComputedStyle(el, '::after').content : null,
    };
  });
}

fs.writeFileSync(path.join(out, 'bloom-visual-verify.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
