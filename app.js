(() => {
const L = window.LOVE, $ = id => document.getElementById(id);
const name = L.herName || 'cutie', calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pause = ms => new Promise(r => setTimeout(r, ms));

/* ---------- flowers, drawn petal by petal ---------- */
let uid = 0;
const PAL = { rose:['#ff7eaa','#b3124f'], peony:['#ffd9e7','#f57fab'], cosmos:['#ff9ccb','#d62c84'], lily:['#fff4f8','#ff8fb8'], daisy:['#ffffff','#ffd3e2'], tulip:['#ff6f9f','#d4246a'] };
const petal = { // tip points up, base at 0,0
  round:(l,w)=>`M0 0C${-w} ${-l*.15} ${-w*1.15} ${-l} 0 ${-l}C${w*1.15} ${-l} ${w} ${-l*.15} 0 0`,
  notch:(l,w)=>`M0 0C${-w*.6} ${-l*.25} ${-w*1.5} ${-l*.85} ${-w*.5} ${-l}Q${-w*.15} ${-l*1.02} 0 ${-l*.88}Q${w*.15} ${-l*1.02} ${w*.5} ${-l}C${w*1.5} ${-l*.85} ${w*.6} ${-l*.25} 0 0`,
  point:(l,w)=>`M0 0C${-w} ${-l*.25} ${-w} ${-l*.65} 0 ${-l}C${w} ${-l*.65} ${w} ${-l*.25} 0 0`
};
function ring(n, d, fill, stroke, off=0){
  let s=''; for(let i=0;i<n;i++) s+=`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width=".8" transform="rotate(${off+i*360/n})"/>`; return s;
}
function flower(type){
  const [a,b]=PAL[type], g='g'+(++uid), f=`url(#${g})`, st=b+'88';
  let s=`<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset=".05" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
  if(type==='rose'){
    [[7,58,27,0],[6,48,25,25],[5,38,22,8],[5,28,17,40],[4,18,12,15]].forEach(([n,l,w,o])=>s+=ring(n,petal.round(l,w),f,'#8f0e41aa',o));
    s+=`<path d="M0 0C4-7-8-9-8 0S6 11 10 1 1-15-9-12" fill="none" stroke="#8f0e41" stroke-width="2" stroke-linecap="round"/>`;
  } else if(type==='peony'){
    [[10,62,20,0],[9,52,18,18],[8,42,16,5],[7,31,13,25],[5,20,10,10]].forEach(([n,l,w,o])=>s+=ring(n,petal.notch(l,w),f,st,o));
    s+=`<circle r="4" fill="#ffd27a"/>`;
  } else if(type==='cosmos'){
    s+=ring(8,petal.notch(56,19),f,st)+`<circle r="12" fill="#f0a933"/>`;
    for(let i=0;i<12;i++) s+=`<circle r="2.4" cx="${9*Math.cos(i*.524)}" cy="${9*Math.sin(i*.524)}" fill="#ffe09a"/>`;
  } else if(type==='lily'){
    s+=ring(3,petal.point(66,27),f,st)+ring(3,petal.point(64,24),f,st,60);
    for(let i=0;i<6;i++) s+=`<g transform="rotate(${i*60+20})"><path d="M0 0Q4-14 0-27" stroke="#f7d4b0" stroke-width="1.8" fill="none"/><ellipse cy="-28" rx="2.6" ry="5" fill="#c4622d"/></g><g transform="rotate(${i*60})" fill="#d4246a"><circle cx="-4" cy="-23" r="1.4"/><circle cx="4" cy="-29" r="1.4"/><circle cy="-36" r="1.3"/></g>`;
  } else if(type==='daisy'){
    s+=ring(15,petal.round(46,8),f,'#f0a5c1')+ring(13,petal.round(37,7),f,'#f0a5c1',9)+`<circle r="13" fill="#f2b23e"/><circle r="8" fill="#ffd27a"/>`;
  } else {
    const t=(x,r)=>`<path d="M0 34C-34 30-36-24 0-50C36-24 34 30 0 34" fill="${f}" stroke="${st}" transform="translate(${x}) rotate(${r})"/>`;
    s+=t(0,0)+t(-17,-13)+t(17,13)+`<path d="M0 36C-24 30-22-16 0-32C22-16 24 30 0 36" fill="${f}" stroke="${st}"/>`;
  }
  return s;
}
const SPOTS=[[300,125,'peony',1.05],[188,155,'cosmos',1],[412,155,'lily',1],[118,245,'rose',.95],[232,238,'lily',.95],[368,240,'cosmos',1],[482,245,'rose',.95],[172,338,'peony',1],[428,338,'peony',1],[300,325,'rose',1.15],[243,422,'daisy',1],[357,422,'tulip',.95]];
const EXTRA=[[220,50,'rose',.9],[380,50,'peony',.9],[300,10,'cosmos',.8],[95,150,'daisy',.95],[505,150,'daisy',.95],[300,225,'tulip',.8]];
function leafSpray(x,y,r){ let s='';for(let i=0;i<6;i++){const h=-i*22;s+=`<ellipse cx="-11" cy="${h-12}" rx="13" ry="8" transform="rotate(35 -11 ${h-12})"/><ellipse cx="11" cy="${h-18}" rx="13" ry="8" transform="rotate(-35 11 ${h-18})"/>`;}
  return `<g class="leaf"><g transform="translate(${x} ${y}) rotate(${r})" fill="#7fa67a" stroke="#5d8560"><path d="M0 60V-135" stroke-width="3"/>${s}</g></g>`; }
function breath(x,y){let s='';[[0,0],[16,-14],[-15,-13],[4,-28],[-22,6],[24,5],[-8,-38]].forEach(([a,b])=>s+=`<path d="M${a} ${b}L0 46" stroke="#8fb08a"/><circle cx="${a}" cy="${b}" r="6" fill="#fff"/><circle cx="${a}" cy="${b}" r="2" fill="#ffc9dc"/>`);return `<g class="leaf"><g transform="translate(${x} ${y})">${s}</g></g>`;}
function drawBouquet(svg, full, onTap){
  const list=full?[...EXTRA,...SPOTS]:SPOTS;
  let stems='',heads='';
  list.forEach(([x,y,t,k],i)=>{
    const ex=300-(x-300)*.28, dl=(i*.07).toFixed(2);
    stems+=`<path class="stem" pathLength="1" style="transition-delay:${dl}s" d="M${ex} 735Q300 600 ${300+(x-300)*.18} 545T${x} ${y}" fill="none" stroke="${i%2?'#6d9668':'#557f56'}" stroke-width="5"/>`;
    heads+=`<g class="fl" data-i="${i}" ${onTap?`role="button" tabindex="0" aria-label="Flower ${i+1}"`:''} transform="translate(${x} ${y}) scale(${k})"><g class="sw" style="animation-delay:${-i*.7}s"><g class="in" style="transition-delay:${(.8+i*.13).toFixed(2)}s">${flower(t)}<text class="spark" text-anchor="middle" x="32" y="-28" font-size="24" fill="#b81557" stroke="#fff" stroke-width="5" paint-order="stroke">♥</text></g></g></g>`;
  });
  const u='p'+(++uid);
  svg.innerHTML=`<defs><linearGradient id="${u}" x1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#f291b7"/></linearGradient><linearGradient id="${u}b" x1="1" x2="0" y2="1"><stop stop-color="#fffafc"/><stop offset="1" stop-color="#e8709f"/></linearGradient></defs>
  <path class="wrap" d="M60 300L120 170 190 215 300 130 410 215 480 170 540 300 330 605H270Z" fill="#fff0f6"/>
  ${leafSpray(110,310,-42)}${leafSpray(490,310,42)}${leafSpray(220,190,-16)}${leafSpray(380,190,16)}
  ${stems}${breath(245,150)}${breath(355,150)}${breath(80,300)}${breath(520,300)}${breath(300,245)}${breath(235,330)}${breath(368,330)}
  ${heads}
  <g class="wrap" style="pointer-events:none"><path d="M50 355Q160 470 345 485L322 612H276Z" fill="url(#${u})"/><path d="M550 355Q430 480 235 492L278 612H324Z" fill="url(#${u}b)"/><path d="M550 355Q430 480 235 492" fill="none" stroke="#fff" stroke-width="3"/>
  <g fill="#d42a70" stroke="#9d1049" stroke-width="1.5"><path d="M298 608Q262 670 238 706L262 702 272 722Q298 665 304 610Z"/><path d="M302 608Q336 660 356 700L334 698 326 720Q304 660 296 610Z"/><path d="M300 602C255 545 200 565 208 602C214 640 265 635 300 602Z" fill="#ea4b8b"/><path d="M300 602C345 545 400 565 392 602C386 640 335 635 300 602Z" fill="#ea4b8b"/><path d="M290 603Q250 580 226 598M310 603Q350 580 374 598" fill="none"/><rect x="284" y="584" width="32" height="36" rx="12"/></g></g>`;
  if(onTap) svg.querySelectorAll('.fl').forEach(el=>{
    const hit=()=>{const r=el.getBoundingClientRect();burst(r.x+r.width/2,r.y+r.height/2,18);onTap(+el.dataset.i,el);};
    el.onclick=hit; el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();hit();}};
  });
}
$('bud').innerHTML=`<path d="M0 30Q18 150 0 250" stroke="#557f56" stroke-width="9" fill="none"/><path d="M6 210C70 190 95 110 88 70C50 100 10 150 6 210" fill="#7fa67a"/><path d="M2 235C-60 215-84 150-78 110C-40 135-6 180 2 235" fill="#6d9668"/><g class="cup"><g transform="scale(2.3) translate(0 -18)">${flower('tulip')}</g></g>`;

/* ---------- petals & hearts ---------- */
const cv=$('petals'),cx=cv.getContext('2d'); let W,H,bits=[],fall=[];
const COL=['#ff7fab','#ffa6c5','#e2397c','#fff','#ffd0e0'];
const size=()=>{const d=Math.min(devicePixelRatio,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);};
size(); addEventListener('resize',size);
const rnd=(a,b)=>a+Math.random()*(b-a);
const mk=()=>({x:rnd(0,W),y:rnd(-H,0),s:rnd(5,11),v:rnd(.4,1.1),p:rnd(0,7),c:COL[rnd(0,5)|0]});
if(!calm) for(let i=0;i<Math.min(34,innerWidth/22);i++){const p=mk();p.y=rnd(0,H);fall.push(p);}
function heart(s){cx.beginPath();cx.moveTo(0,s*.9);cx.bezierCurveTo(-s*1.6,-s*.2,-s*.8,-s*1.3,0,-s*.4);cx.bezierCurveTo(s*.8,-s*1.3,s*1.6,-s*.2,0,s*.9);cx.fill();}
function burst(x,y,n){ if(calm)return; for(let i=0;i<n;i++){const a=rnd(0,6.28),v=rnd(1,7);bits.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-3,s:rnd(5,13),l:1,r:rnd(-1,1),c:COL[rnd(0,5)|0]});} }
function shower(){for(let i=0;i<7;i++)setTimeout(()=>burst(rnd(W*.1,W*.9),rnd(H*.15,H*.6),26),i*260);}
(function tick(){
  cx.clearRect(0,0,W,H);
  for(const p of fall){p.y+=p.v;p.p+=.015;p.x+=Math.sin(p.p)*.6;if(p.y>H+20)Object.assign(p,mk(),{y:-20});
    cx.save();cx.globalAlpha=.65;cx.fillStyle=p.c;cx.translate(p.x,p.y);cx.rotate(p.p);cx.scale(1,.5+.4*Math.abs(Math.sin(p.p*1.4)));cx.beginPath();cx.ellipse(0,0,p.s,p.s*.65,0,0,7);cx.fill();cx.restore();}
  bits=bits.filter(b=>(b.l-=.013)>0);
  for(const b of bits){b.x+=b.vx;b.y+=b.vy;b.vy+=.09;b.vx*=.985;cx.save();cx.globalAlpha=b.l;cx.fillStyle=b.c;cx.translate(b.x,b.y);cx.rotate(b.r);heart(b.s);cx.restore();}
  requestAnimationFrame(tick);
})();

/* ---------- a little music box ---------- */
let ac,out,playing=false,timer,beat=0,nextT=0;
const chords=[[60,64,67,71],[57,60,64,67],[65,69,72,76],[55,59,62,67]],tune=[76,0,79,0,83,79,0,76, 72,0,76,0,79,0,76,0, 77,0,81,0,84,81,0,79, 74,0,79,0,74,0,71,0];
function pluck(m,t,v){const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=440*2**((m-69)/12);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0005,t+1.9);o.connect(g).connect(out);o.start(t);o.stop(t+2);}
function sched(){while(nextT<ac.currentTime+.4){const c=chords[(beat>>3)%4];pluck(c[beat%4],nextT,.09);if(beat%8===0)pluck(c[0]-12,nextT,.14);if(tune[beat%32])pluck(tune[beat%32],nextT,.13);beat++;nextT+=.33;}}
let song=null;
if(L.song){song=new Audio(L.song);song.loop=true;song.preload='auto';song.volume=.6;song.onerror=()=>{song=null;if(playing)music(true);};}
function music(on){try{
  if(song){playing=on;$('music').setAttribute('aria-pressed',on);
    if(on){const p=song.play();p&&p.catch(e=>{if(!song||e.name==='AbortError')return;if(e.name==='NotAllowedError'){playing=false;$('music').setAttribute('aria-pressed',false);}else{song=null;music(true);}});}
    else song.pause();
    return;}
  if(on){if(!ac){ac=new (window.AudioContext||webkitAudioContext)();out=ac.createGain();out.gain.value=.6;out.connect(ac.destination);}
    ac.resume();nextT=ac.currentTime+.1;clearInterval(timer);timer=setInterval(sched,120);}
  else{clearInterval(timer);ac&&ac.suspend();}
  playing=on;$('music').setAttribute('aria-pressed',on);}catch(e){}}
$('music').onclick=()=>music(!playing);
document.addEventListener('visibilitychange',()=>{if(!playing)return;if(document.hidden){song?song.pause():(clearInterval(timer),ac&&ac.suspend());}else music(true);});

/* ---------- scenes ---------- */
async function go(id){
  const cur=document.querySelector('.scene.on');
  cur.classList.remove('on'); await pause(calm?20:650); cur.hidden=true;
  const s=$(id); s.hidden=false; scrollTo(0,0); s.offsetWidth; s.classList.add('on');
  s.querySelector('h1,h2')?.focus({preventScroll:true});
}
const lucky=$('lucky');
if(L.luckyNumber){lucky.setAttribute('aria-label','Our lucky number, '+L.luckyNumber);['♥',...String(L.luckyNumber),'♥'].forEach(c=>{const s=document.createElement('span');s.textContent=c;if(c==='♥')s.className='h';lucky.append(s);});}
else lucky.dataset.empty='';
lucky.onclick=()=>{const r=lucky.getBoundingClientRect();burst(r.x+r.width/2,r.y+r.height/2,30);};
const found=new Set();
$('hello').textContent=`Hey ${name}, these are for you.`;
const showCount=()=>$('count').textContent=found.size?(found.size===12?'You found all 12 of my secrets':`${found.size} of 12 secrets found`):'';
$('open').onclick=async()=>{
  if($('open').classList.contains('go'))return;
  $('open').classList.add('go');music(true);burst(W/2,H*.4,60);await pause(500);
  drawBouquet($('flowers'),false,(i,el)=>{
    el.classList.add('found');found.add(i);$('note').textContent=L.notes[i]||'I love you';
    const n=document.querySelector('.note');n.classList.remove('hit');n.offsetWidth;n.classList.add('hit');
    showCount();if(found.size===12)shower();
  });
  showCount();await go('bouquet');$('flowers').classList.add('grown');
  setTimeout(shower,calm?0:3400);
};
$('toQ').onclick=()=>{step=0;answers.length=0;document.querySelectorAll('#progress svg').forEach(e=>e.classList.remove('ok'));ask();go('ask');};

/* ---------- love timer ---------- */
if(L.since){
  const [y,m,d]=L.since.split('-').map(Number),start=new Date(y,m-1,d);
  const label='Us, since '+start.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  const els=[...document.querySelectorAll('.timer')].map(t=>{
    const p=document.createElement('p'),row=document.createElement('div');p.textContent=label;row.setAttribute('role','timer');
    const nums=['days','hours','minutes','seconds'].map(u=>{const c=document.createElement('div'),b=document.createElement('b'),s=document.createElement('span');s.textContent=u;c.append(b,s);row.append(c);return b;});
    t.append(p,row);return nums;});
  const run=()=>{
    const now=new Date(),n=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    // calendar days, so daylight saving never skews the count
    const days=Math.max(0,Math.round((Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())-Date.UTC(y,m-1,d))/864e5));
    const v=[days,now.getHours(),now.getMinutes(),now.getSeconds()];
    els.forEach(ns=>ns.forEach((b,i)=>b.textContent=i?String(v[i]).padStart(2,'0'):v[i]));
  };
  run();setInterval(run,1000);
}else document.querySelectorAll('.timer').forEach(t=>t.hidden=true);

/* ---------- questions ---------- */
let step=0;const answers=[];
$('progress').innerHTML=EXTRA.map(e=>`<svg viewBox="-70 -70 140 140">${flower(e[2])}</svg>`).join('');
const HEART='<svg class="heart" viewBox="-60 -58 120 112"><path d="M0 50C-95-10-45-85 0-28C45-85 95-10 0 50Z" fill="#e2397c"/></svg>';
function done(label,text,reply){
  answers[step]=[label,text];$('reply').textContent=reply;
  $('progress').children[step].classList.add('ok');
  const r=$('progress').children[step].getBoundingClientRect();burst(r.x+21,r.y+21,26);
  $('next').textContent=step===Q.length-1?'There is one more thing':'Next question';$('next').hidden=false;
}
function choice(label,opts){return a=>opts.forEach(([t,r])=>{
  const b=document.createElement('button');b.className='opt';b.textContent=t;
  b.onclick=()=>{[...a.children].forEach(x=>x.disabled=true);b.classList.add('pick');done(label,t,r);};a.append(b);});}
const Q=[
 ['Do you know how beautiful you are?',choice('Beautiful?',[['Yes, obviously','Correct. And so humble too.'],['Not really','Then I get to remind you every single day.'],['Tell me again','You are the most beautiful thing I have ever seen. Again? Anytime.']])],
 ['How much do you love me?',a=>{
   a.innerHTML=`<div class="love"><div class="box">${HEART}</div><input type="range" min="0" max="100" value="10" aria-label="How much you love me"><button class="opt">This much</button></div>`;
   const i=a.querySelector('input'),h=a.querySelector('.heart'),say=['A tiny bit? Keep going…','Getting warmer…','Aww, go on…','So close. A little more…','To the moon and back!'];
   const up=()=>{h.style.transform=`scale(${.3+i.value/100*1.1})`;$('reply').textContent=say[Math.min(4,i.value/25|0)];};
   i.oninput=up;up();
   a.querySelector('button').onclick=e=>{i.disabled=e.target.disabled=true;e.target.classList.add('pick');const r=h.getBoundingClientRect();burst(r.x+r.width/2,r.y+r.height/2,40);
     done('You love me',i.value+'%',i.value>=100?'And I love you one more than that. Always one more.':i.value>=50?`${i.value}%? I'll earn the rest in kisses.`:'Suspicious. I still love you 1000%.');};}],
 ['Can I have a hug? Hold the heart.',a=>{
   a.innerHTML=`<button class="hug" aria-label="Press and hold to hug"><svg viewBox="-60 -58 120 112"><path class="track" d="M0 50C-95-10-45-85 0-28C45-85 95-10 0 50Z" fill="#ffe3ed" stroke="#e2397c" stroke-width="3"/><clipPath id="hc"><rect x="-70" y="54" width="140" height="120"/></clipPath><path clip-path="url(#hc)" d="M0 50C-95-10-45-85 0-28C45-85 95-10 0 50Z" fill="#e2397c"/></svg></button>`;
   const b=a.firstChild,rect=a.querySelector('rect'),svg=a.querySelector('svg');let t0=0,fin=false,run=false;
   let iv;const loop=()=>{if(!run||fin||!b.isConnected)return clearInterval(iv);const now=performance.now(),p=Math.min(1,(now-t0)/2400);rect.setAttribute('y',54-p*112);svg.style.transform=`scale(${1+p*.12+Math.sin(now/90)*.02})`;
     if(p>=1){fin=true;clearInterval(iv);b.disabled=true;const r=b.getBoundingClientRect();burst(r.x+r.width/2,r.y+r.height/2,60);done('Hug','Delivered','Best hug ever. I felt that one.');}};
   const start=()=>{if(run||fin)return;run=true;t0=performance.now();$('reply').textContent="Don't let go…";clearInterval(iv);iv=setInterval(loop,16);};
   const stop=()=>{if(!run||fin)return;run=false;clearInterval(iv);rect.setAttribute('y',54);svg.style.transform='';$('reply').textContent='Hey, longer than that! Hold on to me.';};
   b.onpointerdown=e=>{try{b.setPointerCapture(e.pointerId);}catch(_){}start();};b.onpointerup=b.onpointercancel=stop;b.oncontextmenu=e=>e.preventDefault();
   b.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();start();}};b.onkeyup=b.onblur=stop;}],
 ['Who loves who more?',choice('Loves more',[['I love you more','Cute. But wrong. I love you more.'],['You love me more','Finally, you admit it. Yes, I do.'],['It is a tie','A tie? Fine. Settle it with a kiss.']])],
 ['Will you be mine, forever?',a=>{
   a.classList.add('run');
   const y=document.createElement('button'),n=document.createElement('button');y.className='opt yes';n.className='opt no';y.textContent='Yes, forever';n.textContent='No';a.append(y,n);
   const say=['Are you sure?','Try again','Nice try','Too slow','Not an option','You meant yes','Pretty please?'];let k=0,spot=0;
   const dodge=e=>{e.preventDefault();if(y.disabled)return;n.textContent=say[k++%say.length];
     // corners only, so it never sits under the growing yes
     const mx=a.clientWidth-n.offsetWidth,my=a.clientHeight-n.offsetHeight,c=[[0,0],[1,1],[0,1],[1,0]][spot++%4];
     n.style.left=Math.max(0,c[0]*mx)+'px';n.style.top=c[1]*my+'px';y.style.transform=`scale(${Math.min(1.6,1+k*.1)})`;};
   n.onpointerenter=dodge;n.onpointerdown=dodge;n.onclick=dodge;
   y.onclick=()=>{y.disabled=true;n.disabled=true;n.classList.add('pick');shower();done('Mine forever?','Yes, forever','You just made me the happiest person alive.');};}],
 ['One last question. Open the box.',a=>{
   a.innerHTML=`<div class="propose"><button class="ringbox" aria-label="Open the ring box"><svg viewBox="-120 -150 240 250" aria-hidden="true">
     <g class="rays">${Array.from({length:12},(_,i)=>`<path d="M-4-60L0-135 4-60Z" fill="#fff3c9" transform="translate(0 -35) rotate(${i*30})"/>`).join('')}</g>
     <path d="M-82 8H82V-8Q82-18 70-18H-70Q-82-18-82-8Z" fill="#fff0f6"/>
     <g class="ring"><circle cy="-8" r="31" fill="none" stroke="#d99a2b" stroke-width="9"/><circle cy="-8" r="31" fill="none" stroke="#ffe09a" stroke-width="4"/>
       <path d="M-26-66L-14-80H14L26-66 0-36Z" fill="#e9faff" stroke="#8fc9de" stroke-width="2"/><path d="M-26-66H26M-14-80L-8-66 0-36 8-66 14-80M-8-66L0-80 8-66" fill="none" stroke="#8fc9de" stroke-width="1.6"/></g>
     <path d="M-88 0H88V70Q88 88 70 88H-70Q-88 88-88 70Z" fill="#a3175a"/><path d="M-88 0H88V14H-88Z" fill="#c92268"/>
     <g class="lid"><path d="M-88 0V-34Q-88-80-40-80H40Q88-80 88-34V0Z" fill="#b81557"/><path transform="translate(0 -34) scale(.34)" d="M0 50C-95-10-45-85 0-28C45-85 95-10 0 50Z" fill="#ffd27a"/></g></svg></button><div class="vows" hidden></div></div>`;
   const b=a.querySelector('.ringbox'),v=a.querySelector('.vows');
   b.onclick=async()=>{if(b.disabled)return;b.disabled=true;b.classList.add('open');const r=b.getBoundingClientRect();burst(r.x+r.width/2,r.y+r.height/2,45);
     await pause(calm?50:1300);$('q').textContent='Will you marry me?';v.hidden=false;
     ['Yes, I will','Yes, a million times'].forEach(t=>{const o=document.createElement('button');o.className='opt';o.textContent=t;o.onclick=()=>{[...v.children].forEach(x=>x.disabled=true);o.classList.add('pick');shower();done('Marry me?',t,'Then it is you and me, for the rest of our lives.');};v.append(o);});
     $('q').focus({preventScroll:true});};}]
];
function ask(){const a=$('arena');a.className='';a.replaceChildren();$('reply').textContent='';$('next').hidden=true;$('q').textContent=Q[step][0];Q[step][1](a);}
$('next').onclick=()=>{if(step<Q.length-1){step++;ask();$('q').focus({preventScroll:true});scrollTo({top:0,behavior:'smooth'});}else{$('next').hidden=true;go('mail');}};

/* ---------- letter ---------- */
const para=(t,c)=>{const p=document.createElement('p');p.textContent=t;if(c)p.className=c;return p;};
$('letter').append(para(`My ${name},`,'dear'),...L.letter.map(t=>para(t)),para(L.yourName?`Yours, ${L.yourName}`:'Yours, always','sign'));
$('envelope').onclick=async()=>{const e=$('envelope');if(e.classList.contains('open'))return;e.classList.add('open');burst(W/2,H/2,30);await pause(calm?50:1000);e.hidden=$('mailHint').hidden=true;$('letter').hidden=$('toEnd').hidden=false;};

/* ---------- finale ---------- */
const langs=['I love you','Je t’aime','Te amo','Ti amo','मुझे तुमसे प्यार है','Ich liebe dich','愛してる','Forever'];let li=0;
$('toEnd').onclick=async()=>{
  drawBouquet($('flowers2'),true);
  $('answers').replaceChildren(...answers.map(([q,t])=>{const l=document.createElement('li'),b=document.createElement('b'),s=document.createElement('span');s.textContent=q;b.textContent=t;l.append(s,b);return l;}));
  await go('end');$('flowers2').classList.add('grown');setTimeout(shower,calm?0:1500);
  setInterval(async()=>{const e=$('langs');e.style.opacity=0;await pause(500);e.textContent=langs[++li%langs.length];e.style.opacity=1;},3600);
};
$('again').onclick=()=>location.reload();
})();
