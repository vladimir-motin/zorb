export const DURATION=45, POINTS=100, WIDTH=960, ATTACK_RANGE=100;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export class Race {
  constructor({random=Math.random}={}) { this.random=random; this.state='menu'; this.elapsed=0;this.score=0;this.playerX=350;this.playerY=439;this.distance=0;this.speed=350;this.cars=[];this.effects=[];this.serial=0;this.cooldown=0;this.pulse=0;this.spawnTimer=0;this.popped=0; }
  start(){this.state='playing';this.elapsed=0;this.score=0;this.playerX=350;this.speed=350;this.distance=0;this.cars=[];this.effects=[];this.serial=0;this.cooldown=0;this.pulse=0;this.popped=0;this.spawnTimer=1.3;this.spawn(790,0);this.spawn(1100,1);}
  spawn(x=1120,lane=this.serial%2){this.cars.push({id:++this.serial,x,lane,speed:155+this.random()*55,bubble:true,color:Math.floor(this.random()*4),phase:this.random()*6.28});}
  pause(){if(this.state==='playing')this.state='paused';else if(this.state==='paused')this.state='playing';}
  attack(){
    if(this.state!=='playing'||this.cooldown>0)return null;
    this.cooldown=.25;this.pulse=.24;
    const target=this.cars.filter(c=>c.bubble&&Math.abs(c.x-this.playerX)<=ATTACK_RANGE).sort((a,b)=>Math.abs(a.x-this.playerX)-Math.abs(b.x-this.playerX)||a.id-b.id)[0];
    if(!target)return null;
    target.bubble=false;this.score+=POINTS;this.popped++;
    this.effects.push({id:target.id,x:target.x,lane:target.lane,life:.65,max:.65});
    return target;
  }
  tick(dt,{left=false,right=false}={}){
    if(this.state!=='playing'||!Number.isFinite(dt)||dt<=0)return;
    const delta=Math.min(dt,DURATION-this.elapsed);
    const direction=Number(right)-Number(left);
    this.speed=350+direction*110;
    this.playerX=clamp(this.playerX+direction*185*delta,180,720);
    this.distance+=this.speed*delta;
    for(const c of this.cars)c.x+=(c.speed-this.speed)*delta;
    this.cars=this.cars.filter(c=>c.x>-200);
    for(const e of this.effects){e.life-=delta;e.x-=this.speed*delta*.45;}
    this.effects=this.effects.filter(e=>e.life>0);
    this.cooldown=Math.max(0,this.cooldown-delta);this.pulse=Math.max(0,this.pulse-delta);
    this.spawnTimer-=delta;
    while(this.spawnTimer<=0){this.spawn();this.spawnTimer+=1.35+this.random()*.45;}
    this.elapsed+=delta;
    if(this.elapsed>=DURATION-1e-8){this.elapsed=DURATION;this.state='finished';}
  }
}
