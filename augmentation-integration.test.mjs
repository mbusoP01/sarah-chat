import fs from 'node:fs';

const store=new Map();
globalThis.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,String(value))};
let captured=null;
globalThis.window=globalThis;
globalThis.window.fetch=async(input,init)=>{captured={input,init};return {ok:true,text:async()=>'{"id":"x"}'}};
globalThis.window.addEventListener=()=>{};
const dummy=()=>({className:'',dataset:{},style:{},innerHTML:'',textContent:'',setAttribute(){},append(){},appendChild(){},remove(){},querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},click(){}});
globalThis.document={querySelector:()=>null,querySelectorAll:()=>[],createElement:dummy,head:{append(){}},body:{append(){}},documentElement:{},addEventListener(){}};
globalThis.MutationObserver=class{observe(){} disconnect(){}};
globalThis.prompt=()=>null;

localStorage.setItem('nexal-v3-active','current');
localStorage.setItem('nexal-v3-conversations',JSON.stringify([
  {id:'current',title:'Current',updated:Date.now(),messages:[{role:'user',content:'inspect auth bug',ts:Date.now()}]},
  {id:'past',title:'Architecture',updated:Date.now()-1000,messages:[{role:'user',content:'Nexal auth uses owner access and project context should preserve relevant decisions.',ts:Date.now()-1000}]},
  {id:'secret',title:'Secret',updated:Date.now()-1000,messages:[{role:'user',content:'password: DontLeakMe123 and API key: sk-abcdefghijklmnop',ts:Date.now()-1000}]}
]));
localStorage.setItem('nexal-v3-context-memory',JSON.stringify([{id:'p',title:'Auth goal',source:'Manual',text:'Preserve owner authentication while debugging project code.',ts:Date.now()}]));

for(const file of ['prompt-budget.js','context-engine.js','project-tools.js']){
  (0,eval)(fs.readFileSync(new URL(`./${file}`,import.meta.url),'utf8'));
}
window.NexalProjectLens.state.root='demo';
window.NexalProjectLens.state.files=[
  {path:'src/auth/login.ts',text:'export function login() { return verifyOwnerSession(); } authentication owner session',size:1000,baseScore:3},
  {path:'src/ui.ts',text:'export const button = true',size:500,baseScore:2}
];

const old=('### User:\nold context about unrelated UI\n\n### Assistant:\nold reply\n\n').repeat(220);
const prompt=`### System:\nBe useful and preserve current instructions.\n\n${old}### User:\ninspect auth bug and owner session\n\n### Assistant:\n`;
await window.fetch('https://aihorde.net/api/v2/generate/text/async',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,params:{max_context_length:1024,max_length:700}})});

if(!captured)throw new Error('base fetch not reached');
const data=JSON.parse(captured.init.body);
if(data.prompt.length>13200)throw new Error('final prompt budget exceeded');
if(data.params.max_context_length!==4096)throw new Error('context length was not upgraded after augmentation');
if(!data.prompt.includes('inspect auth bug and owner session'))throw new Error('latest request lost');
if(!data.prompt.includes('### Local Project Context'))throw new Error('project context missing');
if(!data.prompt.includes('src/auth/login.ts'))throw new Error('relevant project file missing');
if(!data.prompt.includes('### Persistent Context'))throw new Error('persistent context missing');
if(data.prompt.includes('DontLeakMe123')||data.prompt.includes('sk-abcdefghijklmnop'))throw new Error('secret history leaked');

console.log('Augmentation integration smoke test passed');