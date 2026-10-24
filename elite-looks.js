(function(root){'use strict';
const profiles={
'melisa-varguc':[2,'#e8c17c','#9b7157'], 'efsun-karakus':[2,'#cb7890','#ffe0b2'],
'handan-balaban':[5,'#513a2c','#eac58e'], 'ilkem-isik':[4,'#392b27','#eac58e'],
'meliha-cicek':[6,'#604333','#f2d3ad'], 'seda-erden':[4,'#45342b','#eac58e'],
'zuhre-yildiz':[5,'#6b4932','#f2d3ad'], 'asuman-kilic':[4,'#352d29','#eac58e'],
'cansel-ozbey':[6,'#62402c','#f2d3ad'], 'eylul-kartal':[5,'#49342c','#f2d3ad'],
'didem-orgu':[4,'#775336','#f2d3ad'], 'ayca-kacmaz':[6,'#51392f','#eac58e']};
function apply(p){const profile=profiles[p.specialCharacter];if(!profile||!root.TeamAppearance)return p;if(p.eliteLookVersion===1&&root.TeamAppearance.valid(p.appearance))return p;let seed=p.specialCharacter.split('').reduce((n,c)=>n*31+c.charCodeAt(0),7)>>>0;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296),a=root.TeamAppearance.generate(random,{country:'TR'}),hair=a.parts.find(p=>p.id==='hair'),path=hair.path.replace(/Woman[1-6]/,'Woman'+profile[0]),dim=root.TeamAssetData.dimensions[path];if(dim){hair.path=path;Object.assign(hair,dim);hair.x=300-hair.width/2;hair.y=105;}hair.tint=profile[1];for(const part of a.parts){if(part.path.startsWith('PNG/Skin/'))part.tint=profile[2];if(part.id.startsWith('brow'))part.tint=profile[1];}a.palette.head=profile[2];a.palette.hair=profile[1];a.hairGradient=null;a.details={};a.earrings=null;p.appearance=a;p.eliteLookVersion=1;return p;}
root.EliteLooks={apply,profiles};})(globalThis);