// Escapada · Planazo ID (fase 1). Solo clave publicable; nunca usar service_role.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';
const supabase = createClient(
  'https://sswgtcpaayisecwxxskp.supabase.co',
  'sb_publishable_a8hB04TzAhc9NLwrCDtozg_FwVk377j',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);
window.escapadaSupabase = supabase;
const style = document.createElement('style');
style.textContent = `
#planazo-auth-trigger{position:fixed;right:12px;bottom:95px;z-index:21;border:1px solid #c6dedb;border-radius:30px;padding:10px 15px;background:#fffefa;color:#24518b;font:700 13px system-ui;box-shadow:0 4px 16px #17365920;cursor:pointer}
#planazo-auth-dialog{position:fixed;inset:0;z-index:30;background:#112b3a99;display:none;align-items:center;justify-content:center;padding:18px}
#planazo-auth-dialog.open{display:flex}
#planazo-auth-panel{width:min(100%,400px);background:#fffefa;border-radius:18px;padding:23px;box-shadow:0 16px 50px #112b3a40;font:14px system-ui;color:#173659}
#planazo-auth-panel h2{margin:0 0 5px}
#planazo-auth-panel input{width:100%;margin:6px 0 12px}
#planazo-auth-panel button{cursor:pointer}
#planazo-auth-panel .auth-actions{display:flex;gap:9px;margin-top:12px}
#planazo-auth-panel .auth-actions button{flex:1;border:0;border-radius:10px;padding:12px;background:#24518b;color:white;font-weight:700}
#planazo-auth-panel .auth-actions button.secondary{background:#e5f4f1;color:#24518b}
#planazo-auth-message{min-height:20px;font-size:13px;margin-top:10px}
`;
document.head.append(style);
const trigger = document.createElement('button');
trigger.id='planazo-auth-trigger';trigger.type='button';trigger.textContent='Planazo ID · Ingresar';
const dialog = document.createElement('div');
dialog.id='planazo-auth-dialog';
dialog.setAttribute('role','dialog');
dialog.setAttribute('aria-modal','true');
dialog.setAttribute('aria-label','Planazo ID');
dialog.innerHTML=`<div id="planazo-auth-panel">
<div style="display:flex;justify-content:space-between;align-items:center"><h2>Planazo ID</h2><button id="planazo-auth-close" type="button" aria-label="Cerrar" style="border:0;background:none;font-size:25px">×</button></div>
<p style="color:#64778b">Tu cuenta para Escapada y el ecosistema Planazo.</p>
<div id="planazo-auth-form"><form id="planazo-login-form">
<label for="planazo-auth-email">Correo electrónico</label><input id="planazo-auth-email" type="email" autocomplete="username" required>
<label for="planazo-auth-password">Contraseña</label><input id="planazo-auth-password" type="password" autocomplete="current-password" required>
<div class="auth-actions"><button type="submit" id="planazo-auth-submit">Ingresar</button></div></form></div>
<div id="planazo-auth-session" hidden><p id="planazo-auth-user"></p><div class="auth-actions"><button type="button" id="planazo-auth-logout" class="secondary">Cerrar sesión</button></div></div>
<p id="planazo-auth-message" role="status" aria-live="polite"></p>
</div>`;
document.body.append(trigger,dialog);
const $ = id=>document.getElementById(id);
const message=(value,error=false)=>{const el=$('planazo-auth-message');el.textContent=value;el.style.color=error?'#a33b37':'#24518b'};
function render(session){
 const email=session?.user?.email||'';
 $('planazo-auth-form').hidden=!!email;
 $('planazo-auth-session').hidden=!email;
 $('planazo-auth-user').textContent=email?'Sesión iniciada: '+email:'';
 trigger.textContent=email?'Planazo ID · Mi cuenta':'Planazo ID · Ingresar';
 window.dispatchEvent(new CustomEvent('planazo-auth-changed',{detail:{signedIn:!!email,userId:session?.user?.id||null}}));
}
trigger.onclick=()=>{dialog.classList.add('open');message('');if(!$('planazo-auth-form').hidden)$('planazo-auth-email').focus()};
$('planazo-auth-close').onclick=()=>dialog.classList.remove('open');
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.classList.remove('open')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')dialog.classList.remove('open')});
$('planazo-login-form').addEventListener('submit',async e=>{
 e.preventDefault();const button=$('planazo-auth-submit');button.disabled=true;message('Iniciando sesión…');
 try{
  const {error}=await supabase.auth.signInWithPassword({email:$('planazo-auth-email').value.trim(),password:$('planazo-auth-password').value});
  if(error)throw error;
  $('planazo-auth-password').value='';message('Sesión iniciada correctamente.');
 }catch(err){message('No se pudo iniciar sesión. Revisá el correo, la contraseña y la confirmación de email.',true)}
 finally{button.disabled=false}
});
$('planazo-auth-logout').onclick=async()=>{
 const {error}=await supabase.auth.signOut();
 message(error?'No se pudo cerrar sesión.':'Sesión cerrada.',!!error);
};
supabase.auth.onAuthStateChange((_event,session)=>render(session));
supabase.auth.getSession().then(({data,error})=>{if(error)message('No se pudo recuperar la sesión.',true);else render(data.session)}).catch(()=>message('Error de conexión con Planazo ID.',true));
