(function(){
'use strict';
if(window!==top)return;
// Debug switches start off on every game launch; normal game settings are untouched.
for(const [key,value] of [['idle-spiker-ball-shadow-color-v1','black'],['idle-spiker-rival-intro-v1','off']]){
 try{localStorage.setItem(key,value);}catch{}
}
})();
