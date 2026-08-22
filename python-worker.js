const PYODIDE_VERSION='0.29.4';
const PYODIDE_BASE=`https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
let pyodide=null;
async function ensurePyodide(){
  if(pyodide)return pyodide;
  importScripts(PYODIDE_BASE+'pyodide.js');
  pyodide=await loadPyodide({indexURL:PYODIDE_BASE});
  return pyodide;
}
self.onmessage=async event=>{
  const {type,code,id}=event.data||{};
  if(type!=='run'||typeof code!=='string')return;
  const stdout=[],stderr=[];
  try{
    const py=await ensurePyodide();
    py.setStdout({batched:line=>stdout.push(line)});
    py.setStderr({batched:line=>stderr.push(line)});
    await py.loadPackagesFromImports(code);
    const raw=await py.runPythonAsync(code,{filename:'<nexal-python-lab>'});
    let result='';
    if(raw!==undefined&&raw!==null){
      try{result=typeof raw==='string'?raw:String(raw)}catch{result='[Python result]'}
      try{raw?.destroy?.()}catch{}
    }
    self.postMessage({id,ok:true,stdout:stdout.join('\n'),stderr:stderr.join('\n'),result});
  }catch(error){
    self.postMessage({id,ok:false,stdout:stdout.join('\n'),stderr:stderr.join('\n'),error:String(error?.stack||error?.message||error)});
  }finally{
    try{pyodide?.setStdout({})}catch{}
    try{pyodide?.setStderr({})}catch{}
  }
};
