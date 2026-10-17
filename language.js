(function(){
'use strict';
const key='idle-spiker-language-v1',supported=['tr','en'];
let saved=null;try{saved=localStorage.getItem(key)}catch{}
let language=supported.includes(saved)?saved:'tr',resolveReady;
const ready=new Promise(resolve=>{resolveReady=resolve});
const exact=new Map(window.SpikerEnglish||[]),sources=new WeakMap(),attributes=new WeakMap(),cache=new Map(),originalTitle=document.title;
for(const [source,target]of [...exact]){
 for(const [from,to]of [[source.toLocaleLowerCase('tr'),target.toLowerCase()],[source.toLocaleUpperCase('tr'),target.toUpperCase()]])if(!exact.has(from))exact.set(from,to);
}
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const exactOnly=new Set(['Güneş','Yıldız','Zirve','File','Ad','Per','Son'].flatMap(s=>[s,s.toLocaleUpperCase('tr'),s.toLocaleLowerCase('tr')]));
const phrases=[...exact.keys()].filter(key=>!exactOnly.has(key)).sort((a,b)=>b.length-a.length);
const pattern=new RegExp('(?<![\\p{L}\\p{N}])(?:'+phrases.map(escape).join('|')+')(?![\\p{L}\\p{N}])','gu');
const templates=(window.SpikerEnglishTemplates||[]).map(([source,target])=>[new RegExp(escape(source).replace(/\\\{([ns])\\\}/g,(_,type)=>type==='n'?'([\\d.,]+(?:[kmb])?)':'(.+?)'),'gu'),target]);
const skip='script,style,textarea,input,[contenteditable],canvas,svg,[data-no-translate],.card-name,.lineup-preview-player strong,#playerName,#firstName,#lastName,.league-player-name';
function text(value){
 if(language==='tr'||!value||!value.trim())return value;
 if(cache.has(value))return cache.get(value);
 const trimmed=value.trim();let translated=exact.get(trimmed);
 if(translated!==undefined)translated=value.replace(trimmed,translated);
 else {
  translated=value;const resolved=[];
  for(const [expression,target]of templates)translated=translated.replace(expression,(...args)=>{let index=1;resolved.push(target.replace(/\{[ns]\}/g,()=>args[index++]));return '\uE000'+(resolved.length-1)+'\uE001'});
  translated=translated.replace(pattern,match=>exact.get(match));
  translated=translated.replace(/\uE000(\d+)\uE001/g,(_,index)=>resolved[Number(index)]);
 }
 translated=translated.replace(/\/sn\b/g,'/sec').replace(/\/talimat\b/g,'/instruction');
 translated=translated.replace(/Level (\d+)’(?:da|de) açılır/g,'Unlocks at level $1').replace(/(\d+)\. (?:day|GÜN)/g,'Day $1').replace(/(\d+) (?:day|game day) sonra/g,'In $1 days').replace(/(\d+)\. maç/g,'Match $1').replace(/(\d+)\. sıra/g,'Rank $1');
 if(cache.size>4000)cache.clear();cache.set(value,translated);return translated;
}
function nameNode(node){
 const el=node.parentElement;if(!el||el.closest(skip))return true;
 // Display names stay identical in both languages, including surnames such as Gün.
 const value=node.data.trim();
 if(window.TeamRules?.players?.some(p=>value===p.name||value===p.surname||value===p.name+' '+p.surname))return true;
 if(window.LeagueRules?.teams?.includes(value))return true;
 return false;
}
function translateNode(node){
 if(nameNode(node))return;
 const last=sources.get(node),original=last&&node.data===last.output?last.original:node.data;
 const output=text(original);if(node.data!==output)node.data=output;
 sources.set(node,{original,output});
}
function translateAttributes(el){
 if(el.closest(skip))return;
 let map=attributes.get(el);if(!map){map={};attributes.set(el,map)}
 for(const name of ['title','placeholder','aria-label']){
  if(!el.hasAttribute(name))continue;
  const value=el.getAttribute(name),last=map[name],original=last&&value===last.output?last.original:value,output=text(original);
  if(value!==output)el.setAttribute(name,output);map[name]={original,output};
 }
}
function walk(root){
 if(root.nodeType===3){translateNode(root);return}
 if(root.nodeType!==1&&root.nodeType!==9)return;
 if(root.nodeType===1){if(root.matches(skip))return;translateAttributes(root)}
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
 let node;while(node=walker.nextNode()){
  if(node.nodeType===3)translateNode(node);else translateAttributes(node);
 }
}
let observer;
function observe(){observer?.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','placeholder','aria-label']})}
function refresh(){observer?.disconnect();document.documentElement.lang=language;walk(document);document.title=text(originalTitle);document.querySelectorAll('[data-language-control]').forEach(el=>el.value=language);observe()}
function choose(value,persist=true){
 if(!supported.includes(value))return;
 language=value;cache.clear();if(persist)try{localStorage.setItem(key,value)}catch{}
 refresh();document.getElementById('languageChoice')?.close();resolveReady();
 window.dispatchEvent(new CustomEvent('spiker-language-changed',{detail:{language}}));
 const frame=document.getElementById('gameMatchFrame');if(frame?.contentWindow)frame.contentWindow.postMessage({type:'spiker-language',language},'*');
}
window.GameLanguage={get current(){return language},ready,text,set:choose,refresh};
window.addEventListener('storage',event=>{if(event.key===key&&supported.includes(event.newValue))choose(event.newValue,false)});
window.addEventListener('message',event=>{if(window.parent!==window&&event.source===parent&&event.data?.type==='spiker-language')choose(event.data.language,false)});
function init(){
 const settings=document.getElementById('settingsDialog');
 if(settings){
  const row=document.createElement('label');row.className='settings-row language-settings';row.htmlFor='languageSelect';row.innerHTML='<span data-no-translate>Language / Dil</span><select id="languageSelect" data-language-control data-no-translate><option value="tr">Türkçe</option><option value="en">English</option></select>';
  settings.querySelector('h2').after(row);row.querySelector('select').value=language;row.querySelector('select').onchange=event=>choose(event.target.value);
 }
 observer=new MutationObserver(records=>{
  observer.disconnect();const roots=new Set();
  for(const record of records){if(record.type==='childList'){for(const node of record.addedNodes)roots.add(node)}else roots.add(record.target)}
  for(const root of roots)if(root.isConnected)walk(root);
  observe();
 });
 refresh();
 if(settings&&!supported.includes(saved)){
  clearTimeout(window.bootFallback);
  const dialog=document.createElement('dialog');dialog.id='languageChoice';dialog.setAttribute('aria-labelledby','languageChoiceTitle');dialog.setAttribute('data-no-translate','');
  dialog.innerHTML='<span class="language-brand">IDLE<span>SPIKER</span></span><img src="ball_volley1.png" width="42" height="42" alt=""><h1 id="languageChoiceTitle">Hoş geldin · Welcome</h1><p>Dilini seç / Choose your language</p><div class="language-options"><button type="button" data-language="tr"><strong>Türkçe</strong><small>Oynamaya başla →</small></button><button type="button" data-language="en"><strong>English</strong><small>Start playing →</small></button></div><p class="language-note">Dili ayarlardan değiştirebilirsin.<br>You can change the language in settings.</p>';
  document.body.append(dialog);dialog.addEventListener('cancel',event=>event.preventDefault());dialog.querySelectorAll('[data-language]').forEach(button=>button.onclick=()=>choose(button.dataset.language));dialog.showModal();
 }else resolveReady();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
