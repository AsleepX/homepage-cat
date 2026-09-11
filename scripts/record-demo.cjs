// Start the demo server, install Playwright, then node scripts/record-demo.cjs.
// Optional env: PLAYWRIGHT_MODULE, CHROME_PATH. Output: media/homepage-cat-demo.webm
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');const path=require('node:path');
(async()=>{
 const output=path.resolve(__dirname,'../media');
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const context=await browser.newContext({viewport:{width:1280,height:900},recordVideo:{dir:output,size:{width:1280,height:900}}});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4173/demo/');await page.locator('.cat:not([hidden])').waitFor();
 await page.evaluate(()=>{const c=document.createElement('div');c.style.cssText='position:fixed;top:0;left:0;width:16px;height:16px;border:2px solid #819768;border-radius:50%;background:#81976822;pointer-events:none;z-index:100;transform:translate(-30px,-30px)';document.body.append(c);addEventListener('pointermove',e=>{c.style.transform=`translate(${e.clientX-8}px,${e.clientY-8}px)`})});
 const caption=async text=>page.locator('#caption').evaluate((el,t)=>el.textContent=t,text);
 await caption('Homepage Cat · A little life on your page');await page.waitForTimeout(2600);
 await caption('Click to wake: stretch, stroll, and settle down');await page.locator('.cat').click();await page.waitForTimeout(6800);await page.locator('#reset').click();
 const drag=async(part,x,y)=>{const r=await page.locator('.cat').boundingBox();await page.mouse.move(r.x+part,r.y+24);await page.mouse.down();await page.mouse.move(x,y,{steps:45});await page.waitForTimeout(1600)};
 await caption('Pick it up by the body: watch those dangling paws');await drag(27,730,310);await page.mouse.up();await page.locator('#reset').click();
 await caption('Grab the head or tail for a different pose');await drag(45,730,305);await page.mouse.up();await page.locator('#reset').click();await drag(8,730,300);await page.mouse.up();await page.locator('#reset').click();
 await caption('Drop onto text: each paw follows the letter shapes');const h=await page.locator('.row h2').nth(1).boundingBox();await drag(27,h.x+210,h.y-21);await page.mouse.up();await page.waitForTimeout(1300);console.log('Text landing:',await page.locator('.cat').getAttribute('data-surface'));
 await caption('It finds a route, walks across ledges, and jumps home');await page.waitForFunction(()=>document.querySelector('.cat').className==='cat',null,{timeout:30000});await page.waitForTimeout(1600);
 await caption('One stylesheet + createCat() · Zero dependencies · MIT licensed');await page.waitForTimeout(3600);
 const video=page.video();await context.close();await video.saveAs(path.join(output,'homepage-cat-demo.webm'));await video.delete();await browser.close();console.log('Recorded homepage-cat-demo.webm');
})().catch(e=>{console.error(e);process.exitCode=1});
