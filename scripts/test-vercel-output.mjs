// Test the actual emitted ESM entrypoint, not just Vitest's module resolver.
// Requires `vercel build --prod`; intentionally disables real mail in this process.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
delete process.env.SMTP_HOST;
const {default:handler}=await import('../.vercel/output/functions/api/contact.func/api/contact.js');
assert.equal((await handler.fetch(new Request('http://localhost/api/contact'))).status,405);
const payload={name:'Controlled QA',phone:'8645550100',email:'',applianceType:'washer-dryer',selectedProblemIds:['dryer-not-heating'],problem:'',address:'123 Main St, Greenville, SC',zipCode:'99999',preferredContact:'call',bestTime:'Anytime',consent:true,formStartedAt:1};
const body=new FormData();body.set('payload',JSON.stringify(payload));body.append('photos[]',new Blob([await readFile('public/images/hero/hero-800.webp')],{type:'image/webp'}),'qa.webp');
const response=await handler.fetch(new Request('http://localhost/api/contact',{method:'POST',body}));
assert.equal(response.status,502);assert.equal((await response.json()).code,'delivery_not_configured');
console.log('Emitted Vercel function: GET 405; validated multipart 502 delivery_not_configured. No external mail.');
