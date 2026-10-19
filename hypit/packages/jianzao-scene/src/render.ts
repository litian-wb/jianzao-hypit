import { sealVisualTrack } from '@hypit/composition';
import { htmlVisual } from '@hypit/html-program';
import { assertTemporalWindowFor } from '@hypit/temporal';
import type { Timeline } from '@hypit/timeline';
import type { SpatialFrame } from '@hypit/spatial';
import type { TemporalWindow } from '@hypit/temporal';
import { FILM_SOURCE, DATA_SOURCE, ART_SOURCE } from './bundle.js';
/** setup and frame evaluation share the exact code inspected in the browser. */
export function renderJianzao(timeline:Timeline,within:SpatialFrame,window:TemporalWindow,options:{id:string}){
 assertTemporalWindowFor(window,{subjectId:options.id,timeline});
 const frames=window.span.endFrameExclusive-window.span.startFrame;
 if(frames!==7080)throw new Error('This authored source requires 118s at 60fps (7080 frames); revise timeline + data together.');
 const program=htmlVisual({
  html:'<canvas class="jz-canvas" width="1920" height="1080"></canvas>',
  css:':scope{background:#344650;overflow:hidden}.jz-canvas{width:100%;height:100%;display:block}',
  data:{fps:60},
  setup:DATA_SOURCE+'\n'+ART_SOURCE+'\n'+FILM_SOURCE+'\nconst canvas=root.querySelector("canvas"),ctx=canvas.getContext("2d");return frame=>{window.JianzaoFilm.draw(ctx,frame/data.fps,{captions:true});};'
 });
 return sealVisualTrack({id:options.id,timelineId:timeline.id,visualIr:'hypit.visual-ir@1',presents:[{id:options.id,order:0,z:0,span:window.span,elements:[{id:'jianzao',kind:'program',order:0,program,style:[{name:'position',value:'absolute'},{name:'left',value:`${within.xPx}px`},{name:'top',value:`${within.yPx}px`},{name:'width',value:`${within.widthPx}px`},{name:'height',value:`${within.heightPx}px`}]}]}]});
}
