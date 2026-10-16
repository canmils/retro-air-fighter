/* Pure simulation, shared by the browser and Node tests. Original MIT code. */
(function(root){
'use strict';
const W=420,H=640,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hit=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y)<a.r+b.r;
class Flight {
 constructor(random=Math.random){this.random=random;this.reset();}
 reset(){Object.assign(this,{state:'ready',time:0,score:0,lives:3,kills:0,shots:0,spawn:0,fire:0,bossClock:0,boss:null,power:0,drop:false,enemies:[],bullets:[],hostile:[],particles:[],pickups:[],events:[],player:{x:W/2,y:H-85,r:10,inv:0}});}
 start(){this.reset();this.state='playing';}
 damage(){if(this.player.inv>0||this.state!=='playing')return;this.lives--;this.player.inv=2;this.events.push('hurt');if(this.lives<=0)this.state='lost';}
 burst(x,y){for(let i=0;i<12;i++){const a=this.random()*Math.PI*2,s=25+this.random()*100;this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.5+this.random()*.3});}}
 step(dt,input={}){
 if(this.state!=='playing')return;
 dt=clamp(dt,0,.05);this.events=[];this.time+=dt;const p=this.player;p.inv=Math.max(0,p.inv-dt);this.power=Math.max(0,this.power-dt);
 let dx=(input.right?1:0)-(input.left?1:0),dy=(input.down?1:0)-(input.up?1:0),len=Math.hypot(dx,dy)||1;
 if(input.target){dx=input.target.x-p.x;dy=input.target.y-p.y;len=Math.hypot(dx,dy);const f=Math.min(1,300*dt/(len||1));p.x+=dx*f;p.y+=dy*f;}else{p.x+=dx/len*260*dt;p.y+=dy/len*260*dt;}
 p.x=clamp(p.x,18,W-18);p.y=clamp(p.y,40,H-22);
 this.fire-=dt;if(input.shoot&&this.fire<=0){this.fire=.14;this.shots++;for(const offset of this.power>0?[-10,10]:[0])this.bullets.push({x:p.x+offset,y:p.y-20,r:4,vy:-520});this.events.push('shoot');}
 this.spawn-=dt;
 if(this.time<105&&this.spawn<=0){this.spawn=Math.max(.48,1.25-this.time*.006);const heavy=this.random()<.27;this.enemies.push({x:25+this.random()*(W-50),y:-30,origin:0,age:0,r:heavy?18:13,hp:heavy?4:2,heavy,vy:heavy?66:105+this.time*.35,fire:1+this.random()});}
 if(this.time>=105&&!this.boss){this.enemies=[];this.boss={x:W/2,y:-65,r:52,hp:180,max:180,age:0,fire:1};this.events.push('boss');}
 for(const e of this.enemies){e.age+=dt;e.y+=e.vy*dt;e.x=clamp(e.x+Math.sin(e.age*3)*20*dt,20,W-20);e.fire-=dt;if(e.heavy&&e.fire<0){e.fire=1.7;const a=Math.atan2(p.y-e.y,p.x-e.x);this.hostile.push({x:e.x,y:e.y,r:5,vx:Math.cos(a)*145,vy:Math.sin(a)*145});}if(hit(e,p)&&e.hp>0){this.damage();e.hp=0;this.burst(e.x,e.y);}}
 const b=this.boss;if(b){b.age+=dt;b.y=Math.min(105,b.y+65*dt);b.x=W/2+Math.sin(b.age*.85)*100;b.fire-=dt;if(b.y>=105&&b.fire<=0){b.fire=.85;const a=Math.atan2(p.y-b.y,p.x-b.x);for(let i=-2;i<=2;i++)this.hostile.push({x:b.x,y:b.y+25,r:5,vx:Math.cos(a+i*.23)*155,vy:Math.sin(a+i*.23)*155});}if(hit(b,p))this.damage();}
 for(const s of this.bullets){s.y+=s.vy*dt;for(const e of this.enemies){if(e.hp>0&&s.y>-20&&hit(s,e)){e.hp--;s.y=-100;if(e.hp===0){this.kills++;this.score+=e.heavy?250:100;this.burst(e.x,e.y);this.events.push('explode');}}}if(b&&s.y>-20&&hit(s,b)){s.y=-100;b.hp--;this.score+=10;if(b.hp<=0){this.score+=2500;this.burst(b.x,b.y);this.state='won';this.events.push('explode');}}}
 for(const s of this.hostile){s.x+=s.vx*dt;s.y+=s.vy*dt;if(hit(s,p)){this.damage();s.y=H+100;}}
 if(this.time>=24&&!this.drop){this.drop=true;this.pickups.push({x:W/2,y:-20,r:15});}
 for(const c of this.pickups){c.y+=75*dt;if(hit(c,p)){this.power=15;c.y=H+100;this.events.push('power');}}
 for(const q of this.particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=dt;}
 this.enemies=this.enemies.filter(e=>e.hp>0&&e.y<H+40);this.bullets=this.bullets.filter(s=>s.y>-25);this.hostile=this.hostile.filter(s=>s.y<H+30&&s.y>-50&&s.x>-30&&s.x<W+30);this.particles=this.particles.filter(q=>q.life>0);this.pickups=this.pickups.filter(c=>c.y<H+30);
 }
}
if(typeof module!=='undefined')module.exports={Flight,hit,clamp,W,H};else root.RAF={Flight,hit,clamp,W,H};
})(globalThis);
