const fs=require('fs');
const file='editor-template.html.template';let s=fs.readFileSync(file,'utf8');
const placement=`
function positionMan2(){const hair=byId('hair');if(!/Man2\\.png$/i.test(hair.path))return;const head=byId('head'),base=approvedLayout.find(p=>p.id==='head'),ratio=head.scale/base.scale;hair.x=head.x+(223.5-base.x)*ratio;hair.y=head.y+(102.05-base.y)*ratio;}
`;
s=s.replace('function varyIdentity(){',placement+'\nfunction varyIdentity(){');
s=s.replace('p.y=head.y+(base.y-headBase.y)*head.scale/headBase.scale;','p.y=head.y+(base.y-headBase.y)*head.scale/headBase.scale;positionMan2();');
s=s.replace("catch{}selected=['arm-right'", "catch{}try{if(!localStorage.getItem('man2-position-v1')){positionMan2();localStorage.setItem('man2-position-v1','1')}}catch{positionMan2()}selected=['arm-right'");
fs.writeFileSync(file,s);
