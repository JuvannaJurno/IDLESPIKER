(function(root){'use strict';
const api={next(ids,count){ids=Array.isArray(ids)?ids.filter(Boolean):[];return !ids.length||ids.length===1&&count%2?'':ids[(ids.length===1?0:count-1)%ids.length];},rival(teamIndex){return teamIndex===1?['carmen-overture']:teamIndex===2?['taiko']:[];},pause(id){return id?6.1:5.2;}};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MatchPointMusic=api;
})(globalThis);
