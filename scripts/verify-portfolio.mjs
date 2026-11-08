import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const failures = [];
await mkdir('test-results', { recursive: true });
try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => failures.push(`${width}: ${error.message}`));
    const response = await page.goto(base, { waitUntil: 'networkidle' });
    assert.ok(response?.ok(), `HTTP response at ${width}`);
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.title(), 'Haniel Coquilla | Web Developer');
    assert.equal((await page.locator('h1').textContent()).replace(/\s+/g, ' ').trim(), 'Haniel A. Coquilla Jr.');
    assert.equal(await page.locator('.skill-card').count(), 11, 'Reduced motion uses one accessible set of skills');
    assert.equal(await page.locator('a:has-text("View Source Code")').count(), 0);
    assert.equal(await page.locator('.contact-button:disabled').count(), 3);
    assert.equal(await page.locator('.project-actions a').first().getAttribute('href'), 'https://vng-lecheflan.vercel.app');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    assert.equal(overflow, false, `No horizontal overflow at ${width}`);
    for (const id of ['about', 'skills', 'projects', 'contact']) {
      if (width <= 640) {
        await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
        assert.equal(await page.getByRole('button', { name: 'Close navigation', exact: true }).getAttribute('aria-expanded'), 'true');
      }
      await page.locator(`#main-navigation a[href="#${id}"]`).click();
      await page.waitForTimeout(100);
      assert.equal(new URL(page.url()).hash, `#${id}`);
      assert.equal(await page.locator(`#main-navigation a[href="#${id}"]`).getAttribute('aria-current'), 'location', `Active ${id} at ${width}`);
      if (width <= 640) assert.equal(await page.getByRole('button', { name: 'Open navigation', exact: true }).getAttribute('aria-expanded'), 'false');
    }
    if (width <= 640) {
      await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('button', { name: 'Open navigation', exact: true }).getAttribute('aria-expanded'), 'false');
    }
    const brokenImages = await page.locator('img').evaluateAll(images => images.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src));
    assert.deepEqual(brokenImages, [], `Assets load at ${width}`);
    const scrollable = await page.locator('.skills-track').evaluate(element => element.scrollWidth > element.clientWidth + 1);
    if (scrollable) {
      await page.getByRole('button', { name: 'Next skills', exact: true }).click();
      const next = await page.locator('.skills-track').evaluate(element => element.scrollLeft);
      assert.ok(next > 0, `Next skill at ${width}`);
      await page.getByRole('button', { name: 'Previous skills', exact: true }).click();
      const previous = await page.locator('.skills-track').evaluate(element => element.scrollLeft);
      assert.ok(previous < next, `Previous skill at ${width}`);
    } else {
      assert.ok(await page.getByRole('button', { name: 'Next skills', exact: true }).isDisabled(), 'Controls disabled when all logos fit');
    }
    await page.locator('.back-to-top').click();
    await page.screenshot({ path: `test-results/portfolio-${width}.png`, fullPage: true });
    console.log(`PASS ${width}px: assets, layout, navigation, menu, links, reduced motion, carousel`);
    await page.close();
  }
  const motion = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await motion.goto(base, { waitUntil: 'networkidle' });
  const start = await motion.locator('.skills-track').evaluate(element => element.scrollLeft);
  await motion.waitForTimeout(1200);
  const moved = await motion.locator('.skills-track').evaluate(element => element.scrollLeft);
  assert.ok(moved > start + 5, 'Marquee moves smoothly');
  await motion.getByRole('button', { name: 'Pause skills animation', exact: true }).click();
  const pausedAt = await motion.locator('.skills-track').evaluate(element => element.scrollLeft);
  await motion.waitForTimeout(500);
  assert.equal(await motion.locator('.skills-track').evaluate(element => element.scrollLeft), pausedAt, 'Pause stops marquee');
  await motion.getByRole('button', { name: 'Play skills animation', exact: true }).click();
  await motion.waitForTimeout(400);
  assert.ok(await motion.locator('.skills-track').evaluate(element => element.scrollLeft) > pausedAt, 'Play resumes marquee');
  await motion.emulateMedia({ reducedMotion: 'reduce' });
  await motion.waitForFunction(() => document.querySelectorAll('.skill-card').length === 11);
  assert.equal(await motion.locator('.skill-card').count(), 11, 'Live preference changes remove duplicated cards');
  assert.equal(await motion.locator('.motion-toggle').count(), 0);
  assert.deepEqual(failures, [], 'No uncaught browser errors');
  console.log('PASS animation playback and live reduced-motion preference changes');
} finally {
  await browser.close();
}
