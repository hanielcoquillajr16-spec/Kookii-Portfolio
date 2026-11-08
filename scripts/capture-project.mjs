import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const response = await page.goto('https://vng-lecheflan.vercel.app', { waitUntil: 'networkidle', timeout: 45000 });
  if (!response?.ok()) throw new Error(`Project returned HTTP ${response?.status()}`);
  await page.waitForTimeout(2500);
  await mkdir('public/images', { recursive: true });
  await page.screenshot({ path: 'public/images/vng-preview.jpg', type: 'jpeg', quality: 88 });
  console.log(JSON.stringify({ title: await page.title(), url: page.url(), screenshot: 'public/images/vng-preview.jpg' }));
} finally {
  await browser.close();
}
