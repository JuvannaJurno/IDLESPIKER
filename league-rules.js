(function(root){
const teams=['Bizim Kulüp','Mavişehir','Çınar Spor','Yıldız Gençlik','Sahil Spor','Kent Akademi','Güneş Spor','Kuzey Voleybol'],start=Date.UTC(2026,8,28),dayMs=86400000;
const dateFor=day=>new Date(start+(day-1)*dayMs),dayFor=date=>Math.round((Date.UTC(date.getUTCFullYear(),date.getUTCMonth(),date.getUTCDate())-start)/dayMs)+1;
function fixtures(day){if(day<1||day%7!==0)return[];const round=Math.floor(day/7)-1,week=round%14;let ring=teams.map((_,i)=>i);for(let r=0;r<week%7;r++)ring=[ring[0],ring[7],...ring.slice(1,7)];return Array.from({length:4},(_,i)=>{let home=ring[i],away=ring[7-i];if(((week%7)%2===1)!==(week>=7))[home,away]=[away,home];return{home,away,time:(13+i*2)+':00',round:round+1,season:Math.floor(round/14)+1,ours:home===0||away===0}})}
const api={teams,dateFor,dayFor,fixtures};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LeagueRules=api;
})(globalThis);
