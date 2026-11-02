(function(root){
'use strict';
const active=s=>s?.stage==='bal'&&s.division===4;
const kinds=Object.freeze({squad:{name:'Kadro çalışması',icon:'team'},club:{name:'Tesis desteği',icon:'tools'},academy:{name:'Özel antrenman',icon:'person'}});
const int=(n,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const validId=id=>typeof id==='string'&&/^first-project-[1-9]\d*$/.test(id)&&int(Number(id.slice(14)),1);
const defaults=()=>({version:1,sequence:0,completed:0,project:null,history:[]});
function normalize(raw){const s=defaults();if(raw?.version!==1)return s;s.sequence=int(raw.sequence)?raw.sequence:0;s.completed=int(raw.completed)?raw.completed:0;const p=raw.project;
 if(p&&validId(p.id)&&Object.hasOwn(kinds,p.kind)&&int(p.baseline)&&int(p.target,1000,400000)&&int(p.carried,0,p.target)&&int(p.ap,1,1000000000)&&int(p.cash,1,1000000000)&&Number.isFinite(p.startedAt)&&p.startedAt>=0){s.project={id:p.id,kind:p.kind,baseline:p.baseline,target:p.target,carried:p.carried,ap:p.ap,cash:p.cash,startedAt:p.startedAt};s.sequence=Math.max(s.sequence,Number(p.id.split('-').pop()));}
 s.history=(Array.isArray(raw.history)?raw.history:[]).filter(h=>h&&validId(h.id)&&Object.hasOwn(kinds,h.kind)&&Number.isFinite(h.at)&&h.at>=0&&typeof h.label==='string').slice(-8).map(h=>({id:h.id,kind:h.kind,label:h.label.slice(0,96),at:h.at}));s.sequence=Math.max(s.sequence,...s.history.map(h=>Number(h.id.split('-').pop())).filter(n=>int(n)),0);if(s.project&&s.history.some(h=>h.id===s.project.id))s.project=null;return s;
}
function pace(e){return Math.max(1,Math.min(2000,(Number(e?.autoRate)||0)*(1+Math.max(0,Number(e?.doubleChance)||0))));}
function quote(room,e={},cashPerTen=0){const s=normalize(room.firstLeagueDraft),seconds=s.completed===0?90:240,target=Math.max(s.completed===0?1000:3000,Math.min(400000,Math.round(pace(e)*seconds/100)*100));const boost=1+(rank(s.completed).level-1)*.05;return {target,ap:Math.max(1000,Math.min(1000000000,Math.round(target*Math.max(1,Number(e.autoAP)||1)*.06*boost))),cash:Math.max(1000,Math.min(1000000000,Math.round(target*Math.max(1,Number(cashPerTen)||1)/10*.06*boost)))};}
function progress(room){const p=room.firstLeagueDraft?.project;if(!p)return {work:0,target:0,fraction:0,ready:false};const work=Math.min(p.target,Math.max(0,p.carried||0)+Math.max(0,(room.instructions||0)-p.baseline));return {work,target:p.target,fraction:work/p.target,ready:work>=p.target};}
function rank(completed){const limits=[0,1,3,6,10];let n=0;for(let i=0;i<limits.length;i++)if(completed>=limits[i])n=i;return {level:n+1,threshold:limits[n],next:limits[n+1]??null,title:['İlk çalışma','Düzenli kulüp','Gelişim ritmi','Yetiştirici ekip','Kulüp ekolü'][n]};}
function start(room,kind,e,cashPerTen,now=Date.now()){if(!active(room)||!Object.hasOwn(kinds,kind)||!Number.isFinite(now)||now<0)return false;const s=normalize(room.firstLeagueDraft);if(s.project||s.sequence>=Number.MAX_SAFE_INTEGER||!int(room.instructions||0))return false;const q=quote({...room,firstLeagueDraft:s},e,cashPerTen);s.project={id:'first-project-'+(++s.sequence),kind,baseline:room.instructions||0,carried:0,...q,startedAt:now};room.firstLeagueDraft=s;return s.project.id;}
function rebase(room,nextInstructions=0){if(!active(room))return;const s=normalize(room.firstLeagueDraft);if(s.project){s.project.carried=progress({...room,firstLeagueDraft:s}).work;s.project.baseline=nextInstructions;}room.firstLeagueDraft=s;}
function support(e,now=Date.now()){const span=e?.end-e?.start;if(!Number.isFinite(span)||!(span>0)||!Number.isFinite(now))return 0;return Math.max(0,Math.floor(Math.min(span*.1,span*.3-Math.max(0,Number(e.projectSupportMs)||0),e.end-now)));}
function claim(room,target=null,now=Date.now()){if(!active(room)||!Number.isFinite(now)||now<0||!Number.isFinite(room.ap)||!Number.isFinite(room.budget))return false;const s=normalize(room.firstLeagueDraft),p=s.project;if(!p||s.completed>=Number.MAX_SAFE_INTEGER||!progress({...room,firstLeagueDraft:s}).ready)return false;let ap=0,cash=0,advanceMs=0,entryId=null,entry=null;
 if(p.kind==='club')cash=p.cash;else if(p.kind==='academy'&&target!=='ap'){entry=room.academy?.entries?.find(e=>e.id===target);advanceMs=support(entry,now);if(!advanceMs)return false;entryId=entry.id;}else ap=p.ap;
 if(!Number.isFinite(room.ap+ap)||room.ap+ap>Number.MAX_SAFE_INTEGER||!Number.isFinite(room.budget+cash)||room.budget+cash>Number.MAX_SAFE_INTEGER)return false;
 if(entry){entry.start-=advanceMs;entry.end-=advanceMs;entry.projectSupportMs=(entry.projectSupportMs||0)+advanceMs;}
 room.ap+=ap;room.budget+=cash;s.completed++;s.history.push({id:p.id,kind:p.kind,label:advanceMs?'Eğitim desteği':cash?'Bütçe desteği':'AP bursu',at:now});s.history=s.history.slice(-8);s.project=null;room.firstLeagueDraft=s;return {id:p.id,ap,cash,advanceMs,entryId,completed:s.completed,rank:rank(s.completed)};
}
const api={active,kinds,defaults,normalize,quote,progress,rank,pace,support,start,rebase,claim};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FirstLeagueDraftRules=api;
})(globalThis);
