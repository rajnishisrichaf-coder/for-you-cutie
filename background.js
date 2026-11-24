(() => {
const bg=document.createElement('div');bg.id='world';bg.setAttribute('aria-hidden','true');
const R=(a,b)=>a+Math.random()*(b-a), H='M0 50C-95-10-45-85 0-28C45-85 95-10 0 50Z', small=innerWidth<900;
let h='<div class="moon"></div>';
// twinkling sparkles
for(let i=0;i<(small?22:46);i++) h+=`<svg class="tw" viewBox="-10 -10 20 20" style="left:${R(1,99)}%;top:${R(4,72)}%;width:${R(8,22)}px;animation-delay:${-R(0,5)}s;animation-duration:${R(2.4,5)}s"><path d="M0-10Q1-1 10 0Q1 1 0 10Q-1 1-10 0Q-1-1 0-10" fill="#fff"/></svg>`;
// clouds
[[9,300,95,0],[24,210,120,.45],[40,360,140,.2],[16,250,110,.75],[55,240,130,.6]].forEach(([t,w,d,o],i)=>h+=`<svg class="cloud" viewBox="0 0 220 90" style="top:${t}%;width:${small?w*.55:w}px;animation-duration:${d}s;animation-delay:${-d*o}s;opacity:${i%2?.55:.8}"><g fill="#fff"><ellipse cx="60" cy="62" rx="52" ry="24"/><ellipse cx="105" cy="42" rx="46" ry="38"/><ellipse cx="155" cy="58" rx="52" ry="27"/></g><path d="M20 78Q110 92 195 78" stroke="#ffb7d1" stroke-width="5" fill="none" opacity=".5" stroke-linecap="round"/></svg>`);
// heart balloons
[[7,78,'#e2397c',.1],[91,62,'#ff78a8',.3],[84,44,'#ffa9c8',.55],[14,52,'#ff8fb9',.7],[95,84,'#c92268',.85],[3,46,'#ffc0d6',.45]].slice(0,small?4:6).forEach(([x,w,c,o],i)=>h+=`<div class="bal" style="left:${x}%;animation-duration:${26+i*5}s;animation-delay:${-o*(26+i*5)}s"><svg viewBox="-70 -70 140 290" style="width:${small?w*.55:w}px;animation-delay:${-i}s"><path d="M0 58Q22 100 0 140T4 215" stroke="#a3175a" stroke-width="2.5" fill="none" opacity=".6"/><path d="${H}" fill="${c}"/><path d="M-7 60L0 48 7 60Z" fill="${c}"/><path d="M-38-30Q-40-48-24-50" stroke="#fff" stroke-width="8" stroke-linecap="round" fill="none" opacity=".75"/></svg></div>`);
// fairy lights
let wire='M0 18',bulbs='';for(let k=0;k<6;k++){const x=k*300;wire+=`Q${x+150} 96 ${x+300} 18`;for(let j=1;j<8;j++){const t=j/8,px=x+300*t,py=18+2*t*(1-t)*78;bulbs+=`<g transform="translate(${px} ${py})"><path d="M0 0V7" stroke="#a3175a" stroke-width="1.5"/><g class="bulb" style="animation-delay:${-j*.45-k}s" transform="translate(0 16)"><circle r="17" fill="${j%2?'#ffe3a3':'#ff9dc1'}" opacity=".35"/><path transform="scale(.17)" d="${H}" fill="${j%2?'#ffc95c':'#e2397c'}"/></g></g>`;}}
h+=`<svg class="lights" viewBox="0 0 1800 110"><path d="${wire}" fill="none" stroke="#a3175a" stroke-width="2" opacity=".65"/>${bulbs}</svg>`;
// hills and meadow
h+=`<svg class="hills" viewBox="0 0 1440 300" preserveAspectRatio="none"><path d="M0 120Q240 0 520 110T1040 90T1440 100V300H0Z" fill="#ffa8c7"/><path d="M0 190Q300 70 660 180T1440 140V300H0Z" fill="#fb8db5"/><path d="M0 235Q420 150 800 225T1440 205V300H0Z" fill="#ee6f9f"/></svg><div class="meadow">`;
const C=[['#fff','#ffc95c'],['#ffd0e0','#e2397c'],['#e2397c','#ffd27a'],['#c92268','#ff9dc1'],['#ff9dc1','#fff']];
for(let i=0,n=small?20:46;i<n;i++){const [p,m]=C[i%5],s=R(30,64),tall=R(95,170);let pet='';
  if(i%4===3) pet=`<path d="M0 22C-24 20-26-14-18-24L-8-8 0-28 8-8 18-24C26-14 24 20 0 22" fill="${p}"/>`;
  else{for(let j=0;j<7;j++)pet+=`<ellipse cy="-15" rx="8" ry="14" fill="${p}" transform="rotate(${j*51.4})"/>`;pet+=`<circle r="8" fill="${m}"/>`;}
  h+=`<svg viewBox="-32 -32 64 ${tall}" style="left:${(i/n*100+R(-1,1)).toFixed(1)}%;width:${small?s*.65:s}px;animation-delay:${-R(0,4)}s"><path d="M0 0Q${R(-10,10)} 60 0 ${tall}" stroke="#4f7d57" stroke-width="4" fill="none"/><path d="M0 70Q22 52 25 34Q4 42 0 70" fill="#6d9668"/>${pet}</svg>`;}
h+='</div>';
// butterflies
[['#e2397c','#ffb0cb'],['#fff','#ff8fb9'],['#ffb84d','#ffe3a3'],['#b81557','#ff7fab'],['#ff8fb9','#fff']].slice(0,small?3:5).forEach(([a,b],i)=>{
  const wing=`<path d="M0 0C6-34 44-36 40-10C38 4 18 8 0 4Z" fill="${a}"/><path d="M0 4C18 6 32 16 24 30C16 38 4 24 0 6Z" fill="${b}"/><circle cx="26" cy="-12" r="5" fill="${b}"/>`;
  h+=`<div class="fly f${i%3}" style="animation-delay:${-i*7}s;animation-duration:${24+i*4}s;top:${14+i*13}%"><svg viewBox="-46 -40 92 80" style="width:${small?30:46}px"><g class="wing" style="--m:1">${wing}</g><g class="wing" style="--m:-1">${wing}</g><ellipse rx="2.6" ry="15" fill="#7d0f40"/><path d="M0-14Q-5-26-10-27M0-14Q5-26 10-27" stroke="#7d0f40" stroke-width="1.6" fill="none"/></svg></div>`;});
bg.innerHTML=h;document.body.prepend(bg);
})();
