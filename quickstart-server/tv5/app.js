(()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches,N=9,P=document.documentElement.classList.contains('lite')?90:170,SHP=[0,1,2,3,4,6,6,5,0];
if(rm)document.body.classList.add('rm');
// split headline characters for the 3D reveal
let spn=0;$$('[data-sp]').forEach(el=>{el.innerHTML=el.textContent.split(' ').map(wd=>'<span class="wd">'+[...wd].map(ch=>`<span style="--i:${spn++}">${ch}</span>`).join('')+'</span>').join(' ')});
// build services coverflow + why cards
const cf=$('#cf');cf.innerHTML=SERVICES.map((s,i)=>`<article class="cd" data-i="${i}"><b>0${i+1}</b><h3>${s[0]}</h3><p>${s[1]}</p></article>`).join('');
$('#why').innerHTML=WHY.map(w=>`<article class="tc"><h3>${w[0]}</h3><p>${w[1]}</p></article>`).join('');
const cds=$$('.cd');let ci=3,hov=false,px=null;
const cflow=()=>cds.forEach((el,i)=>{const d=i-ci,a=Math.abs(d),sx=innerWidth<800?105:215;el.style.transform=`translate(-50%,-50%) translateX(${d*sx}px) translateZ(${-a*150}px) rotateY(${-Math.sign(d)*50}deg) scale(${a?1:1.08})`;el.style.opacity=a>3?0:1-a*.2;el.style.zIndex=10-a;el.classList.toggle('ac',!a)});
const go=d=>{ci=(ci+d+cds.length)%cds.length;cflow()};cflow();
$('.ar.l').onclick=()=>go(-1);$('.ar.r').onclick=()=>go(1);cds.forEach(el=>el.onclick=()=>{ci=+el.dataset.i;cflow()});
cf.parentNode.addEventListener('pointerenter',()=>hov=true);cf.parentNode.addEventListener('pointerleave',()=>hov=false);
cf.parentNode.addEventListener('pointerdown',e=>px=e.clientX);addEventListener('pointerup',e=>{if(px!=null&&Math.abs(e.clientX-px)>40)go(e.clientX<px?1:-1);px=null});
setInterval(()=>{if(!hov&&!rm&&Math.abs(s-5)<.6)go(1)},3600);
$$('.tc').forEach(t=>{t.addEventListener('pointermove',e=>{const r=t.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;t.style.setProperty('--ry',(x-.5)*16+'deg');t.style.setProperty('--rx',(.5-y)*16+'deg');t.style.setProperty('--gx',x*100+'%');t.style.setProperty('--gy',y*100+'%')});t.addEventListener('pointerleave',()=>{t.style.setProperty('--rx','0deg');t.style.setProperty('--ry','0deg')})});
$$('.mg').forEach(b=>b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.3}px)`}),$$('.mg').forEach(b=>b.addEventListener('pointerleave',()=>b.style.transform='')));
let counted=false;const count=()=>{counted=true;$$('[data-n]').forEach(el=>{const to=+el.dataset.n,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1400);el.textContent=Math.round(to*(1-Math.pow(1-k,3)))+(el.dataset.s||'');if(k<1)requestAnimationFrame(f)})(t0)})};
// ---------- story engine ----------
const cv=$('#cv'),c=cv.getContext('2d'),track=$('#track'),strip=$('#strip'),pans=$$('.pn'),ins=$$('.in'),bar=$('#bar'),rail=$('.rail'),orbs=$$('.orb');
let W,H,R,CX,CY,mob,target=0,cur=0,s=0,mx=0,my=0;pans.forEach((p,i)=>p.style.left=i*100+'vw');
const rnd=(a=>()=>(a=a*16807%2147483647)/2147483647)(42);
const S=Array.from({length:P},()=>({a:rnd(),b:rnd(),c:rnd(),d:rnd(),e:rnd(),o:rnd()<.32,r:1+rnd()*1.3}));
const SH=[[-.8,-.7],[0,-.95],[.8,-.7],[.8,.1],[0,.95],[-.8,.1]];
function shield(i){const L=[];let tot=0;for(let j=0;j<6;j++){const a=SH[j],b=SH[(j+1)%6],l=Math.hypot(b[0]-a[0],b[1]-a[1]);L.push(l);tot+=l}let d=i/P*tot,j=0;while(d>L[j]){d-=L[j];j++}const a=SH[j],b=SH[(j+1)%6],f=d/L[j];return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]}
function pos(k,i,t){const p=S[i];switch(k){
case 0:return[p.a*W+Math.sin(t*4e-4+p.c*6)*14+mx*p.r*8,p.b*H+Math.cos(t*5e-4+p.d*6)*14+my*p.r*8,0,.34];
case 6:return[p.d*W+Math.sin(t*4e-4+p.a*6)*14,p.e*H+Math.cos(t*5e-4+p.b*6)*14,0,.26];
case 1:{const ph=Math.acos(1-2*(i+.5)/P),th=Math.PI*(1+Math.sqrt(5))*i+t*2.5e-4,z=Math.sin(ph)*Math.sin(th);return[CX+R*1.05*Math.sin(ph)*Math.cos(th),CY+R*1.05*Math.cos(ph),z,.3+.7*(z+1)/2]}
case 2:{const a=(i%6)/6*6.283+.3+t*1e-4,r=R*.3*Math.sqrt(p.a),b=p.b*6.283;return[CX+Math.cos(a)*R*.8+Math.cos(b)*r,CY+Math.sin(a)*R*.8+Math.sin(b)*r,0,.9]}
case 3:{const q=shield(i),m=i%3==2?.6:1;return[CX+q[0]*R*m,CY+q[1]*R*m,0,.9]}
case 4:{const col=i%5,row=Math.floor(i/5)/Math.ceil(P/5),h=(.45+col*.34)*R*1.25;return[CX+R*(-.95+col*.48)+(p.a-.5)*R*.3,CY+R*.95-row*h,0,.9]}
case 5:{const u=i/(P-1);return[CX+R*(-1.1+2.2*u),CY+R*(.8-1.6*Math.pow(u,1.7))+p.b*R*.45,0,.9]}}}
function size(){const d=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0);mob=W<800;R=mob?Math.min(W*.34,H*.19):Math.min(W*.22,H*.3);CX=mob?W/2:W*.69;CY=mob?H*.3:H*.5}
const w=k=>Math.max(0,1-Math.abs(s-k)),ez=u=>u*u*(3-2*u);
function frame(t){cur+=(target-cur)*.075;s=cur*(N-1);const k=Math.min(N-2,Math.floor(s)),f=s-k;c.clearRect(0,0,W,H);
strip.style.transform=`translate3d(${-s*W}px,0,0)`;
const g=c.createRadialGradient(CX,CY,0,CX,CY,R*2.2);g.addColorStop(0,`rgba(242,106,27,${.1+.16*w(3)+.1*w(7)})`);g.addColorStop(1,'rgba(242,106,27,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
const X=[];for(let i=0;i<P;i++){let u=ez(Math.min(1,Math.max(0,(f-S[i].e*.35)/.65)));const A=pos(SHP[k],i,t),B=pos(SHP[k+1],i,t);X.push([A[0]+(B[0]-A[0])*u,A[1]+(B[1]-A[1])*u,A[2]+(B[2]-A[2])*u,A[3]+(B[3]-A[3])*u])}
const la=w(2)*.5+w(3)*.28+w(1)*.12+w(7)*.2,th=R*.36;
if(la>.02){c.lineWidth=1;for(let i=0;i<P;i++)for(let j=i+1;j<P;j++){const dx=X[i][0]-X[j][0],dy=X[i][1]-X[j][1],d=dx*dx+dy*dy;if(d<th*th){c.strokeStyle=`rgba(255,150,90,${la*(1-Math.sqrt(d)/th)})`;c.beginPath();c.moveTo(X[i][0],X[i][1]);c.lineTo(X[j][0],X[j][1]);c.stroke()}}}
// unique per-scene accents: orbiting rings (people), scan beam + drawn check (compliance), pulsing node (growth)
if(w(1)>.02){c.strokeStyle=`rgba(255,150,90,${w(1)*.5})`;c.lineWidth=1.2;[0,1].forEach(n=>{c.beginPath();c.ellipse(CX,CY,R*1.5,R*.42,t*3e-4*(n?-1:1)+n*1.2,0,6.283);c.stroke()})}
if(w(3)>.02){const a=w(3),y=CY+Math.sin(t*.0016)*R*.8,gr=c.createLinearGradient(CX-R,y,CX+R,y);gr.addColorStop(0,'rgba(255,150,90,0)');gr.addColorStop(.5,`rgba(255,150,90,${a*.8})`);gr.addColorStop(1,'rgba(255,150,90,0)');c.fillStyle=gr;c.fillRect(CX-R,y-1,R*2,2);
const pts=[[-.3,.05],[-.08,.3],[.35,-.25]],pr=Math.min(1,a*1.6)*2;c.strokeStyle=`rgba(255,255,255,${a})`;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(CX+pts[0][0]*R,CY+pts[0][1]*R);for(let n=1;n<3;n++){const q=Math.min(1,Math.max(0,pr-(n-1)));if(q>0)c.lineTo(CX+(pts[n-1][0]+(pts[n][0]-pts[n-1][0])*q)*R,CY+(pts[n-1][1]+(pts[n][1]-pts[n-1][1])*q)*R)}c.stroke()}
if(w(7)>.02){const e=X[P-1],pu=(t%1400)/1400;c.fillStyle=`rgba(255,128,56,${w(7)})`;c.beginPath();c.arc(e[0],e[1],6,0,6.283);c.fill();c.strokeStyle=`rgba(255,128,56,${w(7)*(1-pu)})`;c.beginPath();c.arc(e[0],e[1],6+pu*26,0,6.283);c.stroke()}
for(let i=0;i<P;i++){const q=X[i],r=S[i].r*(.75+.35*(q[2]+1)/2)*(mob?.9:1.15);c.fillStyle=S[i].o?`rgba(255,128,56,${q[3]})`:`rgba(205,224,255,${q[3]*.9})`;c.beginPath();c.arc(q[0],q[1],r,0,6.283);c.fill()}
ins.forEach((el,i)=>{const d=i-s,a=Math.abs(d);el.style.opacity=Math.max(0,1-a*.75);el.style.transform=`perspective(1200px) rotateY(${-d*26}deg) translateZ(${-a*90}px) translateX(${d*40}px)`});
orbs.forEach((o,i)=>o.style.transform=`translate(${mx*(20+i*14)-s*W*.12*(i+1)}px,${my*(14+i*10)}px)`);
if(s>5.4&&s<6.6&&!counted)count();
const a=Math.round(s);[...rail.children].forEach((b,i)=>b.classList.toggle('on',i==a));bar.style.width=cur*100+'%';requestAnimationFrame(frame)}
['Start','People','Talent','Compliance','Training','Services','Why us','Growth','Together'].forEach((n,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',n);b.innerHTML='<span>'+n+'</span>';b.onclick=()=>scrollTo({top:i/(N-1)*(track.offsetHeight-innerHeight),behavior:'smooth'});rail.appendChild(b)});
addEventListener('keydown',e=>{if(e.key=='ArrowRight'||e.key=='ArrowLeft'){e.preventDefault();scrollBy({top:(e.key=='ArrowRight'?1:-1)*(track.offsetHeight-innerHeight)/(N-1),behavior:'smooth'})}});
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
const sc=()=>{target=Math.min(1,Math.max(0,scrollY/(track.offsetHeight-innerHeight)))};
if(!rm){addEventListener('scroll',sc,{passive:true});addEventListener('resize',()=>{size();sc()});size();sc();cur=target;requestAnimationFrame(frame)}
// ---------- intro: greeting -> sparkles form the logo -> logo flies to navbar ----------
const intro=$('#intro'),il=$('#il'),ic=$('#ic'),x=ic.getContext('2d');
const finish=()=>{document.body.classList.add('go');intro.remove();il.remove();sessionStorage.setItem('tv_intro','1')};
if(rm||sessionStorage.getItem('tv_intro')){if(rm)document.body.classList.add('go');else{intro.remove();il.remove();document.body.classList.add('go')}}
else{const tzH=(()=>{try{const p=new Intl.DateTimeFormat('en-US',{timeZone:'Africa/Dar_es_Salaam',hour:'numeric',hourCycle:'h23'}).formatToParts(new Date());const hp=p.find(x=>x.type==='hour');return hp?parseInt(hp.value,10):((new Date().getUTCHours()+3)%24)}catch(_){return((new Date().getUTCHours()+3)%24)}})();
const h=tzH,G=h>=5&&h<12?['Good morning','Habari za asubuhi']:h>=12&&h<17?['Good afternoon','Habari za mchana']:['Good evening','Habari za jioni'];
$('#gs').textContent=G[1];$('#gw').textContent='Welcome to Ten Ventures Africa · Karibu';$('#gt').innerHTML=[...G[0]].map((ch,i)=>ch==' '?' ':`<span style="animation-delay:${.1+i*.04}s">${ch}</span>`).join('');
let t0=performance.now(),parts=[],lw,lh,phase=0,dpr=Math.min(2,devicePixelRatio||1);
ic.width=innerWidth*dpr;ic.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0);
const ready=()=>{lw=Math.min(360,innerWidth*.72);const k=lw/LOGO.w;lh=Math.round(LOGO.h*k);const ox=(innerWidth-lw)/2,oy=(innerHeight-lh)/2;parts=LOGO.p.filter((_,i)=>!document.documentElement.classList.contains('lite')||i%3==0).map(p=>{const an=Math.random()*6.283,ds=Math.max(innerWidth,innerHeight)*(.6+Math.random()*.5);return{tx:ox+p[0]*k,ty:oy+p[1]*k,sx:innerWidth/2+Math.cos(an)*ds,sy:innerHeight/2+Math.sin(an)*ds,dl:Math.random()*900,col:p[2],sz:1.4+Math.random()*1.2,tw:Math.random()*6}});Object.assign(il.style,{left:ox+'px',top:oy+'px',width:lw+'px',height:lh+'px'})};ready();
$('#sk').onclick=()=>{t0=Math.min(t0,performance.now()-4900)};
(function tick(now){const e=now-t0;x.clearRect(0,0,innerWidth,innerHeight);
if(e>2300)$('#gr').classList.add('hide');
if(parts.length&&e>1900){const gl=e>4500?Math.max(0,1-(e-4500)/600):1;x.globalCompositeOperation='lighter';for(const p of parts){const k=Math.min(1,Math.max(0,(e-1900-p.dl)/1400)),u=1-Math.pow(1-k,3),px=p.sx+(p.tx-p.sx)*u,py=p.sy+(p.ty-p.sy)*u,al=gl*(k<1?.5+.5*Math.sin(e*.02+p.tw):.85+.15*Math.sin(e*.006+p.tw));x.globalAlpha=al;x.fillStyle=p.col;x.fillRect(px,py,p.sz,p.sz);if(k<1){x.globalAlpha=al*.25;x.fillRect(px-1,py-1,p.sz+2,p.sz+2)}}x.globalCompositeOperation='source-over';x.globalAlpha=1}
if(e>4300&&phase==0){phase=1;il.style.opacity=1}
if(e>5300&&phase==1){phase=2;const r=$('.lg img').getBoundingClientRect();il.classList.add('fly');Object.assign(il.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});intro.classList.add('out')}
if(e>6350&&phase==2){finish();return}requestAnimationFrame(tick)})(performance.now())}
})();
