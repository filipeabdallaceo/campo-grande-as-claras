import {chromium} from '@playwright/test';
import {mkdir,copyFile,readdir} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
await mkdir('identidade-visual',{recursive:true});
for(const file of await readdir('public/brand')){
 if(!file.endsWith('.svg'))continue;
 const w=file.includes('horizontal')?1288:file.includes('vertical')?960:512;
 const h=file.includes('horizontal')?400:file.includes('vertical')?606:512;
 await page.setViewportSize({width:w,height:h});
 await page.goto('http://127.0.0.1:4173/brand/'+file);
 await page.locator('svg').evaluate((el,{w,h})=>{el.setAttribute('width',w);el.setAttribute('height',h);}, {w,h});
 await page.screenshot({path:'public/brand/'+file.replace('.svg','.png'),omitBackground:true});
}
await page.setViewportSize({width:180,height:180});
await page.goto('http://127.0.0.1:4173/brand/avatar.svg');
await page.locator('svg').evaluate(el=>{el.setAttribute('width','180');el.setAttribute('height','180')});
await page.screenshot({path:'public/brand/apple-touch-icon.png',omitBackground:true});
await page.setViewportSize({width:1200,height:630});
await page.goto('http://127.0.0.1:4173/brand/social-card.html');await page.evaluate(()=>document.fonts.ready);
await page.screenshot({path:'public/brand/social-card.png'});
await page.setViewportSize({width:1120,height:900});
await page.goto('http://127.0.0.1:4173/brand/guia.html');await page.evaluate(()=>document.fonts.ready);
await page.pdf({path:'identidade-visual/Guia-da-marca.pdf',format:'A4',printBackground:true});
await page.screenshot({path:'identidade-visual/Identidade-visual.png',fullPage:true});
await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:4173/');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'identidade-visual/Site-desktop.png'});
await page.setViewportSize({width:390,height:844});await page.reload();await page.screenshot({path:'identidade-visual/Site-celular.png'});
await browser.close();
console.log('PNG, cartão social, guia PDF e prévias exportados.');
