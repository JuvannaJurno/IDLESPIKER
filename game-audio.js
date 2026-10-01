(function(){
'use strict';
const levels={music:.18,crowd:.14,effects:.48};
let enabled=true,mode='menu',paused=false,finished=false,rallyActive=false;
try{enabled=localStorage.getItem('idle-spiker-sound')!=='off';Object.assign(levels,JSON.parse(localStorage.getItem('idle-spiker-mix')||'{}'))}catch{}
for(const k in levels)levels[k]=Math.max(0,Math.min(1,Number(levels[k])||0));
const voices=[],pending=new WeakSet(),timers=new Set();
function media(src,group,scale=1,loop=false){const a=new Audio(src);a.preload='auto';a.loop=loop;const v={a,group,scale,busy:false,timer:null};voices.push(v);a.load();return v}
const music=media('OST/BGM.mp3','music',1,true);
const bed=media('VFX/Crowd Cheering Sounds/10 - Ambience.mp3','crowd',.12,true);
const cheers=['01 - Strong cheering and strong rhythmic cheering.mp3','03 - Strong cheering - I.mp3','04 - Strong cheering - II - Short.mp3','08 - Rhythmic cheering.mp3'].map(n=>media('VFX/Crowd Cheering Sounds/'+n,'crowd',.9));
const pools={};
for(const n of ['hardball_1','hardball_2','hardball_3','softball_1','softball_2','softball_3','tip','netball_1','netball_hard','floorslam'])pools[n]=Array.from({length:3},()=>media('VFX/Ball/'+n+'.mp3','effects'));
for(const [key,file] of Object.entries({bounce:'VFX/ball_falls_bounces.mp3',whistleShort:'VFX/whistle_short.wav',whistleLong:'VFX/whistle_long.wav',approach:'VFX/Sneakers/squeak_approach.mp3',set:'VFX/Sneakers/squeak_3step_set.mp3',jump1:'VFX/Sneakers/squeak_jump_1.mp3',jump2:'VFX/Sneakers/squeak_jump_2.mp3',jump3:'VFX/Sneakers/squeak_jump_3.mp3'}))pools[key]=Array.from({length:2},()=>media(file,'effects'));
const rallyBed=media('VFX/Crowd Cheering Sounds/11 - Ambience.mp3','crowd',.12,true);
function allowed(){return enabled&&!document.hidden&&(!paused||finished)}
function cancelFade(v){if(v.fade){cancelAnimationFrame(v.fade.frame);v.fade=null}v.a.volume=levels[v.group]*v.scale}
function fadeOut(v,duration=1500){
 if(v.fade||v.a.paused)return;
 clearTimeout(v.timer);v.timer=null;
 const fade={start:performance.now(),gain:levels[v.group]*v.scale?v.a.volume/(levels[v.group]*v.scale):0,frame:0};v.fade=fade;
 const step=now=>{if(v.fade!==fade)return;const t=Math.min(1,(now-fade.start)/duration);v.a.volume=levels[v.group]*v.scale*fade.gain*(1-t)*(1-t);if(t>=1){stop(v);return}fade.frame=requestAnimationFrame(step)};
 fade.frame=requestAnimationFrame(step);
}
function stop(v){cancelFade(v);clearTimeout(v.timer);v.timer=null;v.busy=false;v.a.pause();v.a.onplaying=null}
function play(v){if(pending.has(v.a)||!v.a.paused)return;pending.add(v.a);v.a.volume=levels[v.group]*v.scale;Promise.resolve(v.a.play()).then(()=>{if(!allowed()||(v===music&&mode!=='menu')||(v.group==='crowd'&&(mode!=='match'||(v!==bed&&v!==rallyBed&&rallyActive&&!v.fade)))||(v!==music&&v!==bed&&v!==rallyBed&&!v.busy))stop(v)}).catch(()=>{v.busy=false}).finally(()=>pending.delete(v.a))}
function clearShots(){for(const t of timers)clearTimeout(t);timers.clear();for(const v of voices)if(v!==music&&v!==bed&&v!==rallyBed)stop(v)}
function sync(){
 if(!allowed()){stop(music);stop(bed);stop(rallyBed);clearShots();return}
 if(mode==='menu'){stop(bed);stop(rallyBed);play(music);return}
 stop(music);const target=rallyActive?rallyBed:bed,other=rallyActive?bed:rallyBed;cancelFade(target);play(target);fadeOut(other);if(rallyActive)for(const v of cheers)fadeOut(v);
}
function shot(key,scale=1,duration=0){if(!allowed()||mode!=='match')return;const v=pools[key]?.find(v=>!v.busy);if(!v)return;v.busy=true;v.scale=scale;v.a.currentTime=0;v.a.onended=v.a.onerror=()=>stop(v);v.a.onplaying=()=>{if(duration)v.timer=setTimeout(()=>stop(v),duration*1000)};play(v)}
let last=-1,lastSqueak=0;
function hit(kind){let n=Math.floor(Math.random()*3);if(n===last)n=(n+1)%3;last=n;shot(kind==='hard'?'hardball_'+(n+1):kind==='soft'||kind==='toss'?'softball_'+(n+1):kind,kind==='toss'?.28:kind==='hard'?.85:.65)}
function cue(kind){
 if(kind==='serve'){if(mode!=='match')return;rallyActive=true;sync();shot('whistleShort',.55);return}
 if(kind==='bounce'){shot('bounce',.6,.52);return}
 if(!allowed()||mode!=='match'||performance.now()-lastSqueak<280)return;
 lastSqueak=performance.now();shot(kind==='jump'?'jump'+(1+Math.floor(Math.random()*3)):kind,.4,kind==='approach'?1.1:.6);
}
function point(big=false){
 if(mode!=='match')return;rallyActive=false;cancelFade(bed);sync();
 if(!allowed()||mode!=='match')return;
 shot('whistleShort',.6);
 if(big){const t=setTimeout(()=>{timers.delete(t);shot('whistleLong',.65)},520);timers.add(t)}
 for(const v of cheers)stop(v);
 const v=cheers[big?0:1+Math.floor(Math.random()*3)];v.a.currentTime=0;v.busy=true;v.a.onended=v.a.onerror=()=>stop(v);v.a.onplaying=()=>{v.timer=setTimeout(()=>fadeOut(v),big?7500:3500)};play(v);
}
window.GameAudio={setMode(v){clearShots();cancelFade(bed);mode=v;paused=false;finished=false;rallyActive=false;sync()},setEnabled(v){enabled=!!v;try{localStorage.setItem('idle-spiker-sound',enabled?'on':'off')}catch{}sync()},setPaused(v){paused=!!v;sync()},hit,cue,point,finish(){finished=true;paused=false;rallyActive=false;cancelFade(bed);sync()},unlock:sync};
// Retry blocked playback on every real interaction, including interactions inside the match.
document.addEventListener('pointerdown',sync);document.addEventListener('keydown',sync);
document.addEventListener('visibilitychange',sync);window.addEventListener('pageshow',sync);
window.addEventListener('pagehide',()=>{for(const v of voices)stop(v);clearShots()});
window.addEventListener('message',e=>{const frame=document.getElementById('gameMatchFrame');if(mode!=='match'||!frame||e.source!==frame.contentWindow||e.data?.type!=='spiker-audio')return;const d=e.data;if(d.action==='hit'&&['hard','soft','toss','tip','netball_1','netball_hard','floorslam'].includes(d.kind))hit(d.kind);if(d.action==='cue'&&['serve','bounce','approach','jump','set'].includes(d.kind))cue(d.kind);if(d.action==='point')point(!!d.big);if(d.action==='pause')GameAudio.setPaused(d.value);if(d.action==='finish')GameAudio.finish();if(d.action==='unlock')sync()});
for(const key of ['music','crowd','effects']){const input=document.getElementById('volume-'+key);if(!input)continue;input.value=Math.round(levels[key]*100);input.oninput=()=>{levels[key]=Number(input.value)/100;for(const v of voices){const f=v.fade,t=f?Math.min(1,(performance.now()-f.start)/1500):0;v.a.volume=levels[v.group]*v.scale*(f?f.gain*(1-t)*(1-t):1)}try{localStorage.setItem('idle-spiker-mix',JSON.stringify(levels))}catch{}}}
// Recover a stalled background track without waiting for another score or click.
setInterval(sync,2000);sync();
})();


