(function(){
'use strict';
// Beta-only storage namespace: the production page never loads this file.
const native=window.localStorage,prefix='idlespiker-desktop-beta:',marker=prefix+'initialized';
try{
 if(!native.getItem(marker)){const entries=[];for(let i=0;i<native.length;i++){const key=native.key(i);if(!key.startsWith(prefix))entries.push([key,native.getItem(key)]);}for(const [key,value]of entries)native.setItem(prefix+key,value);native.setItem(marker,'1');}
 const keys=()=>{const out=[];for(let i=0;i<native.length;i++){const key=native.key(i);if(key.startsWith(prefix)&&key!==marker)out.push(key.slice(prefix.length));}return out;};
 const storage={getItem:key=>native.getItem(prefix+key),setItem:(key,value)=>native.setItem(prefix+key,String(value)),removeItem:key=>native.removeItem(prefix+key),clear:()=>keys().forEach(key=>native.removeItem(prefix+key)),key:index=>keys()[index]??null,get length(){return keys().length;}};
 Object.defineProperty(window,'localStorage',{value:new Proxy(storage,{get(target,key){return key in target?Reflect.get(target,key):target.getItem(String(key));},set(target,key,value){target.setItem(String(key),value);return true;},ownKeys:()=>keys(),getOwnPropertyDescriptor:()=>({configurable:true,enumerable:true})}),configurable:true});
}catch(error){throw new Error('Masaüstü beta için ayrı kayıt alanı açılamadı: '+error.message);}
})();
