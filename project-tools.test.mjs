import fs from 'node:fs';

const store=new Map();
globalThis.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,String(value))};
globalThis.window=globalThis;
globalThis.window.fetch=async()=>({ok:true});
globalThis.document={querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({className:'',dataset:{},style:{},setAttribute(){},append(){},appendChild(){},querySelector(){return null},addEventListener(){},click(){}}),head:{append(){}},body:{append(){}},documentElement:{},addEventListener(){}};
globalThis.MutationObserver=class{observe(){} disconnect(){}};

let code=fs.readFileSync(new URL('./project-tools.js',import.meta.url),'utf8');
code=code.replace(/nxProjectStyles\(\);nxProjectInstallFetch\(\);nxProjectWatchPuter\(\);nxProjectEnhance\(\);const nxProjectObserver=[\s\S]*$/,'');
code+='\nglobalThis.__projectTest={nxProjectAllowed,nxProjectRedact,nxProjectBuildPack,nxProjectState,nxProjectBaseScore};';
(0,eval)(code);
const t=globalThis.__projectTest;
const fake=(name,size=100)=>({name,size,webkitRelativePath:name});

if(t.nxProjectAllowed('.env',fake('.env')))throw new Error('.env accepted');
if(t.nxProjectAllowed('node_modules/pkg/index.js',fake('node_modules/pkg/index.js')))throw new Error('node_modules accepted');
if(!t.nxProjectAllowed('src/auth/login.ts',fake('src/auth/login.ts')))throw new Error('source file rejected');
const red=t.nxProjectRedact("const api_key='sk-abcdefghijklmnop'; const password='supersecret123';");
if(red.includes('sk-abcdefghijklmnop')||red.includes('supersecret123'))throw new Error('secret redaction failed');

t.nxProjectState.root='demo';
t.nxProjectState.files=[
  {path:'src/auth/login.ts',text:'export function login user session jwt authentication access control',size:1200,baseScore:t.nxProjectBaseScore('src/auth/login.ts')},
  {path:'src/components/Button.tsx',text:'button visual component styles click',size:800,baseScore:t.nxProjectBaseScore('src/components/Button.tsx')},
  {path:'README.md',text:'demo project overview installation',size:700,baseScore:t.nxProjectBaseScore('README.md')}
];
const pack=t.nxProjectBuildPack('debug authentication login and session access');
if(pack.items[0]?.path!=='src/auth/login.ts')throw new Error('relevance ranking failed');
if(!pack.text.includes('src/auth/login.ts'))throw new Error('selected file missing');

console.log('Project Lens smoke test passed');