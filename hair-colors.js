(function(root){
'use strict';
const palettes=[['#513b2d','#b8815c'],['#292634','#8b6d9c'],['#273d3c','#6faaa1'],['#513b43','#b88091'],['#424653','#a3afbf']];
function style(a){if(!a)return null;if(Object.prototype.hasOwnProperty.call(a,'hairGradient')){const g=a.hairGradient;return g&&/^#[0-9a-f]{6}$/i.test(g.root)&&/^#[0-9a-f]{6}$/i.test(g.end)?g:null;}if(!a.parts?.some(p=>p.id==='hair'&&/Woman[2456]\.png$/.test(p.path)))return null;let hash=2166136261;for(const c of JSON.stringify(a.parts||[]))hash=Math.imul(hash^c.charCodeAt(0),16777619);hash>>>=0;if(hash%6)return null;const p=palettes[Math.floor(hash/6)%palettes.length];return {root:p[0],end:p[1]};}
function base(a){return style(a)?.root||a?.parts?.find(p=>p.id==='hair')?.tint||a?.palette?.hair;}
root.HairColors={palettes,style,base};
})(globalThis);
