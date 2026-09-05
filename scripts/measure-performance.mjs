import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {mkdir, writeFile} from 'node:fs/promises';
const url=process.argv[2] || 'http://127.0.0.1:3100/';
const label=process.argv[3] || 'next';
await mkdir('artifacts/performance',{recursive:true});
const samples=[];
for(let run=1;run<=5;run++){
 const chrome=await launch({chromeFlags:['--headless=new','--no-sandbox']});
 try{
  const result=await lighthouse(url,{port:chrome.port,output:'json',logLevel:'error',onlyCategories:['performance'],formFactor:'mobile',throttlingMethod:'devtools',disableStorageReset:false});
  const a=result.lhr.audits;
  const sample={run,score:result.lhr.categories.performance.score,lcp:a['largest-contentful-paint'].numericValue,cls:a['cumulative-layout-shift'].numericValue,tbt:a['total-blocking-time'].numericValue};
  samples.push(sample);console.log(JSON.stringify(sample));
  await writeFile(`artifacts/performance/${label}-${run}.json`,JSON.stringify(result.lhr));
 }finally{await chrome.kill();}
}
const median=key=>samples.map(s=>s[key]).sort((a,b)=>a-b)[2];
const summary={url,at:new Date().toISOString(),method:'Five isolated mobile Lighthouse runs; cold cache; applied DevTools mobile network/CPU throttling (not Lantern simulation)',samples,median:{lcp:median('lcp'),cls:median('cls'),tbt:median('tbt'),score:median('score')}};
await writeFile(`artifacts/performance/${label}-summary.json`,JSON.stringify(summary,null,2));console.log(JSON.stringify(summary.median));
