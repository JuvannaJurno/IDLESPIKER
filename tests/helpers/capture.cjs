const fs=require('node:fs/promises'),path=require('node:path');
// Capture once, retry only the Windows file write when a scanner briefly locks an audit image.
module.exports=async function capture(page,options={}){
 const {path:file,...settings}=options,buffer=await page.screenshot(settings);
 if(!file)return buffer;
 await fs.mkdir(path.dirname(file),{recursive:true});
 for(let attempt=0;;attempt++)try{await fs.writeFile(file,buffer);return buffer}catch(error){
  if(attempt>=4||!['UNKNOWN','EBUSY','EACCES','EPERM'].includes(error.code))throw error;
  await new Promise(resolve=>setTimeout(resolve,150));
 }
};
