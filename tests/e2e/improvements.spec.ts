import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import path from 'node:path';
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const categories=['refrigerator-freezer','ice-maker','washer-dryer','dishwasher-disposal','oven-cooktop','microwave'];
test('six appliance modals, keyboard focus, review tabs and no overflow',async({page},info)=>{
 await page.goto('/');
 expect(await page.locator('iframe').count()).toBe(0);
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
 await dialog.getByRole('button',{name:/Request .* repair/}).click();
 await expect(page.locator('[name=applianceType]')).toHaveValue('washer-dryer');
 await expect(page.locator('.selected-problems [aria-pressed=true]')).toHaveCount(2);
 await page.locator('[name=applianceType]').selectOption('microwave');await expect(page.locator('[name=problem]')).toHaveValue('Please keep these independent notes.');
 await expect(page.locator('.selected-problems [aria-pressed=true]')).toHaveCount(0);
 await page.locator('.coverage-input input').fill('29601');await page.getByRole('button',{name:'Check my area'}).click();
 await expect(page.locator('.coverage-result')).toContainText('Your ZIP is in our listed service area.');await expect(page.locator('[name=zipCode]')).toHaveValue('29601');
 await page.locator('.coverage-input input').fill('99999');await page.getByRole('button',{name:'Check my area'}).click();await expect(page.locator('.coverage-result')).toContainText('Please contact us');await expect(page.locator('[name=zipCode]')).toHaveValue('99999');
 await page.getByRole('button',{name:/Open interactive map/}).click();await expect(page.locator('iframe')).toHaveAttribute('src',/12206806783937162522/);
});
test('photo preparation, limit, failure retention and retry',async({page})=>{
 let requests=0;
 await page.route('**/api/contact*',async route=>{requests++;await route.fulfill({status:requests===1?502:200,json:requests===1?{ok:false,message:'Controlled mail failure'}:{ok:true,requestId:'test-only'}});});
 await page.goto('/');await page.locator('[name=name]').fill('Controlled QA');await page.locator('[name=phone]').fill('8645550123');await page.locator('[name=zipCode]').fill('29601');await page.locator('[name=problem]').fill('Please preserve my test request.');await page.locator('[name=consent]').check();
 const photo=path.resolve('public/images/hero/hero-800.webp');
 await page.locator('#repair-photos').setInputFiles([photo,photo,photo]);await expect(page.locator('.photo-preview')).toHaveCount(3);
 await page.locator('#repair-photos').setInputFiles(photo);await expect(page.locator('#photo-feedback')).toContainText('up to 3');
 await page.locator('.photo-preview button').first().click();await expect(page.locator('.photo-preview')).toHaveCount(2);
 await page.locator('#repair-photos').setInputFiles({name:'bad.heic',mimeType:'image/heic',buffer:Buffer.from('not a real HEIC')});await expect(page.locator('#photo-feedback')).toContainText('JPEG');
 await page.getByRole('button',{name:'Request my callback'}).click();await expect(page.locator('.form-notice')).toContainText('Controlled mail failure');await expect(page.locator('.photo-preview')).toHaveCount(2);await expect(page.locator('[name=problem]')).toHaveValue('Please preserve my test request.');
 await page.getByRole('button',{name:'Request my callback'}).click();await expect(page.locator('.form-notice')).toContainText('your request was sent');await expect(page.locator('.photo-preview')).toHaveCount(0);
});
test('pricing, reduced motion and accessibility',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.locator('.price-card').click();
 await expect(page.getByRole('dialog')).toContainText('$85');expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);await page.keyboard.press('Escape');
 await page.locator('[data-appliance="refrigerator-freezer"]').click();await expect(page.getByRole('dialog')).toBeVisible();expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);await page.keyboard.press('Escape');
 expect(await page.locator('.hero-picture').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
});
test('selected-only request and readable model photo',async({page},info)=>{
 let captured=false;
 await page.route('**/api/contact*',async route=>{
  const form=await new Response(new Uint8Array(route.request().postDataBuffer()!),{headers:{'content-type':route.request().headers()['content-type']}}).formData();
  const payload=JSON.parse(String(form.get('payload')));expect(payload.problem).toBe('');expect(payload.selectedProblemIds).toEqual(['dryer-not-heating']);expect(payload.applianceType).toBe('washer-dryer');
  const photo=form.get('photos[]') as File;expect(photo.size).toBeLessThanOrEqual(1_000_000);
  await mkdir('artifacts',{recursive:true});await writeFile(`artifacts/model-photo-${info.project.name}.jpg`,Buffer.from(await photo.arrayBuffer()));captured=true;
  await route.fulfill({status:502,json:{ok:false,message:'Controlled retention check'}});
 });
 await page.goto('/');await page.locator('[data-appliance="washer-dryer"]').click();
 const dialog=page.getByRole('dialog');await dialog.locator('.problem-option').nth(1).click();await dialog.locator('.service-dialog-cta').click();
 await page.locator('[name=name]').fill('Controlled QA');await page.locator('[name=phone]').fill('8645550123');await page.locator('[name=zipCode]').fill('99999');await page.locator('[name=consent]').check();
 const buffer=await sharp(Buffer.from('<svg width="3200" height="2400" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="white"/><text x="250" y="800" font-size="150" font-family="Arial">MODEL: WRS325SDHZ08</text><text x="250" y="1100" font-size="150" font-family="Arial">SERIAL: QA-123456789</text></svg>')).png().toBuffer();
 await page.locator('#repair-photos').setInputFiles({name:'model-label.png',mimeType:'image/png',buffer});await expect(page.locator('.photo-preview')).toHaveCount(1);await page.getByRole('button',{name:'Request my callback'}).click();await expect(page.locator('.form-notice')).toContainText('Controlled retention');expect(captured).toBe(true);await expect(page.locator('.photo-preview')).toHaveCount(1);
});
