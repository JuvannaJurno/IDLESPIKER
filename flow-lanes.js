(function(){
'use strict';
let override=0,signature='',cursor=0,model={normal:1,media:false,amplified:false,capacities:[1]};
const ns='http://www.w3.org/2000/svg';
if(!window.FlowDesignPreview)document.documentElement.dataset.flowStyle='ribbon';
function count(){return model.normal+Number(model.media);}
function capacity(lane=0){return model.media&&lane===model.normal?1:Math.max(0,Math.min(1,model.capacities[lane]||0));}
function position(lane=0){return 14+(model.media?(lane===model.normal?0:lane+1):lane)*10;}
function svg(tag,attributes){const el=document.createElementNS(ns,tag);for(const [key,value]of Object.entries(attributes))el.setAttribute(key,value);return el;}
function sync(){
 const workflow=document.getElementById('workflow'),track=workflow?.querySelector('.energy-track');if(!track)return;
 const state=window.RoomSystem?.flowState?.()||{stage:'prologue',instructionLanes:[1]},capacities=state.instructionLanes||[1];
 model={normal:override||Math.max(1,capacities.findLastIndex(c=>c>0)+1),media:!!(window.RoomSystem?.mediaDepartmentOpen?.()&&window.SocialStudioRules?.waveCount({levels:window.DivisionThree?.socialLevels?.()||[]})>0),amplified:state.stage==='bal',capacities};
 const n=count(),width=14+(n-1)*10+24,tiers=[...workflow.querySelectorAll('.tier')];
 const next=JSON.stringify([model.normal,model.media,model.amplified,capacities,tiers.map(t=>t.dataset.floor)]);
 if(next===signature)return;signature=next;
 workflow.dataset.flowLanes=n;workflow.style.setProperty('--flow-gutter',width+'px');workflow.classList.toggle('flow-amplified',model.amplified);
 const header=document.querySelector('.building-header .power-label');let status=header?.querySelector('.flow-capacity-status');if(header&&!status){status=document.createElement('small');status.className='flow-capacity-status';header.append(status);}if(status){status.hidden=n<2;status.textContent=Array.from({length:model.normal-1},(_,i)=>(i+2)+'. hat '+Math.round(capacity(i+1)*5)+'/5').concat(model.media?['Medya']:[]).join(' · ');status.title='Ek hatlar ana hattın belirtilen oranında talimat üretir.';}
 track.replaceChildren(...Array.from({length:n},(_,i)=>{const media=model.media&&i===model.normal,rail=document.createElement('i');rail.className='flow-rail'+(media?' social-rail':'');if(media||model.amplified){const head=document.createElement('b');head.className=media?'flow-media-head':'flow-amplifier';head.title=media?'Medya dağıtım başlığı':'Kritik talimat güçlendirici';head.setAttribute('aria-hidden','true');rail.append(head);}rail.style.left=position(i)+'px';rail.style.setProperty('--rail-index',i);rail.style.setProperty('--flow-capacity',capacity(i));rail.dataset.capacity=String(Math.round(capacity(i)*5));rail.title=media?'Medya · Paylaşım dalgası':(i+1)+'. hat · %'+Math.round(capacity(i)*100)+' kapasite';return rail;}));
 for(const tier of tiers){tier.querySelector('.flow-junctions')?.remove();const junction=svg('svg',{class:'flow-junctions',viewBox:'0 0 '+width+' 30',width,height:30,'aria-hidden':'true'});for(let i=0;i<n;i++){const x=position(i),group=svg('g',{'data-flow-lane':i,class:model.media&&i===model.normal?'media-junction':''});group.append(svg('path',{d:'M '+x+' 4 V 8 Q '+x+' 15 '+(x+7)+' 15 H '+(width-5)}),svg('circle',{cx:x,cy:4,r:2}));junction.append(group);}junction.append(svg('circle',{class:'flow-inlet',cx:width-4,cy:15,r:3.5}));tier.prepend(junction);}
 for(const pulse of workflow.querySelectorAll('.energy-pulse')){const lane=deliveryLane(Number(pulse.dataset.lane)||0,pulse.dataset.source);pulse.dataset.lane=lane;pulse.style.setProperty('--flow-x',position(lane)+'px');}
}
function deliveryLane(lane,source){if(source==='social')return model.media?model.normal:0;return window.FlowDesignPreview&&model.normal>3?(cursor++%model.normal):Math.min(model.normal-1,Math.max(0,lane));}
function flashClass(el,name,duration){if(!el||el.classList.contains(name))return;el.classList.add(name);setTimeout(()=>el.classList.remove(name),duration);}
window.FlowLanes={count,capacity,position,sync,deliveryLane,amplified:()=>model.amplified,socialLane:()=>model.media?model.normal:-1,mediaSent(){const head=document.querySelector('.flow-media-head');if(!head)return;head.classList.add('media-source-active');clearTimeout(head.mediaTimer);head.mediaTimer=setTimeout(()=>head.classList.remove('media-source-active'),500);},manualSent(lane){flashClass(document.querySelectorAll('.flow-rail')[lane],'manual-source',450);},flash(lane){flashClass(document.querySelectorAll('.flow-rail')[lane]?.querySelector('.flow-amplifier'),'amplifier-fire',550);},preview(n){if(!window.FlowDesignPreview)return;override=[1,2,3,4,6].includes(n)?n:1;sync();}};
setInterval(()=>{if(!document.hidden)sync();},600);sync();
})();
