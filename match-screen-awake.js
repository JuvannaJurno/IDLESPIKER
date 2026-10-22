(function(){
'use strict';
let watching=false,lock=null,pending=false,generation=0,suspended=false;
const wanted=()=>watching&&!document.hidden&&!suspended;
async function release(){
 generation++;
 const current=lock;lock=null;
 try{await current?.release();}catch{}
}
async function acquire(){
 if(!wanted()||lock||pending||!window.isSecureContext||!navigator.wakeLock?.request)return;
 const requestGeneration=generation;pending=true;
 try{
  const acquired=await navigator.wakeLock.request('screen');
  if(!wanted()||requestGeneration!==generation){await acquired.release();return;}
  lock=acquired;
  acquired.addEventListener('release',()=>{if(lock===acquired)lock=null;},{once:true});
 }catch{
  // A denied request must not interrupt the match or cause a retry loop.
 }finally{
  pending=false;
  if(requestGeneration!==generation&&wanted())acquire();
 }
}
window.MatchScreenAwake={setWatching(value){watching=!!value;if(watching)acquire();else release();}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)release();else acquire();});
window.addEventListener('pageshow',()=>{suspended=false;acquire();});
window.addEventListener('pagehide',()=>{suspended=true;release();});
// Retry after interaction if the operating system previously released the lock.
document.addEventListener('pointerdown',acquire,{passive:true});
})();
