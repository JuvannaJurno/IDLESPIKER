(function(root){'use strict';
const decimal=new Intl.NumberFormat('tr-TR',{maximumFractionDigits:1}),units=['','k','m','b','t','qa','qi'];
function compact(value){const n=Number(value);if(!Number.isFinite(n))return '—';const a=Math.abs(n);if(a>=1e21)return n.toExponential(1).replace('.',',');if(a<1000)return decimal.format(n);const unit=Math.min(units.length-1,Math.floor(Math.log10(a)/3)),scaled=Math.floor(a/1000**unit*10)/10;return (n<0?'-':'')+decimal.format(scaled)+units[unit];}
function exact(value){return Number(value).toLocaleString('tr-TR',{maximumFractionDigits:2});}
const api={compact,exact};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NumberUI=api;
})(globalThis);
