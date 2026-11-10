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
style.textContent += `
#planazo-auth-trigger{display:none!important}
#planazo-auth-dialog{align-items:stretch;justify-content:center;padding:0;background:#F7F3EA}
#planazo-auth-panel{width:min(100%,460px);height:100dvh;overflow:auto;box-shadow:none;border-radius:0;background:#F7F3EA;padding:36px 25px 100px;color:#244C43}
#planazo-auth-panel h2{font-family:Georgia,serif;font-size:34px;color:#244C43}
#planazo-auth-panel input{border:0;border-bottom:1px solid #A7B8AD;border-radius:0;background:transparent;padding:12px 0;box-shadow:none;outline-offset:3px;color:#244C43}
#planazo-auth-panel label{color:#244C43}
#planazo-auth-panel .auth-actions button{background:#244C43}
#planazo-auth-panel .auth-actions button.secondary{background:transparent;color:#244C43;border:1px solid #A7B8AD}
#planazo-auth-session{border-top:1px solid #A7B8AD;padding-top:18px}
#planazo-auth-panel .profile-section{border-top:1px solid #D9DDD4;padding:18px 0}
#planazo-auth-panel .profile-section h3{font:700 19px Georgia,serif;margin:0 0 12px;color:#244C43}
#planazo-auth-panel .profile-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #E3E5DC}
#planazo-auth-panel .profile-row span{color:#64786D;font-size:13px}
#planazo-auth-panel .profile-row strong{font-weight:600;overflow-wrap:anywhere;text-align:right}
#planazo-auth-panel .profile-action{border:1px solid #A7B8AD;border-radius:10px;background:#E5F0EA;color:#244C43;padding:11px 14px;font-weight:650;cursor:pointer}
#planazo-auth-panel .profile-section select{width:100%;background:transparent;border:0;border-bottom:1px solid #A7B8AD;color:#244C43;padding:12px 0;font:14px system-ui}
#planazo-auth-panel .profile-note{font-size:12px;color:#64786D;line-height:1.5;margin:10px 0}
#planazo-auth-panel button:focus-visible,#planazo-auth-panel select:focus-visible{outline:2px solid #244C43;outline-offset:2px}

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
<div id="planazo-auth-session" hidden>
<section class="profile-section"><h3>Identidad</h3><div class="profile-row"><span>Nombre</span><strong id="planazo-profile-name">Sin configurar</strong></div><div class="profile-row"><span>Correo</span><strong id="planazo-auth-user"></strong></div><p class="profile-note">La edición del nombre y la foto se habilitará cuando esté definido el perfil compartido de Planazo ID.</p></section>
<section class="profile-section"><h3>Preferencias de Escapada</h3><label for="planazo-profile-language">Idioma</label><select id="planazo-profile-language"><option value="es">Español</option><option value="en">English (próximamente)</option></select><p class="profile-note">Estas preferencias se guardan únicamente en este dispositivo. No modifican otras aplicaciones.</p></section>
<section class="profile-section"><h3>Seguridad</h3><button type="button" id="planazo-profile-reset" class="profile-action">Enviar correo para restablecer contraseña</button><p class="profile-note">Te enviaremos un enlace al correo de tu cuenta.</p></section>
<section class="profile-section"><h3>Sesión</h3><div class="auth-actions"><button type="button" id="planazo-auth-logout" class="secondary">Cerrar sesión</button></div></section>
</div>
<p id="planazo-auth-message" role="status" aria-live="polite"></p>
</div>`;
document.body.append(dialog); // El acceso a Planazo ID vive en Perfil, no en una burbuja flotante.
const $ = id=>document.getElementById(id);
const message=(value,error=false)=>{const el=$('planazo-auth-message');el.textContent=value;el.style.color=error?'#a33b37':'#24518b'};
function render(session){
 const email=session?.user?.email||'';
 const displayName=session?.user?.user_metadata?.full_name||session?.user?.user_metadata?.name||'Sin configurar';
 $('planazo-profile-name').textContent=displayName;
 $('planazo-profile-language').value='es';
 $('planazo-auth-form').hidden=!!email;
 $('planazo-auth-session').hidden=!email;
 $('planazo-auth-user').textContent=email;
 trigger.textContent=email?'Planazo ID · Mi cuenta':'Planazo ID · Ingresar';
 window.dispatchEvent(new CustomEvent('planazo-auth-changed',{detail:{signedIn:!!email,userId:session?.user?.id||null}}));
}
function openProfile(){dialog.classList.add('open');message('');if(!$('planazo-auth-form').hidden)$('planazo-auth-email').focus()}
window.openPlanazoProfile=openProfile;
$('planazo-profile-reset').addEventListener('click',async()=>{
 const {data:{user}}=await supabase.auth.getUser();
 if(!user?.email){message('Iniciá sesión para continuar.',true);return}
 const btn=$('planazo-profile-reset');btn.disabled=true;message('Enviando correo…');
 try{
  const {error}=await supabase.auth.resetPasswordForEmail(user.email,{redirectTo:location.origin+location.pathname});
  if(error)throw error;
  message('Si el servicio de correo está configurado, recibirás un enlace para restablecer tu contraseña.');
 }catch(e){message('No pudimos enviar el correo. Intentá nuevamente.',true)}
 finally{btn.disabled=false}
});
$('planazo-profile-language').addEventListener('change',()=>{message('La traducción al inglés todavía no está disponible.');$('planazo-profile-language').value='es'});
trigger.onclick=openProfile;
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
