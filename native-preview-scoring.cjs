// Recording-only adaptations: native game/lab behavior remains unchanged.
module.exports=function scoringPreviewSource(source){
 source=source.replace("for(const q of players){q.previewSky=0;delete q.vectorStandingServeAge;", "lightningPreviewSaved=false;floatPreviewSaved=false;minusPowerBounce=false;previewComboCycle=0;for(const q of players){q.previewSky=0;delete q.vectorStandingServeAge;");
 source=source.replace("for(const q of players){q.previewSky=0;q.serveSwing=undefined;", "if(window.previewScoreGoal)serveGoal=window.previewScoreGoal;for(const q of players){q.previewSky=0;q.serveSwing=undefined;");
 source=source.replace("if(id==='jump-legendary'&&p>=(lightningPreviewSaved?", "if(id==='jump-legendary'&&lightningPreviewSaved&&p>=(lightningPreviewSaved?");
 source=source.replace("goal=finisher==='line'?{x:860,y:175}:finisher==='wipe'?{x:620,y:115}:{x:810,y:380}", "goal=window.previewScoreGoal||(finisher==='line'?{x:860,y:175}:finisher==='wipe'?{x:620,y:115}:{x:810,y:380})");
 source=source.replace("fly(contact,{x:590,y:305},u,38)","fly(contact,window.previewScoreGoal||{x:590,y:305},u,38)");
 source=source.replace("fly(contact,{x:id==='tempo-minus'&&minusPowerBounce?595:800,y:220},u,28)","fly(contact,window.previewScoreGoal||{x:id==='tempo-minus'&&minusPowerBounce?595:800,y:220},u,28)");
 source=source.replace("fly(contact,{x:655,y:450},previewUnit(p,hit,.86),20)","fly(contact,window.previewScoreGoal||{x:655,y:450},previewUnit(p,hit,.86),20)");
 source=source.replace("z:18+Math.sin(u*Math.PI)*height};}","z:(to===window.previewScoreGoal?18*(1-u):18)+Math.sin(u*Math.PI)*height};}");
 source=source.replace("const shadow=ball.y,visual=", "const scoreLanding={'sky-ball-serve':.84,'jump-legendary':.495,'jump-float-legendary':.84,'sync-attack':.85,'tempo-minus':.47,'ghost-tip':.78,'absolute-read':.86}[id];if(window.previewScoreGoal&&p>=scoreLanding){const age=(p-scoreLanding)*3.6;ball={state:'preview',x:window.previewScoreGoal.x,y:window.previewScoreGoal.y,z:age<.45?Math.sin(age/.45*Math.PI)*10:0};}const shadow=ball.y,visual=");
 source=source.replace("previewAim(590,305,(p-.27)*3.6)","previewAim(window.previewScoreGoal?.x??590,window.previewScoreGoal?.y??305,(p-.27)*3.6)");
 return source;
};
