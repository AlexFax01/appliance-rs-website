// Isolated PHP transport tests: no external email, no changes to the release package.
import {mkdtemp, mkdir, cp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {randomBytes} from 'node:crypto';
const runtime=process.env.PHP_TEST_RUNTIME;
if(!runtime) throw new Error('Set PHP_TEST_RUNTIME to a FrankenPHP executable');
const root=await mkdtemp(join(tmpdir(),'appliance-php-test-'));
await mkdir(join(root,'vendor'));
await cp('hosting/php/contact.php',join(root,'contact.php'));
await cp('src/content/problems.json',join(root,'problems.json'));
await cp('tests/php/mail-stub.php',join(root,'vendor/autoload.php'));
const capture=join(root,'capture.json');
const child=spawn(runtime,['php-server','--root',root,'--listen','127.0.0.1:3199'],{env:{...process.env,SMTP_HOST:'local-test',SMTP_USER:'local-test',SMTP_PASS:'local-test',CONTACT_FROM_EMAIL:'qa@example.invalid',TEST_MAIL_CAPTURE:capture},stdio:'ignore'});
const valid={name:'Local QA',phone:'8645550123',email:'',applianceType:'washer-dryer',selectedProblemIds:['dryer-not-heating'],problem:'',brand:'QA',model:'TEST-123',address:'123 Main St, Greenville, SC',zipCode:'99999',bestTime:'Anytime',preferredContact:'call',consent:true,formStartedAt:1};
let checks=0;
async function send(payload=valid,count=0,bytes,mime='image/webp'){
 const form=new FormData();form.append('payload',JSON.stringify(payload));
 const photo=bytes || await readFile('public/images/hero/hero-800.webp');
 for(let i=0;i<count;i++)form.append('photos[]',new Blob([photo],{type:mime}),`photo-${i}.webp`);
 return fetch('http://127.0.0.1:3199/contact.php',{method:'POST',body:form});
}
try{
 for(let i=0;i<50;i++){try{await fetch('http://127.0.0.1:3199/contact.php');break;}catch{await new Promise(resolve=>setTimeout(resolve,100));}}
 for(const n of [0,1,3]){assert.equal((await send(valid,n)).status,200);const mail=JSON.parse(await readFile(capture,'utf8'));assert.equal(mail.attachments.length,n);assert.match(mail.body,/TEST-123/);checks++;}
 assert.equal((await send(valid,4)).status,400);checks++;
 const detailed=await sharp(randomBytes(1536*1152*3),{raw:{width:1536,height:1152,channels:3}}).jpeg({quality:70}).toBuffer();
 assert.equal((await send(valid,1,detailed,'image/jpeg')).status,200);assert.ok(JSON.parse(await readFile(capture,'utf8')).attachments[0].size<=1_000_000);checks++;
 assert.equal((await send(valid,1,Buffer.from('bad'),'image/jpeg')).status,400);checks++;
 assert.equal((await send(valid,1,Buffer.alloc(1_000_001))).status,400);checks++;
 assert.equal((await send({...valid,selectedProblemIds:['fridge-not-cooling']})).status,400);checks++;
 assert.equal((await send({...valid,problem:'FAIL_MAIL'})).status,502);checks++;
 assert.equal((await fetch('http://127.0.0.1:3199/contact.php',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...valid,selectedProblemIds:[],problem:'Legacy JSON request.'})})).status,200);checks++;
 assert.equal((await fetch('http://127.0.0.1:3199/contact.php',{method:'POST',headers:{'content-type':'application/json'},body:'x'.repeat(4_000_001)})).status,413);checks++;
 console.log(`${checks} PHP checks passed (isolated mock mail transport).`);
}finally{child.kill('SIGTERM');await new Promise(resolve=>child.once('exit',resolve));await rm(root,{recursive:true,force:true});}
