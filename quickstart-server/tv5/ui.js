import {api,demo,prep,tel,CEO} from './fb.js';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toast=m=>{const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2400)};
const fd=d=>d?new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'';
const vis=x=>x.status!='hidden'&&!(x.expires&&x.expires<Date.now());
const normUrl=u=>{if(!u)return '';u=String(u).trim();if(!u)return '';if(/^(https?:|mailto:|tel:|\/|#)/i.test(u))return u;return 'https://'+u};
const cta=x=>{const u=normUrl(x.ctaUrl||x.buttonLink||x.link||x.url);if(!u)return '';const t=x.ctaText||x.buttonText||'Learn more';return `<a class="btn3" style="text-decoration:none;display:inline-block" target="_blank" rel="noopener noreferrer" href="${esc(u)}">${esc(t)} →</a>`};
const COLOR_PRESETS=[
 {name:'Ten Ventures Blue',hex:'#0b224d'},
 {name:'Ten Ventures Orange',hex:'#f26522'},
 {name:'Royal Brand Blue',hex:'#1d4ed8'},
 {name:'Midnight Charcoal',hex:'#0f172a'},
 {name:'Forest Emerald',hex:'#044444'}
];
const colorPickerHtml=(id,current='#0b224d',label='Job Poster & Font Accent Color')=>`
<div class="fl full" style="border:1.5px solid var(--bd);border-radius:14px;padding:14px 16px;background:rgba(11,31,77,.02);margin-top:8px">
 <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px">
  <label style="font-weight:750;font-size:14px;color:var(--tx);margin:0">${esc(label)}</label>
  <div style="display:flex;align-items:center;gap:8px">
   <span style="font-size:12.5px;font-weight:700;color:var(--muted)">Custom color:</span>
   <input type="color" id="${id}_picker" value="${current}" style="width:36px;height:32px;border:0;padding:0;background:none;cursor:pointer;border-radius:6px">
   <input type="text" id="${id}" value="${current}" maxlength="9" placeholder="#0b224d" style="width:105px;padding:5px 8px;border:1px solid var(--bd);border-radius:8px;font-family:monospace;font-weight:700;font-size:13px">
  </div>
 </div>
 <div class="color-preset-row" id="${id}_presets" style="display:flex;gap:8px;flex-wrap:wrap">
  ${COLOR_PRESETS.map(p=>`
   <button type="button" class="color-chip-btn ${p.hex.toLowerCase()===current.toLowerCase()?'active':''}" data-color="${p.hex}" style="display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:99px;border:1.5px solid ${p.hex.toLowerCase()===current.toLowerCase()?p.hex:'var(--bd)'};background:#fff;cursor:pointer;font-size:12.5px;font-weight:700;transition:all .2s">
    <span style="width:14px;height:14px;border-radius:50%;background:${p.hex};display:inline-block;box-shadow:0 1px 3px rgba(0,0,0,.2)"></span>
    <span>${p.name}</span>
   </button>
  `).join('')}
 </div>
</div>`;
function bindColorPicker(id,defaultHex='#0b224d'){
 const hexIn=$('#'+id),colorIn=$('#'+id+'_picker'),presets=$('#'+id+'_presets');
 if(!hexIn)return;
 const update=hex=>{
  hexIn.value=hex;
  if(colorIn)colorIn.value=hex.startsWith('#')&&hex.length===7?hex:defaultHex;
  if(presets){
   $$('.color-chip-btn',presets).forEach(b=>{
    const isMatch=b.dataset.color.toLowerCase()===hex.toLowerCase();
    b.classList.toggle('active',isMatch);
    b.style.borderColor=isMatch?hex:'var(--bd)';
   });
  }
 };
 if(colorIn)colorIn.oninput=()=>update(colorIn.value);
 hexIn.oninput=()=>{
  let v=hexIn.value.trim();
  if(v&&!v.startsWith('#'))v='#'+v;
  if(/^#[0-9a-f]{6}$/i.test(v)&&colorIn)colorIn.value=v;
  if(presets){
   $$('.color-chip-btn',presets).forEach(b=>{
    const isMatch=b.dataset.color.toLowerCase()===v.toLowerCase();
    b.classList.toggle('active',isMatch);
    b.style.borderColor=isMatch?v:'var(--bd)';
   });
  }
 };
 if(presets){
  $$('.color-chip-btn',presets).forEach(b=>{
   b.onclick=e=>{e.preventDefault();update(b.dataset.color)};
  });
 }
}
const CATS=['Finance','HR','IT','Marketing','Legal','Operations','Engineering','Administration','Other'],TYPES=['Full-time','Part-time','Contract','Internship'];
const EDUS=['Degree / Shahada ya Kwanza',"Master's Degree / Uzamili",'Diploma / Stashahada','Post-Graduate Diploma','PhD / Uzamivu','Professional Certification (CPA, PSPTB, ACCA, etc.)','Certificate / Cheti','Secondary School / Kidato cha 4-6'];
const calcStrength=s=>{if(!s)return 25;let sc=0;if(s.avatarUrl)sc+=15;if(s.name)sc+=15;if(s.phone)sc+=15;if(s.headline)sc+=15;if(s.location)sc+=10;if(s.education)sc+=10;if(s.skills)sc+=10;if(s.cvUrl||s.cvName)sc+=10;return Math.min(100,Math.max(25,sc))};
const fe=e=>{const m=(e&&(e.code||e.message))||'';return /email-already/.test(m)?'This email is already registered. Please sign in.':/invalid-credential|wrong-password|user-not-found|Wrong email/.test(m)?'Wrong email or password.':/weak-password/.test(m)?'Password must be at least 6 characters.':/network|offline/.test(m)?'No internet connection. Please try again.':/permission/.test(m)?'You do not have permission for this action.':/popup/.test(m)?'Sign-in window was closed.':(e&&e.message)||'Something went wrong.'};
const inp=(id,l,t='text',req=0)=>`<div class="fl"><input id="${id}" type="${t}" placeholder=" " ${req?'data-req':''}><label for="${id}">${l}${req?' *':''}</label><small>Required</small></div>`;
const txa=(id,l,req=0)=>`<div class="fl full"><textarea id="${id}" placeholder=" " ${req?'data-req':''}></textarea><label for="${id}">${l}${req?' *':''}</label><small>Required</small></div>`;
const sel=(id,l,a)=>`<div class="fl s"><select id="${id}">${a.map(o=>`<option>${esc(o)}</option>`).join('')}</select><label for="${id}">${l}</label></div>`;
const fil=(id,l,acc='image/*')=>`<div class="fl s full"><input id="${id}" type="file" accept="${acc}"><label for="${id}">${l}</label></div>`;
const val=r=>{let bad=0;$$('[data-req]',r).forEach(i=>{const ok=i.value.trim()&&(i.type!='email'||/^\S+@\S+\.\S+$/.test(i.value));i.parentNode.classList.toggle('err',!ok);if(!ok)bad++});return!bad};
const table=(cols,rows)=>`<div class="tw"><table class="tb"><thead><tr>${cols.map(c=>`<th>${c[0]}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(r=>`<tr>${cols.map(c=>`<td>${c[1](r)}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${cols.length}" class="empty">Nothing here yet.</td></tr>`}</tbody></table></div>`;
const csv=(name,rows)=>{const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"',a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(q).join(',')).join('\n')],{type:'text/csv'}));a.download=name;a.click()};
const okv=m=>`<div style="text-align:center;padding:26px 0"><svg class="ck2" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/><path d="M30 52l14 14 27-30"/></svg><h2>${m}</h2></div>`;
const skel=n=>'<div class="cards">'+'<div class="sk"></div>'.repeat(n)+'</div>';
const off=e=>`<p class="empty">Could not load data. ${esc(fe(e))} <button class="lnk" onclick="location.reload()">Retry</button></p>`;
function modal(html){let m=$('#md');if(!m){m=document.createElement('div');m.id='md';m.className='md';m.innerHTML='<div></div>';document.body.appendChild(m);m.onclick=e=>{if(e.target==m)m.classList.remove('on')};addEventListener('keydown',e=>e.key=='Escape'&&m.classList.remove('on'))}const d=$('div',m);d.innerHTML='<button class="x" aria-label="Close">×</button>'+html;m.classList.add('on');$('.x',d).onclick=()=>m.classList.remove('on');return d}
const logoOf=(n,l)=>`<span class="lgo">${l?`<img loading="lazy" src="${l}" alt="">`:esc((n||'?')[0].toUpperCase())}</span>`;
const fill=(s,a,all)=>s.innerHTML=`<option value="">${all}</option>`+[...new Set(a)].map(v=>`<option>${esc(v)}</option>`).join('');
let me=null;const subs=[];const ready=new Promise(res=>{api.onUser(u=>{me=u;try{u?localStorage.tv_hint=JSON.stringify({name:u.name||u.email,role:u.role,admin:u.admin}):localStorage.removeItem('tv_hint')}catch(e){}res(u);subs.forEach(f=>f(u))})});
const signout=async()=>{await api.signOut();localStorage.removeItem('tv_hint');location='index.html'};
/* ---------- jobs ---------- */
const isTenV=j=>j.isTenVentures||(j.companyName&&/ten\s*ventures/i.test(j.companyName))||j.companyId==='c_tenventures';

const jobCard=(j,i)=>{
 const isTV=isTenV(j);
 const pColor=j.posterColor||'#0b224d';
 if(isTV){
  const quals=Array.isArray(j.qualifications)?j.qualifications:(j.qualifications||'').split('\n').map(s=>s.trim()).filter(Boolean);
  const qList=quals.length?quals:[
   'Relevant degree or diploma in Human Resources, Law or Business',
   'Demonstrated professional competency and practical work ethics',
   'Excellent interpersonal and communication skills in Swahili & English',
   'Adaptable, dedicated and focused on sustainable organizational growth'
  ];
  const btnTxt=j.buttonText||(j.applyType=='email1'?'Send CV to Neema':j.applyType=='email2'?'Send CV to Janeth':'Apply Now');
  const eHint=j.applyType=='email1'?'neema@tensventures.com':j.applyType=='email2'?'janethgeorge58@gmail.com':j.applyEmail||(j.applyType=='website'?'Website Application':'neema@tensventures.com');
  return `<article class="cd-hiring" data-id="${j.id}" style="--k:${i%12};--hir-c:${esc(pColor)};border-color:${esc(pColor)}">
   <div class="hir-head">
    <div>
     <div class="hir-title" style="color:${esc(pColor)}">We Are HIRING</div>
     <div class="hir-role-pill" style="background:${esc(pColor)}"><span>🔍</span> ${esc(j.title)}</div>
    </div>
    <a href="company.html?id=${esc(j.companyId||'c_tenventures')}" title="Ten Ventures Africa Profile"><img src="assets/logo.jpg" alt="Ten Ventures Africa" class="hir-logo" style="border-color:${esc(pColor)}33"></a>
   </div>
   <div class="hir-body">
    <div>
     <div class="hir-qual-title" style="color:${esc(pColor)}">Qualifications &amp; Requirements</div>
     <ul class="hir-qual-list">
      ${qList.slice(0,4).map(q=>`<li>${esc(q)}</li>`).join('')}
     </ul>
     <p class="meta" style="margin-top:12px;font-size:13.5px;font-weight:700">📍 ${esc(j.location||'Dar es Salaam')} · ${esc(j.type||'Full-time')}${j.deadline?' · Deadline: '+fd(j.deadline):''}</p>
    </div>
    <div class="hir-circle-photo" style="box-shadow:0 10px 26px rgba(11,34,77,.25),0 0 0 3.5px ${esc(pColor)}">
     <img src="${j.avatarUrl||'assets/woman.jpg'}" alt="Ten Ventures Professional">
    </div>
   </div>
   <div class="hir-foot">
    <div>
     <small style="display:block;font-size:11.5px;font-weight:800;text-transform:uppercase;color:${esc(pColor)}">Send Your Resume To:</small>
     <span class="hir-email-meta" style="color:${esc(pColor)}">✉ ${esc(eHint)}</span>
    </div>
    <div class="hir-action-wrap">
     <button class="hir-apply-btn" data-act="apply" data-id="${j.id}" style="background:${esc(pColor)}">
      <span>${esc(btnTxt)}</span>
      <span>→</span>
     </button>
     <button class="btn3 o sm" data-act="view" data-id="${j.id}">Full Info</button>
    </div>
   </div>
  </article>`;
 }

 const btnTxt=j.buttonText||(j.applyType&&j.applyType.startsWith('email')?'Send CV':'Apply Now');
 return `<article class="cd2" data-id="${j.id}" style="--k:${i%12};border-top:4px solid ${esc(pColor)}">
  ${j.imageUrl?`<div class="im" style="max-height:220px;overflow:hidden;background:#0d1b2a"><img loading="lazy" src="${j.imageUrl}" alt="${esc(j.title)}" style="width:100%;height:100%;object-fit:cover"></div>`:''}
  <div class="bd">
   <div class="co">
    <span class="meta" style="font-size:16px;font-weight:850;color:${esc(pColor)};text-transform:uppercase;letter-spacing:.5px">${esc(j.companyName)}</span>
   </div>
   <h3 style="font-size:20px;font-weight:800;margin-top:4px">${esc(j.title)}</h3>
   <p class="meta" style="margin-top:6px;font-size:14.5px;font-weight:700">📍 ${esc(j.location||'Tanzania')} · ${esc(j.type||'Full-time')}${j.deadline?' · Deadline: '+fd(j.deadline):''}</p>
   <p class="pre" style="font-size:15px;line-height:1.6;color:var(--tx);margin:10px 0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${esc(j.description||'')}</p>
   <div style="margin-top:14px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
    <button class="btn3 sm" data-act="apply" data-id="${j.id}" style="font-weight:750;background:${esc(pColor)};border-color:${esc(pColor)}">${esc(btnTxt)}</button>
    <button class="btn3 o sm" data-act="view" data-id="${j.id}">View Description</button>
   </div>
  </div>
 </article>`;
};

function handleJobAction(j){
 if(!me){
  modal(`<h2>Jisajili Kwanza / Sign in to Apply</h2>
   <p class="meta" style="margin:10px 0 16px;font-size:15px;line-height:1.6">Ili kuomba nafasi ya kazi hii ("<b>${esc(j.title)}</b>"), tafadhali jisajili au ingia kwenye akaunti yako ya Job Seeker kwanza. Namba yako ya simu na taarifa ulizojiandikisha nazo zitatumika kukamilisha maombi yako.</p>
   <div style="display:flex;gap:10px;flex-wrap:wrap">
    <a class="btn3" style="text-decoration:none;display:inline-block;padding:12px 24px" href="account.html?next=${encodeURIComponent('careers.html?apply='+j.id)}&role=seeker">Jisajili / Ingia (Job Seeker)</a>
    <button class="btn3 o" onclick="document.getElementById('md').classList.remove('on')">Funga</button>
   </div>`);
  return;
 }
 if(j.applyType==='email1'){
  location.href='mailto:neema@tensventures.com?subject='+encodeURIComponent('Application for '+j.title+' - Ten Ventures Africa')+'&body='+encodeURIComponent('Dear Neema,\n\nI wish to submit my application for the position of '+j.title+'.\n\nName: '+(me?me.name:'')+'\nPhone: '+(me?me.phone||'':'')+'\n\n(Please find my CV attached to this email)');
  toast('Opening email client for neema@tensventures.com...');
  return;
 }
 if(j.applyType==='email2'){
  location.href='mailto:janethgeorge58@gmail.com?subject='+encodeURIComponent('Application for '+j.title+' - Ten Ventures Africa')+'&body='+encodeURIComponent('Dear Janeth,\n\nI wish to submit my application for the position of '+j.title+'.\n\nName: '+(me?me.name:'')+'\nPhone: '+(me?me.phone||'':'')+'\n\n(Please find my CV attached to this email)');
  toast('Opening email client for janethgeorge58@gmail.com...');
  return;
 }
 if(j.applyType==='email_custom'&&j.applyEmail){
  location.href='mailto:'+encodeURIComponent(j.applyEmail)+'?subject='+encodeURIComponent('Application for '+j.title)+'&body='+encodeURIComponent('Hello,\n\nI wish to apply for '+j.title+'.\n\nName: '+(me?me.name:'')+'\nPhone: '+(me?me.phone||'':'')+'\n\n(Please find my CV attached)');
  toast('Opening email to '+j.applyEmail);
  return;
 }
 applyForm(j);
}

async function applyForm(j){
 let sk=null;
 if(me){try{sk=await api.get('seekers',me.uid)}catch(e){}}
 const hasSavedCv=Boolean(sk&&sk.cvUrl);
 const m=modal(`<h2>Apply: ${esc(j.title)}</h2>
 <p class="meta">${esc(j.companyName)} · 📍 ${esc(j.location||'Dar es Salaam')}</p>
 <div class="msg" id="mg"></div>
 ${hasSavedCv?`
  <div id="saved-cv-box" style="background:#f0faf3;border:1.5px solid #25d366;border-radius:14px;padding:12px 16px;margin:12px 0 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
   <div>
    <span style="font-weight:800;color:#0b224d;display:flex;align-items:center;gap:6px">📄 CV Yako ya Wasifu: <b>${esc(sk.cvName||'Wasifu_CV.pdf')}</b></span>
    <small style="color:#2e7d32;font-weight:700">✓ Ipo tayari kuambatanishwa moja kwa moja (1-Click Apply)</small>
   </div>
   <label style="display:inline-flex;align-items:center;gap:8px;font-size:13.5px;font-weight:750;cursor:pointer">
    <input type="checkbox" id="use_saved_cv" checked style="width:18px;height:18px;accent-color:#25d366;cursor:pointer"> Tumia CV hii
   </label>
  </div>
 `:''}
 <div class="fg" style="margin-top:14px">
  ${inp('an','Full name','text',1)}
  ${inp('ae','Email','email',1)}
  ${inp('aph','Phone number','tel',1)}
  ${sel('apr','Profession',CATS)}
  ${inp('ax','Years of experience','number')}
 </div>
 <div style="margin-top:16px">
  <div class="up-zone" id="cv-zone" style="${hasSavedCv?'display:none':''}">
   <input id="acv" type="file" accept=".pdf,.doc,.docx">
   <div class="up-zone-label">
    <div class="up-zone-icon">📄</div>
    <div>
     <b>Upload CV / Resume <span class="up-chip req" id="cv-req-chip">${hasSavedCv?'Optional':'Required *'}</span></b>
     <small>PDF or Word document (Max 2.5 MB) · Mandatory to submit</small>
     <div id="cv-fn" class="file-preview-pill" style="display:none"></div>
    </div>
   </div>
  </div>
  ${hasSavedCv?`<p id="tog_upload_p" style="margin-top:-6px;margin-bottom:12px"><button type="button" class="lnk" id="tog_upload_btn" style="font-size:13px;font-weight:700">+ Pakia CV tofauti kwa nafasi hii</button></p>`:''}
  <div class="up-zone" id="doc-zone">
   <input id="adoc" type="file" accept=".pdf,.doc,.docx,.jpg,.png">
   <div class="up-zone-label">
    <div class="up-zone-icon">📎</div>
    <div>
     <b>Upload Additional Document (Cover Letter / Certificates) <span class="up-chip opt">Optional</span></b>
     <small>Cover letter file, certificates, or portfolio</small>
     <div id="doc-fn" class="file-preview-pill" style="display:none"></div>
    </div>
   </div>
  </div>
  <div class="fl full" style="margin-top:14px">
   <textarea id="ac" placeholder=" "></textarea>
   <label for="ac">Written Cover Letter / Notes (Optional)</label>
  </div>
 </div>
 <p style="margin-top:18px">
  <button class="btn3" id="go" style="width:100%;font-size:16px;padding:15px">Submit Application</button>
 </p>`);

 if(me){
  $('#an',m).value=me.name||(sk&&sk.name)||'';
  $('#ae',m).value=me.email||(sk&&sk.email)||'';
  if(me.phone||(sk&&sk.phone))$('#aph',m).value=me.phone||sk.phone;
 }
 if(sk){
  if(sk.headline){
   const matchCat=CATS.find(c=>c.toLowerCase()===sk.headline.toLowerCase()||sk.headline.toLowerCase().includes(c.toLowerCase()));
   if(matchCat)$('#apr',m).value=matchCat;
  }
  if(sk.experience)$('#ax',m).value=sk.experience;
  if(sk.coverLetter)$('#ac',m).value=sk.coverLetter;
 }

 const cvIn=$('#acv',m),docIn=$('#adoc',m),cvZ=$('#cv-zone',m),docZ=$('#doc-zone',m),cvFn=$('#cv-fn',m),docFn=$('#doc-fn',m);
 const chkSaved=$('#use_saved_cv',m);
 const togBtn=$('#tog_upload_btn',m);

 if(togBtn){
  togBtn.onclick=()=>{
   const isHidden=cvZ.style.display==='none';
   cvZ.style.display=isHidden?'block':'none';
   togBtn.textContent=isHidden?'− Ficha upakiaji wa CV tofauti':'+ Pakia CV tofauti kwa nafasi hii';
  };
 }

 if(chkSaved){
  chkSaved.onchange=()=>{
   if(chkSaved.checked){
    cvZ.style.display='none';
    if(togBtn)togBtn.textContent='+ Pakia CV tofauti kwa nafasi hii';
   }else{
    cvZ.style.display='block';
    if(togBtn)togBtn.textContent='− Ficha upakiaji wa CV tofauti';
   }
  };
 }

 cvIn.onchange=()=>{
  if(cvIn.files[0]){
   cvFn.style.display='flex';
   cvFn.textContent='✓ '+cvIn.files[0].name+' ('+Math.round(cvIn.files[0].size/1024)+' KB)';
   cvZ.classList.add('active');
   if(chkSaved)chkSaved.checked=false;
  }else{
   cvFn.style.display='none';
   cvZ.classList.remove('active');
  }
 };

 docIn.onchange=()=>{
  if(docIn.files[0]){
   docFn.style.display='flex';
   docFn.textContent='✓ '+docIn.files[0].name+' ('+Math.round(docIn.files[0].size/1024)+' KB)';
   docZ.classList.add('active');
  }else{
   docFn.style.display='none';
   docZ.classList.remove('active');
  }
 };

 $('#go',m).onclick=async e=>{
  if(!val(m))return;
  const useSaved=chkSaved&&chkSaved.checked&&sk&&sk.cvUrl;
  const cvF=cvIn.files[0];
  if(!useSaved&&!cvF){
   const g=$('#mg',m);g.className='msg bad';g.textContent='Tafadhali pakia CV yako au chagua kutumia CV ya wasifu wako.';
   cvZ.style.display='block';
   cvZ.style.borderColor='#c62828';
   return;
  }
  const b=e.target;b.classList.add('ld');b.textContent='Submitting Application…';
  try{
   let cv={url:'',name:''};
   if(useSaved){
    cv={url:sk.cvUrl,name:sk.cvName||'CV.pdf'};
   }else{
    cv=await prep(cvF,{cv:true});
   }
   let doc=null;
   if(docIn.files[0]){doc=await prep(docIn.files[0],{doc:true})}
   await api.add('applications',{
    jobId:j.id,
    jobTitle:j.title,
    companyId:j.companyId,
    companyName:j.companyName,
    name:$('#an',m).value.trim(),
    email:$('#ae',m).value.trim(),
    phone:tel($('#aph',m).value),
    profession:$('#apr',m).value,
    exp:$('#ax',m).value,
    cover:$('#ac',m).value.trim(),
    cvUrl:cv.url,
    cvName:cv.name,
    docUrl:doc?doc.url:'',
    docName:doc?doc.name:'',
    uid:me?me.uid:'',
    status:'New',
    createdAt:Date.now()
   });
   m.innerHTML='<button class="x" onclick="document.getElementById(\'md\').classList.remove(\'on\')">×</button>'+okv('Application Received!')+'<p class="nt" style="text-align:center;font-size:16px;font-weight:600">Hongera! Maombi yako yamewasilishwa kikamilifu. The employer will review your profile and CV.</p>';
  }catch(er){
   const g=$('#mg',m);g.className='msg bad';g.textContent=fe(er);
   b.classList.remove('ld');b.textContent='Submit Application';
  }
 };
}

function openJob(j){
 const isTV=isTenV(j);
 const pColor=j.posterColor||'#0b224d';
 const quals=Array.isArray(j.qualifications)?j.qualifications:(j.qualifications||'').split('\n').map(s=>s.trim()).filter(Boolean);
 const btnTxt=j.buttonText||(j.applyType=='email1'?'Send CV to Neema':j.applyType=='email2'?'Send CV to Janeth':'Apply Now');
 const emailHint=j.applyType=='email1'?'neema@tensventures.com':j.applyType=='email2'?'janethgeorge58@gmail.com':j.applyEmail||(j.applyType=='website'?'Website Application':'neema@tensventures.com');

 let bodyHtml='';
 if(isTV){
  bodyHtml=`<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px"><span class="chip">${esc(j.category)}</span><span class="chip" style="background:${esc(pColor)};color:#fff">★ Ten Ventures Africa Official</span></div>
  <h2 style="color:${esc(pColor)}">${esc(j.title)}</h2>
  <p class="meta" style="font-size:16px;font-weight:700;margin:6px 0 16px"><a href="company.html?id=${esc(j.companyId)}" style="color:#f26a1b;font-weight:800">${esc(j.companyName)}</a> · 📍 ${esc(j.location||'Dar es Salaam')} · ${esc(j.type||'Full-time')}${j.deadline?' · Deadline: '+fd(j.deadline):''}</p>
  ${quals.length?`<div style="background:var(--soft);border-radius:18px;padding:18px;margin:16px 0"><h4 style="font-size:16px;font-weight:800;color:${esc(pColor)};text-transform:uppercase;margin-bottom:10px">Requirements &amp; Qualifications</h4><ul style="padding-left:20px;display:grid;gap:6px;font-size:15px;font-weight:600">${quals.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></div>`:''}
  ${j.imageUrl?`<img class="big" src="${j.imageUrl}" alt="${esc(j.title)} Poster" style="border-radius:16px;max-height:440px;object-fit:contain;background:#0d1b2a;width:100%;margin:12px 0">`:''}
  <div style="background:var(--soft);border-radius:18px;padding:18px;margin:14px 0"><h4 style="font-size:15px;font-weight:800;color:${esc(pColor)};text-transform:uppercase;margin-bottom:8px">Full Job Description</h4><p class="pre" style="font-size:16px;line-height:1.75;white-space:pre-wrap;color:var(--tx)">${esc(j.description)}</p></div>
  <div style="margin-top:24px;padding-top:18px;border-top:1.5px solid var(--bd);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px">
   <div>
    <small style="display:block;font-size:12px;font-weight:800;text-transform:uppercase;color:var(--mu)">Application Route:</small>
    <span style="font-size:15px;font-weight:800;color:${esc(pColor)}">✉ ${esc(emailHint)}</span>
   </div>
   <div style="display:flex;gap:10px;flex-wrap:wrap">
    <button class="btn3" id="ap" style="font-size:16px;padding:14px 28px;background:${esc(pColor)};border-color:${esc(pColor)}">${esc(btnTxt)}</button>
    <button class="btn3 o" id="sh">Copy Link</button>
   </div>
  </div>`;
 }else{
  bodyHtml=`<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px">
   <span class="chip" style="font-size:15px;font-weight:800;background:var(--soft);color:${esc(pColor)};text-transform:uppercase">${esc(j.companyName)}</span>
   <span class="chip">${esc(j.category||'General')}</span>
  </div>
  <h2 style="font-size:26px;font-weight:850;color:var(--tx);margin:6px 0">${esc(j.title)}</h2>
  <p class="meta" style="font-size:15px;font-weight:700;margin:6px 0 14px">📍 ${esc(j.location||'Tanzania')} · ${esc(j.type||'Full-time')}${j.deadline?' · Deadline: '+fd(j.deadline):''}</p>
  ${j.imageUrl?`<div style="margin:14px 0"><img class="big" src="${j.imageUrl}" alt="${esc(j.title)} Poster" style="border-radius:16px;max-height:460px;object-fit:contain;background:#0d1b2a;width:100%"></div>`:''}
  <div style="background:var(--soft);border-radius:18px;padding:20px;margin:16px 0">
   <h4 style="font-size:15px;font-weight:800;color:var(--tx);text-transform:uppercase;margin-bottom:10px">Job Description</h4>
   <p class="pre" style="font-size:16px;line-height:1.75;white-space:pre-wrap;color:var(--tx)">${esc(j.description)}</p>
  </div>
  ${quals.length?`<div style="background:var(--soft);border-radius:18px;padding:18px;margin:16px 0"><h4 style="font-size:15px;font-weight:800;color:var(--tx);text-transform:uppercase;margin-bottom:10px">Key Requirements</h4><ul style="padding-left:20px;display:grid;gap:6px;font-size:15px;font-weight:600">${quals.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></div>`:''}
  ${me?.admin?`<div style="background:#fff3e0;border:1.5px solid #ffb74d;border-radius:14px;padding:14px;margin:16px 0;font-size:14px;font-weight:750;color:#e65100">🔒 <b>Ten Ventures Admin Confidential Data:</b><br>Company: ${esc(j.companyName)} (ID: ${esc(j.companyId)}) · Internal Route: ${esc(j.applyType||'website')} · Registered Contact: ${esc(j.applyEmail||'—')}<div style="margin-top:10px"><button class="btn3 sm" id="adm_ed_job">Edit Job (Admin)</button></div></div>`:''}
  <div style="margin-top:20px;padding-top:16px;border-top:1.5px solid var(--bd);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px">
   <div>
    <small style="display:block;font-size:12px;font-weight:800;text-transform:uppercase;color:var(--mu)">Recruitment Notice:</small>
    <span style="font-size:14px;font-weight:750;color:${esc(pColor)}">Maombi yote ya kazi hii yanasimamiwa na Ten Ventures Africa</span>
   </div>
   <div style="display:flex;gap:10px;flex-wrap:wrap">
    <button class="btn3" id="ap" style="font-size:16px;padding:14px 28px;background:${esc(pColor)};border-color:${esc(pColor)}">${esc(btnTxt)}</button>
    <button class="btn3 o" id="sh">Copy Link</button>
   </div>
  </div>`;
 }

 const m=modal(bodyHtml);
 $('#ap',m).onclick=()=>{m.classList.remove('on');handleJobAction(j)};
 $('#sh',m).onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(new URL('careers.html?job='+j.id,location.href).href);toast('Link copied to clipboard')};
 if($('#adm_ed_job',m)){$('#adm_ed_job',m).onclick=()=>{editor('jobs',j,JF,()=>{m.classList.remove('on');location.reload()})}}
}

async function careers(){
 const r=$('#list');r.innerHTML=skel(6);let jobs;
 try{jobs=(await api.list('jobs',[['status','==','published']])).filter(j=>!j.deadline||j.deadline>=Date.now()-864e5)}catch(e){r.innerHTML=off(e);return}
 jobs.sort((a,b)=>(b.featured?1:0)-(a.featured?1:0));
 const q=$('#q'),c=$('#cat'),l=$('#loc'),t=$('#typ');
 fill(c,CATS,'All categories');fill(l,jobs.map(j=>j.location),'All locations');fill(t,TYPES,'All types');
 const draw=()=>{
  const k=q.value.toLowerCase(),a=jobs.filter(j=>(!c.value||j.category==c.value)&&(!l.value||j.location==l.value)&&(!t.value||j.type==t.value)&&(j.title+j.companyName+j.description).toLowerCase().includes(k));
  r.innerHTML=a.length?a.map(jobCard).join(''):'<p class="empty" style="grid-column:1/-1">No jobs match your search.</p>';
  $$('[data-act="apply"]',r).forEach(btn=>{btn.onclick=(e)=>{e.stopPropagation();const j=jobs.find(x=>x.id==btn.dataset.id);if(j)handleJobAction(j)}});
  $$('[data-act="view"]',r).forEach(btn=>{btn.onclick=(e)=>{e.stopPropagation();const j=jobs.find(x=>x.id==btn.dataset.id);if(j)openJob(j)}});
  $$('.cd2, .cd-hiring',r).forEach(el=>{el.onclick=(e)=>{if(e.target.closest('button, a'))return;const j=jobs.find(x=>x.id==el.dataset.id);if(j)openJob(j)}});
 };
 [q,c,l,t].forEach(e=>e.oninput=draw);draw();
 const pms=new URLSearchParams(location.search);
 const jId=pms.get('job'),apId=pms.get('apply');
 if(apId){
  const j=jobs.find(x=>x.id==apId);
  if(j){if(me)applyForm(j);else handleJobAction(j)}
 }else if(jId){
  const j=jobs.find(x=>x.id==jId);
  if(j)openJob(j);
 }
}

/* ---------- company profile (Image 1 style) ---------- */
async function company(){
 const id=new URLSearchParams(location.search).get('id')||'c_tenventures',r=$('#app');
 r.innerHTML=skel(3);let co,jobs;
 try{
  co=await api.get('companies',id);
  if(!co&&id=='c_tenventures'){
   co=(await api.list('companies')).find(c=>c.id=='c_tenventures'||/ten\s*ventures/i.test(c.name));
  }
  jobs=co?await api.list('jobs',[['companyId','==',co.id],['status','==','published']]):[];
 }catch(e){r.innerHTML=off(e);return}

 if(!co){r.innerHTML='<p class="empty">Company profile not found.</p>';return}
 document.title=co.name+' | Ten Ventures Africa Profile';
 const isTV=isTenV(co);
 const isAdmin=me?.admin;

 let actionsHtml='';
 let sideMetaHtml='';

 if(isTV){
  actionsHtml=`<a href="https://wa.me/255784536965?text=Hello%20Ten%20Ventures%20Africa,%20inquiry%20from%20profile" target="_blank" rel="noopener noreferrer" class="btn-wa" style="padding:12px 22px;border-radius:14px">
   <i><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.299-.777.979-.953 1.179-.175.199-.35.225-.651.075s-1.271-.469-2.42-1.494c-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.019-.462.132-.611.136-.134.301-.35.451-.525.15-.175.2-.299.301-.499.1-.2.05-.374-.025-.524-.075-.15-.677-1.633-.927-2.235-.244-.587-.492-.507-.677-.517-.175-.009-.376-.01-.576-.01s-.527.075-.802.374c-.276.299-1.053 1.029-1.053 2.509 0 1.48 1.078 2.91 1.228 3.109.15.2 2.122 3.24 5.141 4.542.718.309 1.279.494 1.716.633.722.229 1.378.197 1.897.12.579-.087 1.78-.728 2.031-1.431.251-.703.251-1.306.176-1.431-.076-.125-.276-.2-.577-.35zm-5.441 7.427c-1.921 0-3.805-.515-5.46-1.492l-.392-.232-4.057 1.064 1.083-3.954-.254-.405c-1.072-1.706-1.639-3.684-1.638-5.714.002-5.992 4.878-10.867 10.867 10.867 2.903.001 5.632 1.132 7.684 3.185 2.052 2.053 3.181 4.783 3.18 7.687-.003 5.993-4.879 10.868-10.874 10.868zm9.243-16.927c-2.467-2.47-5.748-3.83-9.242-3.831-7.185 0-13.032 5.846-13.035 13.033 0 2.298.599 4.54 1.737 6.514l-1.847 6.746 6.902-1.81c1.905 1.039 4.062 1.587 6.241 1.588h.005c7.184 0 13.032-5.846 13.036-13.033 0-3.483-1.357-6.756-3.824-9.227z"/></svg></i>
   <span>Chat on WhatsApp</span>
  </a>
  <a href="mailto:${esc(co.email||'neema@tensventures.com')}" class="btn3" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px">✉ Send Email</a>
  <button class="btn3 o" id="p_sh">Copy Link</button>`;

  sideMetaHtml=`<div style="margin-top:18px;border-top:1px solid var(--bd);padding-top:14px;font-size:14px;display:grid;gap:8px">
   ${co.website?`<div><b>Website:</b> <a style="color:#f26a1b;font-weight:700" target="_blank" rel="noopener" href="https://${esc(co.website.replace(/^https?:\/\//,''))}">${esc(co.website)}</a></div>`:''}
   <div><b>Phone:</b> ${esc(co.phone||'+255 784 536 965')}</div>
   <div><b>Email:</b> <a style="color:#f26a1b;font-weight:700" href="mailto:${esc(co.email||'neema@tensventures.com')}">${esc(co.email||'neema@tensventures.com')}</a></div>
  </div>`;
 }else if(isAdmin){
  actionsHtml=`<button class="btn3" id="adm_co_ed" style="font-size:15px;padding:12px 22px">✏ Edit Company Profile (Admin)</button>
  <a href="admin.html" class="btn3 o">Open Admin Panel</a>
  <button class="btn3 o" id="p_sh">Copy Link</button>`;

  sideMetaHtml=`<div style="margin-top:18px;border-top:1.5px solid #ffb74d;padding-top:14px;font-size:14px;display:grid;gap:8px;background:#fff8e1;padding:14px;border-radius:14px">
   <b style="color:#e65100">🔒 Ten Ventures Admin View:</b>
   <div><b>Registered Phone:</b> ${esc(co.phone||'—')}</div>
   <div><b>Contact Email:</b> <a style="color:#f26a1b;font-weight:700" href="mailto:${esc(co.email)}">${esc(co.email||'—')}</a></div>
   ${co.website?`<div><b>Website:</b> <a style="color:#f26a1b;font-weight:700" target="_blank" rel="noopener" href="https://${esc(co.website.replace(/^https?:\/\//,''))}">${esc(co.website)}</a></div>`:''}
   <div><b>Company ID:</b> <code>${esc(co.id)}</code></div>
  </div>`;
 }else{
  actionsHtml=`<a href="careers.html" class="btn3" style="text-decoration:none">Tazama Nafasi Zote</a>
  <button class="btn3 o" id="p_sh">Copy Link</button>`;

  sideMetaHtml=`<div style="margin-top:18px;border-top:1px solid var(--bd);padding-top:14px;font-size:14px;display:grid;gap:8px">
   <div style="background:var(--soft);border-radius:14px;padding:14px;font-weight:700;color:#005a5b;line-height:1.6">
    🛡 <b>Notisi ya Waombaji Kazi:</b><br>Nafasi zote za kazi za kampuni hii zinasimamiwa na Ten Ventures Africa Recruitment. Waombaji wanatakiwa kuwasilisha CV kupitia mfumo huu.
   </div>
  </div>`;
 }

 r.innerHTML=`<div class="prof-wrap">
  <div class="prof-card-hero">
   <div class="prof-banner">
    <img id="prof_cover_img" src="${co.coverUrl||'assets/aistudio/image_7b6ab344.png'}" alt="Cover Header" onerror="this.src='assets/woman.jpg'">
    <label class="btn-edit-photo btn-edit-cover" id="lbl_edit_cover" title="Badilisha Cover Photo">
     <input type="file" id="in_edit_cover" accept="image/*" style="display:none">
     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
     <span>Badili Cover</span>
    </label>
   </div>
   <div class="prof-center-meta">
    <div class="prof-avatar-wrap">
     <div class="prof-avatar-ring">
      <img id="prof_avatar_img" src="${co.logo||'assets/logo.jpg'}" alt="${esc(co.name)}" onerror="this.src='assets/logo.jpg'">
     </div>
     <label class="btn-edit-photo btn-edit-avatar" id="lbl_edit_avatar" title="Badilisha Profile Photo">
      <input type="file" id="in_edit_avatar" accept="image/*" style="display:none">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
     </label>
    </div>
    <h1 class="prof-name">${esc(co.name)} ${isTV?`<span class="chip" style="background:#25d366;color:#fff;vertical-align:middle;margin-left:8px">★ Official Verified</span>`:isAdmin?`<span class="chip" style="background:#0b1f4d;color:#fff;vertical-align:middle;margin-left:8px">🔒 Admin View</span>`:''}</h1>
    <p class="prof-loc">🇹🇿 ${esc(co.location||'Dar es Salaam, Tanzania')} | ${esc(co.industry||'Corporate Partner')}</p>
    <div class="prof-stats-bar">
     ${isTV?`<span><b>5.96k</b> Followers</span><span>|</span><span><b>136</b> Following</span><span>|</span><span><b>15+</b> Years Leadership</span><span>|</span><span><b>8</b> Core Services</span>`:
     `<span><b>${jobs.length}</b> Active Jobs</span><span>|</span><span>${esc(co.industry||'Partner')}</span><span>|</span><span>${esc(co.location||'Tanzania')}</span>`}
    </div>
    <div class="prof-actions">
     ${actionsHtml}
    </div>
   </div>
  </div>

  <div class="prof-grid">
   <div>
    <div class="prof-side-card">
     <div class="prof-side-title"><span>📋</span> Company Intro</div>
     <p class="pre" style="font-size:15px;line-height:1.7;color:var(--tx);font-weight:600">${esc(co.about||'Ten Ventures Africa corporate recruitment partner. Providing trusted professional career opportunities across Tanzania.')}</p>
     ${sideMetaHtml}
    </div>

    <div class="prof-side-card">
     <div class="prof-side-title"><span>🖼</span> Focus &amp; Gallery</div>
     <div class="prof-img-grid">
      <img src="assets/logo.jpg" alt="Logo">
      <img src="assets/woman.jpg" alt="Leadership">
      <img src="assets/about_founder.webp" alt="Founder">
      <img src="assets/aistudio/image_deca3efe.png" alt="Hiring">
     </div>
    </div>
   </div>

   <div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
     <h2 style="font-size:32px;font-weight:850;color:var(--tx);margin:0">Active Job Openings (${jobs.length})</h2>
     <span class="chip" style="font-weight:800">${esc(co.name)}</span>
    </div>
    <div class="cards" style="padding:0">
     ${jobs.length?jobs.map(jobCard).join(''):'<p class="empty" style="grid-column:1/-1;background:var(--card);border:1.5px solid var(--bd);border-radius:24px;padding:40px">No active job openings right now for this company.</p>'}
    </div>
   </div>
  </div>
 </div>`;

 $('#p_sh').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(location.href);toast('Profile link copied')};
 if($('#adm_co_ed')){$('#adm_co_ed').onclick=()=>editor('companies',co,CF,()=>location.reload())}

 const canEditPhoto=()=>{
  if(!me){
   modal(`<h2>Ingia Kubadilisha Picha</h2><p class="meta" style="margin:10px 0 16px">Tafadhali ingia kama Admin au mmiliki wa kampuni hii ili kubadilisha picha.</p><p><a class="btn3" style="display:inline-block;text-decoration:none" href="account.html?next=${encodeURIComponent(location.pathname.split('/').pop()||'company.html')}${location.search?'&'+location.search.slice(1):''}">Ingia Sasa / Sign in</a></p>`);
   return false;
  }
  if(!me.admin&&me.uid!==co.ownerUid&&me.uid!==co.id&&!isTV){
   toast('Huna ruhusa ya kubadilisha picha za kampuni hii.');
   return false;
  }
  return true;
 };

 const inCover=$('#in_edit_cover'),inAvatar=$('#in_edit_avatar');
 if(inCover){
  $('#lbl_edit_cover').onclick=e=>{if(!canEditPhoto()){e.preventDefault();return false}};
  inCover.onchange=async()=>{
   const f=inCover.files&&inCover.files[0];
   if(!f)return;
   const lbl=$('#lbl_edit_cover');
   lbl.classList.add('uploading');
   toast('Inapakia cover photo mpya…');
   try{
    const im=await prep(f,{max:1600,q:.8});
    await api.set('companies',co.id,{coverUrl:im.url});
    co.coverUrl=im.url;
    $('#prof_cover_img').src=im.url;
    toast('✓ Cover photo imesasishwa kikamilifu!');
   }catch(err){
    toast(fe(err));
   }finally{
    lbl.classList.remove('uploading');
   }
  };
 }

 if(inAvatar){
  $('#lbl_edit_avatar').onclick=e=>{if(!canEditPhoto()){e.preventDefault();return false}};
  inAvatar.onchange=async()=>{
   const f=inAvatar.files&&inAvatar.files[0];
   if(!f)return;
   const lbl=$('#lbl_edit_avatar');
   lbl.classList.add('uploading');
   toast('Inapakia profile photo mpya…');
   try{
    const im=await prep(f,{max:400,q:.85});
    await api.set('companies',co.id,{logo:im.url});
    co.logo=im.url;
    $('#prof_avatar_img').src=im.url;
    toast('✓ Profile photo imesasishwa kikamilifu!');
   }catch(err){
    toast(fe(err));
   }finally{
    lbl.classList.remove('uploading');
   }
  };
 }

 $$('[data-act="apply"]',r).forEach(btn=>{btn.onclick=(e)=>{e.stopPropagation();const j=jobs.find(x=>x.id==btn.dataset.id);if(j)handleJobAction(j)}});
 $$('[data-act="view"]',r).forEach(btn=>{btn.onclick=(e)=>{e.stopPropagation();const j=jobs.find(x=>x.id==btn.dataset.id);if(j)openJob(j)}});
 $$('.cd2, .cd-hiring',r).forEach(el=>{el.onclick=(e)=>{if(e.target.closest('button, a'))return;const j=jobs.find(x=>x.id==el.dataset.id);if(j)openJob(j)}});
}

/* ---------- trainings & news ---------- */
const trCard=(t,i)=>`<article class="cd2" data-id="${t.id}" style="--k:${i%12}"><div class="im">${t.imageUrl?`<img loading="lazy" src="${t.imageUrl}" alt="">`:''}</div><div class="bd"><span class="chip">${esc(t.category)} · ${esc(t.mode)}</span><h3 style="margin-top:8px">${esc(t.title)}</h3><p class="meta" style="margin-top:6px">📅 ${fd(t.date)} ${esc(t.time||'')} · 📍 ${esc(t.location)}</p><p class="meta">👤 ${esc(t.trainer||'Ten Ventures Africa')} · ${t.fee?'TZS '+Number(t.fee).toLocaleString():'Free'}${t.full?' · Fully booked':t.seats?' · '+t.seats+' seats left':''}</p></div></article>`;
function bookForm(t){if(t.full){toast('Sorry, this training is fully booked.');return}if(!me){modal(`<h2>Sign in to book</h2><p class="meta" style="margin:10px 0 16px">Please sign in or create an account first, then come back to book "${esc(t.title)}".</p><p><a class="btn3" style="text-decoration:none;display:inline-block" href="account.html?next=${encodeURIComponent(location.pathname.split('/').pop()||'index.html')}&msg=book">Sign in / Create account</a></p>`);return}const m=modal(`<h2>Book: ${esc(t.title)}</h2><p class="meta">${fd(t.date)} · ${esc(t.location)}</p><div class="msg" id="mg"></div><div class="fg" style="margin-top:14px">${inp('bn','Full name','text',1)}${inp('bph','Phone','tel',1)}${inp('be','Email','email',1)}${inp('bo','Company / organization')}${inp('bpr','Profession')}${inp('bp','Participants','number')}${txa('bm','Additional information')}</div><p style="margin-top:14px"><button class="btn3" id="go">Confirm booking</button></p>`);$('#bp',m).value=1;if(me){$('#bn',m).value=me.name||'';$('#be',m).value=me.email||''}
 $('#go',m).onclick=async e=>{if(!val(m))return;const b=e.target;b.classList.add('ld');b.textContent='Booking…';try{await api.add('bookings',{trainingId:t.id,trainingTitle:t.title,name:$('#bn',m).value.trim(),phone:tel($('#bph',m).value),uid:me?me.uid:'',email:$('#be',m).value.trim(),company:$('#bo',m).value,profession:$('#bpr',m).value,participants:$('#bp',m).value,info:$('#bm',m).value,status:'Pending'});if(t.seats>0){const left=Math.max(0,t.seats-(Number($('#bp',m).value)||1));api.upd('trainings',t.id,{seats:left,full:left<=0}).catch(()=>{})}m.innerHTML='<button class="x" onclick="document.getElementById(\'md\').classList.remove(\'on\')">×</button>'+okv('Booking received')+'<p class="nt" style="text-align:center">We will confirm your seat shortly.</p>'}catch(er){const g=$('#mg',m);g.className='msg bad';g.textContent=fe(er);b.classList.remove('ld');b.textContent='Confirm booking'}}}
async function trainings(){const r=$('#list');r.innerHTML=skel(4);let a;try{a=(await api.list('trainings')).filter(vis)}catch(e){r.innerHTML=off(e);return}const c=$('#cat'),q=$('#q');fill(c,a.map(t=>t.category),'All categories');
 const draw=()=>{const k=q.value.toLowerCase(),x=a.filter(t=>(!c.value||t.category==c.value)&&(t.title+t.description).toLowerCase().includes(k));r.innerHTML=x.length?x.map(trCard).join(''):'<p class="empty" style="grid-column:1/-1">No trainings found.</p>';$$('.cd2',r).forEach(el=>el.onclick=()=>{const t=a.find(z=>z.id==el.dataset.id),m=modal(`<span class="chip">${esc(t.category)} · ${esc(t.mode)}</span><h2>${esc(t.title)}</h2>${t.imageUrl?`<img class="big" src="${t.imageUrl}" alt="">`:''}<p class="meta">📅 ${fd(t.date)} ${esc(t.time||'')} · 📍 ${esc(t.location)} · 👤 ${esc(t.trainer||'Ten Ventures Africa')}</p><p class="meta">${t.fee?'Fee: TZS '+Number(t.fee).toLocaleString():'Free'}${t.seats?' · Seats: '+t.seats:''}</p><p class="pre" style="margin-top:12px">${esc(t.description)}</p><p style="margin-top:18px"><button class="btn3" id="bk">Book this training</button> ${cta(t)}</p>`);$('#bk',m).onclick=()=>bookForm(t)})};[c,q].forEach(e=>e.oninput=draw);draw()}
async function news(){const r=$('#list');r.innerHTML=skel(3);let a;try{a=(await api.list('news')).filter(vis)}catch(e){r.innerHTML=off(e);return}r.innerHTML=a.length?a.map((n,i)=>{const url=normUrl(n.ctaUrl||n.buttonLink||n.link||n.url),txt=n.ctaText||n.buttonText||'Learn more';return `<article class="cd2" data-id="${n.id}" style="--k:${i%12}">${n.imageUrl?`<div class="im"><img loading="lazy" src="${n.imageUrl}" alt=""></div>`:''}<div class="bd"><span class="chip">${esc(n.category)}</span><h3 style="margin-top:8px">${esc(n.title)}</h3><p class="meta" style="margin-top:6px">${fd(n.createdAt)}</p><p class="meta" style="margin-top:6px">${esc((n.body||'').slice(0,110))}…</p>${url?`<div style="margin-top:14px"><a class="btn3 o sm" target="_blank" rel="noopener noreferrer" href="${esc(url)}" onclick="event.stopPropagation()">${esc(txt)} →</a></div>`:''}</div></article>`}).join(''):'<p class="empty" style="grid-column:1/-1">No news yet.</p>';$$('.cd2',r).forEach(el=>el.onclick=(e)=>{if(e.target.closest('a, button'))return;const n=a.find(z=>z.id==el.dataset.id);modal(`<span class="chip">${esc(n.category)}</span><h2>${esc(n.title)}</h2><p class="meta">${fd(n.createdAt)}</p>${n.imageUrl?`<img class="big" src="${n.imageUrl}" alt="">`:''}<p class="pre">${esc(n.body)}</p>${cta(n)}`)})}
/* ---------- account ---------- */
function account(){const r=$('#app');
 const pms=new URLSearchParams(location.search);
 let role=pms.get('role')==='seeker'?'seeker':'company',busy=false;
 const isUp=pms.get('mode')==='up'||pms.get('role')==='seeker';
 r.innerHTML=`<div class="auth"><div class="pane"><div class="sg2" id="tb2"><button class="${isUp?'':'on'}" data-t="in">Sign in</button><button class="${isUp?'on':''}" data-t="up">Create account</button></div><div class="msg" id="mg"></div>
 <div id="fi" ${isUp?'hidden':''}>${inp('li','Email','email',1)}${inp('lp','Password','password',1)}<button class="btn3" id="bi" style="width:100%">Sign in</button><p style="margin-top:12px;display:flex;justify-content:space-between"><button class="lnk" id="fg">Forgot password?</button><button class="lnk" id="gi">Continue with Google</button></p></div>
 <div id="fu" ${isUp?'':'hidden'}><div class="sg2" id="rl"><button class="${role=='company'?'on':''}" data-r="company">I’m a company</button><button class="${role=='seeker'?'on':''}" data-r="seeker">I’m a job seeker</button></div>${inp('sn',role=='company'?'Company name':'Full name','text',1)}<div id="sph_w" ${role=='seeker'?'':'style="display:none"'}>${inp('sph','Phone number (Namba ya simu)','tel',1)}</div>${inp('se','Email','email',1)}${inp('sp','Password (min 6)','password',1)}${inp('sc','Confirm password','password',1)}<button class="btn3" id="bu" style="width:100%">Create account</button><p class="nt" id="r_nt" style="text-align:center">${role=='company'?'Companies can post jobs and get a public profile.':'Job seekers can apply for jobs directly with their saved phone number and CV.'}</p></div></div></div>`;
 const mg=(t,c='bad')=>{const g=$('#mg');g.className='msg '+c;g.textContent=t};const NX=pms.get('next'),go=u=>location=NX&&/^[\w\-./?=&#]+$/.test(NX)?NX:u.admin?'admin.html':u.role=='company'?'dashboard.html':'careers.html';
 ready.then(u=>{if(u&&!busy)go(u)});if(pms.get('msg')=='book')mg('Please sign in or create an account to book your training.','ok');
 $$('#tb2 button').forEach(b=>b.onclick=()=>{$$('#tb2 button').forEach(x=>x.classList.toggle('on',x==b));$('#fi').hidden=b.dataset.t!='in';$('#fu').hidden=b.dataset.t!='up';$('#mg').className='msg'});
 $$('#rl button').forEach(b=>b.onclick=()=>{
  role=b.dataset.r;
  $$('#rl button').forEach(x=>x.classList.toggle('on',x==b));
  $('label[for=sn]').firstChild.textContent=role=='company'?'Company name':'Full name';
  const phW=$('#sph_w');if(phW)phW.style.display=role=='seeker'?'block':'none';
  const rNt=$('#r_nt');if(rNt)rNt.textContent=role=='company'?'Companies can post jobs and get a public profile.':'Job seekers can apply for jobs directly with their saved phone number and CV.';
 });
 const run=async(b,fn,txt)=>{busy=true;b.classList.add('ld');b.textContent='Please wait…';try{await fn()}catch(e){mg(fe(e));busy=false;b.classList.remove('ld');b.textContent=txt}};
 $('#bi').onclick=e=>{if(!val($('#fi')))return;run(e.target,async()=>{await api.signIn($('#li').value.trim(),$('#lp').value);try{if($('#lp').value==$('#li').value.trim().toLowerCase())sessionStorage.tv_first='1';else sessionStorage.removeItem('tv_first')}catch(e){}mg('Welcome back!','ok');setTimeout(async()=>{const u=await new Promise(res=>{let n=0;const t=setInterval(()=>{if(me||++n>30){clearInterval(t);res(me)}},100)});go(u||{role:'seeker'})},300)},'Sign in')};
 $('#bu').onclick=e=>{if(!val($('#fu')))return;if($('#sp').value!=$('#sc').value){mg('Passwords do not match.');return}
  const phoneVal=$('#sph')?tel($('#sph').value):'';
  run(e.target,async()=>{await api.signUp({email:$('#se').value.trim(),password:$('#sp').value,name:$('#sn').value.trim(),phone:phoneVal,role});try{if($('#sp').value==$('#se').value.trim().toLowerCase())sessionStorage.tv_first='1'}catch(e){}mg('Account created!','ok');setTimeout(()=>go({role,phone:phoneVal}),500)},'Create account')};
 $('#gi').onclick=()=>{busy=true;api.google(role).then(()=>setTimeout(()=>go({role}),400)).catch(e=>{mg(fe(e));busy=false})};
 $('#fg').onclick=async()=>{const m=$('#li').value.trim();if(!/^\S+@\S+\.\S+$/.test(m)){mg('Enter your email above first.');return}try{await api.reset(m);mg('Password reset email sent.','ok')}catch(e){mg(fe(e))}}
}
/* ---------- Talent Pool & Candidate View ---------- */
function openCandidateModal(cand){
 const cleanPh=tel(cand.phone).replace('+','');
 const skills=(cand.skills||'').split(',').map(s=>s.trim()).filter(Boolean);
 modal(`
  <div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;flex-wrap:wrap">
    <div class="sk-avatar-ring" style="width:78px;height:78px;font-size:28px">
      ${cand.avatarUrl?`<img src="${cand.avatarUrl}" alt="${esc(cand.name)}">`:esc((cand.name||'?')[0].toUpperCase())}
    </div>
    <div>
      <h2 style="font-size:28px;margin:0">${esc(cand.name)}</h2>
      <p style="font-size:16px;font-weight:750;color:#f26522;margin:2px 0 6px">${esc(cand.headline||'Job Seeker')}</p>
      <p class="meta" style="font-size:13.5px;font-weight:600">📍 ${esc(cand.location||'Tanzania')} · 💼 ${cand.experience||0} yr(s) Experience · 🎓 ${esc(cand.education||'—')}</p>
    </div>
  </div>
  <div style="background:var(--soft);border-radius:18px;padding:18px;margin:14px 0;display:grid;gap:10px">
    <div><b>Simu / Phone:</b> <a style="color:#0b224d;font-weight:750" href="tel:${esc(cand.phone)}">${esc(cand.phone||'—')}</a></div>
    <div><b>Barua Pepe / Email:</b> <a style="color:#f26522;font-weight:750" href="mailto:${esc(cand.email)}">${esc(cand.email||'—')}</a></div>
    <div><b>Kiwango cha Elimu:</b> ${esc(cand.education||'—')}</div>
  </div>
  ${skills.length?`
    <div style="margin:16px 0">
      <h4 style="font-size:14px;font-weight:800;color:var(--tx);text-transform:uppercase;margin-bottom:8px">Ujuzi &amp; Umairi (Key Skills)</h4>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${skills.map(sk=>`<span class="cand-skill-chip" style="font-size:13px;padding:6px 12px">${esc(sk)}</span>`).join('')}
      </div>
    </div>
  `:''}
  ${cand.bio?`
    <div style="margin:16px 0">
      <h4 style="font-size:14px;font-weight:800;color:var(--tx);text-transform:uppercase;margin-bottom:8px">Maelezo ya Wasifu (Professional Summary)</h4>
      <p class="pre" style="font-size:15px;line-height:1.7;background:#fff;border:1px solid var(--bd);padding:16px;border-radius:14px;color:var(--tx)">${esc(cand.bio)}</p>
    </div>
  `:''}
  <div style="margin-top:20px;padding-top:16px;border-top:1.5px solid var(--bd);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      ${cand.cvUrl?`<a class="btn3" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px" download="${esc(cand.cvName||'CV.pdf')}" href="${cand.cvUrl}"><span>⬇ Pakua CV (${esc(cand.cvName||'Document')})</span></a>`:'<span class="meta">Hana CV ya kupakua</span>'}
      ${cleanPh?`<a class="btn-wa" target="_blank" rel="noopener noreferrer" href="https://wa.me/${cleanPh}?text=${encodeURIComponent('Habari '+cand.name+', tunawasiliana nawe kutoka Ten Ventures Africa kuhusu fursa za ajira.')}" style="padding:10px 18px;border-radius:12px;font-size:14px"><i><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.299-.777.979-.953 1.179-.175.199-.35.225-.651.075s-1.271-.469-2.42-1.494c-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.019-.462.132-.611.136-.134.301-.35.451-.525.15-.175.2-.299.301-.499.1-.2.05-.374-.025-.524-.075-.15-.677-1.633-.927-2.235-.244-.587-.492-.507-.677-.517-.175-.009-.376-.01-.576-.01s-.527.075-.802.374c-.276.299-1.053 1.029-1.053 2.509 0 1.48 1.078 2.91 1.228 3.109.15.2 2.122 3.24 5.141 4.542.718.309 1.279.494 1.716.633.722.229 1.378.197 1.897.12.579-.087 1.78-.728 2.031-1.431.251-.703.251-1.306.176-1.431-.076-.125-.276-.2-.577-.35zm-5.441 7.427c-1.921 0-3.805-.515-5.46-1.492l-.392-.232-4.057 1.064 1.083-3.954-.254-.405c-1.072-1.706-1.639-3.684-1.638-5.714.002-5.992 4.878-10.867 10.867 10.867 2.903.001 5.632 1.132 7.684 3.185 2.052 2.053 3.181 4.783 3.18 7.687-.003 5.993-4.879 10.868-10.874 10.868zm9.243-16.927c-2.467-2.47-5.748-3.83-9.242-3.831-7.185 0-13.032 5.846-13.035 13.033 0 2.298.599 4.54 1.737 6.514l-1.847 6.746 6.902-1.81c1.905 1.039 4.062 1.587 6.241 1.588h.005c7.184 0 13.032-5.846 13.036-13.033 0-3.483-1.357-6.756-3.824-9.227z"/></svg></i><span>WhatsApp</span></a>`:''}
    </div>
    <button class="btn3 o" onclick="document.getElementById('md').classList.remove('on')">Funga</button>
  </div>
 `);
}

async function renderTalentPool(container, isAdmin=false){
 container.innerHTML=skel(3);
 let allSeekers=[];
 try{
   allSeekers=await api.list('seekers');
 }catch(e){
   container.innerHTML=off(e);
   return;
 }
 const seekers=allSeekers.filter(s=>isAdmin||s.isPublic!==false);
 const cities=[...new Set(seekers.map(s=>s.location).filter(Boolean))];
 container.innerHTML=`
  <div style="background:var(--soft);border-radius:20px;padding:22px;margin-bottom:20px">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px">
      <div>
        <h3 style="font-size:22px;font-weight:800;color:var(--tx);margin:0">Talent Pool / Hifadhi ya Wafanyakazi</h3>
        <p class="meta" style="margin-top:4px">Tafuta wataalamu walio tayari kuajiriwa, kagua wasifu, pakua CV na wasiliana nao moja kwa moja.</p>
      </div>
      <span class="chip" style="background:#0b224d;color:#fff">${seekers.length} Wataalamu Waliosajiliwa</span>
    </div>
    <div class="fb" style="padding:0;max-width:100%;grid-template-columns:2fr 1fr 1fr auto">
      <input class="in2" id="tp_q" placeholder="Tafuta jina, taaluma, ujuzi (skills), mji...">
      <select class="in2" id="tp_loc"><option value="">Miji Yote (All Locations)</option>${cities.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select>
      <select class="in2" id="tp_edu"><option value="">Viwango Vyote vya Elimu</option>${EDUS.map(e=>`<option value="${esc(e)}">${esc(e)}</option>`).join('')}</select>
      <button class="btn3 o sm" id="tp_reset">Onyesha Wote</button>
    </div>
  </div>
  <div id="tp_cards"></div>
 `;
 const qIn=$('#tp_q',container),locIn=$('#tp_loc',container),eduIn=$('#tp_edu',container),cardsEl=$('#tp_cards',container);
 const draw=()=>{
   const q=(qIn.value||'').toLowerCase();
   const loc=locIn.value;
   const edu=eduIn.value;
   const filtered=seekers.filter(s=>{
     const matchQ=!q||(s.name+' '+(s.headline||'')+' '+(s.skills||'')+' '+(s.location||'')+' '+(s.bio||'')).toLowerCase().includes(q);
     const matchLoc=!loc||s.location===loc;
     const matchEdu=!edu||s.education===edu;
     return matchQ&&matchLoc&&matchEdu;
   });
   if(!filtered.length){
     cardsEl.innerHTML='<p class="empty" style="padding:40px 0">Hakuna wataalamu wanaolingana na vigezo ulivyoweka.</p>';
     return;
   }
   cardsEl.innerHTML=`<div class="cand-grid">${filtered.map(s=>{
     const cleanPh=tel(s.phone).replace('+','');
     const skillsArr=(s.skills||'').split(',').map(x=>x.trim()).filter(Boolean);
     return `
      <div class="cand-card">
        <div>
          <div class="cand-top">
            <div class="cand-ava">
              ${s.avatarUrl?`<img src="${s.avatarUrl}" alt="${esc(s.name)}">`:esc((s.name||'?')[0].toUpperCase())}
            </div>
            <div>
              <h4 style="font-size:18px;font-weight:800;color:var(--tx);margin:0">${esc(s.name)}</h4>
              <p style="font-size:14px;font-weight:700;color:#f26522;margin:2px 0 4px">${esc(s.headline||'Job Seeker')}</p>
              <p class="meta" style="font-size:12.5px;font-weight:600">📍 ${esc(s.location||'Tanzania')} · 💼 ${s.experience||0} yr(s) exp</p>
            </div>
          </div>
          ${s.education?`<div style="margin-bottom:8px"><span class="chip" style="font-size:11px;background:#eef3ff;color:#0b224d">🎓 ${esc(s.education)}</span></div>`:''}
          ${skillsArr.length?`
            <div class="cand-skills">
              ${skillsArr.slice(0,4).map(sk=>`<span class="cand-skill-chip">${esc(sk)}</span>`).join('')}
              ${skillsArr.length>4?`<span class="cand-skill-chip" style="color:var(--mu)">+${skillsArr.length-4}</span>`:''}
            </div>
          `:''}
          <p class="pre" style="font-size:13.5px;line-height:1.5;color:var(--mu);margin:8px 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(s.bio||'Taarifa za wasifu za mtaalamu huyu.')}</p>
        </div>
        <div class="cand-footer">
          <button class="btn3 sm" data-tp-view="${s.id||s.uid}">Wasifu Kamili</button>
          <div style="display:flex;gap:6px">
            ${s.cvUrl?`<a class="btn3 o sm" download="${esc(s.cvName||'CV.pdf')}" href="${s.cvUrl}" title="Pakua CV">⬇ CV</a>`:''}
            ${cleanPh?`<a class="btn-wa" target="_blank" rel="noopener noreferrer" href="https://wa.me/${cleanPh}?text=${encodeURIComponent('Habari '+s.name+', nimeona wasifu wako kwenye Ten Ventures Africa Talent Pool.')}" style="padding:6px 10px;border-radius:10px;font-size:12px"><i><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.299-.777.979-.953 1.179-.175.199-.35.225-.651.075s-1.271-.469-2.42-1.494c-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.019-.462.132-.611.136-.134.301-.35.451-.525.15-.175.2-.299.301-.499.1-.2.05-.374-.025-.524-.075-.15-.677-1.633-.927-2.235-.244-.587-.492-.507-.677-.517-.175-.009-.376-.01-.576-.01s-.527.075-.802.374c-.276.299-1.053 1.029-1.053 2.509 0 1.48 1.078 2.91 1.228 3.109.15.2 2.122 3.24 5.141 4.542.718.309 1.279.494 1.716.633.722.229 1.378.197 1.897.12.579-.087 1.78-.728 2.031-1.431.251-.703.251-1.306.176-1.431-.076-.125-.276-.2-.577-.35zm-5.441 7.427c-1.921 0-3.805-.515-5.46-1.492l-.392-.232-4.057 1.064 1.083-3.954-.254-.405c-1.072-1.706-1.639-3.684-1.638-5.714.002-5.992 4.878-10.867 10.867 10.867 2.903.001 5.632 1.132 7.684 3.185 2.052 2.053 3.181 4.783 3.18 7.687-.003 5.993-4.879 10.868-10.874 10.868zm9.243-16.927c-2.467-2.47-5.748-3.83-9.242-3.831-7.185 0-13.032 5.846-13.035 13.033 0 2.298.599 4.54 1.737 6.514l-1.847 6.746 6.902-1.81c1.905 1.039 4.062 1.587 6.241 1.588h.005c7.184 0 13.032-5.846 13.036-13.033 0-3.483-1.357-6.756-3.824-9.227z"/></svg></i></a>`:''}
          </div>
        </div>
      </div>
     `;
   }).join('')}</div>`;

   $$('[data-tp-view]',cardsEl).forEach(btn=>{
     btn.onclick=()=>{
       const cand=seekers.find(x=>(x.id||x.uid)==btn.dataset.tpView);
       if(cand)openCandidateModal(cand);
     };
   });
 };

 [qIn,locIn,eduIn].forEach(el=>el.oninput=draw);
 $('#tp_reset',container).onclick=()=>{qIn.value='';locIn.value='';eduIn.value='';draw()};
 draw();
}

/* ---------- company / seeker dashboard ---------- */
function dashboard(){const r=$('#app');ready.then(async u=>{if(!u){location='account.html';return}if(u.admin){location='admin.html';return}const co=u.role=='company';
 const T=co?['Profile','Post a job','My jobs','Applicants','Talent Pool']:['Wasifu (Profile)','CV & Nyaraka (Documents)','Maombi Yangu (Applications)'];
 r.innerHTML=`<div class="w2"><div class="dh"><div><span class="chip">${co?'Company':'Job Seeker'}</span><h2 style="font-size:34px;margin-top:6px">Hello, ${esc((u.name||u.email).split(' ')[0])}</h2></div><button class="btn3 o sm" id="so">Sign out</button></div><div class="tabs" id="tb">${T.map((t,i)=>`<button class="${i?'':'on'}">${t}</button>`).join('')}</div><div id="v"></div></div>`;$('#so').onclick=signout;
 const v=$('#v'),F={
  /* Company Tabs */
  async 'Profile'(){const c=await api.get('companies',u.uid)||{};v.innerHTML=`<div class="msg" id="mg"></div><div class="fg">${inp('cn','Company name','text',1)}${inp('ci','Industry')}${inp('cl','Location','text',1)}${inp('cw','Website')}${inp('cp','Phone','tel')}${inp('ce','Contact email','email')}${txa('ca','About the company',1)}${fil('clg','Company logo (optional)')}</div><p style="margin-top:14px"><button class="btn3" id="sv">Save profile</button> ${c.name?`<a class="btn3 o" href="company.html?id=${u.uid}">View public page</a>`:''}</p>`;const M={cn:'name',ci:'industry',cl:'location',cw:'website',cp:'phone',ce:'email',ca:'about'};Object.entries(M).forEach(([k,f])=>$('#'+k).value=c[f]||'');
   $('#sv').onclick=async e=>{if(!val(v))return;const b=e.target;b.classList.add('ld');try{const lg=await prep($('#clg').files[0],{max:256,q:.8});await api.set('companies',u.uid,{...Object.fromEntries(Object.entries(M).map(([k,f])=>[f,$('#'+k).value.trim()])),logo:lg.url||c.logo||'',ownerUid:u.uid,ownerEmail:u.email});toast('Profile saved');F['Profile']()}catch(er){const g=$('#mg');g.className='msg bad';g.textContent=fe(er)}b.classList.remove('ld')}},
  async 'Post a job'(){const c=await api.get('companies',u.uid);if(!c||!c.name){v.innerHTML='<p class="empty">Please complete your company profile first.</p>';$$('#tb button')[0].click();toast('Complete your profile first');return}let mode='text';
   v.innerHTML=`<div class="msg" id="mg"></div><div class="sg2" id="md2"><button class="on" data-m="text">✍ Write the job</button><button data-m="image">🖼 Upload a poster image</button></div><div class="fg">${inp('jt','Job title','text',1)}${sel('jc','Category',CATS)}${inp('jl','Location','text',1)}${sel('jy','Type',TYPES)}${inp('jd','Application deadline','date')}${inp('jbt','Button Text (e.g. Apply Now)','text',0)}<div class="fl s"><select id="jat"><option value="website">Apply directly on Website</option><option value="email1">Email to neema@tensventures.com</option><option value="email2">Email to janethgeorge58@gmail.com</option><option value="email_custom">Custom Email</option></select><label for="jat">Application Method</label></div>${inp('jae','Custom Email','email',0)}${colorPickerHtml('jc_color','#0b224d','Poster & Font Accent Color')}<div class="full" id="jx">${txa('jx1','Job description, responsibilities and requirements',1)}</div></div><p style="margin-top:14px"><button class="btn3" id="pj">Publish job</button></p>`;
   $('#jd').value='';$('#jbt').value='Apply Now';bindColorPicker('jc_color','#0b224d');
   $$('#md2 button').forEach(b=>b.onclick=()=>{mode=b.dataset.m;$$('#md2 button').forEach(x=>x.classList.toggle('on',x==b));$('#jx').innerHTML=mode=='text'?txa('jx1','Job description, responsibilities and requirements',1):fil('jimg','Poster image (required)')+txa('jx2','Short text (optional)')});
   $('#pj').onclick=async e=>{if(!val(v))return;const b=e.target;try{b.classList.add('ld');let img={url:''};if(mode=='image'){const f=$('#jimg').files[0];if(!f)throw new Error('Please choose a poster image.');img=await prep(f,{max:1000,q:.74})}const dl=$('#jd').value;await api.add('jobs',{companyId:u.uid,companyName:c.name,logo:c.logo||'',title:$('#jt').value.trim(),category:$('#jc').value,location:$('#jl').value.trim(),type:$('#jy').value,deadline:dl?Date.parse(dl):0,buttonText:$('#jbt').value.trim()||'Apply Now',applyType:$('#jat').value,applyEmail:$('#jae').value.trim()||c.email||'',posterColor:$('#jc_color').value.trim()||'#0b224d',mode,description:(mode=='text'?$('#jx1').value:$('#jx2').value)||'',imageUrl:img.url,status:'published'});toast('Job published');$$('#tb button')[2].click()}catch(er){const g=$('#mg');g.className='msg bad';g.textContent=fe(er)}b.classList.remove('ld')}},
  async 'My jobs'(){v.innerHTML=skel(1);const [jobs,apps]=await Promise.all([api.list('jobs',[['companyId','==',u.uid]]),api.list('applications',[['companyId','==',u.uid]])]);v.innerHTML=table([['Job',j=>`<b>${esc(j.title)}</b><br><span class="meta">${esc(j.location)} · ${esc(j.type)} · <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${esc(j.posterColor||'#0b224d')};vertical-align:middle"></span> ${esc(j.posterColor||'#0b224d')}</span>`],['Status',j=>`<span class="chip">${j.status}</span>`],['Applicants',j=>apps.filter(a=>a.jobId==j.id).length],['Posted',j=>fd(j.createdAt)],['',j=>`<button class="btn3 o sm" data-a="t" data-id="${j.id}">${j.status=='published'?'Hide':'Show'}</button> <button class="btn3 o sm" data-a="e" data-id="${j.id}">Edit</button> <button class="btn3 o sm" data-a="d" data-id="${j.id}">Delete</button>`]],jobs);
   $$('button[data-a]',v).forEach(b=>b.onclick=async()=>{const j=jobs.find(x=>x.id==b.dataset.id);if(b.dataset.a=='d'){if(!confirm('Delete this job?'))return;await api.del('jobs',j.id);F['My jobs']()}else if(b.dataset.a=='e'){editor('jobs',j,JF_CO,F['My jobs'])}else{await api.upd('jobs',j.id,{status:j.status=='published'?'hidden':'published'});F['My jobs']()}})},
  async 'Applicants'(){v.innerHTML=skel(1);const a=await api.list('applications',[['companyId','==',u.uid]]);v.innerHTML=`<p style="margin-bottom:12px"><button class="btn3 o sm" id="ex">Export CSV</button></p>`+table([['Name',x=>`<b>${esc(x.name)}</b><br><span class="meta">${esc(x.email)} · ${esc(x.phone)}</span>`],['Job',x=>esc(x.jobTitle)],['Profession',x=>esc(x.profession)],['Date',x=>fd(x.createdAt)],['CV',x=>x.cvUrl?`<a style="color:#f26a1b;font-weight:700" download="${esc(x.cvName)}" href="${x.cvUrl}">Download CV</a>`:'—'],['Doc',x=>x.docUrl?`<a style="color:#0b224d;font-weight:700" download="${esc(x.docName)}" href="${x.docUrl}">Cover Doc</a>`:'—']],a);$('#ex').onclick=()=>csv('applicants.csv',[['Name','Email','Phone','Profession','Job','Experience','Date'],...a.map(x=>[x.name,x.email,x.phone,x.profession,x.jobTitle,x.exp,fd(x.createdAt)])])},
  async 'Talent Pool'(){await renderTalentPool(v,false)},

  /* Job Seeker Tabs */
  async 'Wasifu (Profile)'(){
   v.innerHTML=skel(1);
   let sk=await api.get('seekers',u.uid);
   if(!sk){
    sk={name:u.name||'',email:u.email||'',phone:u.phone||'',headline:'',location:'Dar es Salaam',education:"Degree / Shahada ya Kwanza",experience:1,skills:'',bio:'',avatarUrl:'',isPublic:true};
   }
   const strength=calcStrength(sk);
   v.innerHTML=`
    <div class="msg" id="mg"></div>
    <div class="sk-hero">
      <div class="sk-hero-inner">
        <div class="sk-user-meta">
          <div class="prof-avatar-wrap" style="margin:0;width:92px;height:92px">
            <div class="sk-avatar-ring" style="width:92px;height:92px">
              <img id="sk_ava_img" src="${sk.avatarUrl||'assets/woman.jpg'}" alt="${esc(sk.name||u.name)}" onerror="this.src='assets/woman.jpg'">
            </div>
            <label class="btn-edit-photo btn-edit-avatar" id="lbl_sk_ava" title="Badilisha picha ya wasifu">
              <input type="file" id="in_sk_ava" accept="image/*" style="display:none">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </label>
          </div>
          <div>
            <span class="chip" style="background:#0b224d;color:#fff">★ Job Seeker</span>
            <h3 style="font-size:24px;font-weight:800;color:var(--tx);margin:4px 0 2px">${esc(sk.name||u.name||'Mtafuta Kazi')}</h3>
            <p style="font-size:14.5px;font-weight:700;color:#f26522;margin:0 0 4px">${esc(sk.headline||'Weka Taaluma Yako (mf. HR Specialist, Accountant)')}</p>
            <p class="meta" style="font-size:13px;font-weight:600">✉ ${esc(u.email)} ${sk.phone?`· 📞 ${esc(sk.phone)}`:''}</p>
          </div>
        </div>
        <div class="sk-strength-card">
          <div class="sk-meter-head">
            <span>Nguvu ya Wasifu (Profile Strength)</span>
            <b style="color:#f26522;font-size:16px">${strength}%</b>
          </div>
          <div class="sk-meter-bar">
            <div class="sk-meter-fill" style="width:${strength}%"></div>
          </div>
          <div class="sk-meter-hint">
            ${strength>=80?'🌟 Wasifu wako una nguvu kubwa na uko tayari kwa waajiri!':strength>=50?'💡 Ongeza ujuzi, elimu na CV ili kufikia 100%':'⚠️ Kamilisha taarifa zako zote ili waajiri wakuone kwa urahisi.'}
          </div>
        </div>
      </div>
    </div>

    <div style="background:var(--card);border:1.5px solid var(--bd);border-radius:24px;padding:26px;box-shadow:0 8px 24px rgba(11,31,77,.05)">
      <h3 style="font-size:20px;font-weight:800;color:var(--tx);margin-bottom:18px">Taarifa za Wasifu &amp; Taaluma</h3>
      <div class="fg">
        ${inp('sk_n','Jina Kamili (Full Name)','text',1)}
        ${inp('sk_h','Kichwa cha Kazi / Taaluma (Headline / Title)','text',1)}
        ${inp('sk_p','Namba ya Simu (WhatsApp / Calls)','tel',1)}
        ${inp('sk_l','Mahali Ulipo / Mji (City / Region)','text',1)}
        ${sel('sk_edu','Kiwango cha Elimu (Education Level)',EDUS)}
        ${inp('sk_exp','Uzoefu wa Kazi (Miaka / Years of Experience)','number')}
        <div class="full">${inp('sk_skills','Ujuzi Mkuu / Skills (Tenganisha kwa koma, mf. Labour Law, Payroll, PDPA, Excel)','text')}</div>
        <div class="full">${txa('sk_bio','Wasifu Mfupi / Professional Bio (Eleza kwa ufupi uzoefu wako na mafanikio)',0)}</div>
        <div class="full" style="background:rgba(11,34,77,.03);border:1px solid var(--bd);border-radius:14px;padding:14px 18px">
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-weight:750;font-size:14px;color:var(--tx)">
            <input type="checkbox" id="sk_pub" ${sk.isPublic!==false?'checked':''} style="width:18px;height:18px;accent-color:#25d366;cursor:pointer">
            <span>Weka wasifu wangu wazi kwenye Talent Pool ili makampuni na waajiri wanipate moja kwa moja</span>
          </label>
        </div>
      </div>
      <p style="margin-top:20px"><button class="btn3" id="sk_save" style="font-size:15px;padding:14px 28px">Hifadhi Wasifu (Save Profile)</button></p>
    </div>
   `;

   $('#sk_n').value=sk.name||u.name||'';
   $('#sk_h').value=sk.headline||'';
   $('#sk_p').value=sk.phone||u.phone||'';
   $('#sk_l').value=sk.location||'Dar es Salaam';
   if(sk.education)$('#sk_edu').value=sk.education;
   $('#sk_exp').value=sk.experience??1;
   $('#sk_skills').value=sk.skills||'';
   $('#sk_bio').value=sk.bio||'';

   let newAvatarUrl=sk.avatarUrl||'';
   const inAva=$('#in_sk_ava'),avaImg=$('#sk_ava_img');
   inAva.onchange=async()=>{
     const f=inAva.files[0];
     if(!f)return;
     try{
       toast('Inapakiwa picha…');
       const res=await prep(f,{max:400,q:.8});
       newAvatarUrl=res.url;
       avaImg.src=res.url;
       await api.set('seekers',u.uid,{avatarUrl:res.url});
       toast('Picha imebadilishwa kikamilifu!');
     }catch(err){toast(fe(err))}
   };

   $('#sk_save').onclick=async e=>{
     if(!val(v))return;
     const b=e.target;b.classList.add('ld');
     try{
       const nameVal=$('#sk_n').value.trim();
       const phoneVal=tel($('#sk_p').value);
       const updatedData={
         uid:u.uid,
         email:u.email,
         name:nameVal,
         headline:$('#sk_h').value.trim(),
         phone:phoneVal,
         location:$('#sk_l').value.trim(),
         education:$('#sk_edu').value,
         experience:Number($('#sk_exp').value)||0,
         skills:$('#sk_skills').value.trim(),
         bio:$('#sk_bio').value.trim(),
         isPublic:$('#sk_pub').checked,
         avatarUrl:newAvatarUrl||sk.avatarUrl||'',
         updatedAt:Date.now()
       };
       await api.set('seekers',u.uid,updatedData);
       try{await api.profile(nameVal)}catch(er){}
       toast('Wasifu wako umehifadhiwa kikamilifu!');
       F['Wasifu (Profile)']();
     }catch(er){
       const g=$('#mg');g.className='msg bad';g.textContent=fe(er);
     }
     b.classList.remove('ld');
   };
  },

  async 'CV & Nyaraka (Documents)'(){
   v.innerHTML=skel(1);
   let sk=await api.get('seekers',u.uid)||{};
   v.innerHTML=`
    <div class="msg" id="mg"></div>
    <div style="background:var(--card);border:1.5px solid var(--bd);border-radius:24px;padding:26px;box-shadow:0 8px 24px rgba(11,31,77,.05);margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px">
        <div>
          <h3 style="font-size:22px;font-weight:800;color:var(--tx);margin:0">Wasifu Wako wa Kazi (Primary Resume / CV)</h3>
          <p class="meta" style="margin-top:4px">Pakia CV yako hapa mara moja tu ili utumie kuomba nafasi zote za kazi bila kupakia upya kila mara.</p>
        </div>
        ${sk.cvUrl?`<span class="chip" style="background:#25d366;color:#fff;font-size:12px">✓ 1-Click Apply Ready</span>`:''}
      </div>

      ${sk.cvUrl?`
        <div class="sk-doc-card">
          <div class="sk-doc-info">
            <div class="sk-doc-ic">📄</div>
            <div>
              <b style="font-size:16px;color:var(--tx);display:block">${esc(sk.cvName||'Wasifu_CV.pdf')}</b>
              <span class="meta" style="font-size:13px">Imehifadhiwa · ${fd(sk.cvDate||sk.updatedAt||Date.now())}</span>
            </div>
          </div>
          <div class="sk-doc-actions">
            <a class="btn3 sm" download="${esc(sk.cvName||'CV.pdf')}" href="${sk.cvUrl}">⬇ Pakua CV (Download)</a>
            <button class="btn3 o sm" id="sk_btn_rep_cv">🔄 Badilisha CV</button>
            <button class="btn3 o sm" id="sk_btn_del_cv" style="color:#c62828">🗑 Futa</button>
          </div>
        </div>
      `:''}

      <div class="up-zone" id="sk-cv-zone" style="${sk.cvUrl?'display:none':''}">
        <input id="sk_cv_in" type="file" accept=".pdf,.doc,.docx">
        <div class="up-zone-label">
          <div class="up-zone-icon">📄</div>
          <div>
            <b>Pakia CV Mpya (Upload CV / Resume) <span class="up-chip req">PDF au Word</span></b>
            <small>Chagua faili la PDF au Word (Max 2.5 MB) kutoka kwenye simu au kompyuta yako</small>
            <div id="sk-cv-fn" class="file-preview-pill" style="display:none"></div>
          </div>
        </div>
      </div>

      <div style="margin-top:24px;border-top:1.5px solid var(--bd);padding-top:20px">
        <h4 style="font-size:17px;font-weight:800;color:var(--tx);margin-bottom:6px">Barua ya Maombi ya Jumla (Master Cover Letter - Hiari)</h4>
        <p class="meta" style="margin-bottom:12px">Ujumbe huu utajazwa moja kwa moja kwenye maombi yako unapoomba kazi.</p>
        <div class="fl full">
          <textarea id="sk_cover_txt" placeholder=" " style="min-height:110px"></textarea>
          <label for="sk_cover_txt">Barua ya Maombi / Written Cover Letter</label>
        </div>
      </div>

      <div style="margin-top:24px;border-top:1.5px solid var(--bd);padding-top:20px">
        <h4 style="font-size:17px;font-weight:800;color:var(--tx);margin-bottom:6px">Nyaraka ya Ziada / Vyeti (Additional Documents - Hiari)</h4>
        <p class="meta" style="margin-bottom:12px">Mfano: Cheti cha elimu, cheti cha taaluma (CPA/Barua), au portfolio.</p>
        ${sk.docUrl?`
          <div class="sk-doc-card" style="margin-bottom:14px">
            <div class="sk-doc-info">
              <div class="sk-doc-ic" style="background:#fff3e0;color:#e65100">📎</div>
              <div>
                <b style="font-size:15px;color:var(--tx);display:block">${esc(sk.docName||'Document.pdf')}</b>
                <span class="meta" style="font-size:12.5px">Nyaraka ya ziada</span>
              </div>
            </div>
            <div class="sk-doc-actions">
              <a class="btn3 o sm" download="${esc(sk.docName||'Doc.pdf')}" href="${sk.docUrl}">⬇ Pakua Faili</a>
            </div>
          </div>
        `:''}
        <div class="up-zone" id="sk-doc-zone">
          <input id="sk_doc_in" type="file" accept=".pdf,.doc,.docx,.jpg,.png">
          <div class="up-zone-label">
            <div class="up-zone-icon">📎</div>
            <div>
              <b>Pakia Nyaraka ya Ziada (Certificates / Portfolio)</b>
              <small>Faili la PDF, Word au picha (Max 2.5 MB)</small>
              <div id="sk-doc-fn" class="file-preview-pill" style="display:none"></div>
            </div>
          </div>
        </div>
      </div>

      <p style="margin-top:22px"><button class="btn3" id="sk_docs_save" style="font-size:15px;padding:14px 28px">Hifadhi Nyaraka (Save Documents)</button></p>
    </div>
   `;

   $('#sk_cover_txt').value=sk.coverLetter||'';
   const cvIn=$('#sk_cv_in'),docIn=$('#sk_doc_in'),cvFn=$('#sk-cv-fn'),docFn=$('#sk-doc-fn'),cvZone=$('#sk-cv-zone'),docZone=$('#sk-doc-zone');
   const repBtn=$('#sk_btn_rep_cv'),delBtn=$('#sk_btn_del_cv');

   if(repBtn){
     repBtn.onclick=()=>{
       cvZone.style.display=cvZone.style.display==='none'?'block':'none';
       if(cvZone.style.display!=='none')cvIn.click();
     };
   }
   if(delBtn){
     delBtn.onclick=async()=>{
       if(!confirm('Una uhakika unataka kufuta CV hii kwenye wasifu wako?'))return;
       await api.set('seekers',u.uid,{cvUrl:'',cvName:''});
       toast('CV imefutwa');
       F['CV & Nyaraka (Documents)']();
     };
   }

   cvIn.onchange=()=>{
     if(cvIn.files[0]){
       cvFn.style.display='flex';
       cvFn.textContent='✓ '+cvIn.files[0].name+' ('+Math.round(cvIn.files[0].size/1024)+' KB)';
       cvZone.classList.add('active');
     }else{
       cvFn.style.display='none';
       cvZone.classList.remove('active');
     }
   };

   docIn.onchange=()=>{
     if(docIn.files[0]){
       docFn.style.display='flex';
       docFn.textContent='✓ '+docIn.files[0].name+' ('+Math.round(docIn.files[0].size/1024)+' KB)';
       docZone.classList.add('active');
     }else{
       docFn.style.display='none';
       docZone.classList.remove('active');
     }
   };

   $('#sk_docs_save').onclick=async e=>{
     const b=e.target;b.classList.add('ld');
     try{
       const updates={coverLetter:$('#sk_cover_txt').value.trim()};
       if(cvIn.files[0]){
         const cvRes=await prep(cvIn.files[0],{cv:true});
         updates.cvUrl=cvRes.url;
         updates.cvName=cvRes.name;
         updates.cvDate=Date.now();
       }
       if(docIn.files[0]){
         const docRes=await prep(docIn.files[0],{doc:true});
         updates.docUrl=docRes.url;
         updates.docName=docRes.name;
       }
       await api.set('seekers',u.uid,updates);
       toast('Nyaraka zimehifadhiwa kikamilifu!');
       F['CV & Nyaraka (Documents)']();
     }catch(er){
       const g=$('#mg');g.className='msg bad';g.textContent=fe(er);
     }
     b.classList.remove('ld');
   };
  },

  async 'Maombi Yangu (Applications)'(){
   v.innerHTML=skel(1);
   const allApps=await api.list('applications');
   const a=allApps.filter(x=>x.uid==u.uid||(x.email&&x.email.toLowerCase()===(u.email||'').toLowerCase()));
   const stMap={
     New:'<span class="app-st-badge app-st-new">● Mpya / Inasubiri</span>',
     Reviewing:'<span class="app-st-badge app-st-review">● Inapitiwa</span>',
     Shortlisted:'<span class="app-st-badge app-st-shortlist">★ Umechaguliwa</span>',
     Interview:'<span class="app-st-badge app-st-interview">🎤 Mahojiano</span>',
     Accepted:'<span class="app-st-badge app-st-accepted">✓ Imekubaliwa</span>',
     Rejected:'<span class="app-st-badge app-st-rejected">Haikufanikiwa</span>'
   };

   v.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px">
      <div>
        <h3 style="font-size:22px;font-weight:800;color:var(--tx);margin:0">Maombi Yangu ya Kazi (${a.length})</h3>
        <p class="meta" style="margin-top:4px">Fuatilia hali ya maombi yako ya kazi yaliyowasilishwa kwa waajiri.</p>
      </div>
      <a class="btn3" href="careers.html" style="text-decoration:none;display:inline-block">Tafuta Kazi Nyingine →</a>
    </div>
   `+table([
     ['Nafasi ya Kazi',x=>`<b>${esc(x.jobTitle)}</b><br><span class="meta">${esc(x.companyName)} · 📍 ${esc(x.profession||'General')}</span>`],
     ['Tarehe',x=>fd(x.createdAt)],
     ['Hali ya Maombi',x=>stMap[x.status]||`<span class="chip">${esc(x.status)}</span>`],
     ['CV Iliyotumwa',x=>x.cvUrl?`<a style="color:#f26a1b;font-weight:750" download="${esc(x.cvName||'CV.pdf')}" href="${x.cvUrl}">Pakua CV</a>`:'—'],
     ['',x=>`<button class="btn3 o sm" data-my-app="${x.id}">Tazama Taarifa</button>`]
   ],a);

   $$('[data-my-app]',v).forEach(btn=>{
     btn.onclick=()=>{
       const item=a.find(z=>z.id==btn.dataset.myApp);
       if(!item)return;
       modal(`
        <h2>Maombi: ${esc(item.jobTitle)}</h2>
        <p class="meta" style="font-size:15px;font-weight:700">${esc(item.companyName)} · Tarehe: ${fd(item.createdAt)}</p>
        <div style="background:var(--soft);border-radius:16px;padding:16px;margin:14px 0">
          <p><b>Hali ya Maombi:</b> ${stMap[item.status]||item.status}</p>
          <p class="meta" style="margin-top:6px">Taarifa zako zimepokelewa na timu ya uajiri ya Ten Ventures Africa.</p>
        </div>
        ${item.cover?`<div style="margin:14px 0"><b style="display:block;margin-bottom:6px">Barua / Ujumbe Uliowasilisha:</b><p class="pre" style="background:#fff;border:1px solid var(--bd);padding:14px;border-radius:12px">${esc(item.cover)}</p></div>`:''}
        <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
          ${item.cvUrl?`<a class="btn3 sm" download="${esc(item.cvName||'CV.pdf')}" href="${item.cvUrl}">⬇ Pakua CV Uliyotuma</a>`:''}
          <button class="btn3 o sm" onclick="document.getElementById('md').classList.remove('on')">Funga</button>
        </div>
       `);
     };
   });
  }
 };
 $$('#tb button').forEach((b,i)=>b.onclick=()=>{$$('#tb button').forEach(x=>x.classList.toggle('on',x==b));F[T[i]]()});F[T[0]]()})}
/* ---------- admin ---------- */
const BST=['Pending','Confirmed','Cancelled'],AST=['New','Reviewing','Shortlisted','Interview','Accepted','Rejected'],TC=['Legal','HR','Team Building','Leadership','Compliance','Other'],NC=['Announcement','Training','Event','Opportunity','Offer'];
const opts=(a,c)=>a.map(o=>`<option${o==c?' selected':''}>${esc(o)}</option>`).join('');
const stSel=(id,c,a)=>`<select class="in2" data-st="${id}" style="padding:7px 10px;min-width:120px;font-weight:700">${opts(a,c)}</select>`;
const bt=(k,id,t)=>`<button class="btn3 o sm" data-${k}="${id}">${t}</button>`;
const dz=(id,l)=>`<div class="dz-w"><label class="dz"><input id="${id}" type="file" accept="image/*"><span class="ic">↑</span><span><b>${l}</b><small>Click or drop an image · any size, the ratio is kept automatically</small></span><img class="pv" alt=""></label></div>`;
document.addEventListener('change',e=>{const i=e.target,z=i.closest&&i.closest('.dz');if(!z)return;const f=i.files[0],p=z.querySelector('.pv'),s=z.querySelector('small');if(!f){p.style.display='none';return}s.textContent=f.name+' · '+Math.round(f.size/1024)+' KB';const u=URL.createObjectURL(f);p.onload=()=>URL.revokeObjectURL(u);p.src=u;p.style.display='block'});
['dragenter','dragover'].forEach(n=>document.addEventListener(n,e=>{const z=e.target.closest&&e.target.closest('.dz');if(z)z.classList.add('drag')}));
['dragleave','drop'].forEach(n=>document.addEventListener(n,e=>{const z=e.target.closest&&e.target.closest('.dz');if(z)z.classList.remove('drag')}));
const bars=(t,p)=>{const mx=Math.max(1,...p.map(x=>x[1]));return `<div style="margin:18px 0"><h3 style="margin-bottom:10px">${t}</h3>${p.length?p.map(([n,c])=>`<div style="display:flex;align-items:center;gap:10px;margin:6px 0"><span class="meta" style="width:150px;flex:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(n)}</span><div style="flex:1;background:var(--soft);border-radius:8px"><div class="bar" style="width:${c/mx*100}%;min-width:4px;height:14px;border-radius:8px;background:#f26a1b"></div></div><b>${c}</b></div>`).join(''):'<p class="empty">No data yet.</p>'}</div>`};
const hint=e=>/permission/i.test((e&&(e.code||e.message))||'')?'<p class="empty">Firebase is blocking this action because the Firestore rules are not published yet. Open Firebase Console → Firestore Database → Rules, paste the file <b>firebase/firestore.rules</b> and press Publish (one time only), then reload this page.</p>':off(e);
const JF=[
 ['title','Job title'],
 ['companyName','Company name'],
 ['location','Location'],
 ['category','Category','sel',CATS],
 ['type','Type','sel',TYPES],
 ['deadline','Deadline','date'],
 ['buttonText','Action Button Text (e.g. Apply Now, Tuma CV)'],
 ['applyType','Application Route','sel',['website','email1','email2','email_custom']],
 ['applyEmail','Custom Email (if custom route)'],
 ['posterColor','Poster / Font Accent Color (#0b224d, #f26522, etc.)'],
 ['description','Full Description','area']
];
const JF_CO=[
 ['title','Job title'],
 ['location','Location'],
 ['category','Category','sel',CATS],
 ['type','Type','sel',TYPES],
 ['deadline','Deadline','date'],
 ['buttonText','Action Button Text (e.g. Apply Now)'],
 ['applyType','Application Route','sel',['website','email1','email2','email_custom']],
 ['applyEmail','Custom Email (if custom route)'],
 ['posterColor','Poster / Font Accent Color (#0b224d, #f26522, etc.)'],
 ['description','Full Description','area']
];
const CF=[
 ['name','Company name'],
 ['industry','Industry'],
 ['location','Location'],
 ['website','Website'],
 ['phone','Phone numbers'],
 ['email','Contact email'],
 ['about','About company','area']
];
const TF=[['title','Title'],['category','Category','sel',TC],['date','Date','date'],['time','Time','time'],['location','Location'],['mode','Mode','sel',['Offline','Online']],['trainer','Trainer'],['fee','Fee (TZS)','number'],['seats','Seats','number'],['expires','Hide announcement after','date'],['ctaText','Button text'],['ctaUrl','Button link'],['description','Description','area']];
const NF=[['title','Title'],['category','Category','sel',NC],['expires','Hide announcement after','date'],['ctaText','Button text'],['ctaUrl','Button link'],['body','Text','area']];
const AF=[['title','Title'],['body','Text','area'],['ctaText','Button text'],['ctaUrl','Button link'],['expires','Hide after','date']];
function editor(col,row,fields,done){const m=modal(`<h2>Edit Profile &amp; Data</h2><div class="msg" id="mg"></div><div class="fg" style="margin-top:14px">${fields.map(([k,l,t,o])=>t=='area'?txa('e_'+k,l):t=='sel'?sel('e_'+k,l,o):inp('e_'+k,l,t||'text')).join('')}</div><p style="margin-top:16px"><button class="btn3" id="sv">Save changes</button></p>`);
 fields.forEach(([k,,t])=>{const v=row[k];$('#e_'+k,m).value=t=='date'?(v?new Date(v).toISOString().slice(0,10):''):(v??'')});
 $('#sv',m).onclick=async()=>{const d={};fields.forEach(([k,,t])=>{let v=$('#e_'+k,m).value;if(k==='ctaUrl')v=normUrl(v);d[k]=t=='date'?(v?Date.parse(v):0):t=='number'?Number(v)||0:(typeof v==='string'?v.trim():v)});try{await api.upd(col,row.id,d);m.parentNode.classList.remove('on');toast('Saved successfully');done()}catch(e){const g=$('#mg',m);g.className='msg bad';g.textContent=fe(e)}}}
function admin(){const r=$('#app');ready.then(async u=>{if(!u){location='account.html';return}if(!u.admin){r.innerHTML='<div class="w2"><p class="empty">This area is for administrators only. <a class="lnk" href="index.html">Go home</a></p></div>';return}
 const T=['Overview','Companies','Jobs','Applications','Talent Pool','Trainings','Bookings','News','Messages','Pop-up ads','Users','Admins','My account'];r.innerHTML=`<div class="w2"><div class="dh"><div><span class="chip">Admin</span><h2 style="font-size:34px;margin-top:6px">Ten Ventures Africa Control Center</h2></div><button class="btn3 o sm" id="so">Sign out</button></div><div class="tabs" id="tb">${T.map((t,i)=>`<button class="${i?'':'on'}">${t}</button>`).join('')}</div><div id="v"></div></div>`;$('#so').onclick=signout;const v=$('#v'),all=c=>api.list(c),safe=c=>api.list(c).catch(()=>[]);
 const act=(col,reload)=>$$('button[data-del]',v).forEach(b=>b.onclick=async()=>{if(!confirm('Delete permanently?'))return;await api.del(col,b.dataset.del);toast('Deleted');reload()});
 const stBind=(col,arr)=>$$('select[data-st]',v).forEach(s=>s.onchange=async()=>{try{await api.upd(col,s.dataset.st,{status:s.value});const x=arr.find(y=>y.id==s.dataset.st);if(x)x.status=s.value;toast('Status updated')}catch(e){toast(fe(e))}});
 const rowActs=(col,a,reload,fields)=>{$$('[data-t]',v).forEach(b=>b.onclick=async()=>{const x=a.find(y=>y.id==b.dataset.t);await api.upd(col,x.id,{status:x.status=='hidden'?'published':'hidden'});reload()});$$('[data-f]',v).forEach(b=>b.onclick=async()=>{const x=a.find(y=>y.id==b.dataset.f);await api.upd(col,x.id,{featured:!x.featured});reload()});$$('[data-e]',v).forEach(b=>b.onclick=()=>editor(col,a.find(y=>y.id==b.dataset.e),fields,reload));act(col,reload)};
 const pager=()=>$$('table.tb',v).forEach(t=>{if(t.dataset.pg)return;t.dataset.pg=1;const rows=[...t.tBodies[0].rows];if(rows.length<=25)return;let n=25;const b=document.createElement('button');b.className='btn3 o sm';b.style.margin='12px 0';const up=()=>{rows.forEach((r,i)=>r.hidden=i>=n);b.textContent='Show more ('+Math.max(0,rows.length-n)+' left)';b.hidden=n>=rows.length};b.onclick=()=>{n+=25;up()};up();t.parentNode.after(b)});new MutationObserver(pager).observe(v,{childList:true,subtree:true});
 const fail=er=>{const g=$('#mg',v);if(g){g.className='msg bad';g.textContent=fe(er)}};
 const first=()=>{const m=modal(`<h2>Set your own password</h2><p class="meta" style="margin:8px 0 16px">You signed in with the starting password. Choose your own password now so that only you can open this admin panel.</p><div class="msg" id="mg2"></div><div id="s0"><div class="fg">${inp('fp1','New password (min 6)','password',1)}${inp('fp2','Confirm new password','password',1)}</div></div><p style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn3" id="fpb">Save new password</button><button class="btn3 o" id="fpl">Later</button></p>`),bad=t=>{const g=$('#mg2',m);g.className='msg bad';g.textContent=t};
  $('#fpl',m).onclick=()=>m.parentNode.classList.remove('on');
  $('#fpb',m).onclick=async e=>{if(!val($('#s0',m)))return;if($('#fp1',m).value.length<6)return bad('Password must be at least 6 characters.');if($('#fp1',m).value!=$('#fp2',m).value)return bad('Passwords do not match.');if($('#fp1',m).value==u.email)return bad('Please choose a different password from your email.');const b=e.target;b.classList.add('ld');try{await api.pass(u.email,$('#fp1',m).value);sessionStorage.removeItem('tv_first');m.parentNode.classList.remove('on');toast('Password changed. Use it next time you sign in.')}catch(er){b.classList.remove('ld');bad(fe(er))}}};
 const F={
 async Overview(){v.innerHTML=skel(1);const [us,co,jb,ap,tr,bk,nw,ms]=await Promise.all(['users','companies','jobs','applications','trainings','bookings','news','messages'].map(safe));const S=[['Users',us],['Companies',co],['Jobs',jb],['Applications',ap],['Trainings',tr],['Bookings',bk],['News',nw],['Messages',ms]],un=ms.filter(x=>!x.read).length;
  const ev=[...jb.slice(0,6).map(x=>({t:x.createdAt,m:`<b>${esc(x.companyName)}</b> posted a job: ${esc(x.title)}`})),...ap.slice(0,6).map(x=>({t:x.createdAt,m:`<b>${esc(x.name)}</b> applied for ${esc(x.jobTitle)}`})),...bk.slice(0,6).map(x=>({t:x.createdAt,m:`<b>${esc(x.name)}</b> booked ${esc(x.trainingTitle)}`})),...ms.slice(0,6).map(x=>({t:x.createdAt,m:`<b>${esc(x.name)}</b> sent a message`})),...us.slice(0,6).map(x=>({t:x.createdAt||0,m:`<b>${esc(x.name||x.email)}</b> joined as ${esc(x.role)}`}))].sort((a,b)=>b.t-a.t).slice(0,12);
  setTimeout(()=>$$('.stc b',v).forEach(b=>{const n=+b.textContent,t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/900);b.textContent=Math.round(n*(1-Math.pow(1-k,3)));k<1&&requestAnimationFrame(f)};b.textContent=0;requestAnimationFrame(f)}),30);
  v.innerHTML=`<div class="stc">${S.map(([n,a],i)=>`<div style="animation-delay:${i*60}ms"><b>${a.length}</b>${n}</div>`).join('')}</div>${un?`<p class="meta" style="margin-bottom:12px">📩 ${un} unread message(s)</p>`:''}${bars('Applications by status',AST.map(k=>[k,ap.filter(x=>(x.status||'New')==k).length]))}${bars('Bookings by training',Object.entries(bk.reduce((o,x)=>(o[x.trainingTitle]=(o[x.trainingTitle]||0)+1,o),{})))}<h3 style="margin-bottom:10px">Latest activity</h3>${ev.length?ev.map(e=>`<p class="meta" style="padding:9px 0;border-top:1px solid var(--bd)">${fd(e.t)} · ${e.m}</p>`).join(''):'<p class="empty">No activity yet.</p>'}`},
 async Companies(){
  const a=await all('companies');
  v.innerHTML=`<div class="msg" id="mg"></div>
  <p class="meta" style="margin-bottom:14px;font-size:15px">All employer and corporate profiles registered on Ten Ventures Africa. You can edit any company profile directly.</p>`+
  table([
   ['Company',c=>`<b>${esc(c.name)}</b>${c.isTenVentures?' <span class="chip" style="background:#0b224d;color:#fff">★ Ten Ventures Africa</span>':''}<br><span class="meta">${esc(c.industry||'')} · ${esc(c.location||'')}</span>`],
   ['Contact',c=>esc(c.ownerEmail||c.email||'')],
   ['Phone',c=>esc(c.phone||'—')],
   ['Public Page',c=>`<a style="color:#f26a1b;font-weight:750" href="company.html?id=${c.id}">View Profile</a>`],
   ['',c=>bt('e',c.id,'Edit Profile')+' '+bt('del',c.id,'Delete')]
  ],a);
  $$('[data-e]',v).forEach(b=>b.onclick=()=>editor('companies',a.find(y=>y.id==b.dataset.e),CF,F.Companies));
  act('companies',F.Companies);
 },
 async Jobs(){
  const [a,cos]=await Promise.all([all('jobs'),all('companies')]);
  v.innerHTML=`<div class="msg" id="mg"></div>
  <div style="background:var(--card);border:1.5px solid var(--bd);border-radius:24px;padding:24px;margin-bottom:24px;box-shadow:0 8px 24px rgba(11,31,77,.06)">
   <h3 style="font-size:22px;font-weight:800;color:var(--tx);margin-bottom:14px">Post New Job (Ten Ventures Official or Client Company)</h3>
   <div class="fg">
    <div class="fl s"><select id="nj_co"><option value="c_tenventures">Ten Ventures Africa (Official - We Are Hiring Design)</option>${cos.filter(c=>c.id!='c_tenventures').map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select><label for="nj_co">Posting Organization</label></div>
    ${inp('nj_t','Job title','text',1)}
    ${sel('nj_c','Category',CATS)}
    ${inp('nj_l','Location','text',1)}
    ${sel('nj_y','Type',TYPES)}
    ${inp('nj_d','Application deadline','date')}
    ${inp('nj_bt','Button Text on Card (e.g. Apply Now, Tuma CV)','text',0)}
    <div class="fl s"><select id="nj_at"><option value="website">Apply directly on Website (Job seeker submits CV here)</option><option value="email1">Send applications to neema@tensventures.com</option><option value="email2">Send applications to janethgeorge58@gmail.com</option><option value="email_custom">Send to custom email</option></select><label for="nj_at">Application Method</label></div>
    ${inp('nj_ae','Custom Email (if custom chosen)','email',0)}
    ${colorPickerHtml('nj_color','#0b224d','Poster & Font Accent Color (Theme)')}
    <div class="full">${txa('nj_q','Key Qualifications & Requirements (one per line, displayed on hiring card)',0)}</div>
    <div class="full">${txa('nj_x','Full Job description & responsibilities',1)}</div>
    ${dz('nj_im','Poster Image or Professional Avatar Photo')}
   </div>
   <p style="margin-top:16px"><button class="btn3" id="nj_btn" style="font-size:15px;padding:14px 28px">Publish Job</button></p>
  </div>`+table([
   ['Job',j=>`<b>${esc(j.title)}</b>${j.featured?' ★':''}${isTenV(j)?' <span class="chip" style="background:#0b224d;color:#fff">Ten Ventures</span>':''}<br><span class="meta">${esc(j.companyName)} · ${esc(j.category)} · <b>Btn: ${esc(j.buttonText||'Apply Now')}</b> · <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${esc(j.posterColor||'#0b224d')};vertical-align:middle"></span> ${esc(j.posterColor||'#0b224d')}</span>`],
   ['Status',j=>`<span class="chip">${j.status}</span>`],
   ['Posted',j=>fd(j.createdAt)],
   ['',j=>bt('t',j.id,j.status=='published'?'Hide':'Show')+' '+bt('f',j.id,j.featured?'Unfeature':'Feature')+' '+bt('e',j.id,'Edit')+' '+bt('del',j.id,'Delete')]
  ],a);
  $('#nj_bt').value='Apply Now';
  $('#nj_l').value='Dar es Salaam';
  bindColorPicker('nj_color','#0b224d');
  $('#nj_btn').onclick=async e=>{
   if(!val(v))return;
   const b=e.target;b.classList.add('ld');
   try{
    const coId=$('#nj_co').value,co=cos.find(c=>c.id==coId)||{name:'Ten Ventures Africa'};
    const isTV=coId=='c_tenventures'||/ten\s*ventures/i.test(co.name);
    const im=await prep($('#nj_im').files[0],{max:1000,q:.74});
    const dl=$('#nj_d').value;
    const quals=$('#nj_q').value.split('\n').map(s=>s.trim()).filter(Boolean);
    await api.add('jobs',{
     companyId:coId,
     companyName:co.name,
     logo:isTV?'assets/logo.jpg':(co.logo||''),
     isTenVentures:isTV,
     title:$('#nj_t').value.trim(),
     category:$('#nj_c').value,
     location:$('#nj_l').value.trim(),
     type:$('#nj_y').value,
     deadline:dl?Date.parse(dl):0,
     buttonText:$('#nj_bt').value.trim()||'Apply Now',
     applyType:$('#nj_at').value,
     applyEmail:$('#nj_ae').value.trim()||($('#nj_at').value=='email2'?'janethgeorge58@gmail.com':'neema@tensventures.com'),
     posterColor:$('#nj_color').value.trim()||'#0b224d',
     qualifications:quals,
     description:$('#nj_x').value.trim(),
     imageUrl:im.url||(isTV?'assets/aistudio/image_deca3efe.png':''),
     avatarUrl:isTV?'assets/woman.jpg':'',
     status:'published'
    });
    toast('Job published successfully');
    F.Jobs();
   }catch(er){fail(er);b.classList.remove('ld')}
  };
  rowActs('jobs',a,F.Jobs,JF);
 },
 async Applications(){
  const [a,jobs]=await Promise.all([all('applications'),all('jobs')]);
  v.innerHTML=`<div class="fb" style="padding:0;grid-template-columns:2fr 1fr 1fr 1fr auto">
   <input class="in2" id="aq" placeholder="Search applicant name, email, phone…">
   <select class="in2" id="aj"><option value="">All Jobs</option>${jobs.map(j=>`<option value="${esc(j.title)}">${esc(j.title)}</option>`).join('')}</select>
   <select class="in2" id="ap1"></select>
   <select class="in2" id="as"></select>
   <button class="btn3" id="ex">Export CSV</button>
  </div>
  <p style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:10px 0"><span class="meta">From</span><input type="date" class="in2" id="af"><span class="meta">To</span><input type="date" class="in2" id="ato"></p>
  <div id="at"></div>`;
  fill($('#ap1'),CATS,'All professions');fill($('#as'),AST,'All statuses');let cur=[];
  const det=x=>{
   const cleanPh=tel(x.phone).replace('+','');
   const m=modal(`<h2>Applicant: ${esc(x.name)}</h2>
   <p class="meta" style="font-size:16px;font-weight:700">${esc(x.jobTitle)} · <b>${esc(x.companyName)}</b></p>
   <div style="background:var(--soft);border-radius:18px;padding:18px;margin:14px 0;display:grid;gap:10px">
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
     <div><b>Email:</b> <a style="color:#f26a1b;font-weight:750" href="mailto:${esc(x.email)}">${esc(x.email)}</a></div>
     <div><b>Phone:</b> <a style="color:#0b224d;font-weight:750" href="tel:${esc(x.phone)}">${esc(x.phone)}</a></div>
     ${cleanPh?`<a class="btn-wa" target="_blank" href="https://wa.me/${cleanPh}?text=Hello%20${encodeURIComponent(x.name)},%20we%20have%20received%20your%20application%20for%20${encodeURIComponent(x.jobTitle)}%20at%20Ten%20Ventures%20Africa." style="padding:8px 14px;border-radius:10px;font-size:13px"><i><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.677.15-.2.299-.777.979-.953 1.179-.175.199-.35.225-.651.075s-1.271-.469-2.42-1.494c-.894-.797-1.498-1.782-1.674-2.081-.175-.3-.019-.462.132-.611.136-.134.301-.35.451-.525.15-.175.2-.299.301-.499.1-.2.05-.374-.025-.524-.075-.15-.677-1.633-.927-2.235-.244-.587-.492-.507-.677-.517-.175-.009-.376-.01-.576-.01s-.527.075-.802.374c-.276.299-1.053 1.029-1.053 2.509 0 1.48 1.078 2.91 1.228 3.109.15.2 2.122 3.24 5.141 4.542.718.309 1.279.494 1.716.633.722.229 1.378.197 1.897.12.579-.087 1.78-.728 2.031-1.431.251-.703.251-1.306.176-1.431-.076-.125-.276-.2-.577-.35zm-5.441 7.427c-1.921 0-3.805-.515-5.46-1.492l-.392-.232-4.057 1.064 1.083-3.954-.254-.405c-1.072-1.706-1.639-3.684-1.638-5.714.002-5.992 4.878-10.867 10.867 10.867 2.903.001 5.632 1.132 7.684 3.185 2.052 2.053 3.181 4.783 3.18 7.687-.003 5.993-4.879 10.868-10.874 10.868zm9.243-16.927c-2.467-2.47-5.748-3.83-9.242-3.831-7.185 0-13.032 5.846-13.035 13.033 0 2.298.599 4.54 1.737 6.514l-1.847 6.746 6.902-1.81c1.905 1.039 4.062 1.587 6.241 1.588h.005c7.184 0 13.032-5.846 13.036-13.033 0-3.483-1.357-6.756-3.824-9.227z"/></svg></i><span>WhatsApp Applicant</span></a>`:''}
    </div>
    <div><b>Profession:</b> ${esc(x.profession||'—')} · <b>Experience:</b> ${esc(x.exp||0)} yr(s) · <b>Applied:</b> ${fd(x.createdAt)}</div>
   </div>
   <p style="margin:12px 0"><b>Status:</b> ${stSel(x.id,x.status||'New',AST)}</p>
   ${x.cover?`<div style="margin:14px 0"><b style="display:block;margin-bottom:6px">Cover Letter / Notes:</b><p class="pre" style="font-size:15px;line-height:1.6;background:#fff;border:1px solid var(--bd);padding:14px;border-radius:12px">${esc(x.cover)}</p></div>`:''}
   <div style="margin-top:18px;display:flex;gap:12px;flex-wrap:wrap">
    ${x.cvUrl?`<a class="btn3" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px" download="${esc(x.cvName||'CV.pdf')}" href="${x.cvUrl}"><span>⬇ Download CV (${esc(x.cvName||'Document')})</span></a>`:'<span class="meta">No CV attached</span>'}
    ${x.docUrl?`<a class="btn3 o" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px" download="${esc(x.docName||'CoverDoc.pdf')}" href="${x.docUrl}"><span>📎 Extra Document (${esc(x.docName||'File')})</span></a>`:''}
   </div>`);
   $('select[data-st]',m).onchange=async e=>{try{await api.upd('applications',x.id,{status:e.target.value});x.status=e.target.value;toast('Status updated');d()}catch(er){toast(fe(er))}};
  };
  const d=()=>{
   const k=$('#aq').value.toLowerCase(),f=$('#af').value?Date.parse($('#af').value):0,t=$('#ato').value?Date.parse($('#ato').value)+864e5:0;
   cur=a.filter(x=>(!$('#ap1').value||x.profession==$('#ap1').value)&&(!$('#aj').value||x.jobTitle==$('#aj').value)&&(!$('#as').value||(x.status||'New')==$('#as').value)&&(!f||x.createdAt>=f)&&(!t||x.createdAt<=t)&&(x.name+x.email+x.phone+(x.jobTitle||'')+(x.companyName||'')).toLowerCase().includes(k));
   $('#at').innerHTML=`<p class="meta" style="margin-bottom:10px;font-size:15px;font-weight:750">${cur.length} Applicant(s) Recorded</p>`+table([
    ['Applicant',x=>`<b>${esc(x.name)}</b><br><span class="meta">${esc(x.email)} · ${esc(x.phone)}</span>`],
    ['Job Applied',x=>`<b>${esc(x.jobTitle)}</b><br><span class="meta">${esc(x.companyName)}</span>`],
    ['Profession',x=>esc(x.profession||'—')],
    ['Date',x=>fd(x.createdAt)],
    ['Status',x=>stSel(x.id,x.status||'New',AST)],
    ['Files',x=>(x.cvUrl?`<a class="btn3 sm" style="text-decoration:none;margin-right:4px" download="${esc(x.cvName||'CV')}" href="${x.cvUrl}">CV</a>`:'')+
            (x.docUrl?`<a class="btn3 o sm" style="text-decoration:none" download="${esc(x.docName||'Doc')}" href="${x.docUrl}">Doc</a>`:'')],
    ['',x=>bt('d',x.id,'Review Details')]
   ],cur);
   stBind('applications',a);
   $$('[data-d]',v).forEach(b=>b.onclick=()=>det(a.find(x=>x.id==b.dataset.d)));
  };
  ['aq','ap1','aj','as','af','ato'].forEach(i=>$('#'+i).oninput=d);d();
  $('#ex').onclick=()=>csv('applicants.csv',[['Name','Email','Phone','Profession','Job','Company','Experience','Status','Date'],...cur.map(x=>[x.name,x.email,x.phone,x.profession,x.jobTitle,x.companyName,x.exp,x.status||'New',fd(x.createdAt)])]);
 },
 async 'Talent Pool'(){await renderTalentPool(v,true)},
 async Trainings(){const [a,bk]=await Promise.all([all('trainings'),all('bookings')]);v.innerHTML=`<div class="msg" id="mg"></div><div class="fg">${inp('tt','Training title','text',1)}${sel('tc','Category',TC)}${inp('td','Date','date',1)}${inp('tm','Time','time')}${inp('tl','Location','text',1)}${sel('tmd','Mode',['Offline','Online'])}${inp('tr','Trainer')}${inp('tf','Fee (TZS)','number')}${inp('ts','Seats','number')}${inp('te','Hide announcement after','date')}${inp('tct','Button text (optional)')}${inp('tcu','Button link (optional)')}${txa('tx','Description',1)}${dz('tim','Training image')}</div><p style="margin:14px 0 24px"><button class="btn3" id="pt">Publish training</button></p>`+table([['Training',t=>`<b>${esc(t.title)}</b>${t.full?' <span class="chip">Full</span>':''}<br><span class="meta">${fd(t.date)} · ${esc(t.location)}${t.seats?' · '+t.seats+' seats left':''}</span>`],['Status',t=>`<span class="chip">${t.status=='hidden'?'hidden':'live'}</span>`],['Bookings',t=>bt('b',t.id,bk.filter(b=>b.trainingId==t.id).length+' view')],['',t=>bt('t',t.id,t.status=='hidden'?'Show':'Hide')+' '+bt('e',t.id,'Edit')+' '+bt('del',t.id,'Delete')]],a);
  $('#pt').onclick=async e=>{if(!val(v))return;const b=e.target;b.classList.add('ld');try{const im=await prep($('#tim').files[0],{max:1000,q:.74}),ex=$('#te').value;await api.add('trainings',{title:$('#tt').value.trim(),category:$('#tc').value,date:Date.parse($('#td').value),time:$('#tm').value,location:$('#tl').value.trim(),mode:$('#tmd').value,trainer:$('#tr').value,fee:Number($('#tf').value)||0,seats:Number($('#ts').value)||0,expires:ex?Date.parse(ex):0,ctaText:$('#tct').value.trim(),ctaUrl:$('#tcu').value.trim(),description:$('#tx').value,imageUrl:im.url,status:'published'});toast('Training published');F.Trainings()}catch(er){fail(er);b.classList.remove('ld')}};
  $$('button[data-b]',v).forEach(b=>b.onclick=()=>{const t=a.find(x=>x.id==b.dataset.b),l=bk.filter(x=>x.trainingId==t.id),m=modal(`<h2>Bookings: ${esc(t.title)}</h2><p style="margin:10px 0"><button class="btn3 o sm" id="bx">Export CSV</button></p>`+table([['Name',x=>`<b>${esc(x.name)}</b><br><span class="meta">${esc(x.email)}</span>`],['Phone',x=>esc(x.phone)],['Company',x=>esc(x.company||'')],['People',x=>esc(x.participants)],['Date',x=>fd(x.createdAt)],['Status',x=>esc(x.status||'Pending')]],l));$('#bx',m).onclick=()=>csv('bookings.csv',[['Full Name','Phone','Email','Company','Profession','Training','Booking Date','Participants','Status'],...l.map(x=>[x.name,x.phone,x.email,x.company,x.profession,x.trainingTitle,fd(x.createdAt),x.participants,x.status])])});rowActs('trainings',a,F.Trainings,TF)},
 async Bookings(){const a=await all('bookings');v.innerHTML=`<div class="fb" style="padding:0;grid-template-columns:2fr 1fr 1fr auto"><input class="in2" id="bq" placeholder="Search name, email, phone…"><select class="in2" id="bt"></select><select class="in2" id="bs"></select><button class="btn3" id="bx">Export CSV</button></div><div id="bl" style="margin-top:12px"></div>`;fill($('#bt'),a.map(x=>x.trainingTitle),'All trainings');fill($('#bs'),BST,'All statuses');let cur=[];
  const d=()=>{const k=$('#bq').value.toLowerCase();cur=a.filter(x=>(!$('#bt').value||x.trainingTitle==$('#bt').value)&&(!$('#bs').value||(x.status||'Pending')==$('#bs').value)&&(x.name+x.email+x.phone).toLowerCase().includes(k));$('#bl').innerHTML=`<p class="meta" style="margin-bottom:8px">${cur.length} booking(s)</p>`+table([['Name',x=>`<b>${esc(x.name)}</b><br><span class="meta">${esc(x.email)} · ${esc(x.phone)}</span>`],['Training',x=>esc(x.trainingTitle)+(x.company?'<br><span class="meta">'+esc(x.company)+'</span>':'')],['People',x=>esc(x.participants)],['Date',x=>fd(x.createdAt)],['Status',x=>stSel(x.id,x.status||'Pending',BST)],['',x=>bt('del',x.id,'Delete')]],cur);stBind('bookings',a);act('bookings',F.Bookings)};
  ['bq','bt','bs'].forEach(i=>$('#'+i).oninput=d);d();$('#bx').onclick=()=>csv('bookings.csv',[['Full Name','Phone','Email','Company','Profession','Training','Booking Date','Participants','Status'],...cur.map(x=>[x.name,x.phone,x.email,x.company,x.profession,x.trainingTitle,fd(x.createdAt),x.participants,x.status||'Pending'])])},
 async News(){const a=await all('news');v.innerHTML=`<div class="msg" id="mg"></div><div class="fg">${inp('nt','Title','text',1)}${sel('nc','Category',NC)}${inp('ne','Hide announcement after','date')}${inp('nct','Button text (optional, defaults to Learn more)')}${inp('ncu','Button link (optional, e.g. https://... or website URL)')}${txa('nb','Text',1)}${dz('nim','News image (optional)')}</div><p style="margin:14px 0 24px"><button class="btn3" id="pn">Publish news</button></p>`+table([['Title',n=>`<b>${esc(n.title)}</b><br><span class="meta">${esc(n.category)} · ${fd(n.createdAt)}${n.ctaUrl?` · <a href="${esc(normUrl(n.ctaUrl))}" target="_blank" rel="noopener noreferrer" style="color:#f26a1b;font-weight:750">${esc(n.ctaText||'Learn more')} ↗</a>`:''}</span>`],['Status',n=>`<span class="chip">${n.status=='hidden'?'hidden':'live'}</span>`],['',n=>bt('t',n.id,n.status=='hidden'?'Show':'Hide')+' '+bt('e',n.id,'Edit')+' '+bt('del',n.id,'Delete')]],a);
  $('#pn').onclick=async e=>{if(!val(v))return;const b=e.target;b.classList.add('ld');try{const im=await prep($('#nim').files[0],{max:1000,q:.74}),ex=$('#ne').value;await api.add('news',{title:$('#nt').value.trim(),category:$('#nc').value,body:$('#nb').value,expires:ex?Date.parse(ex):0,ctaText:$('#nct').value.trim()||'Learn more',ctaUrl:normUrl($('#ncu').value.trim()),imageUrl:im.url,status:'published'});toast('News published');F.News()}catch(er){fail(er);b.classList.remove('ld')}};rowActs('news',a,F.News,NF)},
 async Messages(){const a=await all('messages');v.innerHTML=table([['From',m=>`${m.read?'':'<span style="color:#f26a1b">● </span>'}<b>${esc(m.name)}</b>${m.uid?' <span class="chip">Member</span>':''}<br><span class="meta">${esc(m.email)}${m.phone?' · '+esc(m.phone):''}</span>`],['Message',m=>`${m.service?`<span class="chip">${esc(m.service)}</span><br>`:''}<span class="pre">${esc(m.message)}</span>`],['Date',m=>fd(m.createdAt)],['',m=>`<a class="btn3 o sm" style="text-decoration:none" href="mailto:${esc(m.email)}?subject=Re: Ten Ventures Africa">Reply</a> ${bt('r',m.id,m.read?'Unread':'Mark read')} ${bt('del',m.id,'Delete')}`]],a);
  $$('[data-r]',v).forEach(b=>b.onclick=async()=>{const m=a.find(x=>x.id==b.dataset.r);await api.upd('messages',m.id,{read:!m.read});F.Messages()});act('messages',F.Messages)},
 async 'Pop-up ads'(){const [a,tr]=await Promise.all([all('ads'),all('trainings')]);v.innerHTML=`<div class="msg" id="mg"></div><p class="meta" style="margin-bottom:12px">Visitors see one live ad as a pop-up when they open the site. Link an ad to a training so visitors can book straight from it.</p><div class="fg">${inp('pt1','Ad title','text',1)}<div class="fl s"><select id="ptr"><option value="">No training (general ad)</option>${tr.map(t=>`<option value="${t.id}">${esc(t.title)}</option>`).join('')}</select><label for="ptr">Link to training</label></div>${inp('pc1','Button text (general ads)')}${inp('pu1','Button link (general ads)')}${inp('pe1','Hide after','date')}${txa('pb1','Text',1)}${dz('pim','Ad image (optional)')}</div><p style="margin:14px 0 24px"><button class="btn3" id="pa1">Publish ad</button></p>`+table([['Ad',x=>`<b>${esc(x.title)}</b><br><span class="meta">${x.trainingId?'Training booking':'General'}${x.expires?' · until '+fd(x.expires):''}</span>`],['Status',x=>`<span class="chip">${x.status=='hidden'?'hidden':'live'}</span>`],['',x=>bt('t',x.id,x.status=='hidden'?'Show':'Hide')+' '+bt('e',x.id,'Edit')+' '+bt('del',x.id,'Delete')]],a);
  $('#pa1').onclick=async e=>{if(!val(v))return;const b=e.target;b.classList.add('ld');try{const im=await prep($('#pim').files[0],{max:900,q:.74}),ex=$('#pe1').value;await api.add('ads',{title:$('#pt1').value.trim(),body:$('#pb1').value,trainingId:$('#ptr').value,ctaText:$('#pc1').value.trim(),ctaUrl:$('#pu1').value.trim(),expires:ex?Date.parse(ex):0,imageUrl:im.url,status:'published'});toast('Ad published');F['Pop-up ads']()}catch(er){fail(er);b.classList.remove('ld')}};rowActs('ads',a,F['Pop-up ads'],AF)},
 async Users(){const a=await all('users');v.innerHTML=table([['Name',x=>esc(x.name)],['Email',x=>esc(x.email)],['Type',x=>`<span class="chip">${esc(x.role)}</span>`],['Joined',x=>fd(x.createdAt)]],a)},
 async Admins(){const a=await all('adminEmails');v.innerHTML=`<div class="msg" id="mg"></div><p class="meta" style="margin-bottom:12px">Add a new administrator. They sign in on the normal Sign in page with this email and password.</p><div class="fg">${inp('an1','Full name','text',1)}${inp('ae1','Email','email',1)}${inp('ap2','Password (min 6)','password',1)}</div><p style="margin:14px 0 24px"><button class="btn3" id="aa">Add admin</button></p>`+table([['Admin',x=>`<b>${esc(x.name||'')}</b><br><span class="meta">${esc(x.email)}</span>`],['Role',x=>x.owner?'CEO / owner':'Admin'],['',x=>x.owner?'':`<button class="btn3 o sm" data-del="${esc(x.id)}">Remove</button>`]],[...CEO.map(e=>({id:e,email:e,name:'CEO',owner:1})),...a.filter(x=>!CEO.includes(x.id))]);
  $('#aa').onclick=async e=>{if(!val(v))return;if($('#ap2').value.length<6){fail(new Error('Password must be at least 6 characters.'));return}const b=e.target;b.classList.add('ld');try{await api.mkAdmin($('#ae1').value.trim(),$('#ap2').value,$('#an1').value.trim());toast('Admin added');F.Admins()}catch(er){fail(er);b.classList.remove('ld')}};act('adminEmails',F.Admins)},
 async 'My account'(){v.innerHTML=`<div class="msg" id="mg"></div><h3 style="margin-bottom:10px">Profile</h3><div id="s1"><div class="fg">${inp('mn','Display name','text',1)}</div></div><p style="margin:14px 0 26px"><button class="btn3" id="sn">Save name</button> <span class="meta">${esc(u.email)}</span></p><h3 style="margin-bottom:10px">Change password</h3><div id="s2"><div class="fg">${inp('po','Current password','password',1)}${inp('pn','New password (min 6)','password',1)}${inp('pc','Confirm new password','password',1)}</div></div><p style="margin-top:14px"><button class="btn3" id="sp">Change password</button></p><h3 style="margin:26px 0 10px">Change login email</h3><div id="s3"><div class="fg">${inp('ne2','New email','email',1)}${inp('pw2','Current password','password',1)}</div></div><p class="meta" style="margin-top:8px">A confirmation link is sent to the new email. Click it, then sign in with the new email.</p><p style="margin-top:12px"><button class="btn3" id="sm">Change email</button></p>`;$('#mn').value=u.name||'';
  $('#sn').onclick=async()=>{if(!val($('#s1')))return;try{await api.profile($('#mn').value.trim());toast('Name saved')}catch(er){fail(er)}};
  $('#sp').onclick=async()=>{if(!val($('#s2')))return;if($('#pn').value.length<6)return fail(new Error('Password must be at least 6 characters.'));if($('#pn').value!=$('#pc').value)return fail(new Error('Passwords do not match.'));try{await api.pass($('#po').value,$('#pn').value);toast('Password changed');F['My account']()}catch(er){fail(er)}};
  $('#sm').onclick=async()=>{if(!val($('#s3')))return;try{await api.changeEmail($('#pw2').value,$('#ne2').value.trim());toast('Confirmation link sent to the new email')}catch(er){fail(er)}}}};
 $$('#tb button').forEach((b,i)=>b.onclick=()=>{$$('#tb button').forEach(x=>x.classList.toggle('on',x==b));F[T[i]]().catch(e=>v.innerHTML=hint(e))});F.Overview().catch(e=>v.innerHTML=hint(e));if(sessionStorage.tv_first)first()})}
const P={careers,company,trainings,news,account,dashboard,admin}[document.body.dataset.page];P&&P();
if(demo){const b=document.createElement('div');b.style.cssText='position:fixed;left:10px;bottom:10px;z-index:200;background:#f26a1b;color:#fff;font:600 11px Inter;padding:5px 10px;border-radius:99px';b.textContent='DEMO MODE · data stays in this browser';document.body.appendChild(b)}
export{bookForm,ready,modal,esc,fd};
