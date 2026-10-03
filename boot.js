(function(){
const screen=document.getElementById('bootScreen');if(!screen)return;
const images=[...document.images].filter(img=>{const r=img.getBoundingClientRect();return r.width&&r.height&&r.bottom>0&&r.top<innerHeight});
const ready=Promise.all(images.map(img=>img.decode?img.decode().catch(()=>{}):Promise.resolve()));
function finish(){clearTimeout(window.bootFallback);screen.remove()}
// Audio and off-screen cards never hold up the opening screen.
const minimum=new Promise(resolve=>setTimeout(resolve,Math.max(0,1500-(performance.now()-(window.bootStartedAt??performance.now())))));
Promise.all([ready,minimum]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(finish)));
})();
