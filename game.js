import {Race,DURATION} from './model.js';
import {render,drawLogo} from './art.js';
import {installControls} from './controls.js';
import {sceneFrame} from './viewport.js';

const $=id=>document.getElementById(id),race=new Race(),canvas=$('game');
let clock=0,last=0,accumulator=0;
drawLogo($('brand'));
race.cars=[{id:1,x:640,lane:0,speed:180,bubble:true,color:0,phase:0},{id:2,x:820,lane:1,speed:180,bubble:true,color:1,phase:1}];
const controls=installControls({attack:()=>race.attack(),pause:togglePause,active:()=>race.state==='playing',onBlur:()=>{if(race.state==='playing'){race.pause();controls.clear();sync();}}});

function resize(){const box=$('stage').getBoundingClientRect(),frame=sceneFrame(box.width||960,box.height||540);canvas.width=frame.width;canvas.height=frame.height;render(canvas,race,clock);}
window.addEventListener('resize',resize);resize();
function sync(){
  $('score').textContent=String(race.score).padStart(5,'0');$('seconds').textContent=String(Math.ceil(DURATION-race.elapsed)).padStart(2,'0');
  $('time-fill').style.width=(DURATION-race.elapsed)/DURATION*100+'%';
  $('pause').disabled=!['playing','paused'].includes(race.state);$('pause').textContent=race.state==='paused'?'▶':'Ⅱ';$('pause').setAttribute('aria-label',race.state==='paused'?'Продолжить':'Пауза');
  $('paused').hidden=race.state!=='paused';
  document.querySelectorAll('[data-control]').forEach(b=>b.disabled=race.state!=='playing');
  canvas.dataset.state=race.state;canvas.dataset.score=String(race.score);canvas.dataset.elapsed=race.elapsed.toFixed(2);canvas.dataset.playerX=race.playerX.toFixed(1);canvas.dataset.cars=JSON.stringify(race.cars.map(c=>({id:c.id,x:Math.round(c.x),lane:c.lane,bubble:c.bubble})));
}
function start(){
  controls.clear();race.start();accumulator=0;last=performance.now();
  document.body.classList.remove('finished');$('results').hidden=true;$('intro').hidden=true;
  resize();sync();canvas.focus({preventScroll:true});document.querySelector('.machine').scrollIntoView({block:'nearest',behavior:'instant'});
}
function togglePause(){race.pause();controls.clear();accumulator=0;last=performance.now();sync();if(race.state==='playing')canvas.focus({preventScroll:true});}
$('start').onclick=start;$('replay').onclick=start;$('pause').onclick=togglePause;$('resume').onclick=togglePause;
function finish(){
  controls.clear();$('final-score').textContent=race.score.toLocaleString('ru-RU');$('popped').textContent=race.popped;
  $('results').hidden=false;document.body.classList.add('finished');sync();$('results').scrollIntoView({block:'start',behavior:'smooth'});
}
function loop(now){
  const dt=Math.min(.1,Math.max(0,(now-last)/1000));last=now;
  if(race.state==='playing'){
    accumulator+=dt;while(accumulator>=1/60&&race.state==='playing'){race.tick(1/60,controls.input.snapshot());accumulator-=1/60;clock+=1/60;}
    if(race.state==='finished')finish();
  }
  sync();render(canvas,race,clock);requestAnimationFrame(loop);
}
sync();requestAnimationFrame(loop);
