import {createRequire} from 'node:module';import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),project=path.join(root,'../project'),out=path.join(project,'output');
const require=createRequire(path.join(root,'packages/provider-html-local/package.json'));const {default:puppeteer}=await import(require.resolve('puppeteer-core'));
const browser=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{const page=await browser.newPage();await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});let errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.setContent('<!doctype html><meta charset="utf-8"><style>body{margin:0}canvas{display:block}</style><canvas width="1920" height="1080"></canvas>');
for(const f of ['data.js','art.js','film.js'])await page.addScriptTag({content:fs.readFileSync(path.join(project,'src',f),'utf8')});
const audit=await page.evaluate(async()=>{await document.fonts.ready;const ctx=document.querySelector('canvas').getContext('2d');let errors=[],maxWidth=0;
for(let t=0;t<118;t+=.25){try{JianzaoFilm.draw(ctx,t)}catch(e){errors.push({t,error:String(e)})}}
function signature(t){JianzaoFilm.draw(ctx,t);let d=ctx.getImageData(0,0,1920,1080).data,h=0;for(let i=0;i<d.length;i+=131)h=(Math.imul(h,31)+d[i])|0;return h}
let det=[0,20,40,63,85,88.8,94.5,96,113].map(t=>{let a=signature(t);signature(5);return {t,pass:a===signature(t)}});
ctx.font='500 52px "Noto Sans CJK SC"';let hanWidth=ctx.measureText('庞涓减灶').width;
return {version:JianzaoFilm.version,frames:7080,duration:118,samples:472,drawErrors:errors,determinism:det,hanWidth,captionCount:JIANZAO_DATA.captions.length,finalQuestion:JIANZAO_DATA.finalQuestion};});
audit.pageErrors=errors;audit.systemCjkFonts=true;fs.writeFileSync(path.join(out,'cloud-audit.json'),JSON.stringify(audit,null,2));
if(errors.length||audit.drawErrors.length||audit.determinism.some(x=>!x.pass)||audit.hanWidth<180)throw Error('Cloud visual audit failed: '+JSON.stringify(audit));
for(const [i,t] of [1.2,8.5,20,29,42.5,53,65,72,89,94.2,96,113].entries()){await page.evaluate(t=>JianzaoFilm.draw(document.querySelector('canvas').getContext('2d'),t),t);await page.screenshot({path:path.join(out,'review-source-'+String(i).padStart(2,'0')+'.jpg'),type:'jpeg',quality:83});}
console.log('CLOUD_VISUAL_AUDIT_OK',JSON.stringify(audit));}finally{await browser.close();}
