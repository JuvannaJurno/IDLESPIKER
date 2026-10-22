(function(){
'use strict';
const original={uniform:'#ffffff',skin:'#ffe0b1',hair:'#bb8044',shoe:'#3f3b3b'};
const panel=document.createElement('section');panel.id='equipmentLab';panel.className='equipment-lab';panel.setAttribute('aria-labelledby','equipmentTitle');
panel.innerHTML=`<header><div><span class="eyebrow">VEKTÖR KARAKTER · PROTOTİP</span><h2 id="equipmentTitle">Beyaz formadan takım renklerine</h2><p>Orijinal karakter · Forma, ten, saç ve ayakkabı ayrı ayrı renklendirilir.</p></div><span class="equipment-source">charactersEquipment.svg · İlk beyaz forma</span></header><div class="equipment-layout"><div class="equipment-court"><div class="equipment-court-lines"></div><div class="equipment-runner"><div class="equipment-shadow"></div><div class="equipment-avatar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24.5 34.7">
<!-- Exact paths from charactersEquipment.svg / Layer0_28_FILL. Original painter order preserved. -->
<g id="equipment-character" transform="translate(-30 -275)">
<path data-part="uniform" data-tone="base" fill="var(--equipment-uniform, #FFFFFF)" stroke="none" d="
M 46.75 295.85
Q 46.5 296.1 46.3 296.35 44.85 297.8 43 298.3 42.8 298.35 42.6 298.4 42.15 298.9 41 299 40.75 299 40.45 299 37.4 299 35.15 297.15
L 35.15 297.95
Q 35.15 299.95 36.35 301.5 36.6 301.8 36.85 302.05 38.55 303.7 40.95 303.7 42.05 303.7 43 303.35 44.15 302.95 45.05 302.05 46.75 300.35 46.75 297.95
L 46.75 295.85
M 35.15 283.6
Q 37.4 281.75 40.45 281.75 40.75 281.75 41 281.8 42.1 281.85 42.55 282.3 42.8 282.35 43 282.4 44.85 282.9 46.3 284.35 46.5 284.6 46.75 284.85
L 46.75 282.75
Q 46.75 280.35 45.05 278.65 44.15 277.75 43 277.35 42.05 277 41 277
L 40.95 277
Q 38.55 277 36.85 278.65 35.15 280.35 35.15 282.75
L 35.15 283.6 Z"/>

<path data-part="uniform" data-tone="edge" fill="var(--equipment-uniform-edge, #CBCEE9)" stroke="none" d="
M 48.75 296.1
Q 48.75 295.95 48.8 295.85
L 46.75 295.85 46.75 297.95
Q 46.75 300.35 45.05 302.05 44.15 302.95 43 303.35 42.05 303.7 40.95 303.7 38.55 303.7 36.85 302.05 36.6 301.8 36.35 301.5 35.15 299.95 35.15 297.95
L 35.15 297.15 33.15 298.05
Q 33.2 299.95 34 301.5 34.55 302.55 35.45 303.5 37.75 305.7 40.95 305.7 42.05 305.7 43 305.45 44.9 304.95 46.45 303.5
L 46.5 303.5
Q 48.75 301.2 48.75 297.95
L 48.75 296.1
M 33.15 282.7
L 33.1 282.75 35.15 283.6 35.15 282.75
Q 35.15 280.35 36.85 278.65 38.55 277 40.95 277
L 41 277
Q 42.05 277 43 277.35 44.15 277.75 45.05 278.65 46.75 280.35 46.75 282.75
L 46.75 284.85 48.8 284.85
Q 48.75 284.75 48.75 284.65
L 48.75 282.75
Q 48.75 279.5 46.5 277.25
L 46.45 277.25
Q 44.9 275.75 43 275.25 42.05 275 41 275
L 40.95 275
Q 37.75 275 35.45 277.25 33.15 279.5 33.15 282.7 Z"/>

<path data-part="skin" data-tone="shadow" fill="var(--equipment-skin-shadow, #C4A26F)" stroke="none" d="
M 50.5 290.4
Q 50.5 290.35 50.5 290.3 50.45 287.75 49.35 286.3
L 49.35 286.25
Q 48.9 285.6 48.8 284.85
L 46.75 284.85
Q 46.9 286.25 47.7 287.4 48.45 288.5 48.5 290.35 48.45 292.2 47.7 293.3 46.9 294.45 46.75 295.85
L 48.8 295.85
Q 48.9 295.1 49.35 294.45 50.45 292.95 50.5 290.4 Z"/>

<path data-part="skin" data-tone="base" fill="var(--equipment-skin, #FFE0B1)" stroke="none" d="
M 43 282.4
Q 42.8 282.35 42.55 282.3 43.25 283 42.25 284.7 42.1 284.9 42 285.1 42.5 285.15 43 285.3 44.15 285.65 45.1 286.6 46.7 288.2 46.7 290.35 46.7 292.55 45.1 294.15 44.15 295.1 43 295.5 42.55 295.65 42.05 295.7 42.1 295.85 42.25 296.05 43.2 297.65 42.6 298.4 42.8 298.35 43 298.3 44.85 297.8 46.3 296.35 46.5 296.1 46.75 295.85 46.9 294.45 47.7 293.3 48.45 292.2 48.5 290.35 48.45 288.5 47.7 287.4 46.9 286.25 46.75 284.85 46.5 284.6 46.3 284.35 44.85 282.9 43 282.4 Z"/>

<path data-part="hair" data-tone="shadow" fill="var(--equipment-hair-shadow, #7E5125)" stroke="none" d="
M 34.5 284.2
Q 34.8 283.9 35.15 283.6
L 33.1 282.75 33.1 282.8
Q 31.2 284.65 30.5 287.05 30 288.5 30 290.2 30 290.3 30 290.35 30 290.45 30 290.55 30 292.3 30.5 293.8 31.2 296.1 33.1 298
L 33.15 298.05 35.15 297.15
Q 34.8 296.85 34.5 296.55 33 295.05 32.4 293.2 32 291.95 32 290.55 32 290.45 32 290.35 32 290.3 32 290.2 32 288.85 32.4 287.65 33 285.75 34.5 284.2 Z"/>

<path data-part="hair" data-tone="base" fill="var(--equipment-hair, #BB8044)" stroke="none" d="
M 40.45 281.75
Q 37.4 281.75 35.15 283.6 34.8 283.9 34.5 284.2 33 285.75 32.4 287.65 32 288.85 32 290.2 32 290.3 32 290.35 32 290.45 32 290.55 32 291.95 32.4 293.2 33 295.05 34.5 296.55 34.8 296.85 35.15 297.15 37.4 299 40.45 299 40.75 299 41 299 42.15 298.9 42.6 298.4 43.2 297.65 42.25 296.05 42.1 295.85 42.05 295.7 42.55 295.65 43 295.5 44.15 295.1 45.1 294.15 46.7 292.55 46.7 290.35 46.7 288.2 45.1 286.6 44.15 285.65 43 285.3 42.5 285.15 42 285.1 42.1 284.9 42.25 284.7 43.25 283 42.55 282.3 42.1 281.85 41 281.8 40.75 281.75 40.45 281.75 Z"/>
</g>
</svg>
</div></div><span class="equipment-mode-label">Duruş önizlemesi</span></div><div class="equipment-controls"><div class="equipment-colors">`+Object.entries({uniform:'Forma',skin:'Ten',hair:'Saç',shoe:'Ayakkabı'}).map(([key,label])=>'<label>'+label+'<input type="color" data-equipment-color="'+key+'" value="'+original[key]+'" aria-label="'+label+' rengi"></label>').join('')+`</div><label class="equipment-select">Parçaları incele<select id="equipmentLayer"><option value="all">Karakterin tamamı</option><option value="uniform">Yalnızca forma</option><option value="skin">Yalnızca ten</option><option value="hair">Yalnızca saç</option><option value="shoe">Yalnızca ayakkabı</option><option value="sleeve">Forma kolu</option><option value="arm-skin">Kol teni</option><option value="shorts">Şort</option><option value="leg-skin">Bacak teni</option></select></label><label class="equipment-select">Hareket<select id="equipmentMotion"><option value="idle">Bekleme</option><option value="walk">Yürüme</option><option value="still">Sabit</option><option value="spike">Smaç</option><option value="block">Blok</option><option value="receive">Manşet</option><option value="serve">Servis</option></select></label><label class="equipment-select">Yön<input id="equipmentDirection" type="range" min="-180" max="180" value="0" aria-label="Karakter yönü"></label><div class="equipment-actions"><button type="button" id="equipmentTeam">Takım renklerini dene</button><button type="button" id="equipmentReset">Orijinale dön</button></div><small>Renk ve hareket denemesi. Maç karakterlerini henüz değiştirmez.</small></div></div>`;
const pieces=document.createElement('div');pieces.className='equipment-pieces';pieces.innerHTML=`<div class="equipment-piece"><h3>Kol</h3><div class="equipment-piece-preview"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 20.2 15"><g transform="translate(-392 -295)"><path data-part="skin" data-piece="arm-skin" data-tone="base" fill="var(--equipment-skin, #FFE0B1)" stroke="none" d="
M 399.15 298
Q 400.8 301.7 399.2 305
L 406.8 305
Q 409.25 301.8 406.8 298
L 399.15 298 Z"/>
<path data-part="uniform" data-piece="sleeve" data-tone="base" fill="var(--equipment-uniform, #FFFFFF)" stroke="none" d="
M 398.95 297.55
Q 398.8 297.25 398.65 297
L 394 297 394 306 398.65 306
Q 398.85 305.7 399 305.4 399.1 305.2 399.2 305 400.8 301.7 399.15 298 399.05 297.8 398.95 297.55 Z"/>
<path data-part="uniform" data-piece="sleeve" data-tone="edge" fill="var(--equipment-uniform-edge, #CBCEE9)" stroke="none" d="
M 394 295
Q 393.15 295 392.6 295.6 392 296.15 392 297
L 392 306
Q 392 306.85 392.6 307.45 393.15 308 394 308
L 398.65 308
Q 399.15 308 399.6 307.8 400.05 307.55 400.35 307.1 400.35 307.05 400.4 307
L 399.2 305
Q 399.1 305.2 399 305.4 398.85 305.7 398.65 306
L 394 306 394 297 398.65 297
Q 398.8 297.25 398.95 297.55 399.05 297.8 399.15 298
L 400.4 296
Q 400.1 295.5 399.65 295.25 399.15 295 398.65 295
L 394 295 Z"/>
<path data-part="skin" data-piece="arm-skin" data-tone="shadow" fill="var(--equipment-skin-shadow, #C4A26F)" stroke="none" d="
M 407.75 296.25
Q 407.3 296 406.8 296
L 400.4 296 399.15 298 406.8 298
Q 409.25 301.8 406.8 305
L 399.2 305 400.4 307 406.8 307
Q 407.25 307 407.7 306.8 408.1 306.6 408.4 306.25 411.75 301.95 408.5 296.95 408.2 296.5 407.75 296.25 Z"/></g></svg></div><p>Forma kolu + ten</p></div><div class="equipment-piece"><h3>Bacak</h3><div class="equipment-piece-preview"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 20.2 15"><g transform="translate(-392 -315)"><path data-part="shoe" data-piece="shoe" data-tone="shadow" fill="var(--equipment-shoe-shadow, #2C2A2A)" stroke="none" d="
M 406.8 325
Q 409.25 321.8 406.8 318
L 403.8 318
Q 406.25 321.8 403.8 325
L 406.8 325 Z"/>
<path data-part="skin" data-piece="leg-skin" data-tone="shadow" fill="var(--equipment-skin-shadow, #C4A26F)" stroke="none" d="
M 400.4 327
L 403.8 327 403.8 325 399.2 325 400.4 327
M 403.8 318
L 403.8 316 400.4 316 399.15 318 403.8 318 Z"/>
<path data-part="uniform" data-piece="shorts" data-tone="base" fill="var(--equipment-uniform, #FFFFFF)" stroke="none" d="
M 398.95 317.55
Q 398.8 317.25 398.65 317
L 394 317 394 326 398.65 326
Q 398.85 325.7 399 325.4 399.1 325.2 399.2 325 400.8 321.7 399.15 318 399.05 317.8 398.95 317.55 Z"/>
<path data-part="skin" data-piece="leg-skin" data-tone="base" fill="var(--equipment-skin, #FFE0B1)" stroke="none" d="
M 403.8 318
L 399.15 318
Q 400.8 321.7 399.2 325
L 403.8 325
Q 406.25 321.8 403.8 318 Z"/>
<path data-part="shoe" data-piece="shoe" data-tone="base" fill="var(--equipment-shoe, #3F3B3B)" stroke="none" d="
M 403.8 316
L 403.8 318 406.8 318
Q 409.25 321.8 406.8 325
L 403.8 325 403.8 327 406.8 327
Q 407.25 327 407.7 326.8 408.1 326.6 408.4 326.25 411.75 321.95 408.5 316.95 408.2 316.5 407.75 316.25 407.3 316 406.8 316
L 403.8 316 Z"/>
<path data-part="uniform" data-piece="shorts" data-tone="edge" fill="var(--equipment-uniform-edge, #CBCEE9)" stroke="none" d="
M 392.6 315.6
Q 392 316.15 392 317
L 392 326
Q 392 326.85 392.6 327.45 393.15 328 394 328
L 398.65 328
Q 399.15 328 399.6 327.8 400.05 327.55 400.35 327.1 400.35 327.05 400.4 327
L 399.2 325
Q 399.1 325.2 399 325.4 398.85 325.7 398.65 326
L 394 326 394 317 398.65 317
Q 398.8 317.25 398.95 317.55 399.05 317.8 399.15 318
L 400.4 316
Q 400.1 315.5 399.65 315.25 399.15 315 398.65 315
L 394 315
Q 393.15 315 392.6 315.6 Z"/></g></svg></div><p>Şort + ten + ayakkabı</p></div>`;panel.append(pieces);
document.querySelector('.masthead').after(panel);
const avatar=panel.querySelector('.equipment-avatar'),runner=panel.querySelector('.equipment-runner');
function tint(hex,factors){return '#'+factors.map((f,i)=>Math.min(255,Math.max(0,Math.round(parseInt(hex.slice(1+i*2,3+i*2),16)*f))).toString(16).padStart(2,'0')).join('')}
function update(){for(const [key,base]of Object.entries(original)){const value=panel.querySelector('[data-equipment-color="'+key+'"]').value;panel.style.setProperty('--equipment-'+key,value);if(key==='uniform')panel.style.setProperty('--equipment-uniform-edge',tint(value,[203/255,206/255,233/255]));if(key==='skin')panel.style.setProperty('--equipment-skin-shadow',tint(value,[196/255,162/224,111/177]));if(key==='shoe')panel.style.setProperty('--equipment-shoe-shadow',tint(value,[44/63,42/59,42/59]));if(key==='hair')panel.style.setProperty('--equipment-hair-shadow',tint(value,[126/187,81/128,37/68]));}const layer=panel.querySelector('#equipmentLayer').value;panel.querySelectorAll('[data-part]').forEach(p=>p.style.visibility=layer==='all'||p.dataset.part===layer||p.dataset.piece===layer?'visible':'hidden');panel.style.setProperty('--equipment-direction',panel.querySelector('#equipmentDirection').value+'deg');runner.dataset.motion=panel.querySelector('#equipmentMotion').value;panel.querySelector('.equipment-mode-label').textContent={idle:'Bekleme',walk:'Yürüme',still:'Sabit',spike:'Smaç',block:'Blok',receive:'Manşet',serve:'Servis'}[runner.dataset.motion];}
panel.addEventListener('input',update);panel.querySelector('#equipmentTeam').onclick=()=>{for(const [key,value]of Object.entries({uniform:'#326db2',skin:'#b87e55',hair:'#302936',shoe:'#f3e9d2'}))panel.querySelector('[data-equipment-color="'+key+'"]').value=value;update()};panel.querySelector('#equipmentReset').onclick=()=>{for(const [key,value]of Object.entries(original))panel.querySelector('[data-equipment-color="'+key+'"]').value=value;panel.querySelector('#equipmentDirection').value=0;panel.querySelector('#equipmentLayer').value='all';panel.querySelector('#equipmentMotion').value='idle';update()};update();
})();