(function(root){'use strict';
const formats={tr:new Intl.NumberFormat('tr-TR',{maximumFractionDigits:1}),en:new Intl.NumberFormat('en-US',{maximumFractionDigits:1})},units=['','k','m','b','t','qa','qi'];
const english=()=>root.GameLanguage?.current==='en';
function compact(value){const n=Number(value);if(!Number.isFinite(n))return '—';const decimal=formats[english()?'en':'tr'],a=Math.abs(n);if(a>=1e21)return english()?n.toExponential(1):n.toExponential(1).replace('.',',');if(a<1000)return decimal.format(n);const unit=Math.min(units.length-1,Math.floor(Math.log10(a)/3)),scaled=Math.floor(a/1000**unit*10)/10;return (n<0?'-':'')+decimal.format(scaled)+units[unit];}
function exact(value){return Number(value).toLocaleString(english()?'en-US':'tr-TR',{maximumFractionDigits:2});}
const api={compact,exact};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NumberUI=api;
})(globalThis);
