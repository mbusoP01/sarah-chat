import fs from 'node:fs';

const store=new Map();
globalThis.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,String(value))};
globalThis.window=globalThis;
globalThis.window.fetch=async()=>({ok:true});
globalThis.document={querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({className:'',dataset:{},style:{},append(){},appendChild(){},querySelector(){return null},addEventListener(){}}),head:{append(){}},body:{append(){}},documentElement:{},addEventListener(){}};
globalThis.MutationObserver=class{observe(){} disconnect(){}};
globalThis.prompt=()=>null;

let code=fs.readFileSync(new URL('./context-engine.js',import.meta.url),'utf8');
code=code.replace(/nxContextAddStyles\(\);nxContextInstallFetchHook\(\);nxContextWatchPuter\(\);nxContextEnhance\(\);const nxContextObserver=[\s\S]*$/,'');
code+='\nglobalThis.__contextTest={nxContextBuildPack,nxContextInjectPrompt};';
(0,eval)(code);

localStorage.setItem('nexal-v3-active','current');
localStorage.setItem('nexal-v3-conversations',JSON.stringify([
  {id:'current',title:'Current',updated:Date.now(),messages:[{role:'user',content:'How should I improve Nexal memory?',ts:Date.now()}]},
  {id:'old1',title:'Nexal architecture',updated:Date.now()-1000,messages:[{role:'user',content:'I want Nexal to reduce context blindness and remember project decisions across chats.',ts:Date.now()-1000}]},
  {id:'old2',title:'Secret',updated:Date.now()-2000,messages:[{role:'user',content:'My password: FinalQA-Temporary-2026! and API key: sk-secretsecretsecret',ts:Date.now()-2000}]}
]));
localStorage.setItem('nexal-v3-context-memory',JSON.stringify([{id:'p1',title:'Goal',source:'Manual pin',text:'Prioritize intellectual autonomy and strong cross-chat project context for Nexal.',ts:Date.now()}]));

const query='Improve Nexal context memory and reduce context blindness';
const pack=globalThis.__contextTest.nxContextBuildPack(query);
if(!pack.items.some(item=>item.title==='Nexal architecture'))throw new Error('Relevant prior conversation was not recalled.');
if(pack.text.includes('FinalQA-Temporary'))throw new Error('Likely secret leaked into automatic recall.');
const prompt=`### System:\nBe useful.\n\n### User:\n${query}\n\n### Assistant:\n`;
const injected=globalThis.__contextTest.nxContextInjectPrompt(prompt);
if(!injected.includes('### Persistent Context'))throw new Error('Persistent context block was not injected.');
if(!injected.includes('Nexal architecture'))throw new Error('Recall provenance was not preserved.');

console.log('Context Engine smoke test passed');