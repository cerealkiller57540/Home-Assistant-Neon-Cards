import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ deviceScaleFactor: 2, viewport: { width: 1360, height: 900 } });
await p.goto('http://127.0.0.1:8910/previews/theme-demo.html', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
await p.screenshot({ path: '../previews/generated/_theme-neo-tokyo-v3.png', fullPage: true });
const box = await p.evaluate(() => ({ w: document.body.scrollWidth, h: document.body.scrollHeight }));
console.log('thème démo capturé', box.w + 'x' + box.h);
await b.close();
