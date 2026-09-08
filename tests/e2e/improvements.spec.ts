import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import path from 'node:path';
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const categories=['refrigerator-freezer','ice-maker','washer-dryer','dishwasher-disposal','oven-cooktop','microwave'];
test('six appliance modals, keyboard focus, review tabs and no overflow',async({page},info)=>{
 await page.goto('/');
 await expect(page.locator('iframe')).toHaveCount(0);await expect(page.locator('.google-service-map')).toBeVisible();
 for(const value of categories){
  const card=page.locator(`[data-appliance="${value}"]`);await card.click();
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toBeVisible();
  await expect.poll(()=>dialog.locator('img').evaluate((img: HTMLImageElement)=>img.complete && img.naturalWidth>0)).toBe(true);
  await page.screenshot({path:`test-results/${info.project.name}-${value}-problems.png`,animations:'disabled'});
  await expect(dialog.locator('.problem-option')).toHaveCount(4);
  await dialog.getByRole('tab',{name:'Common problems'}).focus();await page.keyboard.press('ArrowRight');
  await expect(dialog.getByRole('tab',{name:/Customer reviews/})).toHaveAttribute('aria-selected','true');
  const count=await dialog.locator('.service-review').count();expect(count).toBe(value==='refrigerator-freezer'||value==='washer-dryer'?3:value==='ice-maker'||value==='dishwasher-disposal'?2:0);
  for(const key of ['Tab','Shift+Tab']) for(let i=0;i<12;i++){await page.keyboard.press(key);expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);}
  await page.screenshot({path:`test-results/${info.project.name}-${value}.png`,animations:'disabled'});
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(card).toBeFocused();
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('problem selections and ZIP transfer without erasing notes',async({page})=>{
 await page.goto('/');await page.locator('[name=problem]').fill('Please keep these independent notes.');
 await page.locator('[data-appliance="washer-dryer"]').click();
 const dialog=page.getByRole('dialog');await dialog.locator('.problem-option').nth(1).click();await dialog.locator('.problem-option').nth(2).click();
 await expect(dialog.getByRole('link',{name:'Call now'})).toHaveAttribute('href','tel:+18649244349');
 await dialog.getByRole('button',{name:'Request repair'}).click();
 await expect(page.locator('[name=applianceType]')).toHaveValue('washer-dryer');
 await expect(page.locator('.selected-problems [aria-pressed=true]')).toHaveCount(2);
 await page.locator('[name=applianceType]').selectOption('microwave');await expect(page.locator('[name=problem]')).toHaveValue('Please keep these independent notes.');
 await expect(page.locator('.selected-problems [aria-pressed=true]')).toHaveCount(0);
 await page.locator('.coverage-input input').fill('29601');
 await expect(page.locator('.coverage-result')).toContainText('Your ZIP is in our listed service area.');await expect(page.locator('[name=zipCode]')).toHaveValue('29601');
 await page.locator('.coverage-input input').fill('99999');await expect(page.locator('.coverage-result')).toContainText('Please contact us');await expect(page.locator('[name=zipCode]')).toHaveValue('99999');
 await expect(page.locator('iframe')).toHaveAttribute('src',/12206806783937162522/);await expect(page.locator('iframe')).toHaveAttribute('loading','lazy');
});
test('photo preparation, limit and prepared SMS retention',async({page})=>{
 await page.goto('/');await page.locator('[name=name]').fill('Controlled QA');await page.locator('[name=phone]').fill('8645550123');await page.locator('[name=address]').fill('123 Main St, Greenville, SC');await page.locator('[name=zipCode]').fill('29601');await page.locator('[name=problem]').fill('Please preserve my test request.');await page.locator('[name=consent]').check();
 const photo=path.resolve('public/images/hero/hero-800.webp');
 await page.locator('#repair-photos').setInputFiles([photo,photo,photo]);await expect(page.locator('.photo-preview')).toHaveCount(3);
 await page.locator('#repair-photos').setInputFiles(photo);await expect(page.locator('#photo-feedback')).toContainText('up to 3');
 await page.locator('.photo-preview button').first().click();await expect(page.locator('.photo-preview')).toHaveCount(2);
 await page.locator('#repair-photos').setInputFiles({name:'bad.heic',mimeType:'image/heic',buffer:Buffer.from('not a real HEIC')});await expect(page.locator('#photo-feedback')).toContainText('JPEG');
 await page.getByRole('button',{name:'Review & open SMS'}).click();await expect(page.locator('.form-notice')).toContainText('ready');await expect(page.locator('.photo-preview')).toHaveCount(2);await expect(page.locator('[name=problem]')).toHaveValue('Please preserve my test request.');
 const sms=await page.locator('#sms-ready-link').getAttribute('href');expect(sms).toMatch(/^sms:\+18649244349[?&]body=/);expect(decodeURIComponent(sms!)).toContain('Name: Controlled QA');expect(decodeURIComponent(sms!)).toContain('Service address: 123 Main St, Greenville, SC');expect(decodeURIComponent(sms!)).toContain('I selected 2 photos');
});
test('pricing, reduced motion and accessibility',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.locator('.price-card').click();
 await expect(page.getByRole('dialog')).toContainText('$85');expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);await page.keyboard.press('Escape');
 await page.locator('[data-appliance="refrigerator-freezer"]').click();await expect(page.getByRole('dialog')).toBeVisible();expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);await page.keyboard.press('Escape');
 expect(await page.locator('.hero-picture').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
});
test('selected-only request and readable model photo',async({page},info)=>{
 await page.goto('/');await page.locator('[data-appliance="washer-dryer"]').click();
 const dialog=page.getByRole('dialog');await dialog.locator('.problem-option').nth(1).click();await dialog.locator('.service-dialog-cta').click();
 await page.locator('[name=name]').fill('Controlled QA');await page.locator('[name=phone]').fill('8645550123');await page.locator('[name=address]').fill('456 Oak Ave, Greer, SC');await page.locator('[name=zipCode]').fill('99999');await page.locator('[name=consent]').check();
 const buffer=await sharp(Buffer.from('<svg width="3200" height="2400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><text x="250" y="800" font-size="150" font-family="Arial">MODEL: WRS325SDHZ08</text><text x="250" y="1100" font-size="150" font-family="Arial">SERIAL: QA-123456789</text></svg>')).png().toBuffer();
 await page.locator('#repair-photos').setInputFiles({name:'model-label.png',mimeType:'image/png',buffer});await expect(page.locator('.photo-preview')).toHaveCount(1);
 const preview=page.locator('.photo-preview img');const processed=Buffer.from(await preview.evaluate(async image=>new Uint8Array(await (await fetch((image as HTMLImageElement).src)).arrayBuffer())));await mkdir('artifacts',{recursive:true});await writeFile(`artifacts/model-photo-${info.project.name}.jpg`,processed);expect(processed.byteLength).toBeLessThanOrEqual(1_000_000);
 await page.getByRole('button',{name:'Review & open SMS'}).click();await expect(page.locator('.form-notice')).toContainText('ready');await expect(page.locator('.photo-preview')).toHaveCount(1);const sms=decodeURIComponent((await page.locator('#sms-ready-link').getAttribute('href'))!);expect(sms).toContain('Common problems: Dryer not heating');
});

test('mobile menu, persistent contact and lazy map are usable',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 const menu=page.getByRole('button',{name:'Toggle navigation'});await menu.click();await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeVisible();
 await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Appliances We Repair'}).click();await expect(page).toHaveURL(/#appliances$/);await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toHaveCount(0);await expect(page.locator('#appliances')).toBeInViewport();
 await menu.click();await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Service Areas'}).click();await expect(page).toHaveURL(/#areas$/);await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toHaveCount(0);await expect(page.locator('#areas')).toBeInViewport();
 await expect(page.locator('.google-service-map')).toBeVisible();await expect(page.locator('.service-city-link')).toHaveCount(19);await expect(page.locator('.service-city-link').first()).toContainText('Greenville');await expect(page.locator('.service-city-link').last()).toContainText('Moore');await expect(page.locator('iframe')).toBeVisible();
 await page.getByRole('button',{name:'Inman'}).click();await expect(page.locator('.pulse-city-card')).toContainText('Inman, SC');await expect(page.locator('.pulse-city-card')).toContainText('29349');await expect(page.locator('.pulse-city-card')).not.toContainText('directions');
 await page.getByRole('button',{name:'Explore Google map'}).click();await expect(page.locator('.pulse-visual-layer')).toHaveCount(0);await page.getByRole('button',{name:'Show service pulse'}).click();await expect(page.locator('.pulse-visual-layer')).toBeVisible();
 await expect(page.locator('.mobile-contact-bar .mobile-call')).toHaveAttribute('href','tel:+18649244349');await expect(page.locator('.mobile-contact-bar')).not.toContainText('Text');await expect(page.locator('.mobile-contact-bar')).toContainText('Request callback');
 await page.evaluate(() => document.querySelector<HTMLButtonElement>('.header-cta')?.click());await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('dialog').getByRole('link',{name:'Send a text'})).toHaveCount(0);await expect(page.getByRole('dialog').getByRole('button',{name:'Request a callback'})).toBeVisible();await page.getByRole('button',{name:'Close contact options'}).click();
 await page.locator('[data-appliance="refrigerator-freezer"]').click();const dialog=page.getByRole('dialog');await expect(dialog.getByRole('button',{name:'Request repair'})).toBeVisible();await expect(dialog.getByRole('link',{name:'Call now'})).toBeVisible();
});

test('service areas are ranked and visually tiered',async({page})=>{
 await page.goto('/');const areas=page.locator('.area-list li');await expect(areas).toHaveCount(10);
 await expect(areas.nth(0)).toContainText('Greenville');await expect(areas.nth(1)).toContainText('Spartanburg');await expect(areas.nth(2)).toContainText('Greer');
 await expect(areas.nth(0)).toHaveClass(/area-large/);await expect(areas.nth(4)).toHaveClass(/area-large/);await expect(areas.nth(5)).toHaveClass(/area-medium/);await expect(areas.nth(8)).toHaveClass(/area-small/);
 const sizes=await Promise.all([0,5,8].map(index=>areas.nth(index).evaluate(node=>Number.parseFloat(getComputedStyle(node).fontSize))));expect(sizes[0]).toBeGreaterThan(sizes[1]);expect(sizes[1]).toBeGreaterThan(sizes[2]);
});
