import { test, expect } from '@playwright/test';

test('published GitHub Pages site loads its bundled assets and navigates', async ({ page }) => {
  test.skip(!process.env.LIVE_URL, 'Set LIVE_URL to explicitly check the published site.');
  test.setTimeout(90000);
  const failures: string[] = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await page.goto(process.env.LIVE_URL!, { waitUntil: 'networkidle', timeout: 60000 });
  await expect(page.locator('#slide-title')).toContainText('Before the shortfall.');
  await expect(page.locator('#scene')).toHaveClass(/scene-ready/, { timeout: 20000 });
  await page.keyboard.press('m');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#slide-number')).toHaveText('02');
  await page.keyboard.press('End');
  await expect(page.locator('#current-speaker')).toHaveText('Mariano');
  await page.keyboard.press('Home');
  await page.screenshot({ path: 'test-results/live-opening.png', fullPage: true });
  expect(failures).toEqual([]);
});
