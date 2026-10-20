(function(root){
'use strict';
const palettes=[['#513b2d','#b8815c'],['#292634','#8b6d9c'],['#273d3c','#6faaa1'],['#513b43','#b88091'],['#424653','#a3afbf']];
function subtle(g){const end='#'+[1,3,5].map(i=>Math.round(parseInt(g.root.slice(i,i+2),16)*.45+parseInt(g.end.slice(i,i+2),16)*.55).toString(16).padStart(2,'0')).join('');return {root:g.root,end};}
function style(a){if(!a)return null;if(Object.prototype.hasOwnProperty.call(a,'hairGradient')){const g=a.hairGradient;return g&&/^#[0-9a-f]{6}$/i.test(g.root)&&/^#[0-9a-f]{6}$/i.test(g.end)?subtle(g):null;}if(!a.parts?.some(p=>p.id==='hair'&&/Woman[2456]\.png$/.test(p.path)))return null;let hash=2166136261;for(const c of JSON.stringify(a.parts||[]))hash=Math.imul(hash^c.charCodeAt(0),16777619);hash>>>=0;if(hash%40)return null;const p=palettes[Math.floor(hash/40)%palettes.length];return subtle({root:p[0],end:p[1]});}
function base(a){return style(a)?.root||a?.parts?.find(p=>p.id==='hair')?.tint||a?.palette?.hair;}
root.HairColors={palettes,style,base};
})(globalThis);
