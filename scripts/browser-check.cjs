// npm install --no-save playwright; npx playwright install chromium
// Start python3 -m http.server 4173, then node scripts/browser-check.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 try {
 const page=await browser.newPage({viewport:{width:1280,height:900}}); const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto('http://127.0.0.1:4173/demo/');await page.locator('.cat:not([hidden])').waitFor();assert.match(await page.title(),/Homepage Cat/);
 await page.locator('.cat').click();await page.waitForFunction(()=>document.querySelector('.cat').classList.contains('is-running'));
 await page.waitForFunction(()=>document.querySelector('.cat').className==='cat');
 const r=await page.locator('.cat').boundingBox();await page.mouse.move(r.x+28,r.y+24);await page.mouse.down();await page.mouse.move(r.x-65,r.y+120,{steps:20});
 assert.match(await page.locator('.cat').getAttribute('class'),/is-held/);await page.mouse.up();
 await page.waitForFunction(()=>document.querySelector('.cat').dataset.surface);
 await page.waitForFunction(()=>document.querySelector('.cat').className==='cat',null,{timeout:30000});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.evaluate(async()=>{let rejected=false;try{(await import('/src/index.js')).createCat({track:'#home'})}catch{rejected=true}if(!rejected)throw Error('duplicate mount accepted')});
 await page.goto('http://127.0.0.1:4173/');
 await page.setContent('<main id="root"><div id="track" style="width:400px"></div><p>Words to walk on.</p></main><link rel="stylesheet" href="/src/homepage-cat.css">');
 await page.evaluate(async()=>{
 const {createCat}=await import('/src/index.js');
 for(let i=0;i<3;i++){const cat=createCat({track:'#track',root:'#root'});cat.reset();cat.destroy();cat.destroy();if(document.querySelector('.cat'))throw Error('cat leaked')}
 window.testCat=createCat({track:'#track',root:'#root'});window.testCat.element.focus();
 });
 await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('.cat').classList.contains('is-waking'));
 await page.evaluate(()=>window.testCat.destroy());await page.waitForTimeout(1400);assert.equal(await page.locator('.cat').count(),0);
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(async()=>{window.testCat=(await import('/src/index.js')).createCat({track:'#track',root:'#root'})});await page.locator('.cat').click();assert.equal(await page.locator('.cat').getAttribute('class'),'cat');assert.deepEqual(errors,[]);
 console.log('PASS: desktop, mobile layout, wake, drag, landing, return, lifecycle, keyboard, reduced motion');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
