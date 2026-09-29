const fs=require('fs');
const file='editor-template.html.template';let s=fs.readFileSync(file,'utf8');
s=s.replace('function positionMan2(){',`function positionMan5(){const hair=byId('hair');if(!/Man5\\.png$/i.test(hair.path))return;const head=byId('head'),base=approvedLayout.find(p=>p.id==='head'),ratio=head.scale/base.scale;hair.x=head.x+(222.5-base.x)*ratio;hair.y=head.y+(111.05-base.y)*ratio;}
function positionMan2(){`);
s=s.replace('head.scale/headBase.scale;positionMan2();','head.scale/headBase.scale;positionMan2();positionMan5();');
s=s.replace("selected=['arm-right','sleeve-right','hand-right'];render();document.getElementById", "try{if(!localStorage.getItem('man5-position-v1')){positionMan5();localStorage.setItem('man5-position-v1','1')}}catch{positionMan5()}selected=['arm-right','sleeve-right','hand-right'];render();document.getElementById");
fs.writeFileSync(file,s);
