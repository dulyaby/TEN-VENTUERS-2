import {api} from './fb.js';
import {bookForm,ready,esc,fd} from './ui.js';
const pg=document.body.dataset.page;
const normUrl=u=>{if(!u)return '';u=String(u).trim();if(!u)return '';if(/^(https?:|mailto:|tel:|\/|#)/i.test(u))return u;return 'https://'+u};
const safe=u=>/^(https?:|mailto:|tel:)/i.test(u)||/^[\w\-./?=&#]+$/.test(u);
const show=async ad=>{let t=null;
 if(ad.trainingId){try{t=await api.get('trainings',ad.trainingId)}catch(e){}if(!t||t.status=='hidden'||(t.expires&&t.expires<Date.now()))return}
 const img=ad.imageUrl||(t&&t.imageUrl)||'',o=document.createElement('div');o.className='pa';
 o.innerHTML=`<div class="pc" role="dialog" aria-modal="true"><button class="px" aria-label="Close">×</button>${img?`<div class="pi"><img src="${img}" alt=""></div>`:''}<div class="pb"><span class="chip">${t?'Training':'Announcement'}</span><h2>${esc(ad.title)}</h2><p class="pre">${esc(ad.body||'')}</p>${t?`<p class="meta" style="margin-top:8px">📅 ${fd(t.date)} ${esc(t.time||'')} · 📍 ${esc(t.location)} · ${t.fee?'TZS '+Number(t.fee).toLocaleString():'Free'}</p>`:''}<p style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">${t?'<button class="btn3" id="pbk">Book now</button>':ad.ctaUrl&&safe(ad.ctaUrl)?`<a class="btn3" style="text-decoration:none" target="_blank" rel="noopener noreferrer" href="${esc(normUrl(ad.ctaUrl))}">${esc(ad.ctaText||'Learn more')}</a>`:''}<button class="btn3 o" id="pcl">Close</button></p></div></div>`;
 document.body.appendChild(o);requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add('on')));
 try{const s=JSON.parse(sessionStorage.tv_ads||'[]');s.push(ad.id);sessionStorage.tv_ads=JSON.stringify(s)}catch(e){}
 const close=()=>{o.classList.remove('on');setTimeout(()=>o.remove(),600)};
 o.onclick=e=>{if(e.target==o)close()};o.querySelector('.px').onclick=close;o.querySelector('#pcl').onclick=close;addEventListener('keydown',e=>e.key=='Escape'&&close());
 const bk=o.querySelector('#pbk');if(bk)bk.onclick=async()=>{close();await ready;setTimeout(()=>bookForm(t),650)}};
if(!['admin','account','dashboard'].includes(pg))(async()=>{let ads=[];try{ads=(await api.list('ads')).filter(a=>a.status!='hidden'&&!(a.expires&&a.expires<Date.now()))}catch(e){return}
 let seen=[];try{seen=JSON.parse(sessionStorage.tv_ads||'[]')}catch(e){}const ad=ads.find(a=>!seen.includes(a.id));if(!ad)return;
 setTimeout(()=>show(ad),document.getElementById('intro')?7500:2200)})();
