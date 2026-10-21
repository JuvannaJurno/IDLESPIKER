let source=require('fs').readFileSync('test-offline-progress.cjs','utf8');
source=source.replace('localStorage.clear();',"localStorage.clear();localStorage.setItem('idle-spiker-language-v1','tr');");
source=source.replace("path:'match-arrival-mobile.png'","path:'C:/Users/MELİH BEY/AppData/Local/Temp/idle-audit-arrival.png'");eval(source);
