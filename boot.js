(function(){
const screen=document.getElementById('bootScreen');if(!screen)return;
const pepper=document.getElementById('bootPepper');if(pepper){if(matchMedia('(prefers-reduced-motion: reduce)').matches){pepper.autoplay=false;pepper.pause();pepper.removeAttribute('src');pepper.load();}else pepper.play().catch(()=>{});}
const images=[...document.images].filter(img=>{const r=img.getBoundingClientRect();return r.width&&r.height&&r.bottom>0&&r.top<innerHeight});
const ready=Promise.all(images.map(img=>img.decode?img.decode().catch(()=>{}):Promise.resolve()));
function finish(){clearTimeout(window.bootFallback);pepper?.pause();pepper?.removeAttribute('src');pepper?.load();screen.remove()}
// Audio and off-screen cards never hold up the opening screen.
const minimum=new Promise(resolve=>setTimeout(resolve,Math.max(0,1500-(performance.now()-(window.bootStartedAt??performance.now())))));
Promise.all([ready,minimum,window.GameLanguage?.ready]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(finish)));
})();
