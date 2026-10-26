(function(){
if(new URLSearchParams(location.search).get('rivalIntroPreview')!=='1')return;
window.RivalIntroPreview=true;
const memory=()=>{const data=new Map();return {get length(){return data.size},key:i=>[...data.keys()][i]??null,getItem:k=>data.get(String(k))??null,setItem:(k,v)=>data.set(String(k),String(v)),removeItem:k=>data.delete(String(k)),clear:()=>data.clear()};};
Object.defineProperty(window,'localStorage',{value:memory()});Object.defineProperty(window,'sessionStorage',{value:memory()});
localStorage.setItem('idle-spiker-language-v1','tr');localStorage.setItem('idle-spiker-country-v1','TR');
localStorage.setItem('idle-spiker-onboarding-v1',JSON.stringify(['tap','arrival','blocks-basics','assistant','train','player-stats','match','quick-upgrade']));
const show=HTMLDialogElement.prototype.showModal;HTMLDialogElement.prototype.showModal=function(){if(this.id==='gameMatchDialog')return show.call(this);};
})();
