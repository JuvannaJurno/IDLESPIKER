(function(root){
'use strict';
const levels=Object.freeze([{tier:1,label:'Umut verici',chance:.15},{tier:2,label:'Yüksek potansiyel',chance:.25},{tier:3,label:'Olağanüstü potansiyel',chance:.4}].map(Object.freeze));
function rating(p){return levels[[1,2,3].includes(p?.academyPotential)?p.academyPotential-1:1];}
function roll(random=Math.random){const n=random();return n<.35?1:n<.85?2:3;}
const api={rating,roll};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ProspectPotentialRules=api;
})(globalThis);
