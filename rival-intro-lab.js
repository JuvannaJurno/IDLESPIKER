(function(){
'use strict';
const arena=document.querySelector('.stage-card .arena'),frame=document.getElementById('matchPreview');if(!arena||!frame)return;
const open=document.createElement('button'),back=document.createElement('button');open.type=back.type='button';open.textContent='Oyuncu tanıtımı';open.id='labRivalIntro';back.textContent='Tanıtımı kapat';back.hidden=true;back.id='labRivalIntroBack';
const controls=document.createElement('div');controls.style.cssText='display:flex;gap:8px;flex-wrap:wrap;padding:10px 20px';for(const b of [open,back])b.style.cssText='border:1px solid var(--line);border-radius:10px;background:var(--paper);color:var(--ink);padding:9px 12px;cursor:pointer';controls.append(open,back);arena.before(controls);
let resume=false;
function install(){
 if(typeof previewDraw!=='function'||!window.RivalCalloutUI)return;
 const ui=RivalCalloutUI.create(),previous=previewDraw;let active=null,lastArgs=null,timer=null;
 function stop(){if(active===null)return;active=null;clearTimeout(timer);ui.hide();if(lastArgs)previous(...lastArgs);parent.postMessage({type:'lab-rival-intro-ended'},'*');}
 ui.box.querySelector('button').onclick=stop;
 previewDraw=function(...args){lastArgs=args;previous(...args);if(active===null)return;const actor=players.find(p=>p.index===active);if(!actor)return;ctx.save();ctx.fillStyle='#0b1c254d';ctx.fillRect(0,0,1000,620);drawPlayer(actor);ctx.restore();ui.place(actor,canvas);window.LabRivalIntroState={active:true,actor:actor.index};};
 window.addEventListener('message',e=>{if(e.source!==parent)return;if(e.data?.type==='lab-rival-intro-stop'){stop();window.LabRivalIntroState={active:false};}if(e.data?.type==='lab-rival-intro-start'){clearTimeout(timer);active=window.previewAuraActor??players.find(p=>p.team===1)?.index;ui.show('Melis Arıgöl','Zor Toplara Pas',e.data.portrait);if(e.data.args)previewDraw(...e.data.args);timer=setTimeout(()=>{stop();window.LabRivalIntroState={active:false};},3400);}});
}
// Extend the existing sandbox scene; no game URL or additional iframe is loaded.
frame.srcdoc=frame.srcdoc.replace('</body>','<script>('+install.toString()+')();</scr'+'ipt></body>');
open.onclick=()=>{if(back.hidden)resume=playing;playing=false;updatePlay();const args=[skills[selected].id,time/length,document.getElementById('effects').checked,document.getElementById('serveType').value,Number(document.getElementById('serveZone').value),serveImpactAge,saveAge,skills[selected].rarity];frame.contentWindow.postMessage({type:'lab-rival-intro-start',args,portrait:window.LabRivalPortrait},'*');back.hidden=false;open.textContent='Tanıtımı tekrar oynat';frame.scrollIntoView({block:'nearest'});};
back.onclick=()=>frame.contentWindow.postMessage({type:'lab-rival-intro-stop'},'*');
window.addEventListener('message',e=>{if(e.source===frame.contentWindow&&e.data?.type==='lab-rival-intro-ended'){back.hidden=true;open.textContent='Oyuncu tanıtımı';playing=resume;updatePlay();lastPreviewMessage='';draw(time/length);}});
})();
