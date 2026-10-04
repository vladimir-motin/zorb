// All art is drawn on a 480×270 raster and enlarged without smoothing.
import {verticalCamera} from './viewport.js';
const PAL=['#889bb4','#615a79','#a7b3ba','#753e4c'];
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
function poly(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function hash(n){return Math.abs(Math.sin(n*127.1+311.7)*43758.5453)%1;}
const GLYPHS={G:['01111','11000','11000','11011','11001','11001','01111'],D:['11110','11011','11001','11001','11001','11011','11110'],R:['11110','11001','11001','11110','11100','11010','11001'],I:['111','010','010','010','010','010','111'],V:['11001','11001','11001','11001','11001','01010','00100'],E:['11111','11000','11000','11110','11000','11000','11111'],'-':['000','000','000','111','000','000','000']};
export function drawLogo(canvas){
  const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);let x=1;
  for(const letter of 'G-DRIVE'){
    GLYPHS[letter].forEach((row,y)=>[...row].forEach((p,i)=>{if(p==='1')rect(c,x+i*2+Math.floor((6-y)/2),y*2+2,2,2,letter==='G'?'#ff671d':'#f2f0e8');}));
    x+=(GLYPHS[letter][0].length+1)*2;
  }
}
function tower(c,x,bottom,w,h,n,far=false){
  const colors=far?['#37485b','#3d5061','#304357']:['#3b394b','#383d4b','#424252'];
  const color=colors[n%3];rect(c,x,bottom-h,w,h,color);rect(c,x,bottom-h, w,4,far?'#60707b':'#626071');
  if(n%3===0)rect(c,x+w*.36,bottom-h-20,12,20,color);
  rect(c,x+w-6,bottom-h,6,h,'#262e40');
  const ww=far?4:8,step=far?14:21;
  for(let yy=bottom-h+12;yy<bottom-10;yy+=step)for(let xx=x+10;xx<x+w-10;xx+=step){
    const lit=hash(n+xx+yy)>.43;
    rect(c,xx,yy,ww,far?6:11,lit?(far?'#a38775':'#dfb77f'):'#263446');
    if(!far&&lit)rect(c,xx+ww-2,yy,2,11,'#ad8564');
  }
  if(!far){for(let yy=bottom-h+28;yy<bottom-8;yy+=42)rect(c,x,yy,w-6,2,'#555064');
    rect(c,x+8,bottom-36,w-23,28,'#202d3b');rect(c,x+11,bottom-33,w-29,15,n%2?'#7692a1':'#e3a06a');}
}
function skyline(c,distance,far){
  const step=far?106:178,speed=far?.12:.31,offset=distance*speed,base=far?222:283;
  const first=Math.floor(offset/step)-1;
  for(let i=first;i<first+Math.ceil(960/step)+3;i++){
    const n=((i%97)+97)%97,x=i*step-offset;
    const h=far?72+Math.floor(hash(n+8)*110):105+Math.floor(hash(n+3)*95);
    tower(c,x,base,step-8,h,n,far);
  }
}
function station(c,x){
  rect(c,x+20,222,280,58,'#ccd8dc');rect(c,x+30,236,96,34,'#263f57');
  for(let i=0;i<3;i++)rect(c,x+34+i*30,240,24,24,'#75b5d3');
  rect(c,x+120,224,172,8,'#4488b7');rect(c,x+126,229,8,65,'#c1d1db');rect(c,x+278,229,8,65,'#c1d1db');
  rect(c,x+4,203,304,21,'#0075b8');rect(c,x+4,222,304,5,'#63c4e4');
  rect(c,x+4,204,304,3,'#91d5e8');
  c.font='bold 17px monospace';c.textAlign='left';c.fillStyle='#f5fcff';c.fillText('ГАЗПРОМ',x+85,220);
  for(let i=0;i<3;i++){
    const p=x+146+i*43;rect(c,p,249,20,37,'#dfe4df');rect(c,p+2,253,16,12,'#107ebb');rect(c,p+5,256,10,5,'#b4edff');rect(c,p+15,267,7,15,'#172d40');rect(c,p-3,286,27,5,'#5a6b79');
  }
  rect(c,x-22,203,8,84,'#667d90');rect(c,x-36,183,44,65,'#1686c4');rect(c,x-34,185,40,3,'#a7e6fa');
  c.font='bold 9px monospace';c.fillStyle='#fff';c.fillText('АЗС',x-29,199);c.fillText('95',x-27,217);c.fillText('98',x-27,232);
}
function lamp(c,x){rect(c,x,165,5,149,'#152632');rect(c,x-35,163,40,5,'#182c3b');rect(c,x-42,168,21,5,'#ffcf8e');rect(c,x-43,173,23,3,'#6e5d52');rect(c,x-5,307,16,5,'#141f2b');}
function wheel(c,x,y,time){
  poly(c,[[x-17,y-9],[x-11,y-16],[x+10,y-16],[x+17,y-9],[x+17,y+10],[x+10,y+17],[x-10,y+17],[x-17,y+10]],'#10141c');
  poly(c,[[x-11,y-6],[x-6,y-11],[x+6,y-11],[x+11,y-6],[x+11,y+6],[x+6,y+11],[x-6,y+11],[x-11,y+6]],'#667789');
  rect(c,x-7,y-7,14,14,'#252c39');
  if(Math.floor(time*18)%2){rect(c,x-2,y-11,4,22,'#a2acb5');rect(c,x-11,y-2,22,4,'#919eac');}
  else{for(const sign of [-1,1]){rect(c,x+sign*7-2,y+sign*7-2,4,4,'#c2c7c8');rect(c,x-sign*7-2,y+sign*7-2,4,4,'#c2c7c8');}}
  rect(c,x-3,y-3,6,6,'#d3c6ad');
}
export function car(c,x,y,color,time,{hero=false,scale=1}={}){
  c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);
  rect(c,-105,8,215,7,'#182131');rect(c,-85,15,176,3,'#273044');
  const main=hero?'#f46a19':color,shadow=hero?'#aa360f':'#414655',light=hero?'#ffad45':'#c4c9cc';
  poly(c,hero?[[-114,-15],[-111,-31],[-88,-35],[-47,-65],[-35,-68],[9,-68],[44,-43],[90,-34],[112,-25],[117,-4],[107,6],[-107,6],[-116,-3]]:[[-111,-17],[-105,-35],[-76,-40],[-50,-66],[-37,-72],[19,-72],[50,-47],[91,-39],[111,-29],[115,-5],[103,8],[-104,8],[-113,0]],'#161e2c');
  poly(c,hero?[[-109,-16],[-107,-28],[-83,-32],[-42,-60],[-32,-63],[9,-63],[43,-39],[88,-30],[108,-22],[111,-6],[102,1],[-105,1]]:[[-106,-18],[-101,-32],[-69,-38],[-44,-64],[-33,-67],[17,-67],[49,-43],[88,-36],[105,-26],[110,-6],[99,3],[-101,3]],main);
  poly(c,[[-58,-40],[-39,-60],[-30,-63],[13,-63],[41,-41]],'#122a3c');
  poly(c,[[-35,-59],[-27,-59],[10,-59],[30,-44],[-45,-44]],'#467a8f');
  poly(c,[[-30,-58],[10,-58],[25,-47],[-12,-47]],'#7bb2bd');
  rect(c,-5,-64,4,25,'#273243');rect(c,-59,-42,105,3,light);
  rect(c,-94,-34,29,4,light);rect(c,47,-37,37,4,light);rect(c,87,-30,15,4,light);
  rect(c,-102,-4,49,7,shadow);rect(c,-21,-1,75,5,shadow);rect(c,76,-1,28,5,shadow);
  if(!hero)rect(c,-33,-35,3,30,shadow);rect(c,37,-35,3,31,shadow);rect(c,20,-34,10,3,'#332a25');
  rect(c,38,-43,15,5,main);rect(c,49,-43,7,8,'#1b2533');
  rect(c,96,-26,12,6,'#fff3c1');rect(c,101,-20,7,3,'#eab663');rect(c,-108,-26,8,8,'#ff2f32');
  rect(c,102,-9,10,6,'#1b2026');rect(c,-106,-9,9,4,'#c5c7c3');
  wheel(c,-65,1,time);wheel(c,68,1,time);
  if(hero){rect(c,-27,-21,57,13,'#bf410c');c.font='italic bold 9px monospace';c.textAlign='left';c.fillStyle='#fff0d4';c.fillText('G-ENERGY',-26,-11);rect(c,-103,-35,34,3,'#292b30');}
  c.restore();
}
function bubble(c,x,y,r,time,near){
  c.save();c.translate(Math.round(x),Math.round(y));
  const points=[];for(let i=0;i<32;i++){const a=i/32*Math.PI*2;points.push([Math.round(Math.cos(a)*r/4)*4,Math.round(Math.sin(a)*r/4)*4]);}
  poly(c,points,near?'rgba(165,231,248,.17)':'rgba(182,221,240,.11)');
  c.beginPath();points.forEach(([xx,yy],i)=>i?c.lineTo(xx,yy):c.moveTo(xx,yy));c.closePath();c.strokeStyle=near?'#b1efff':'#8cacbd';c.lineWidth=near?4:2;c.stroke();
  c.strokeStyle='rgba(222,247,255,.8)';c.lineWidth=4;c.beginPath();c.moveTo(-r*.76,-r*.22);c.lineTo(-r*.67,-r*.49);c.lineTo(-r*.44,-r*.7);c.lineTo(-r*.16,-r*.8);c.stroke();
  rect(c,-r*.54,-r*.56,8,4,'#e5faff');rect(c,r*.71,r*.3,4,12,'#bfdce7');
  if(near){rect(c,-19,-r-22,38,15,'#112533');c.font='bold 11px monospace';c.textAlign='center';c.fillStyle='#adf0fa';c.fillText('ЛОП!',0,-r-10);}
  c.restore();
}
function pop(c,e){
  const t=1-e.life/e.max,y=e.lane===0?319:369,r=e.lane===0?86:98;
  c.save();c.globalAlpha=1-t;
  for(let i=0;i<16;i++){
    const a=i/16*6.28+e.id;const d=r+t*60;rect(c,e.x+Math.cos(a)*d,y+Math.sin(a)*d,6+(i%3)*2,4+(i%2)*2,i%3?'#c5f2ff':'#79cbe5');
  }
  c.globalAlpha=Math.min(1,e.life*4);c.font='bold 23px monospace';c.textAlign='center';c.fillStyle='#132534';c.fillText('+100',e.x+2,y-90-t*40+2);c.fillStyle='#f9efb2';c.fillText('+100',e.x,y-90-t*40);c.restore();
}
export function render(canvas,race,clock){
  const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.save();c.scale(.5,.5);
  const viewWidth=canvas.width*2,camera=Math.max(0,Math.min(960-viewWidth,race.playerX-viewWidth*.4));c.translate(-camera,0);
  const cameraY=verticalCamera(canvas.height);c.save();c.scale(1,(320-cameraY)/320);
  const d=race.distance;
  rect(c,0,0,960,540,'#192638');
  const bands=['#12253a','#25374c','#3e4659','#65566a','#956b71','#c18776','#e6ab85'];
  bands.forEach((col,i)=>rect(c,0,i*24,960,24,col));rect(c,720-(d*.03%1100),75,60,52,'#edaf82');rect(c,728-(d*.03%1100),66,44,9,'#edaf82');
  skyline(c,d,true);skyline(c,d,false);
  rect(c,0,282,960,31,'#526171');rect(c,0,303,960,9,'#9c9693');rect(c,0,312,960,8,'#273345');
  const sx=850-(d*.55%2200);station(c,sx);if(sx>620)station(c,sx-2200);
  for(let i=-1;i<5;i++)lamp(c,i*310-(d*.55%310));
  c.restore();c.translate(0,-cameraY);
  rect(c,0,320,960,66,'#333c4e');rect(c,0,386,960,72,'#30384a');rect(c,0,458,960,82,'#252f40');
  for(const y of [352,410,482]){
    for(let i=-1;i<10;i++){const x=i*140-(d*(y===482?1.4:1)%140);rect(c,x,y,72,4,'#87909b');rect(c,x+72,y,4,2,'#555f70');}
  }
  rect(c,0,520,960,7,'#77777b');rect(c,0,527,960,13,'#1d2b3c');
  for(let i=0;i<20;i++)rect(c,i*60-(d*1.4%60),520,29,7,'#c4b393');
  for(const lane of [0,1])for(const carState of race.cars.filter(a=>a.lane===lane)){
    const y=lane===0?357:410,scale=lane===0?.78:.91;
    car(c,carState.x,y,PAL[carState.color],clock,{scale});
    if(carState.bubble)bubble(c,carState.x,y-35,lane===0?86:98,clock,Math.abs(carState.x-race.playerX)<=100&&race.state==='playing');
  }
  // The orange car is always in the closest lane; nobody changes lanes.
  car(c,race.playerX,race.playerY,'#f46a19',clock,{hero:true,scale:1.08});
  if(race.pulse>0){c.save();c.globalAlpha=race.pulse/.24;const rr=90+(1-race.pulse/.24)*60;
    c.strokeStyle='#ffba55';c.lineWidth=6;c.beginPath();for(let i=0;i<=24;i++){const a=i/24*6.28;const x=race.playerX+Math.round(Math.cos(a)*rr/4)*4,y=race.playerY-40+Math.round(Math.sin(a)*rr*.6/4)*4;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();c.restore();}
  for(const e of race.effects)pop(c,e);
  rect(c,0,536,960,4,'#f26a25');
  c.restore();
}
