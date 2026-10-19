/* v5: original layered ink silhouettes; source preview, no encoded video. */
(function(G){'use strict';const A=G.JZArt,{P,cl,lerp,ease,rnd,path,stroke,ell,rect,text,save,person,torch,pennant,stove,stone,grass,tent,cart,archer,bolt}=A;let c,opt={},texture;
const ROAD=[[329,590],[403,351],[484,238],[527,229],[563,257],[494,365],[679,590]],TREE={x:681,base:452};
function camera(x,y,z,f){save(()=>{c.translate(480,270);c.scale(z,z);c.translate(-x,-y);f()})}
function paper(){if(!texture){texture=c.canvas.ownerDocument.createElement('canvas');texture.width=960;texture.height=540;let g=texture.getContext('2d'),im=g.createImageData(960,540);for(let i=0;i<im.data.length;i+=4){let v=rnd(i);im.data[i]=im.data[i+1]=im.data[i+2]=v>.5?235:22;im.data[i+3]=v>.92?13:0}g.putImageData(im,0,0)}save(()=>{c.globalCompositeOperation='soft-light';c.globalAlpha=.32;c.drawImage(texture,0,0)});}
function mountain(points,col){path(points,col);for(let i=0;i<points.length-2;i++){let [x,y]=points[i];if(y>470)continue;stroke([[x+8,y+18],[x+14,y+49],[x-3,y+87]],'rgba(204,202,170,.09)',.8)}}
function sky(kind=1,night=false){let grad=c.createLinearGradient(0,0,0,540);grad.addColorStop(0,night?'#243943':['#cbbda4','#c2b49f','#b1ad9b'][kind-1]);grad.addColorStop(1,night?'#59615c':'#ae9674');c.fillStyle=grad;c.fillRect(-80,-50,1120,650);
 for(let layer=0;layer<3;layer++){let pts=[[-80,540]];for(let x=-80;x<=1040;x+=45){let y=270-layer*49+Math.sin(x*.008+kind+layer)*38+Math.sin(x*.019+layer)*16;pts.push([x,y])}pts.push([1040,540]);path(pts,night?['#48585b','#3b5157','#30474e'][layer]:['#8e8c78','#a3a18b','#b4ae96'][layer]);}
 if(!night&&kind===1){ell(774,92,29,29,'#d5c9af');stroke([[0,153],[205,149],[287,155]],'rgba(225,214,187,.25)',6)}
 if(!night&&kind===2){stroke([[45,106],[298,111],[451,101]],'rgba(226,219,201,.28)',6);stroke([[513,137],[706,130],[904,138]],'rgba(226,219,201,.18)',3)}
}
function ground(kind=1,night=false){path([[-80,351],[112,332],[331,353],[549,333],[795,347],[1040,329],[1040,620],[-80,620]],night?'#414b46':['#aa8e67','#a29b80','#8f826a'][kind-1]);for(let i=0;i<62;i++){let x=rnd(i+30)*1040-40,y=356+rnd(i+800)*205;stroke([[x,y],[x+5+rnd(i)*17,y-.8]],night?'#536057':'rgba(206,181,136,.3)',.7)}
 if(kind===2){path([[-70,315],[180,291],[358,299],[603,273],[1010,296],[1010,328],[610,305],[365,333],[166,322],[-70,352]],'#7f948c');for(let i=0;i<23;i++){let x=rnd(i)*1020;stroke([[x,309],[x+16,308]],'#b7b7a0',.7)}}
 for(let i=0;i<14;i++){let x=rnd(i+61)*980,y=381+rnd(i+81)*129;grass(x,y,.4+rnd(i)*.7,night?'#707260':'#7f7756');if(i%3===0)stone(x-8,y,.5,night?'#4a5b59':'#8c8c74')}
}
function placeTag(s,night=false){if(!s||!opt.guide)return;text(s,52,52,14,night?'#c0c6b4':'#514b39')}
function guide(s){if(opt.guide){rect(40,75,440,35,'rgba(12,27,33,.85)');text(s,51,99,17,P.bone)}}
function campSet(day,t){sky(day);ground(day);
 if(day===1){tent(760,337,.64);tent(842,332,.49);cart(716,368,.62)}
 if(day===2){stone(63,354,.75);stone(137,345,1);}
 if(day===3){mountain([[652,346],[749,198],[812,221],[884,141],[1040,235],[1040,540],[841,540]],'#67796e');stroke([[736,314],[792,274],[819,286]],'#919d86',1)}
 // Illustrative ratio 60:30:18 = 10:5:3; digits are historical counts, arrays are schematic.
 let count=[60,30,18][day-1],cols=10;
 for(let i=0;i<count;i++){let row=Math.floor(i/cols),x=58+(i%cols)*72+(row%2)*23,y=345+row*19;stove(x,y,.22+row*.052,i+day*100)}
}
function number(day,u){if(u<[4.6,2.1,1.7][day-1]||u>[7.2,4.4,4.3][day-1])return;const s=['十万灶','五万灶','三万灶'][day-1];text(s,63,147,47,P.red)}
function gray(x,y,s,u){for(let i=0;i<9;i++){let p=cl((u-.5)/1.4);ell(x+(i-4)*3*s+p*15*s,y-(i%3)*s-p*4*s,1.5*s,.6*s,'#c8c0a5')}}
function scoutClose(u,t,day=1){sky(day);ground(day);stove(387,451,1.3,5);let q=ease((u-.2)/1.9),px=473,py=449,s=1.55;
 let h=[lerp(-10,-40,q),lerp(-43,-27,q)];let actor=person(px,py,s,t,{kneel:true,hand:h,left:[15,-47]});stroke([actor.hand,[actor.hand[0]-64,actor.hand[1]+16]],'#775b3b',2.3);gray(386,455,1,u);
 stone(271,469,.6);grass(646,445,1.3);
}
function report(day,u,t){campSet(day,t);let ph=ease(u/1.6),x=lerp(780,552,ph);person(652,454,1.23,t,{commander:true,hand:u>2.3?[42,-72]:[18,-57]});person(x,450,1.16,t,{flip:true,walk:u<1.6?1:0,hand:u>1.6?[35,-70]:[17,-53]});pennant(850,431,.7,t);
 for(let i=0;i<6;i++)person(750+i*25+(u>3?(u-3)*12:0),392+(i%2)*10,.55,t,{walk:u>3?1:0,spear:true,phase:i});
}
function tally(u,t){
 sky(2);ground(2);camera(482,345,1.24,()=>{
  // A different observation: count the rows, mark a tally, then report.
  for(let i=0;i<30;i++)stove(113+i%10*65,355+Math.floor(i/10)*28,.43,i);
  let p=ease(u/3),h=person(774,434,1.05,t,{flip:true,hand:[lerp(16,39,p),lerp(-54,-73,p)]});
  stroke([h.hand,[lerp(688,188,p),371]],'#786147',1.6);
  stone(818,449,.7);
 });
 if(u>=2.1&&u<4.6)text('五万灶',64,117,40,P.red);
}
function decision(u,t){
 const q=u-4.5;
 camera(592,360,1.65,()=>{sky(3);ground(3);mountain([[751,359],[827,222],[928,177],[1060,242],[1060,560]],'#6c7a6c');
  let run=ease(q/2.4),sx=lerp(410,521,run),handoff=ease((q-2.3)/1.15),turn=ease((q-4.4)/1.35);
  let a=person(sx,448,1.15,t,{walk:q<2.4?1:0,hand:q>2.5?[35+Math.sin(q*1.1)*3,-67]:[lerp(18,41,handoff),lerp(-52,-67,handoff)]});
  let b=person(621,450,1.2,t,{commander:true,hand:[lerp(-21,44,turn),lerp(-65,-74,turn)],left:q>2.4&&q<4.5?[-38,-64]:[-23,-58]});
  for(let i=0;i<7;i++)person(759+i*29+(q>5?(q-5)*21:0),410+(i%2)*10,.65,t,{walk:q>5?1:0,spear:true,phase:i});pennant(806,419,.67,t);
 });
}
function camp(day,u,t){
 if(day===1){if(u<3.2)camera(441,347,1.48,()=>scoutClose(u,t));
  else if(u<7.3){camera(473,314,1.13+ease((u-3.2)/4)*.035,()=>{campSet(1,t);let h=person(798,430,.83,t,{hand:[lerp(18,42,ease((u-3.4)/1.8)),-68]});stroke([h.hand,[700,405]],'#6e5a3f',1.7)});number(day,u)}
  else camera(615,338,1.3,()=>report(1,u-7.3,t));
 }else if(day===2){
  if(u<5.2)tally(u,t);
  else {camera(615,338,1.3,()=>report(2,u-5.2,t));}
 }else{
  if(u<4.5){camera(478+ease(u/4.5)*17,328,1.21,()=>{campSet(3,t);person(780-u*11,420,.73,t,{walk:.7,hand:[30,-69]});});number(day,u)}
  else decision(u,t);
 }
 if(day===3&&u>=4.5&&u<11.7)text('情节演绎',902,52,13,'#625d4b','right');
 guide('观察与解释不是同一件事');
}
function arrange(u,t){camera(472+ease(u/7)*14,334,1.26,()=>{sky(2);ground(2);tent(825,339,.65);cart(775,369,.58);
 // Nothing disappears: a small new camp is built; the army leaves it behind.
 for(let i=0;i<4;i++)stove(209+i*72,399+(i%2)*10,.65,i+10);
 let build=ease(u/2.7);save(()=>{c.translate(356,451);c.scale(1,.48+build*.52);stove(0,0,.86,90)});let exit=Math.max(0,u-2.8),px=418+exit*27,walk=u>2.8?1:0;
 let hand=u<2.8?[-36,-36+Math.sin(u*5)*3]:[16,-52];let h=person(px,450,1.2,t,{qi:true,kneel:u<2.8,walk,hand});if(u<2.8){ell(h.hand[0]-8,h.hand[1]+2,8,4,'#ae8658');stroke([h.hand,[365,432]],'#8f7755',3)}
 let lead=477+u*24;for(let i=0;i<10;i++)person(lead+i*37,392+(i%2)*12,.62,t,{qi:true,walk:1,spear:true,phase:i});pennant(lead+87,394,.62,t,true);
 });placeTag('齐军一侧 · 新营');guide('少筑灶 → 成队离营；不是兵在凭空消失');}
function split(u,t){
 if(u<3.0){camera(606,335,1.27,()=>{sky(3);ground(3);person(625,454,1.25,t,{commander:true,hand:[42,-73]});let h=person(508,450,1.18,t,{hand:[22,-69]});pennant(h.hand[0],h.hand[1]+65,.87,t);for(let i=0;i<7;i++)person(735+i*27,404+(i%2)*11,.65,t,{spear:true,phase:i});});return}
 let p=ease((u-3)/6.6),lead=lerp(460,865,p),rear=lerp(190,259,p);let cam=lerp(480,572,ease((u-5)/6));
 camera(cam,278,1.01,()=>{sky(3);ground(3);path([[-90,377],[1100,373],[1100,477],[-90,481]],'#ad9571');
 for(let k=0;k<20;k++)stroke([[-70+k*66,431],[-56+k*66,430]],'#bba784',.7);
 for(let i=0;i<12;i++){let xx=rear-(i%4)*36,yy=414+Math.floor(i/4)*17;person(xx,yy,.75,t,{walk:.45,spear:true,phase:i})}pennant(rear-42,431,.75,t);
 for(let i=0;i<8;i++){let xx=lead-(i%4)*34,yy=414+Math.floor(i/4)*20;person(xx,yy,.75,t,{walk:1,spear:true,phase:i})}person(lead+31,434,.78,t,{walk:1,commander:true});pennant(lead-24,431,.75,t);
 mountain([[982,384],[1031,211],[1114,187],[1170,540],[1012,540]],'#687769');
 // The rear stays on the same road. The foreground is only quiet scrub.
 for(let k=0;k<5;k++){grass(50+k*178,510,1.3);stone(120+k*169,494,.7)}
 });guide('前队加速，后队保持步速；同一条道路');}
const GORGE_CENTER=[[-95,497],[100,470],[290,438],[408,388],[456,336],[550,302],[711,255],[787,234]];
function routeAt(d){let n=GORGE_CENTER.length-1,z=cl(d)*n,j=Math.min(n-1,Math.floor(z)),u=z-j;
 let p0=GORGE_CENTER[Math.max(0,j-1)],p1=GORGE_CENTER[j],p2=GORGE_CENTER[j+1],p3=GORGE_CENTER[Math.min(n,j+2)];
 return [0,1].map(k=>.5*((2*p1[k])+(-p0[k]+p2[k])*u+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*u*u+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*u*u*u));
}
function gorge(u,t){camera(lerp(464,510,ease(u/11)),324,1.16,()=>{
 sky(3);ground(3);
 mountain([[-80,252],[27,205],[123,241],[202,181],[294,247],[340,334],[330,422],[-80,463]],'#66786b');
 let left=[],right=[];for(let i=0;i<=70;i++){let d=i/70,p=routeAt(d),n=routeAt(Math.min(1,d+.003)),dx=n[0]-p[0],dy=n[1]-p[1],l=Math.hypot(dx,dy)||1,w=lerp(35,11,ease((d-.12)/.6));left.push([p[0]-dy/l*w,p[1]+dx/l*w]);right.push([p[0]+dy/l*w,p[1]-dx/l*w]);}
 path([...left,...right.reverse()],'#af9875');
 for(let i=0;i<22;i++){let d=.13+i*.027+u*.014,xy=routeAt(d),sf=lerp(.93,.23,cl(d));let spacing=lerp(19,0,ease((d-.22)/.3));xy[1]+=(i%3-1)*spacing;person(xy[0],xy[1],sf,t,{walk:1,spear:i%3===0,phase:i,commander:i===21})}
 // Behind is on the same unbroken road, not a pasted miniature cutaway.
 for(let i=0;i<6;i++){let d=.035+i*.011+u*.001,xy=routeAt(d);person(xy[0],xy[1],.76,t,{walk:.35,phase:i})}
 // The distant road continues behind this ridge; the bend does not end in the sky.
 mountain([[661,301],[676,242],[718,206],[779,180],[849,198],[939,128],[1045,177],[1045,374],[832,365],[727,331]],'#596f65');
 mountain([[645,575],[653,442],[675,379],[728,355],[787,310],[858,282],[990,294],[1040,575]],'#334f4c');
 for(let i=0;i<15;i++){let x=725+rnd(i)*243,y=378+rnd(i+90)*130;stroke([[x,y],[x-6,y+18]],'#607669',.8)}
 });}

function patchPath(){path([[648,143],[661,139],[672,141],[683,136],[697,141],[700,180],[696,192],[702,222],[697,243],[702,278],[697,323],[681,329],[668,324],[645,331],[642,299],[646,275],[641,241],[647,213],[643,181]],null)}
function tree(tr,showLetters=true){
 path([[619,454],[633,344],[629,246],[642,152],[635,72],[647,-20],[707,-20],[701,92],[711,187],[703,288],[714,382],[733,456]],'#303a32');
 stroke([[641,163],[582,103],[562,52]],'#303a32',13);stroke([[707,205],[765,154],[817,141]],'#303a32',15);stroke([[700,100],[744,60],[758,17]],'#303a32',10);
 for(let i=0;i<11;i++){let x=637+i*6;stroke([[x,439],[x-3,405],[x+3,367],[x-1,339]],'#59634e',.8)}
 save(()=>{patchPath();c.clip();rect(630,130,86,205,'#435244');for(let i=0;i<14;i++){let xx=644+i*4;stroke([[xx,142],[xx+Math.sin(i)*2,228],[xx-2,329]],'#536250',.5)}
 if(tr){let lift=cl((334-tr[1])/63),r=99+lift*125,g=c.createRadialGradient(tr[0],tr[1],1,tr[0],tr[1],r);g.addColorStop(0,'rgba(245,208,139,.84)');g.addColorStop(.5,'rgba(238,201,137,.5)');g.addColorStop(1,'rgba(237,199,138,0)');c.fillStyle=g;c.fillRect(630,130,86,205);
  // Only illuminated strokes become information. No fully legible inscription beforehand.
  if(showLetters&&lift>.1){let words=['庞涓死于','此树之下'];for(let k=0;k<2;k++)for(let j=0;j<4;j++){
   c.globalAlpha=ease((lift-.12-j*.025)/.7);text(words[k][j],684-k*24,178+j*34,18,P.ink,'center');}
  }
 }
 });
 if(tr){save(()=>{let g=c.createRadialGradient(tr[0],tr[1],4,tr[0],tr[1],98);g.addColorStop(0,'rgba(235,166,82,.12)');g.addColorStop(1,'rgba(235,166,82,0)');c.fillStyle=g;c.fillRect(tr[0]-98,tr[1]-98,196,196)})}
}

function commander(x,y,s,t,lift=0,walk=0){let hand=[lerp(20,29,lift),lerp(-53,-108,lift)],p=person(x,y,s,t,{commander:true,hand,walk});return torch(p.hand,s*.86,t)}
function valleyBase(t){sky(3,true);ground(3,true);path(ROAD,'#7f7b61');mountain([[408,260],[431,214],[474,181],[518,187],[544,211],[581,218],[581,248],[526,260]],'#334c50');for(let i=0;i<10;i++)stroke([[421+i*13,400+i*8],[431+i*14,384+i*8]],'#8a876e',.7);
 mountain([[-80,278],[42,228],[128,251],[173,216],[234,283],[277,361],[305,540],[-80,540]],'#1b343c');
 mountain([[730,540],[751,363],[778,305],[824,263],[884,202],[1040,247],[1040,540]],'#1e373e');
 for(let i=0;i<9;i++){stone(60+i*27,359+i*11,.6,'#394d4e');grass(835+i*15,394+i*9,.6,'#6a7563')}
}
function guards(t,n=5){for(let i=0;i<n;i++){let row=Math.floor(i/2),x=488+(i%2)*26+row*7,y=369+row*20;person(x,y,.38+row*.07,t,{walk:0,phase:i,spear:true})}}
function valley(t,actor={}){valleyBase(t);guards(t,actor.crowd||5);let flame=null;if(actor.show!==false)flame=commander(actor.x||583,actor.y||451,actor.s||1.3,t,actor.lift||0,actor.walk||0);tree(flame,!actor.hideLetters);return flame}
function firingLine(t,releaseAt=Infinity){
 for(let side=0;side<2;side++)for(let i=0;i<5;i++){let x=side?848-i*26:127+i*30,y=side?289+i*17:289+i*17,sf=.63+i*.075,delay=i*.042+side*.12;
  archer(x,y,sf,t,!!side,.33,t<releaseAt+delay);}
 // Foreground ridge lips separate hidden positions from the lower road.
 path([[57,357],[123,344],[201,389],[262,428],[279,448],[89,417]],'#18383c');
 path([[758,414],[792,372],[859,321],[914,326],[938,383],[793,449]],'#1c383c');
}
function hook(u,t){if(u<2.35){camera(461,312,1.13,()=>{valley(t,{lift:ease(u/2),crowd:3,hideLetters:true});archer(148,313,1.35,t,false,.31,true);archer(848,301,1.0,t,true,.34,true);});}
 else if(u<4.8){camera(266,311,1.72,()=>{valleyBase(t);archer(224,321,1.45,t,false,.29,true);archer(153,302,.72,t,false,.3,true)});}
 else {camera(541,315,1.14,()=>{valley(t,{lift:1,crowd:3,hideLetters:true});archer(158,310,1.1,t,false,.31,true);archer(847,301,1.0,t,true,.34,true)});}
}

function flameSignal(x,y,t){stroke([[x,y+9],[x-1,y+27]],'#6b5438',2);A.flame(x,y,.44,t)}
function ambush(u,t){if(u<4.3){camera(480+ease(u/4.3)*10,300,1.065,()=>{valleyBase(t);tree(null);guards(t,6);firingLine(t)});}
 else {camera(238,320,1.68,()=>{valleyBase(t);let aim=lerp(.22,.34,ease((u-4.3)/2));archer(222,323,1.4,t,false,aim,true);archer(155,302,.7,t,false,.3,true);stone(203,370,.8,'#45574c')});}
}

function treeScene(u,t){let lift=ease((u-8.1)/2.2),x=lerp(486,583,ease((u-.4)/4.0));
 if(u>10.4&&u<11.8){camera(374,307,1.43,()=>{valley(t,{lift:1,crowd:6});archer(224,321,1.4,t,false,.31,true)});return}
 let z=lerp(1.01,1.19,ease((u-4.5)/5.7)),camX=lerp(484,551,ease((u-4.5)/5.7));
 camera(camX,284,z,()=>{valley(t,{x,show:true,lift,walk:u>.4&&u<4.4?1:0,crowd:6});if(u>11.8)archer(128,313,1.15,t,false,.12,true)});
 guide('停步 → 看不清 → 靠近 → 举火');}
const BOLT_TRACES=Array.from({length:28},(_,i)=>{
 let side=i%2,k=Math.floor(i/2);return {sx:side?840-k%5*25:157+k%5*28,sy:side?299+k%5*17:309+k%5*16,tx:477+rnd(i+51)*130,ty:410+rnd(i+121)*62,at:.92+side*.12+k*.041};
});
function impacts(u,t){
 for(let i=0;i<8;i++){let x=455+i*24,y=429+(i%3)*14,age=u-(1.8+i*.07);if(age<0)continue;let a=cl(age/1.3);stroke([[x-8,y-13],[x+2,y+1]],'#b6b198',1.1);for(let j=0;j<5;j++)ell(x+(j-2)*a*8,y-Math.sin(j+1)*a*7,1.4*(1-a)+.2,.6,'rgba(181,168,127,'+(.5*(1-a))+')');}
}
function volley(u,t){
 if(u<.78){camera(480,300,1.065,()=>{valley(t,{lift:1,crowd:6});firingLine(t,94)});return}
 if(u<1.55){camera(475,307,1.065,()=>{valley(t,{lift:1,crowd:6});firingLine(t,94);for(let b of BOLT_TRACES){let p=(u-b.at)/.74;if(p<0||p>1)continue;bolt(lerp(b.sx,b.tx,p),lerp(b.sy,b.ty,p),Math.atan2(b.ty-b.sy,b.tx-b.sx),.65)}});return}
 camera(500+ease((u-1.55)/7)*13,319,1.15,()=>{
 valleyBase(t);
 for(let i=0;i<8;i++){let react=ease((u-1.8-i*.07)/1.6),x=485+(i%3)*28+react*(rnd(i)-.5)*81,y=389+Math.floor(i/3)*21;
  if(i===3||i===6)save(()=>{c.translate(x,y);c.rotate(-react*.98);person(0,0,.5,t,{walk:0,phase:i,spear:false})});
  else person(x,y,.5,t,{walk:react>.05&&react<.98?1:0,phase:i,flip:i%2===0});
 }
 let react=ease((u-1.9)/1.5),flame=commander(583-react*17,451,1.3,t,1-react*.32,0);tree(flame);
 for(let b of BOLT_TRACES){let p=(u-b.at)/.74;if(p<0||p>1)continue;bolt(lerp(b.sx,b.tx,p),lerp(b.sy,b.ty,p),Math.atan2(b.ty-b.sy,b.tx-b.sx),.68)}
 impacts(u,t);
 // A flag falls on the roadway; no fire on anonymous soldiers' heads.
 save(()=>{let p=ease((u-2.3)/1.6);c.translate(509,434);c.rotate(p*1.15);pennant(0,0,.58,t)});
 if(u>4.7){let near=ease((u-4.7)/3.5);save(()=>{c.globalAlpha=near;path([[363,528],[394,504],[447,509],[472,522],[429,534]],'#193039');stroke([[391,516],[453,520]],'#50625d',2)});}
 });
}

function reflection(u,t,final=false){
 // Keep the aftermath in a cool night palette, not a sudden broad daylight reset.
 let z=final?1.37:lerp(1.38,1.45,ease(u/7));camera(final?416:394,final?339:345,z,()=>{sky(3,true);ground(3,true);stove(267,443,1.9,201);stone(206,457,.9,'#627064');for(let i=0;i<14;i++){let p=(u*.047+i*.071)%1;ell(255+i*2+p*32,455-p*19,.7,.4,'#aaa891')}path([[548,590],[575,397],[665,309],[692,314],[610,410],[691,590]],'#576057');mountain([[630,330],[657,295],[705,280],[754,314],[770,351]],'#344e4e');grass(760,455,1.3,'#71816c')});
 if(final){let cap=G.JIANZAO_DATA.captions.find(a=>a.screenOnly&&t>=a.start&&t<a.end);if(cap){let s=cap.text;let lines=s.length>15?[s.slice(0,8),s.slice(8)]:[s];lines.forEach((a,i)=>text(a,648,232+i*38,26,P.bone,'center'))}}
}
function subtitle(t){let cap=G.JIANZAO_DATA.captions.find(a=>t>=a.start&&t<a.end);if(!cap||cap.screenOnly||cap.artOnly)return;
 let size=opt.largeCaptions?29:26,s=cap.text,arr=[s];if(s.length>17){let b=-1,dist=99;for(let i=5;i<s.length-4;i++)if('，：。'.includes(s[i])&&Math.abs(i-s.length/2)<dist){b=i+1;dist=Math.abs(i-s.length/2)}if(b<0)b=Math.ceil(s.length/2);arr=[s.slice(0,b),s.slice(b)]}
 c.font='500 '+size+'px -apple-system,"PingFang SC","Noto Sans CJK SC",sans-serif';let w=Math.max(...arr.map(a=>c.measureText(a).width))+30,h=arr.length*33+13,y=540-39-h;
 rect((960-w)/2,y,w,h,'rgba(13,28,34,.9)');c.fillStyle='#eee3cb';c.textAlign='center';c.textBaseline='alphabetic';arr.forEach((a,i)=>c.fillText(a,480,y+29+i*33));
}
function draw(ctx,time,options={}){c=ctx;A.bind(ctx);opt=options;let D=G.JIANZAO_DATA,t=cl(Number(time)||0,0,D.duration-1/6000),shot=D.shots.find(s=>t>=s.start&&t<s.end),u=t-shot.start;
 c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);c.scale(ctx.canvas.width/960,ctx.canvas.height/540);
 switch(shot.id){case'hook':hook(u,t);break;case'camp1':camp(1,u,t);break;case'camp2':camp(2,u,t);break;case'arrange':arrange(u,t);break;case'camp3':camp(3,u,t);break;case'split':split(u,t);break;case'gorge':gorge(u,t);break;case'ambush':ambush(u,t);break;case'tree':treeScene(u,t);break;case'volley':volley(u,t);break;case'reflection':reflection(u,t);break;case'discussion':reflection(u,t,true);break;}
 paper();if(options.captions!==false)subtitle(t);c.restore();return {time:t,shot:shot.id,local:u};}
G.JianzaoFilm={draw,width:1920,height:1080,duration:118,version:'5.0-viewer-polish',getState(t){let D=G.JIANZAO_DATA,s=D.shots.find(x=>t>=x.start&&t<x.end)||D.shots.at(-1);return{shot:s.id,local:t-s.start,themeRevealed:t>=D.events.theme,release:t>=D.events.release,sourceOnly:true}}};
})(typeof window!=='undefined'?window:globalThis);
