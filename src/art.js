/* Original authored vector assets. No model output; controlled paper/ink illustration. */
(function(G){'use strict';let c;const W=960,H=540,PI=Math.PI;
const P={ink:'#172a30',night:'#233740',paper:'#c7b59b',ochre:'#8f7757',bone:'#e7d5b2',red:'#863d2b',amber:'#e9a654',qi:'#6c7053'};
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,p)=>a+(b-a)*p,ease=v=>{v=cl(v);return v*v*(3-2*v)},rnd=n=>{let v=Math.sin(n*127.1+46.8)*43758.5453;return v-Math.floor(v)};
function path(p,fill,stroke,w=1){c.beginPath();p.forEach((v,i)=>i?c.lineTo(...v):c.moveTo(...v));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=w;c.stroke()}}
function stroke(p,col=P.ink,w=2){c.beginPath();p.forEach((v,i)=>i?c.lineTo(...v):c.moveTo(...v));c.lineWidth=w;c.strokeStyle=col;c.lineCap='round';c.lineJoin='round';c.stroke()}
function ell(x,y,rx,ry,col){c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,PI*2);c.fillStyle=col;c.fill()}
function rect(x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h)}
function text(s,x,y,size=22,col=P.bone,align='left'){c.fillStyle=col;c.textAlign=align;c.textBaseline='alphabetic';c.font='500 '+size+'px "Noto Serif CJK SC","Songti SC","STSong",serif';c.fillText(s,x,y)}
function save(f){c.save();f();c.restore()}
function pose(o={}){const walk=o.walk||0,ph=(o.time||0)*7+(o.phase||0),step=Math.sin(ph)*12*walk,bob=Math.abs(Math.sin(ph))*1.2*walk+(1-walk)*Math.sin((o.time||0)*1.7+(o.phase||0))*.45;
 const right=o.hand||[17+step*.3,-54-bob];return {right,left:o.left||[-20-step*.3,-48],step,bob}}
function joint(a,b,d,col,w){stroke([a,b,d],col,w);ell(d[0],d[1],w*.38,w*.42,col)}
function person(x,y,s,t,o={}){let p=pose({...o,time:t}),face=o.flip?-1:1,col=o.qi?P.qi:P.ink,edge=o.qi?'#b0ac80':'#657b7c';
 save(()=>{c.translate(x,y);c.scale(s*face,s);ell(0,2,19,3,'rgba(7,19,22,.16)');
 if(o.kneel){stroke([[-7,-29],[-24,-3],[-42,-3]],col,9);stroke([[-42,-3],[-48,0]],col,5);stroke([[7,-29],[25,-28],[25,0]],col,9);stroke([[23,0],[34,0]],col,5);c.translate(0,8)}
 else for(let k of [-1,1]){let ft=k*p.step+k*5;stroke([[k*7,-39-p.bob],[k*6+ft*.35,-20],[ft,0]],col,8);stroke([[ft-3,1],[ft+7,1]],col,5)}
 if(o.commander){path([[-17,-79],[3,-76],[11,-37],[-25,-28],[-24,-62]],'#263d49');stroke([[-18,-65],[-22,-37]],'#6b7167',1)}
 path([[-14,-79-p.bob],[12,-78-p.bob],[18,-43-p.bob],[8,-35],[-16,-36],[-20,-59]],col);
 for(let k=0;k<5;k++){stroke([[-12,-70+k*7-p.bob],[11,-71+k*7-p.bob]],edge,.8);for(let j=0;j<3;j++)stroke([[-10+j*7,-69+k*7-p.bob],[-10+j*7,-66+k*7-p.bob]],edge,.55)}
 stroke([[2,-76],[2,-36]],edge,.8);ell(0,-89-p.bob,10,12,col);
 path([[-13,-89-p.bob],[-12,-101-p.bob],[-3,-108-p.bob],[8,-104-p.bob],[14,-91-p.bob],[5,-94-p.bob]],col);
 stroke([[-9,-99-p.bob],[-2,-104-p.bob],[7,-100-p.bob]],edge,.8);
 if(o.commander)path([[-2,-108],[1,-121],[6,-119],[8,-112],[4,-106]],P.red);
 joint([10,-73-p.bob],[(10+p.right[0])*.5+4,(-73+p.right[1])*.5+8],p.right,col,6);
 joint([-12,-71-p.bob],[(-12+p.left[0])*.5-4,(-71+p.left[1])*.5+10],p.left,col,6);
 if(o.spear){let h=p.right;stroke([[h[0]-4,h[1]+54],[h[0]+14,h[1]-123]],'#594c38',2.5);path([[h[0]+10,h[1]-122],[h[0]+16,h[1]-141],[h[0]+19,h[1]-121]],'#c3b697')}
 });return {hand:[x+p.right[0]*s*face,y+(p.right[1]+(o.kneel?8:0))*s],left:[x+p.left[0]*s*face,y+(p.left[1]+(o.kneel?8:0))*s]};}
function flame(x,y,s,t){save(()=>{c.translate(x,y);c.scale(s,s);let sw=Math.sin(t*8)*2;path([[0,4],[-7,-5],[-4+sw,-18],[0,-11],[4+sw,-29],[9,-11],[7,-1]],P.amber);path([[1,2],[-1,-6],[4,-18],[5,-5]],P.bone);for(let k=0;k<2;k++){let p=(t*.7+k*.4)%1;ell(sw+p*3,-22-p*17,.6*(1-p),1.5*(1-p),P.amber)}})}
function torch(h,s,t){stroke([[h[0]-s,h[1]+15*s],[h[0]+3*s,h[1]-21*s]],'#775333',4*s);stroke([[h[0]+2*s,h[1]-17*s],[h[0]+3*s,h[1]-24*s]],'#af8051',6*s);flame(h[0]+3*s,h[1]-25*s,s,t);return [h[0]+3*s,h[1]-36*s]}
function pennant(x,y,s,t,qi=false){stroke([[x,y],[x,y-113*s]],'#645138',2*s);let p=[[x,y-110*s]];for(let k=0;k<6;k++)p.push([x+(8+k*7)*s,y-(108-Math.sin(k*.8+t*2)*3)*s]);for(let k=5;k>=0;k--)p.push([x+(8+k*7)*s,y-(84-Math.sin(k*.8+t*2+1)*3)*s]);p.push([x,y-83*s]);path(p,qi?'#777855':P.red);stroke([[x+8*s,y-104*s],[x+8*s,y-90*s]],P.bone,.8*s)}
function stove(x,y,s,seed=0){save(()=>{c.translate(x,y);c.rotate((rnd(seed+19)-.5)*.09);c.scale(s,s);ell(0,4,30,8,'rgba(30,27,18,.16)');path([[-28,4],[-25,-12],[-20,-25],[-7,-31],[10,-29],[23,-19],[29,-2],[26,8],[8,12],[-12,10]],'#8c7050',P.ink,1.1);ell(0,-18,18,8,'#594b38');ell(0,-19,12,4,'#2b302b');stroke([[-24,-7],[-19,-22],[-9,-28]],'#b4966b',1.4);path([[-12,10],[-12,-1],[-6,-9],[2,-10],[11,-4],[13,10]],P.ink);ell(0,9,9,2.3,'#b7b096');for(let k=0;k<8;k++){let xx=(rnd(k+seed)-.5)*43,yy=-17+rnd(k+seed+100)*23;stroke([[xx,yy],[xx+3,yy+1]],'#ac8c61',.6)}stroke([[-5,3],[6,8]],'#b5aa88',.8)})}
function stone(x,y,s=1,col='#68716a'){path([[x-13*s,y],[x-9*s,y-9*s],[x+3*s,y-13*s],[x+15*s,y-3*s],[x+11*s,y+3*s]],col);stroke([[x-7*s,y-7*s],[x+2*s,y-10*s],[x+9*s,y-3*s]],'#94958a',.7)}
function grass(x,y,s=1,col='#655f49'){stroke([[x-4*s,y],[x-9*s,y-15*s],[x-6*s,y-8*s],[x-2*s,y-16*s],[x,y]],col,.8);stroke([[x,y],[x+5*s,y-12*s],[x+6*s,y-5*s]],col,.7)}
function tent(x,y,s){path([[x-50*s,y],[x-2*s,y-64*s],[x+43*s,y-7*s],[x+51*s,y]],'#75634a');path([[x-2*s,y-64*s],[x+9*s,y],[x-18*s,y]],'#3d3e31');stroke([[x-51*s,y],[x-2*s,y-65*s],[x+43*s,y-7*s]],'#ac9774',s);stroke([[x-2*s,y-66*s],[x-3*s,y-75*s]],'#514c39',2*s)}
function cart(x,y,s){for(let k of [-1,1]){ell(x+k*23*s,y,11*s,11*s,'#453f30');ell(x+k*23*s,y,7*s,7*s,'#a28a64');for(let a=0;a<6;a++)stroke([[x+k*23*s,y],[x+k*23*s+9*Math.cos(a*PI/3)*s,y+9*Math.sin(a*PI/3)*s]],'#494330',s)}path([[x-39*s,y-15*s],[x-26*s,y-31*s],[x+35*s,y-29*s],[x+42*s,y-11*s]],'#796249');stroke([[x+37*s,y-16*s],[x+68*s,y-5*s]],'#514731',2*s)}
function bolt(x,y,a,s=1){save(()=>{c.translate(x,y);c.rotate(a);stroke([[-21*s,0],[18*s,0]],'#c7c3aa',1.3*s);path([[18*s,0],[11*s,-2*s],[12*s,2*s]],'#d9cfb4');stroke([[-15*s,0],[-22*s,-3*s]],'#b3af99',s)})}
function bow(x,y,s,a=0,loaded=true){save(()=>{c.translate(x,y);c.rotate(a);c.scale(s,s);
 // +x is shooting direction. Bow is forward, string pulled rearward to the nut.
 stroke([[-30,3],[38,3]],'#795c3a',6);stroke([[18,-25],[28,-14],[32,0],[28,14],[18,25]],'#c9b590',3.5);stroke([[18,-25],[loaded?-12:18,0],[18,25]],'#b3ae96',1);stroke([[-13,3],[-12,16]],P.ink,4);if(loaded)bolt(10,-1,0,.86);
 })}
function archer(x,y,s,t,flip=false,aim=0,loaded=true){save(()=>{c.translate(x,y);c.scale(s*(flip?-1:1),s);path([[-35,37],[-24,16],[-13,7],[11,10],[34,36]],'#5e6552');ell(-6,-4,10,12,'#777955');path([[-19,-5],[-17,-18],[-7,-23],[6,-18],[10,-6]],P.ink);stroke([[-15,-15],[-7,-19],[3,-14]],'#a3a280',1);bow(39,5,1,aim,loaded);joint([2,12],[11,17],[27,9],'#999a75',6);joint([-14,15],[2,23],[16,14],'#858b68',5);stroke([[-29,32],[-20,18]],'#9b9c79',1)})}
G.JZArt={bind(ctx){c=ctx},c:()=>c,P,cl,lerp,ease,rnd,path,stroke,ell,rect,text,save,pose,person,torch,flame,pennant,stove,stone,grass,tent,cart,bolt,bow,archer};
})(typeof window!=='undefined'?window:globalThis);
