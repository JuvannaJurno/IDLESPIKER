(function(){
const screen=document.getElementById('bootScreen');if(!screen)return;
const pepper=document.getElementById('bootPepper');
const images=[...document.images].filter(img=>{const r=img.getBoundingClientRect();return r.width&&r.height&&r.bottom>0&&r.top<innerHeight});
const ready=Promise.all(images.map(img=>img.decode?img.decode().catch(()=>{}):Promise.resolve()));
function finish(){clearTimeout(window.bootFallback);pepper?.pause();pepper?.removeAttribute('src');pepper?.load();screen.classList.add("is-finishing");setTimeout(()=>screen.remove(),matchMedia("(prefers-reduced-motion: reduce)").matches?0:170)}
// Audio and off-screen cards never hold up the opening screen.
const minimum=new Promise(resolve=>setTimeout(resolve,Math.max(0,1500-(performance.now()-(window.bootStartedAt??performance.now())))));
Promise.all([ready,minimum,window.GameLanguage?.ready]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(finish)));
})();
