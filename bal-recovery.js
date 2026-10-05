(function(){
'use strict';
// A durable transition journal lets an interrupted multi-key save finish on the next load.
try{const raw=localStorage.getItem('idle-spiker-bal-transition-v1');if(raw){const tx=JSON.parse(raw);if(tx.version===1&&tx.entries&&typeof tx.entries==='object'){for(const [key,value]of Object.entries(tx.entries))if(['idle-spiker-rooms-v2','idle-spiker-league-v1','idle-spiker-main-menu-v1','idle-spiker-prologue-archive-v1','idle-spiker-women-v1','idle-spiker-onboarding-v1','idle-spiker-match-results'].includes(key)&&typeof value==='string')localStorage.setItem(key,value);localStorage.removeItem('idle-spiker-bal-transition-v1')}}}catch{window.balRecoveryFailed=true;window.gameResetting=true;}
})();
