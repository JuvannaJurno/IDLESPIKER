(function(){
'use strict';
const levels={music:.18,crowd:.14,effects:.48};
let ownPointMusicCount=0;
let enabled=true,mode='menu',paused=false,finished=false,rallyActive=false;
try{enabled=localStorage.getItem('idle-spiker-sound')!=='off';Object.assign(levels,JSON.parse(localStorage.getItem('idle-spiker-mix')||'{}'))}catch{}
for(const k in levels)levels[k]=Math.max(0,Math.min(1,Number(levels[k])||0));
const voices=[],pending=new WeakSet(),timers=new Set();
function media(src,group,scale=1,loop=false){const a=new Audio(src);a.preload='auto';a.loop=loop;const v={a,group,scale,busy:false,timer:null};voices.push(v);a.load();return v}
const notifySound=media('assets/audio/notify-placeholder.wav','effects',.65);
const pointMusicVoices=new Map();let pointMusicVoice=null;
function stopPointMusic(){if(pointMusicVoice)stop(pointMusicVoice);pointMusicVoice=null;}
function playPointMusic(track,preview=false){
if(!track?.src||!allowed()||levels.music<=0||(!preview&&(mode!=='match'||rallyActive))||preview&&mode!=='menu')return;
stopPointMusic();if(preview)haltMusic();const src=preview?track.src:(track.matchSrc||track.src);let v=pointMusicVoices.get(src);if(!v){v=media(src,'music',.8);v.pointMusic=true;pointMusicVoices.set(src,v)}
pointMusicVoice=v;v.busy=true;v.a.currentTime=track.start||0;v.a.onended=v.a.onerror=()=>{stop(v);if(pointMusicVoice===v)pointMusicVoice=null;};
v.a.onplaying=()=>{if(preview)v.timer=setTimeout(()=>{v.timer=null;fadeOut(v,350)},3000)};play(v);
}
function previewPointMusic(track){if(window.PlayerProfile?.unlocked(track))playPointMusic(track,true);}
function socialReady(){if(!allowed()||mode!=='menu'||levels.effects<=0)return;stop(notifySound);notifySound.a.currentTime=0;notifySound.busy=true;notifySound.a.onended=notifySound.a.onerror=()=>stop(notifySound);play(notifySound);}
const musicTracks=['OST/BGM_0.mp3','OST/BGM_1.mp3','OST/BGM_2.mp3','OST/BGM_3.mp3','OST/zephiramusic-cute-lofi-613381.mp3','OST/zephiramusic-lofi-christmas-613825.mp3','OST/zephiramusic-positive-lofi-587548.mp3','OST/zephiramusic-tokyo-lofi-604786.mp3'].map(src=>media(src,'music',1,false));
let musicIndex=Math.floor(Math.random()*musicTracks.length),musicTransition=null,musicPausedAt=null;
function haltMusic(){musicPausedAt??=performance.now();for(const v of musicTracks)stop(v)}
function startMusic(){if(musicPausedAt!==null){if(musicTransition?.start!=null)musicTransition.start+=performance.now()-musicPausedAt;musicPausedAt=null}play(musicTracks[musicIndex]);if(musicTransition)play(musicTracks[musicTransition.next])}
function nextMusic(){if(musicTransition||!allowed()||mode!=='menu')return;const choices=musicTracks.map((_,i)=>i).filter(i=>i!==musicIndex),next=choices[Math.floor(Math.random()*choices.length)],v=musicTracks[next],out=musicTracks[musicIndex];v.a.currentTime=0;v.scale=0;musicTransition={next,start:null,duration:Math.max(.2,Math.min(3,(out.a.duration-out.a.currentTime)||3))};play(v)}
for(const v of musicTracks)v.a.onended=()=>{if(v===musicTracks[musicIndex])nextMusic()};
setInterval(()=>{if(!allowed()||mode!=='menu'||pointMusicVoice?.busy)return;const out=musicTracks[musicIndex];if(!musicTransition){if(!out.a.paused&&Number.isFinite(out.a.duration)&&out.a.duration-out.a.currentTime<=3)nextMusic();return}const t=musicTransition,incoming=musicTracks[t.next];if(incoming.a.paused){play(incoming);return}t.start??=performance.now();const progress=Math.min(1,(performance.now()-t.start)/(t.duration*1000));out.scale=Math.cos(progress*Math.PI/2);incoming.scale=Math.sin(progress*Math.PI/2);out.a.volume=levels.music*out.scale;incoming.a.volume=levels.music*incoming.scale;if(progress===1){stop(out);out.a.currentTime=0;out.scale=1;musicIndex=t.next;musicTransition=null}},50);
const bed=media('VFX/Crowd Cheering Sounds/10 - Ambience.mp3','crowd',.12,true);
const cheers=['01 - Strong cheering and strong rhythmic cheering.mp3','03 - Strong cheering - I.mp3','04 - Strong cheering - II - Short.mp3','08 - Rhythmic cheering.mp3'].map(n=>media('VFX/Crowd Cheering Sounds/'+n,'crowd',.9));
const legendaryCheers=[['04 - Strong cheering - II - Short.mp3',5],['03 - Strong cheering - I.mp3',6],['02 - Strong cheering and soft rhythmic cheering.mp3',9],['01 - Strong cheering and strong rhythmic cheering.mp3',4]].map(([file,start])=>Object.assign(media('VFX/Crowd Cheering Sounds/'+file,'crowd',1),{start}));
function legendaryPoint(){if(!allowed()||mode!=='match')return;for(const v of [...cheers,...legendaryCheers])stop(v);const v=legendaryCheers[Math.floor(Math.random()*legendaryCheers.length)];v.a.currentTime=v.start;v.busy=true;v.a.onended=v.a.onerror=()=>stop(v);v.a.onplaying=()=>{v.timer=setTimeout(()=>fadeOut(v,900),3500)};play(v);}
const pools={};
for(const n of ['hardball_1','hardball_2','hardball_3','softball_1','softball_2','softball_3','tip','netball_1','netball_hard','floorslam','hardfloorslam','floorslam_hard','floorslam_2'])pools[n]=Array.from({length:3},()=>media('VFX/Ball/'+n+'.mp3','effects'));
for(const [key,file] of Object.entries({bounce:'VFX/ball_falls_bounces.mp3',whistleShort:'VFX/whistle_short.wav',whistleLong:'VFX/whistle_long.wav',approach:'VFX/Sneakers/squeak_approach.mp3',set:'VFX/Sneakers/squeak_3step_set.mp3',jump1:'VFX/Sneakers/squeak_jump_1.mp3',jump2:'VFX/Sneakers/squeak_jump_2.mp3',jump3:'VFX/Sneakers/squeak_jump_3.mp3'}))pools[key]=Array.from({length:2},()=>media(file,'effects'));
const rallyBed=media('VFX/Crowd Cheering Sounds/11 - Ambience.mp3','crowd',.12,true);
const criticalClicks=Array.from({length:2},()=>media('zipclick.flac','effects',.41));let lastCriticalClick=-Infinity;
const upgradeClicks=Array.from({length:3},()=>media('VFX/click.mp3','effects',.75));
const typingClicks=[2,3,4,5].map(n=>Array.from({length:2},()=>media('VFX/click '+n+'.mp3','effects',.38)));
const heartbeatSound=media('heartbeat.wav','effects',.65,true);
function stopHeartbeat(){fadeOut(heartbeatSound,100);}
function heartbeat(){if(!allowed()||mode!=='match'||levels.effects<=0)return;stop(heartbeatSound);heartbeatSound.a.currentTime=0;heartbeatSound.busy=true;play(heartbeatSound);}
const skillStopSound=media('time_stop.mp3','effects',.55);let previousSkillPitch=null;
function stopSkillSlow(){stop(skillStopSound);}
function skillSlow(){if(!allowed()||mode!=='match'||levels.effects<=0)return;const v=skillStopSound;stop(v);v.a.currentTime=0;const pitches=[-1.6,-.8,0,.8,1.6].filter(n=>n!==previousSkillPitch);previousSkillPitch=pitches[Math.floor(Math.random()*pitches.length)];v.a.preservesPitch=false;v.a.mozPreservesPitch=false;v.a.playbackRate=2**(previousSkillPitch/12);v.busy=true;v.a.onended=v.a.onerror=()=>stop(v);v.a.onplaying=()=>{v.timer=setTimeout(()=>{v.timer=null;fadeOut(v,250/v.a.playbackRate)},750/v.a.playbackRate);};play(v);}
const drawMelody=[60,64,67,69,67,64,62,67,64,60,62,64],drawNotes=new Set();let drawStep=0,lastDraw=-Infinity;
function stopDrawNotes(){for(const voice of drawNotes){try{voice.osc.stop()}catch{}voice.osc.disconnect();voice.gain.disconnect();}drawNotes.clear();}
function cardDraw(){if(!allowed()||mode!=='menu'||levels.effects<=0)return;const now=performance.now();if(now-lastDraw>1800)drawStep=0;if(now-lastDraw<45)return;lastDraw=now;try{const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;uiContext??=new Context();if(uiContext.state==='suspended')uiContext.resume().catch(()=>{});const note=drawMelody[drawStep++%drawMelody.length],frequency=440*2**((note-69)/12),t=uiContext.currentTime;while(drawNotes.size>=6){const old=drawNotes.values().next().value;old.osc.stop();old.osc.disconnect();old.gain.disconnect();drawNotes.delete(old);}for(const [multiple,volume]of [[1,.11],[2,.018]]){const osc=uiContext.createOscillator(),gain=uiContext.createGain();osc.type='sine';osc.frequency.setValueAtTime(frequency*multiple,t);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume*levels.effects,t+.012);gain.gain.exponentialRampToValueAtTime(.0001,t+.48);osc.connect(gain);gain.connect(uiContext.destination);const voice={osc,gain};drawNotes.add(voice);osc.onended=()=>{drawNotes.delete(voice);osc.disconnect();gain.disconnect();};osc.start(t);osc.stop(t+.5);}}catch{}}

const discoverySound=media('VFX/players_found.mp3','effects',.75);
function playersFound(){if(!allowed()||mode!=='menu'||levels.effects<=0)return;const v=discoverySound;stop(v);v.busy=true;v.a.currentTime=0;v.a.onended=v.a.onerror=()=>stop(v);play(v);}
const typingEnters=Array.from({length:2},()=>media('VFX/click_enter.mp3','effects',.45));let typingVariant=-1;
function typeKey(enter=false){if(!allowed()||mode!=='menu'||levels.effects<=0)return;let pool;if(enter)pool=typingEnters;else{typingVariant=(typingVariant+1+Math.floor(Math.random()*3))%typingClicks.length;pool=typingClicks[typingVariant];}const v=pool.find(v=>!v.busy)||pool[0];stop(v);v.busy=true;v.a.currentTime=0;v.a.playbackRate=1;v.a.onended=v.a.onerror=()=>stop(v);play(v);}
let lastUpgradeClick=-Infinity;
function upgradeClick(){if(!enabled||document.hidden||levels.effects<=0||performance.now()-lastUpgradeClick<55)return;lastUpgradeClick=performance.now();const v=upgradeClicks.find(v=>!v.busy)||upgradeClicks[0];stop(v);v.busy=true;v.a.currentTime=0;v.a.preservesPitch=false;v.a.playbackRate=2**((Math.random()-.5)*.8/12);v.a.onended=v.a.onerror=()=>stop(v);play(v);}
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
function play(v){if(pending.has(v.a)||!v.a.paused)return;pending.add(v.a);v.a.volume=levels[v.group]*v.scale;Promise.resolve(v.a.play()).then(()=>{if(!allowed()||(v.group==='music'&&(v.pointMusic?(!v.busy||(mode==='match'&&rallyActive&&!v.fade)):mode!=='menu'))||(v.group==='crowd'&&(mode!=='match'||(v!==bed&&v!==rallyBed&&rallyActive&&!v.fade)))||(v.group!=='music'&&v!==bed&&v!==rallyBed&&!v.busy))stop(v)}).catch(()=>{v.busy=false}).finally(()=>pending.delete(v.a))}
function clearShots(){stopPointMusic();for(const t of timers)clearTimeout(t);timers.clear();for(const v of voices)if(v.group!=='music'&&v!==bed&&v!==rallyBed)stop(v)}
function sync(){if(!allowed()||finished)stopPointMusic();else if(mode==='match'&&rallyActive&&pointMusicVoice)fadeOut(pointMusicVoice,450);
 if(!allowed()||mode!=='menu'||levels.effects<=0)stopDrawNotes();
 if(!allowed()){haltMusic();for(const v of voices)if(v.group!=='music')stop(v);clearShots();return}
 if(mode==='menu'){stop(bed);stop(rallyBed);if(pointMusicVoice?.busy)haltMusic();else startMusic();return}
 haltMusic();const target=rallyActive?rallyBed:bed,other=rallyActive?bed:rallyBed;cancelFade(target);play(target);fadeOut(other);if(rallyActive)for(const v of [...cheers,...legendaryCheers])fadeOut(v);
}
function shot(key,scale=1,duration=0){if(!allowed()||mode!=='match')return;const v=pools[key]?.find(v=>!v.busy);if(!v)return;v.busy=true;v.scale=scale;v.a.currentTime=0;v.a.onended=v.a.onerror=()=>stop(v);v.a.onplaying=()=>{if(duration)v.timer=setTimeout(()=>stop(v),duration*1000)};play(v)}
let last=-1,lastSqueak=0;
function hit(kind){if(kind.startsWith('slot-')){if(allowed()&&mode==='match')window.SlotChime?.play(kind,levels.effects);return;}if(kind==='whoosh-stop'){for(const v of pools.whoosh||[])stop(v);return;}if(['veryhardball','hardfloorslam','floorslam_2','floorslam_hard','whoosh'].includes(kind)){if(!pools[kind])pools[kind]=Array.from({length:2},()=>media('VFX/Ball/'+kind+'.mp3','effects',1,kind==='whoosh'));shot(kind,kind==='whoosh'?.55:.9);return;}let n=Math.floor(Math.random()*3);if(n===last)n=(n+1)%3;last=n;shot(kind==='hard'?'hardball_'+(n+1):kind==='soft'||kind==='toss'?'softball_'+(n+1):kind,kind==='toss'?.28:kind==='hard'?.85:.65)}
function cue(kind){
 if(kind==='heart-pling'){if(allowed()&&mode==='match'&&levels.effects>0)window.SlotChime?.play('heart-pling',levels.effects);return;}
 if(kind==='serve'){if(mode!=='match')return;rallyActive=true;sync();shot('whistleShort',.55);return}
 if(kind==='bounce'){shot('bounce',.6,.52);return}
 if(!allowed()||mode!=='match'||performance.now()-lastSqueak<280)return;
 lastSqueak=performance.now();shot(kind==='jump'?'jump'+(1+Math.floor(Math.random()*3)):kind,.4,kind==='approach'?1.1:.6);
}
function point(big=false,team=null,musicId=null){
 if(mode!=='match')return;rallyActive=false;cancelFade(bed);sync();
 if(!allowed()||mode!=='match')return;
 ownPointMusicCount++;const id=musicId??(team===1?'':window.MatchPointMusic?.next(window.PlayerProfile?.selectedMusic?.(),ownPointMusicCount));const track=window.PointMusicCatalog?.find(t=>t.id===id);if(track)playPointMusic(track);else stopPointMusic();
 shot('whistleShort',.6);
 if(big){const t=setTimeout(()=>{timers.delete(t);shot('whistleLong',.65)},520);timers.add(t)}
 for(const v of [...cheers,...legendaryCheers])stop(v);
 const v=cheers[big?0:1+Math.floor(Math.random()*3)];v.a.currentTime=0;v.busy=true;v.a.onended=v.a.onerror=()=>stop(v);v.a.onplaying=()=>{v.timer=setTimeout(()=>fadeOut(v),big?7500:3500)};play(v);
}
let uiContext=null,lastUIClick=-Infinity;
function uiClick(){if(!enabled||document.hidden||levels.effects<=0||performance.now()-lastUIClick<55)return;lastUIClick=performance.now();try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;uiContext??=new Audio();if(uiContext.state==='suspended')uiContext.resume().catch(()=>{});const osc=uiContext.createOscillator(),gain=uiContext.createGain(),t=uiContext.currentTime;osc.type='triangle';osc.frequency.setValueAtTime(780,t);osc.frequency.exponentialRampToValueAtTime(360,t+.045);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.045*levels.effects,t+.004);gain.gain.exponentialRampToValueAtTime(.0001,t+.055);osc.connect(gain);gain.connect(uiContext.destination);osc.start(t);osc.stop(t+.06);osc.onended=()=>{osc.disconnect();gain.disconnect()}}catch{}}
function critical(){if(!allowed()||mode!=='menu'||levels.effects<=0||performance.now()-lastCriticalClick<180)return;lastCriticalClick=performance.now();const v=criticalClicks.find(v=>!v.busy)||criticalClicks[0];stop(v);v.busy=true;v.a.currentTime=0;v.a.preservesPitch=false;v.a.playbackRate=.9;v.a.onended=v.a.onerror=()=>stop(v);play(v);}
function achievement(){if(!enabled||document.hidden||levels.effects<=0)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;uiContext??=new Audio();if(uiContext.state==='suspended')uiContext.resume().catch(()=>{});const t=uiContext.currentTime;[659.25,830.61,987.77].forEach((frequency,i)=>{const osc=uiContext.createOscillator(),gain=uiContext.createGain(),start=t+i*.085;osc.type='sine';osc.frequency.value=frequency;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.065*levels.effects,start+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+.35);osc.connect(gain);gain.connect(uiContext.destination);osc.start(start);osc.stop(start+.36);osc.onended=()=>{osc.disconnect();gain.disconnect()}})}catch{}}
window.GameAudio={previewPointMusic,stopPointMusic,socialReady,cardDraw,legendaryPoint,heartbeat,stopHeartbeat,skillSlow,stopSkillSlow,critical,achievement,uiClick,upgradeClick,typeKey,playersFound,setMode(v){if(v!==mode)ownPointMusicCount=0;clearShots();cancelFade(bed);mode=v;paused=false;finished=false;rallyActive=false;sync()},setEnabled(v){enabled=!!v;try{localStorage.setItem('idle-spiker-sound',enabled?'on':'off')}catch{}sync()},setPaused(v){paused=!!v;sync()},hit,cue,point,finish(){finished=true;paused=false;rallyActive=false;cancelFade(bed);sync()},unlock:sync};
// Retry blocked playback on every real interaction, including interactions inside the match.
document.addEventListener('pointerdown',sync);document.addEventListener('keydown',sync);
const clubPanel=document.getElementById('clubPanel');if(clubPanel)new MutationObserver(()=>{if(clubPanel.hidden)criticalClicks.forEach(stop)}).observe(clubPanel,{attributes:true,attributeFilter:['hidden']});
window.addEventListener('blur',()=>{stopDrawNotes();criticalClicks.forEach(stop);stopSkillSlow();stop(heartbeatSound);});
document.addEventListener('visibilitychange',sync);window.addEventListener('pageshow',sync);
window.addEventListener('pagehide',()=>{stopDrawNotes();for(const v of voices)stop(v);clearShots()});
window.addEventListener('message',e=>{const frame=document.getElementById('gameMatchFrame');if(mode!=='match'||!frame||e.source!==frame.contentWindow||e.data?.type!=='spiker-audio')return;const d=e.data;if(d.action==='hit'&& (d.kind?.startsWith('slot-')||['hard','soft','toss','tip','netball_1','netball_hard','floorslam','veryhardball','hardfloorslam','floorslam_2','floorslam_hard','whoosh','whoosh-stop'].includes(d.kind)))hit(d.kind);if(d.action==='cue'&&['serve','bounce','approach','jump','set','heart-pling'].includes(d.kind))cue(d.kind);if(d.action==='point')point(!!d.big,d.team,d.musicId);if(d.action==='legendary-point')legendaryPoint();if(d.action==='pause')GameAudio.setPaused(d.value);if(d.action==='finish')GameAudio.finish();if(d.action==='heartbeat')heartbeat();if(d.action==='heartbeat-stop')stopHeartbeat();if(d.action==='skill-slow')skillSlow();if(d.action==='skill-slow-stop')stopSkillSlow();if(d.action==='unlock')sync()});
for(const key of ['music','crowd','effects']){const input=document.getElementById('volume-'+key);if(!input)continue;input.value=Math.round(levels[key]*100);input.oninput=()=>{levels[key]=Number(input.value)/100;for(const v of voices){const f=v.fade,t=f?Math.min(1,(performance.now()-f.start)/1500):0;v.a.volume=levels[v.group]*v.scale*(f?f.gain*(1-t)*(1-t):1)}try{localStorage.setItem('idle-spiker-mix',JSON.stringify(levels))}catch{}}}
// Recover a stalled background track without waiting for another score or click.
setInterval(sync,2000);sync();
})();


