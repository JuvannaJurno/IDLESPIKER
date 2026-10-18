(function(){
'use strict';
window.MaintenancePepper=function(gate){const frame=document.createElement('iframe');frame.src='maintenance-court.html';frame.title='İki oyuncu pepper antrenmanı yapıyor';frame.tabIndex=-1;frame.setAttribute('aria-hidden','true');frame.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;background:transparent;pointer-events:none;z-index:0';gate.prepend(frame);const copy=gate.querySelector('.maintenance-copy');copy.style.cssText='position:relative;z-index:1;pointer-events:none;background:#dce9dfd9;padding:18px 20px;border-radius:18px';return()=>{frame.src='about:blank';frame.remove();};};
})();
