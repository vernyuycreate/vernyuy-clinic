/* Vernyuy Clinic: light theme by default, with a nav toggle for dark.
   The choice is saved in LocalStorage ("cp-theme") and applied before first paint (see inline script in <head>). */
(function(){
const root=document.documentElement,KEY='cp-theme';
const SUN='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/></svg>';
const MOON='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>';
const meta=document.querySelector('meta[name="theme-color"]');
const cur=()=>root.getAttribute('data-theme')==='dark'?'dark':'light';

const wrap=document.querySelector('.nav .wrap'),nv=document.getElementById('nv');
if(!wrap)return;
const b=document.createElement('button');
b.type='button';b.id='tt';b.className='tt';
(nv?nv.after(b):wrap.appendChild(b));

function paint(){
  const d=cur()==='dark';
  b.innerHTML=d?SUN:MOON;
  b.setAttribute('aria-pressed',d);
  b.setAttribute('aria-label',d?'Switch to light theme':'Switch to dark theme');
  b.title=d?'Light theme':'Dark theme';
  if(meta)meta.content=d?'#101A1A':'#0E4F55';
}
function set(v){
  root.classList.add('tt-anim');
  if(typeof applyTheme==='function')applyTheme(v);            // main.js: sets data-theme and saves it
  else{root.setAttribute('data-theme',v);try{localStorage.setItem(KEY,v)}catch(e){}}
  paint();
  clearTimeout(set.t);set.t=setTimeout(()=>root.classList.remove('tt-anim'),450);
}
b.addEventListener('click',()=>set(cur()==='dark'?'light':'dark'));
/* keep the button right if the theme is changed elsewhere (admin > Settings > Appearance) */
new MutationObserver(paint).observe(root,{attributes:true,attributeFilter:['data-theme']});
paint();
})();
