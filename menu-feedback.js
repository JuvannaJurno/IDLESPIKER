(function(){
'use strict';
const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)'),layer=$('rewardLayer');
let audio=null,sound=true,lastSound=0,lastAuto=0,lastTap=0,streak=0,resetTimer,live=0;
try{sound=localStorage.getItem('idle-spiker-sound')!=='off'}catch{}
const toggle=$('soundToggle');
function soundLabel(){toggle.textContent=sound?'♪':'♪̸';toggle.setAttribute('aria-pressed',String(sound));toggle.setAttribute('aria-label',sound?'Tüm sesleri kapat':'Tüm sesleri aç')}
$('settingsButton').onclick=()=>$('settingsDialog').showModal();$('closeSettings').onclick=()=>$('settingsDialog').close();$('settingsDialog').addEventListener('close',()=>$('settingsButton').focus());
soundLabel();toggle.onclick=()=>{sound=!sound;window.GameAudio?.setEnabled(sound);soundLabel();try{localStorage.setItem('idle-spiker-sound',sound?'on':'off')}catch{}if(sound)tone('tap')};
function tone(kind){if(!sound)return;const now=performance.now();if(kind==='tap'&&now-lastSound<65)return;lastSound=now;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audio??=new Audio();if(audio.state==='suspended')audio.resume().catch(()=>{});const notes=kind==='day'?[523,659,784,1047]:kind==='critical'?[784,1175]:kind==='build'?[440,659,880]:[360+Math.min(streak,12)*18];notes.forEach((hz,i)=>{const osc=audio.createOscillator(),gain=audio.createGain(),t=audio.currentTime+i*.075;osc.type='sine';osc.frequency.setValueAtTime(hz,t);osc.frequency.exponentialRampToValueAtTime(hz*.75,t+.11);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.055,t+.009);gain.gain.exponentialRampToValueAtTime(.0001,t+.16);osc.connect(gain);gain.connect(audio.destination);osc.start(t);osc.stop(t+.17);osc.onended=()=>{osc.disconnect();gain.disconnect()}})}catch{}}
function animate(el,frames,options){if(!el||reduced.matches||!el.animate)return;el.getAnimations().forEach(a=>a.cancel());el.animate(frames,options)}
function clipRewards(){
const button=$('energyButton').getBoundingClientRect(),nav=document.querySelector('.mobile-nav')?.getBoundingClientRect(),shell=document.querySelector('.shell').getBoundingClientRect();
const bottom=Math.max(0,Math.min(innerHeight,button.top-8,nav?.top??innerHeight));
layer.style.clipPath='inset(0px '+Math.max(0,innerWidth-shell.right)+'px '+Math.max(0,innerHeight-bottom)+'px '+Math.max(0,shell.left)+'px)';
}
window.addEventListener('resize',clipRewards,{passive:true});
new ResizeObserver(clipRewards).observe($('energyButton'));
clipRewards();
function popup(text,x,y,kind='normal'){clipRewards();if(kind==='level'){const existing=layer.querySelector('.reward-pop.level');if(existing){existing.textContent=text;return}}if(live>=12)return;const n=document.createElement('span');n.className='reward-pop '+kind;n.textContent=text;n.style.left=Math.max(75,Math.min(innerWidth-75,x))+'px';n.style.top=Math.max(45,y)+'px';layer.append(n);live++;setTimeout(()=>{n.remove();live--},950)}
function burst(x,y,count=8){if(reduced.matches||live>35)return;for(let i=0;i<count;i++){const p=document.createElement('i'),angle=Math.PI*2*i/count;p.className='reward-spark';p.style.left=x+'px';p.style.top=y+'px';p.style.setProperty('--dx',Math.cos(angle)*(35+Math.random()*45)+'px');p.style.setProperty('--dy',Math.sin(angle)*50-35+'px');p.style.background=['#ffd46d','#fff8d9','#ed9270','#83c8b4'][i%4];layer.append(p);live++;setTimeout(()=>{p.remove();live--},650)}}
function clubVisible(){return !document.hidden&&!document.querySelector(".dashboard")?.hidden&&!window.MatchGateway?.active()}
function instruction(completed,progress,source){if(!clubVisible())return;const manual=source!=='auto',now=performance.now(),button=$('energyButton');button.style.setProperty('--day-fill',progress+'%');if(!manual&&now-lastAuto<700&&!completed)return;if(!manual)lastAuto=now;
if(manual){streak=now-lastTap<650?streak+1:1;lastTap=now;const badge=$('tapRhythm');badge.textContent=streak>=4?'GÜZEL TEMPO! · '+streak+' TALİMAT':'';clearTimeout(resetTimer);resetTimer=setTimeout(()=>{badge.textContent='';streak=0},900);animate(button,[{transform:'translateY(5px) scale(.98)'},{transform:'translateY(-2px) scale(1.015)',offset:.55},{transform:'translateY(0) scale(1)'}],{duration:230,easing:'ease-out'});tone(completed?'day':'tap');if(!reduced.matches&&navigator.vibrate)navigator.vibrate(8)}
animate(document.querySelector('.calendar-day.today'),[{transform:'scale(1.09)'},{transform:'scale(1)'}],{duration:200});}
function applyGainFeedback(gain,tier,completed){if(!clubVisible())return;const r=tier.getBoundingClientRect(),amount=(gain?.ap||0).toLocaleString('tr-TR',{maximumFractionDigits:1}),critical=!!gain?.critical;
popup((gain?.bonus?'DÜZENLİ ÇALIŞMA! ':gain?.repeatBonus?'TEKRAR ANTRENMANI! ':critical?'KRİTİK! ':'')+'+'+amount+' AP',r.left+r.width*.5+(Math.random()-.5)*55,r.top-12,critical?'critical':'normal');
burst(r.left+r.width*.5,r.top,critical?12:5);tone(critical?'critical':'tap');if(critical&&!reduced.matches&&navigator.vibrate)navigator.vibrate([18,25,18]);
animate($('roomAP'),[{transform:'scale(1.22)',color:'#d58b30'},{transform:'scale(1)',color:'#4a6b77'}],{duration:280});

if(completed){const wallet=$('roomBudget'),box=wallet.getBoundingClientRect();if(!reduced.matches&&box.width){const chip=document.createElement('span');chip.className='reward-pop day';chip.textContent='+'+(window.RoomSystem?.dailyBudget?.()||20)+' bütçe';chip.style.cssText='position:fixed;left:'+Math.min(innerWidth-90,Math.max(10,r.left))+'px;top:'+Math.max(60,Math.min(innerHeight-100,r.top))+'px;animation:none';layer.append(chip);const start=chip.getBoundingClientRect();chip.animate([{transform:'translate(0,0)',opacity:1},{transform:'translate('+(box.left-start.left)+'px,'+(box.top-start.top)+'px)',opacity:0}],{duration:1100,easing:'ease-in-out'}).onfinish=()=>chip.remove()}popup('GÜN TAMAMLANDI! · +'+(window.RoomSystem?.dailyBudget?.()||20)+' BÜTÇE',innerWidth/2,Math.max(90,r.top-90),'day');burst(innerWidth/2,Math.max(100,r.top-110),18)}}
new MutationObserver(()=>{if(!clubVisible()){layer.replaceChildren();$("tapRhythm").textContent=""}}).observe(document.querySelector(".dashboard"),{attributes:true,attributeFilter:["hidden"]});
window.MenuFeedback={instruction,applyGainFeedback,floor(tier){if(!clubVisible())return;const now=performance.now();if(now-(tier.feedbackAt||-1000)<350)return;tier.feedbackAt=now;animate(tier.querySelector('.room-player'),[{transform:'translateY(0)'},{transform:'translateY(-7px)',offset:.45},{transform:'translateY(0)'}],{duration:280,easing:'ease-out'})},build(name){tone('build');const r=$('energyButton').getBoundingClientRect();popup(name+' HAZIR!',innerWidth/2,r.top-40,'build');burst(innerWidth/2,r.top-60,12)}};
})();
