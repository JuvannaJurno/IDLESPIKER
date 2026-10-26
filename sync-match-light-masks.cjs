const fs=require('fs');
const assets={vision:'window_h_blur.png',player:'window_g_blur.png',ball:'window_h.png',light:'window_h_noise.png'};
const data=Object.fromEntries(Object.entries(assets).map(([id,file])=>[id,'data:image/png;base64,'+fs.readFileSync(file).toString('base64')]));
fs.writeFileSync('match-light-mask-data.js','window.MatchLightMaskData='+JSON.stringify(data)+';\n');
