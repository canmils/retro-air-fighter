'use strict';
const {Flight,W,H}=RAF,flight=new Flight(),canvas=document.querySelector('#game'),ctx=canvas.getContext('2d');
const $=s=>document.querySelector(s),overlay=$('#overlay'),pauseButton=$('#pause');
const keys=new Set();let pointer=null,last=0,sound=false,audio=null,best=0,finished=false;
try{best=Number(localStorage.getItem('raf-best'))||0;}catch{}
function tone(freq,duration=.06){if(!sound||!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.type='square';o.frequency.setValueAtTime(freq,audio.currentTime);g.gain.setValueAtTime(.025,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}
function clearInput(){keys.clear();pointer=null;}
function start(){clearInput();flight.start();finished=false;overlay.hidden=true;pauseButton.disabled=false;pauseButton.textContent='Pause';$('#status').textContent='Mission in progress';canvas.focus();if(sound&&audio)audio.resume().catch(()=>{});}
function pause(){if(!['playing','paused'].includes(flight.state))return;clearInput();if(flight.state==='playing'){flight.state='paused';show('FLIGHT ON HOLD','Take a breath.','Your mission will wait.','Resume mission');pauseButton.textContent='Resume';$('#status').textContent='Paused';}else{flight.state='playing';overlay.hidden=true;pauseButton.textContent='Pause';$('#status').textContent='Mission in progress';canvas.focus();}}
function show(top,title,message,button){$('#overline').textContent=top;$('#title').textContent=title;$('#message').textContent=message;$('#start').textContent=button;overlay.hidden=false;}
$('#start').onclick=()=>flight.state==='paused'?pause():start();pauseButton.onclick=pause;
$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent=`Sound: ${sound?'on':'off'}`;$('#sound').setAttribute('aria-pressed',String(sound));if(sound){try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});tone(440);}catch{sound=false;$('#sound').textContent='Sound unavailable';$('#sound').setAttribute('aria-pressed','false');}}};
canvas.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyP','Escape'].includes(e.code))e.preventDefault();if(e.code==='KeyP'||e.code==='Escape'){if(!e.repeat)pause();return;}keys.add(e.code);});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{if(flight.state==='playing')pause();else clearInput();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&flight.state==='playing')pause();});
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};}
canvas.addEventListener('pointerdown',e=>{if(flight.state!=='playing'||pointer)return;e.preventDefault();canvas.focus();canvas.setPointerCapture(e.pointerId);const pos=point(e);pointer={id:e.pointerId,ox:flight.player.x-pos.x,oy:flight.player.y-pos.y,target:{...flight.player}};});
canvas.addEventListener('pointermove',e=>{if(pointer&&pointer.id===e.pointerId){const p=point(e);pointer.target={x:p.x+pointer.ox,y:p.y+pointer.oy};}});
for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,e=>{if(pointer&&e.pointerId===pointer.id)pointer=null;});
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function plane(x,y,enemy=false,heavy=false){ctx.save();ctx.translate(Math.round(x),Math.round(y));if(enemy)ctx.rotate(Math.PI);const body=enemy?(heavy?'#bc6971':'#d5a27e'):'#81d2bd',dark=enemy?'#723f55':'#356d78';rect(-5,-21,10,39,body);rect(-20,0,40,8,dark);rect(-17,-3,34,5,body);rect(-10,13,20,5,body);rect(-3,-10,6,10,'#183b52');rect(-7,-24,14,2,'#e7e2c4');if(!enemy)rect(-3,19,6,5+Math.floor(flight.time*20)%5,'#f5bd68');if(heavy){rect(-26,-1,7,14,body);rect(19,-1,7,14,body);}ctx.restore();}
function draw(){
 ctx.fillStyle='#103f54';ctx.fillRect(0,0,W,H);
 const t=flight.time;
 // Chunky islands and ocean streaks use only original canvas shapes.
 for(let i=0;i<7;i++){const y=((i*151+t*34)%1100)-160,x=i%2===0?-25:365;rect(x,y,80,90,'#2c6464');rect(x+8,y+10,65,65,'#457767');rect(x+18,y+20,42,38,'#66836c');}
 for(let i=0;i<42;i++){const x=(i*83)%W,y=(i*59+t*65)%H;rect(x,y,7+(i%4)*4,2,'#235269');}
 for(const q of flight.pickups){rect(q.x-13,q.y-13,26,26,'#f5bd68');ctx.fillStyle='#273a46';ctx.font='bold 16px monospace';ctx.textAlign='center';ctx.fillText('W',q.x,q.y+6);}
 for(const s of flight.bullets){rect(s.x-2,s.y-8,4,15,'#ffdc89');rect(s.x-1,s.y-8,2,10,'#fff3cf');}
 for(const e of flight.enemies)plane(e.x,e.y,true,e.heavy);
 const b=flight.boss;if(b){ctx.save();ctx.translate(b.x,b.y);rect(-51,-30,102,66,'#536775');rect(-63,-4,126,22,'#8d9292');rect(-15,-44,30,95,'#b3b7a5');rect(-9,-28,18,50,'#365267');rect(-45,17,12,24,'#c58075');rect(33,17,12,24,'#c58075');ctx.restore();rect(60,49,300,7,'#253745');rect(60,49,300*Math.max(0,b.hp)/b.max,7,'#e58a77');}
 for(const s of flight.hostile){rect(s.x-4,s.y-4,8,8,'#ff9784');rect(s.x-2,s.y-2,4,4,'#ffdfad');}
 if(flight.player.inv<=0||Math.floor(t*14)%2===0)plane(flight.player.x,flight.player.y);
 for(const q of flight.particles)rect(q.x,q.y,4,4,q.life>.35?'#ffd17d':'#ca7664');
 rect(0,0,W,38,'#0b2334');ctx.font='bold 12px monospace';ctx.textAlign='left';ctx.fillStyle='#d9e7e2';ctx.fillText(`SCORE ${String(flight.score).padStart(6,'0')}`,14,24);ctx.textAlign='right';ctx.fillStyle='#f5bd68';ctx.fillText(`LIVES ${flight.lives}`,W-14,24);
 ctx.font='10px monospace';ctx.fillStyle='#b4d2cf';ctx.textAlign='left';ctx.fillText(`BEST ${String(best).padStart(6,'0')}`,14,H-14);ctx.textAlign='right';ctx.fillText(flight.power>0?`DOUBLE FIRE ${Math.ceil(flight.power)}s`:b?'CARRIER IN RANGE':`CARRIER IN ${Math.max(0,Math.ceil(105-t))}s`,W-14,H-14);
 if(!b){rect(0,H-3,W*Math.min(t/105,1),3,'#f5bd68');}
}
function frame(now){const dt=Math.min((now-last)/1000||0,.05);last=now;if(flight.state==='playing'){flight.step(dt,{left:keys.has('ArrowLeft'),right:keys.has('ArrowRight'),up:keys.has('ArrowUp'),down:keys.has('ArrowDown'),shoot:keys.has('Space')||!!pointer,target:pointer?.target});for(const e of flight.events)tone(e==='shoot'?740:e==='power'?1100:e==='hurt'?90:140,e==='shoot'?.035:.15);if(['won','lost'].includes(flight.state)&&!finished){finished=true;clearInput();best=Math.max(best,flight.score);try{localStorage.setItem('raf-best',String(best));}catch{}pauseButton.disabled=true;const win=flight.state==='won';$('#status').textContent=win?'Mission complete':'Mission ended';show(win?'MISSION COMPLETE':'AIRCRAFT LOST',win?'Sky secured.':'One more flight?',`Score ${flight.score.toLocaleString()} · ${flight.kills} enemies down · ${Math.floor(flight.time)}s flown. Best: ${best.toLocaleString()}.`,'Fly again →');}}
 draw();requestAnimationFrame(frame);}
requestAnimationFrame(frame);
