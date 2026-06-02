import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'http://127.0.0.1:8910/previews/preview.html';
const OUT = '../previews/generated';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

// 1) Récupère la liste des cards (tags + labels) depuis la page
const probe = await browser.newPage();
await probe.goto(BASE, { waitUntil: 'domcontentloaded' });
const cards = await probe.evaluate(() => window.CARDS || []);
await probe.close();
if (!cards.length) { console.log('Aucune card (window.CARDS vide)'); await browser.close(); process.exit(1); }

// 2) Capture chaque card dans une page isolée (?card=<tag> → pas de collision de globals)
for (const c of cards) {
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 900, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE}?card=${encodeURIComponent(c.tag)}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.body.dataset.ready === '1', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(2200); // stabilise RAF/animations

  const slug = c.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const tile = await page.$('.tile');
  const card = tile ? await tile.$(`${c.tag}`) : null;
  const target = card || tile;
  try {
    const box = await target.boundingBox();
    if (!box || box.height < 30) throw new Error(`rendu vide (${box ? box.width + 'x' + box.height : 'no box'})`);
    await target.screenshot({ path: `${OUT}/${slug}.png` });
    console.log(`OK  ${slug.padEnd(20)} ${Math.round(box.width)}x${Math.round(box.height)}`);
  } catch (e) {
    console.log(`ERR ${slug.padEnd(20)} ${e.message}${errors.length ? '  | ' + errors[0] : ''}`);
  }
  await page.close();
}
await browser.close();
