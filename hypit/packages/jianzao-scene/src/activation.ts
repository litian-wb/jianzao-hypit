/* Adapted API structure from Hypit chat-scene, commit dc2b7a8f31b1ef1443a79ca448548d69e3ceb6a0.
 * Hypit.AI modified Apache-2.0 terms: see hypit/UPSTREAM-LICENSE.txt. */
import { assertAttributes, assertEmptyElement, createMarkupSurfaceFacet, textAttribute } from '@hypit/hypit/markup';
import { canonicalize, sameType } from '@hypit/hypit/protocol';
import type { ModuleManifest, TypeRef } from '@hypit/hypit/protocol';
import { sealGraphFragment } from '@hypit/hypit/author';
import { createProducerPackageFacet } from '@hypit/hypit/producer';
import { createAdmissionPackageFacet } from '@hypit/hypit/admission';
import type { ProducerPackage } from '@hypit/hypit/producer';
import type { AdmissionPackage } from '@hypit/hypit/admission';
import type { StructuredSurfaceHandler, SurfaceResolvedReference } from '@hypit/hypit/markup';
import { compositionTypes } from '@hypit/composition';
import { timelineTypes } from '@hypit/timeline';
import type { Timeline } from '@hypit/timeline';
import { spatialTypes } from '@hypit/spatial';
import type { SpatialFrame } from '@hypit/spatial';
import { temporalTypes } from '@hypit/temporal';
import type { TemporalWindow } from '@hypit/temporal';
import { resolveTemporalWindowReference, resolveTemporalContext, temporalContextAttributeVocabulary, temporalWindowAttributeNames, temporalWindowAttributeVocabulary } from '@hypit/temporal/markup';
import { renderJianzao } from './render.js';
const module = {name:'@jianzao/scene',version:'1'} as const;
const optionsType:TypeRef={module,name:'Options'};
const producer={module,name:'render'};
const ports=[{name:'timeline',type:timelineTypes.timeline},{name:'within',type:spatialTypes.frame},{name:'window',type:temporalTypes.window},{name:'options',type:optionsType}];
export const manifest:ModuleManifest={format:'hypit.module@1',...module,
 dependencies:[compositionTypes.visualTrack,timelineTypes.timeline,spatialTypes.frame,temporalTypes.window].map(type=>({module:type.module})),
 types:[{name:'Options'}],capabilities:[],producers:[{name:'render',inputs:ports,outputs:[{name:'visual',type:compositionTypes.visualTrack}],needs:[]}]};
const inline=<T>(record:{value:{kind:string;value?:unknown}}|undefined):T=>{if(record?.value.kind!=='inline')throw new Error('Scene inputs must be inline');return record.value.value as T;};
const value=(x:unknown)=>({kind:'inline' as const,value:canonicalize(x)});
const handlers:ProducerPackage&AdmissionPackage={producers:[{producer,handler:({inputs})=>({outputs:{visual:value(renderJianzao(inline<Timeline>(inputs.timeline),inline<SpatialFrame>(inputs.within),inline<TemporalWindow>(inputs.window),inline<{id:string}>(inputs.options)))},needs:{}})}]};
export const decodeSurface:StructuredSurfaceHandler=({element,resolveReference})=>{
 assertAttributes(element,['id','timeline','within',...temporalWindowAttributeNames]);assertEmptyElement(element);
 const id=textAttribute(element,'id'),context=resolveTemporalContext({element,resolveReference}),window=resolveTemporalWindowReference({element,resolveReference});
 const raw=element.attributes.within;if(typeof raw!=='object'||raw.kind!=='reference')throw new Error('within must be a Frame reference');
 const found=resolveReference(raw.path);if(!found||!sameType(found.type,spatialTypes.frame))throw new Error('within must be a SpatialFrame');
 const record={id:`${id}.options`,type:optionsType,value:value({id}),range:element.range};
 const input=(name:string)=>({kind:'fragment-input' as const,name});
 const fragment=sealGraphFragment({inputs:ports,operations:[{id:'render',producer,inputs:{timeline:input('timeline'),within:input('within'),window:input('window'),options:input('options')},result:{kind:'output',name:'visual'}}],exports:[{name:'visual',type:compositionTypes.visualTrack,root:{kind:'fragment-operation',operation:'render'}}]});
 const bindings:Record<string,SurfaceResolvedReference['ref']>={timeline:context.timeline.ref,within:found.ref,window:window.ref,options:{kind:'record',id:record.id}};
 return {records:[record],fragments:[fragment],components:[{id,fragment:fragment.id,inputs:bindings,outputs:{visual:`${id}.visual`},range:element.range}],exports:[`${id}.visual`]};
};
const declaration={name:'scene',tag:'Scene',mode:'structured' as const,outputs:[compositionTypes.visualTrack,optionsType],vocabulary:{summary:'Authored 118-second deterministic Jianzao scene; no model requests.',attributes:[...temporalContextAttributeVocabulary,...temporalWindowAttributeVocabulary,{name:'id',kind:'literal' as const,required:true,summary:'Scene identity'},{name:'within',kind:'expression' as const,required:true,summary:'Full Canvas frame'}],children:[],ports:[{name:'visual',type:compositionTypes.visualTrack,summary:'Jianzao authored picture'}],example:'<jz:Scene id="story" timeline={animation.timeline} within={canvas.bounds} during={animation.window}/>'}};
export const hypitPackage={format:'hypit.package@1' as const,modules:[{manifest}],facets:[createProducerPackageFacet(handlers),createAdmissionPackageFacet(handlers),createMarkupSurfaceFacet({module,declaration,handler:decodeSurface})]};
export default hypitPackage;
