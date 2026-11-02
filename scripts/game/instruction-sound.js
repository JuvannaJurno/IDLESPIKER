(function(root){
'use strict';
// The same note/envelope serves the game and the isolated button design page.
function create({enabled=()=>true,critical=()=>root.GameAudio?.critical?.()}={}){
 let audio=null,lastSound=0;
 return function tone(kind='tap',streak=0){
  if(!enabled())return;if(kind==='critical'){critical();return;}
  const now=performance.now();if(kind==='tap'&&now-lastSound<65)return;lastSound=now;
  try{const Audio=root.AudioContext||root.webkitAudioContext;if(!Audio)return;audio??=new Audio();if(audio.state==='suspended')audio.resume().catch(()=>{});
   const notes=kind==='day'?[523,659,784,1047]:kind==='build'?[440,659,880]:[360+Math.min(streak,12)*18];
   notes.forEach((hz,i)=>{const osc=audio.createOscillator(),gain=audio.createGain(),t=audio.currentTime+i*.075;osc.type='sine';osc.frequency.setValueAtTime(hz,t);osc.frequency.exponentialRampToValueAtTime(hz*.75,t+.11);gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.055,t+.009);gain.gain.exponentialRampToValueAtTime(.0001,t+.16);osc.connect(gain);gain.connect(audio.destination);osc.start(t);osc.stop(t+.17);osc.onended=()=>{osc.disconnect();gain.disconnect();};});
  }catch{}
 };
}
root.InstructionSound={create};
})(window);
