import { test, expect } from '@playwright/test';

test('desktop renders real WebGL and records an opening screenshot', async ({ page }) => {
  const errors: string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await expect(page.locator('#slide-title')).toContainText('Before the shortfall.');
  await expect(page.locator('#scene')).toHaveClass(/scene-ready/, {timeout:20000});
  await page.waitForTimeout(1000);await page.screenshot({path:'test-results/desktop-opening.png'});
  expect(errors).toEqual([]);
});
test('every main slide names its part of the nine-part format', async ({ page }) => {
  await page.goto('/?static=1');
  for(let i=2;i<=17;i++){await page.goto('/?static=1#slide-'+i);await expect(page.locator('.part-label')).toContainText(/Part \d of 9/);}
  await page.goto('/?static=1#slide-16');await expect(page.locator('.part-label')).toContainText('Expected outcome and implementation');await expect(page.locator('#slide-title')).toContainText('Clear limits.');
});
test('main navigation, notes, appendix and keyboard limits', async ({ page }) => {
  await page.goto('/?static=1');await page.keyboard.press('ArrowRight');await expect(page.locator('#slide-number')).toHaveText('02');
  await page.keyboard.press('n');await expect(page.locator('#notes-dialog')).toBeVisible();await expect(page.locator('#notes-content')).toContainText('Soriano');
  await page.keyboard.press('Escape');await page.keyboard.press('End');await expect(page.locator('#slide-number')).toHaveText('17');
  await expect(page.locator('#next')).toBeDisabled();await page.keyboard.press('ArrowRight');await expect(page.locator('#slide-number')).toHaveText('17');
  await page.keyboard.press('o');await expect(page.locator('.overview-part')).toHaveCount(10);await page.locator('[data-slide="18"]').click();await expect(page.locator('#slide-number')).toHaveText('A2');
  await page.getByRole('button',{name:'Return to main presentation'}).click();await expect(page.locator('#slide-number')).toHaveText('17');
});
test('controls hide while the mouse is still and return on movement', async ({ page }) => {
  await page.goto('/?static=1');await page.mouse.move(200,200);await expect(page.locator('body')).not.toHaveClass(/idle/);
  await page.waitForTimeout(3000);await expect(page.locator('body')).toHaveClass(/idle/);
  await page.mouse.move(300,300);await expect(page.locator('body')).not.toHaveClass(/idle/);
});
test('timer starts, pauses, and resets explicitly', async ({ page }) => {
  await page.goto('/?static=1');await expect(page.locator('#timer')).toHaveText('20:00');await page.keyboard.press('t');await page.waitForTimeout(1200);
  await expect(page.locator('#timer-state')).toHaveText('Pause');await page.keyboard.press('t');await expect(page.locator('#timer-state')).toHaveText('Resume');
  const paused=await page.locator('#timer').textContent();await page.waitForTimeout(600);await expect(page.locator('#timer')).toHaveText(paused!);
  page.on('dialog',d=>d.accept());await page.locator('#timer-reset').click();await expect(page.locator('#timer')).toHaveText('20:00');
});
test('what-if labels unobserved values and does not consume range arrow keys', async ({ page }) => {
  await page.goto('/?static=1#slide-5');await page.locator('#simulator summary').click();
  await page.locator('#supply-input').fill('2700');await expect(page.locator('#balance-badge')).toHaveText('Yellow alert');
  await expect(page.locator('#what-if-label')).toContainText('not observed');await page.locator('#supply-input').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('#slide-number')).toHaveText('05');
  await page.locator('#sim-reset').click();await expect(page.locator('#balance-margin')).toContainText('77');await expect(page.locator('#balance-badge')).toHaveText('Red alert');
});
test('private presenter window syncs slides and timer', async ({ page }) => {
  await page.goto('/?static=1#slide-6');const popupPromise=page.waitForEvent('popup');await page.locator('#presenter').click();const popup=await popupPromise;
  await expect(popup.locator('#presenter-notes')).toContainText('Corpuz');await popup.locator('#next').click();await expect(page.locator('#slide-number')).toHaveText('07');
  await popup.locator('#timer-toggle').click();await expect(page.locator('#timer-state')).toHaveText('Pause');await page.keyboard.press('End');await expect(popup.locator('#presenter-slide h1')).toContainText('Connected evidence');
});
test('all slides stay within mobile width and remain readable', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});await page.goto('/?static=1');
  for(let i=1;i<=21;i++){await page.goto('/?static=1#slide-'+i);await expect(page.locator('#slide-title')).toBeVisible();const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);expect(overflow,'horizontal overflow on slide '+i).toBe(false);}
  await page.goto('/?static=1#slide-1');await page.screenshot({path:'test-results/mobile-opening.png',fullPage:true});
});
test('projector size fits all main slides without page scrolling', async ({ page }) => {
  await page.setViewportSize({width:1280,height:720});
  for(let i=1;i<=17;i++){await page.goto('/?static=1#slide-'+i);const overflow=await page.evaluate(()=>({vertical:document.documentElement.scrollHeight-innerHeight,horizontal:document.documentElement.scrollWidth-innerWidth}));expect(overflow.horizontal).toBeLessThanOrEqual(1);expect(overflow.vertical,'vertical overflow slide '+i).toBeLessThanOrEqual(2);}
});
test('reduced motion, static mode and print handout are supported', async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/?static=1');await expect(page.locator('#motion')).toHaveAttribute('aria-pressed','true');await expect(page.locator('.fallback-art')).toBeVisible();
  await page.emulateMedia({media:'print'});await expect(page.locator('#print-handout')).toBeVisible();await expect(page.locator('#print-handout .print-slide')).toHaveCount(22);await expect(page.locator('#print-handout .print-parts li')).toHaveCount(9);
  await page.pdf({path:'test-results/presentation-script.pdf',format:'A4',preferCSSPageSize:true,printBackground:false});
});
test('WebGL failure leaves a usable static deck', async ({page})=>{
  await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(this: HTMLCanvasElement,type: string,...args: unknown[]){if(type==='webgl'||type==='webgl2'||type==='experimental-webgl')return null;return Reflect.apply(original,this,[type,...args]);} as typeof original;});
  await page.goto('/');await expect(page.locator('.fallback-art')).toBeVisible();await page.keyboard.press('ArrowRight');await expect(page.locator('#slide-number')).toHaveText('02');
});
test('every 3D shot renders without errors and records visual checks',async({page})=>{
  test.setTimeout(120000);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('#scene')).toHaveClass(/scene-ready/,{timeout:20000});
  for(let n=1;n<=21;n++){await page.evaluate(n=>{location.hash='#slide-'+n;},n);await page.waitForTimeout(500);if([1,3,4,5,8,10,11,14,16,17].includes(n))await page.screenshot({path:`test-results/slide-${n}.png`});}
  expect(errors).toEqual([]);
});
