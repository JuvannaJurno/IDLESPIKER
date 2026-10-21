(function(root){'use strict';
const teams=Object.freeze({
 1:{kind:'serve',label:'Servis baskısı',player:5,focus:'serve',rematch:'Servisçileri rövanşa daha güçlü hazırlandı.'},
 2:{kind:'defense',label:'Savunmadan kontrollü hücum',player:2,focus:'set',rematch:'Melis rövanş için paslarını geliştirdi.'},
 3:{kind:'defense',label:'Uzun ralli savunması',player:6,focus:'receive',rematch:'Liberoları rövanş için manşetini geliştirdi.'},
 4:{kind:'block',label:'Filede ikili blok',player:3,focus:'block',rematch:'Orta oyuncuları rövanş için bloğunu geliştirdi.'},
 5:{kind:'block',label:'Nadia ile blok duvarı',player:0,focus:'block',rematch:'Nadia rövanş için bloğunu geliştirdi.'},
 6:{kind:'serve',label:'Yerleşimli servis',player:4,focus:'serve',placement:true,rematch:'Servisçileri rövanş için servis kontrolünü geliştirdi.'},
 7:{kind:'serve',label:'Sert servis ve hücum',player:5,focus:'serve',rematch:'Derin rövanş için servisini geliştirdi.'}
});
const shifts={serve:{serve:16,spike:3,receive:-9,block:-7,set:-3},block:{block:18,receive:-8,serve:-6,spike:-4},defense:{receive:16,stamina:8,spike:-10,serve:-8,block:-6}};
const keys=['spike','block','serve','receive','set','stamina','mental'];
function profile(team){return teams[team]||null;}
function shape(p,team,overall){const style=profile(team);if(!style)return p;const before=overall(p);for(const [k,v]of Object.entries(shifts[style.kind]))p[k]=Math.max(1,p[k]+v);const correction=before-overall(p);for(const k of keys)p[k]=Math.max(1,p[k]+correction);return p;}
function finish(p,team,index,round,overall){const style=profile(team);if(!style)return p;const rematch=round>=8,improved=rematch&&index===style.player,before=overall(p);if(improved){p[style.focus]+=4;p.mental+=2;if(p.specialCharacter){const correction=before-overall(p);for(const k of keys)p[k]=Math.max(1,p[k]+correction);}}return Object.assign(p,{rivalStyleTeam:team,rivalStyleKind:style.kind,rivalStyleLabel:style.label,rivalRematch:rematch,rivalImproved:improved});}
function rematchText(roster){const p=roster?.find(p=>p?.rivalImproved),style=p&&profile(p.rivalStyleTeam);if(!p||!style)return null;const name=[p.name,p.surname].filter(Boolean).join(' '),focus={serve:'servisini',set:'paslarını',block:'bloğunu',receive:'manşetini'}[style.focus];return name?name+' rövanş için '+focus+' geliştirdi.':style.rematch;}
function of(p){return p?.stats?.rivalStyleKind||p?.rivalStyleKind||null;}
function serveTarget(server,receivers,random){if(of(server)!=='serve'||!receivers.length)return receivers[Math.floor(random()*receivers.length)];const style=profile(server.stats.rivalStyleTeam),weights=receivers.map(p=>{const weak=Math.max(1,220-(p.stats?.receive||80));return style?.placement?1+Math.abs(p.y-310)/120:weak/40;});let n=random()*weights.reduce((a,b)=>a+b,0);return receivers.find((p,i)=>(n-=weights[i])<=0)||receivers.at(-1);}
const api={teams,profile,shape,finish,rematchText,of,serveTarget};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RivalStyles=api;
})(globalThis);
