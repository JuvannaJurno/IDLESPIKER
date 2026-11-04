/* Host contract for the unchanged production vector renderer, inside this page only. */
'use strict';
var sprites=Array.from({length:12},()=>({}));
var matchInfo={division:2,colors:[{primary:'#568a8e',accent:'#f0d282'},{primary:'#b86f57',accent:'#f7dda3'}]};
function shade(color,factor){return '#'+color.slice(1).match(/../g).map(v=>Math.round(parseInt(v,16)*factor).toString(16).padStart(2,'0')).join('');}
function tossing(p){return p.toss>0;}
function receiving(p){return p.receive>0;}
function dominant(){return '#65878a';}
window.SecretVolleyArt={
 actors:[],
 makeActors(){
  const skins=['#e0bc85','#aa8956','#ffe0b1','#957544','#d2ac73','#f5d29d'];
  const hairs=['#403735','#6f4b43','#c2a264','#3c4d54','#765a7f','#313b40'];
  const names=['Deniz','Ece','İpek','Duru','Yağmur','Elif','Ada','Selin','Nehir','Mina','Defne','Aslı'];
  this.actors=Array.from({length:12},(_,i)=>({index:i,team:i<6?0:1,roster:{id:'secret-volley-'+i,name:names[i],
   appearance:{palette:{head:skins[i%6],shirt:i<6?'#568a8e':'#b86f57',hair:hairs[i%6],shoe:'#3f4545'},
    clubKit:{accent:i<6?'#f0d282':'#f7dda3'},parts:[{id:'head',tint:skins[i%6]},{id:'hair',path:'PNG/Hair/Black/blackWoman'+(i%3+1)+'.png'}]}}}));
  return this.actors;
 }
};
