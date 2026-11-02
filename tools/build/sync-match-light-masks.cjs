const fs=require('../maintenance/source-files.cjs');
const assets={vision:'assets/effects/window_h_blur.png',player:'assets/effects/window_g_blur.png',ball:'assets/effects/window_h.png',light:'assets/effects/window_h_noise.png'};
const data=Object.fromEntries(Object.entries(assets).map(([id,file])=>[id,'data:image/png;base64,'+fs.readFileSync(file).toString('base64')]));
fs.writeFileSync('scripts/game/match-light-mask-data.js','window.MatchLightMaskData='+JSON.stringify(data)+';\n');
