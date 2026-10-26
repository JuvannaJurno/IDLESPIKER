(function(){
'use strict';
if(window.RivalIntroPreview){
 const start=()=>{GuidedTutorial.stop();GuidedTutorial.start=()=>false;RoomSystem.setAutoClick(()=>{});const s=BalRules.enter(RoomRules.defaults(),1);s.division=3;s.openDepartments=[2,4];RoomSystem.loadStage(s);LeagueSeason.loadStage({mode:'bal',division:3,startDay:1,run:3,results:{}});const f={home:0,away:2,round:1},squad=TeamView.snapshot();squad.opponents=MatchIntro.opponents(f);document.getElementById('bootScreen')?.remove();const style=document.createElement('style');style.textContent='body>:not(#gameMatchDialog){visibility:hidden!important}#gameMatchDialog{position:fixed!important;inset:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;max-height:none!important;border:0!important;border-radius:0!important;padding:0!important}#gameMatchDialog #matchIntro{inset:0!important}.achievement-notice{display:none!important}';document.head.append(style);document.getElementById('gameMatchDialog').showModal();MatchIntro.show(squad,f,()=>{});};
 if(document.readyState==='complete')start();else addEventListener('load',start,{once:true});return;
}
const arena=document.querySelector('.stage-card .arena');if(!arena)return;
const open=document.createElement('button'),back=document.createElement('button');open.type=back.type='button';open.textContent='Oyuncu tanıtımı';open.id='labRivalIntro';back.textContent='Yetenek sahasına dön';back.hidden=true;back.id='labRivalIntroBack';
const controls=document.createElement('div');controls.style.cssText='display:flex;gap:8px;flex-wrap:wrap;padding:10px 20px';for(const b of [open,back])b.style.cssText='border:1px solid var(--line);border-radius:10px;background:var(--paper);color:var(--ink);padding:9px 12px;cursor:pointer';controls.append(open,back);arena.before(controls);
let frame=null,resume=false;
open.onclick=()=>{resume=playing;playing=false;updatePlay();if(!frame){frame=document.createElement('iframe');frame.id='labRivalIntroFrame';frame.title='Oyundaki gerçek özel rakip tanıtımı';frame.style.cssText='position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);width:390px;max-width:100%;height:100%;border:0;z-index:8;background:#80b8b4';arena.append(frame);}frame.hidden=false;frame.src='index.html?rivalIntroPreview=1';back.hidden=false;open.textContent='Tanıtımı tekrar oynat';};
back.onclick=()=>{if(frame){frame.remove();frame=null;}back.hidden=true;open.textContent='Oyuncu tanıtımı';playing=resume;updatePlay();};
})();
