(function(){
'use strict';if(!window.AcademyPreview)return;
window.AcademyBallPicker={mount({host,storage,onChange}){
 const panel=document.createElement('div');panel.className='academy-ball-picker';panel.innerHTML='<span>Top</span><div class="academy-ball-options" role="group" aria-label="Antrenman topunu seç"></div>';host.append(panel);
 const options=panel.lastElementChild;let selected='classic';try{selected=storage.getItem('ball-choice-v1')||'classic';}catch{}
 function outline(base){const edge=document.createElement('canvas');edge.width=edge.height=128;const e=edge.getContext('2d');for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(dx*dx+dy*dy<=10)e.drawImage(base,dx,dy);e.globalCompositeOperation='source-in';e.fillStyle='#2e3d43';e.fillRect(0,0,128,128);e.globalCompositeOperation='source-over';e.drawImage(base,0,0);const g=base.getContext('2d'),pixels=g.getImageData(0,0,128,128).data,ring=e.createImageData(128,128);for(let y=1;y<127;y++)for(let x=1;x<127;x++){const i=(y*128+x)*4,a=pixels[i+3],inner=Math.min(a,pixels[i-4+3],pixels[i+4+3],pixels[i-512+3],pixels[i+512+3]);ring.data[i]=46;ring.data[i+1]=61;ring.data[i+2]=67;ring.data[i+3]=Math.round((a-inner)*.85);}const overlay=document.createElement('canvas');overlay.width=overlay.height=128;overlay.getContext('2d').putImageData(ring,0,0);e.drawImage(overlay,0,0);return edge.toDataURL('image/png');}
 const choices=[{id:'classic',name:'Mevcut top',thumb:'ball_volley1.png',src:null}];
 function choose(choice,save=true){selected=choice.id;for(const button of options.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.ballChoice===selected));if(save)try{storage.setItem('ball-choice-v1',selected);}catch{}onChange({id:choice.id,src:choice.src});}
 function add(choice){choices.push(choice);button(choice);}
 function button(choice){const b=document.createElement('button');b.type='button';b.dataset.ballChoice=choice.id;b.setAttribute('aria-pressed',String(choice.id===selected));b.setAttribute('aria-label',choice.name);b.title=choice.name;const img=document.createElement('img');img.src=choice.thumb;img.alt='';b.append(img);b.onclick=()=>{choose(choice);window.GameAudio?.uiClick?.();};options.append(b);}
 button(choices[0]);
 const script=document.createElement('script');script.src='academy-ball-atlas-data.js?v='+Date.now();script.onload=()=>{
  const data=window.AcademyBallAtlasData;if(!data)return;const atlas=new Image();atlas.onload=()=>{
   for(const [id,name,x,y,w,h]of data.cells){const crop=document.createElement('canvas');crop.width=w;crop.height=h;const g=crop.getContext('2d',{willReadFrequently:true});g.drawImage(atlas,x,y,w,h,0,0,w,h);const pixels=g.getImageData(0,0,w,h).data;let left=w,top=h,right=0,bottom=0;
    for(let row=0;row<h;row++)for(let col=0;col<w;col++)if(pixels[(row*w+col)*4+3]>16){left=Math.min(left,col);right=Math.max(right,col);top=Math.min(top,row);bottom=Math.max(bottom,row);}
    if(left>right||top>bottom)continue;
    const bw=right-left+1,bh=bottom-top+1,tile=document.createElement('canvas');tile.width=tile.height=128;const ctx=tile.getContext('2d'),scale=116/Math.max(bw,bh);ctx.drawImage(crop,left,top,bw,bh,(128-bw*scale)/2,(128-bh*scale)/2,bw*scale,bh*scale);const src=outline(tile);add({id,name,src,thumb:src});
   }
   const original=new Image();original.onload=()=>{const tile=document.createElement('canvas');tile.width=tile.height=128;const g=tile.getContext('2d'),scale=116/Math.max(original.naturalWidth,original.naturalHeight);g.drawImage(original,(128-original.naturalWidth*scale)/2,(128-original.naturalHeight*scale)/2,original.naturalWidth*scale,original.naturalHeight*scale);choices[0].src=choices[0].thumb=outline(tile);options.querySelector('[data-ball-choice=classic] img').src=choices[0].thumb;choose(choices.find(choice=>choice.id===selected)||choices[0],false);};original.src=data.classicSrc;
  };atlas.src=data.src;
 };document.head.append(script);
 return panel;
}};
})();
