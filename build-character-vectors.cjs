// Rebuild without the old PNG directory. Legacy IDs intentionally preserve saved appearances.
const fs=require('fs'),path=require('path');const manifest=JSON.parse(fs.readFileSync('character_assets/character-layout.json','utf8'));
const source=file=>'data:image/svg+xml;base64,'+fs.readFileSync('character_assets/parts/'+file).toString('base64');const assets={};for(const key of Object.keys(manifest.dimensions))assets[key]=source(key.replace(/^PNG\//,'').replace(/\.png$/,'.svg'));
fs.writeFileSync('team-asset-data.js','window.TeamAssetData='+JSON.stringify({assets,dimensions:manifest.dimensions,base:manifest.base})+';\n');
fs.writeFileSync('profile-hair-data.js','// Profile-only styles: never enter the roster generation pool.\nwindow.ProfileHairCatalog='+JSON.stringify(manifest.profileStyles.map(p=>({...p,source:source(p.file)})))+';\n');console.log('Built',Object.keys(assets).length,'vector parts and',manifest.profileStyles.length,'profile-only hair styles.');
