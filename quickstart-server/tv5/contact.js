import {api,tel} from './fb.js';
const $=s=>document.querySelector(s),fm=$('#fm');
let me=null;
api.onUser(u=>{me=u;if(u){$('#n').value=u.name||u.email;$('#e').value=u.email;$('#n').parentNode.style.display='none';$('#e').parentNode.style.display='none'}});
fm.onsubmit=async e=>{e.preventDefault();let bad=0;fm.querySelectorAll('[data-req]').forEach(i=>{const ok=i.value.trim()&&(i.type!='email'||/^\S+@\S+\.\S+$/.test(i.value));i.parentNode.classList.toggle('err',!ok);if(!ok)bad++});if(bad)return;
 const b=$('.sb',fm);b.classList.add('ld');b.textContent='Sending…';
 try{await api.add('messages',{name:$('#n').value.trim(),email:$('#e').value.trim(),phone:tel($('#p').value),service:$('#s').value.trim(),message:$('#m').value.trim(),uid:me?me.uid:'',read:false});fm.parentNode.classList.add('done')}
 catch(er){b.classList.remove('ld');b.textContent='Send message';const t=$('#toast');if(t){t.textContent='Could not send. Please check your connection and try again.';t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2800)}}};
