/* Vernyuy Clinic: polish layer. Every tween here answers a question: where am I, what changed, what next? */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const g=G,ok=!!(G&&!RM);

/* Skip link */
document.addEventListener('click',e=>{if(e.target.closest('[data-skip]')){e.preventDefault();const m=$('#main');m.focus({preventScroll:true});m.scrollIntoView()}});

/* Hero headline: masked word rise (sets the tone, once per home visit) */
const h1=$('#h1h');
if(h1){const t=h1.textContent.trim();h1.setAttribute('aria-label',t);if(ok){h1.innerHTML=t.split(' ').map(w=>`<span class="w" aria-hidden="true"><span class="wi">${w}</span></span>`).join(' ');g.set('#h1h .wi',{yPercent:115})}}
const heroWords=()=>{if(ok&&h1)g.fromTo('#h1h .wi',{yPercent:115},{yPercent:0,duration:.95,stagger:.07,ease:'power4.out',delay:.05})};

/* Mobile booking bar: appears once the hero is behind you, the moment intent is highest */
const mb=document.createElement('a');mb.className='btn mbar';mb.href='appointment.html';mb.textContent='Book an appointment';document.body.appendChild(mb);
let mbOn=false,mbHide=false;if(ok)g.set(mb,{yPercent:160});else mb.classList.add('css');
const mbSync=()=>{const w=!mbHide&&scrollY>480;if(w===mbOn)return;mbOn=w;mb.tabIndex=w?0:-1;mb.setAttribute('aria-hidden',!w);ok?g.to(mb,{yPercent:w?0:160,duration:.5,ease:'power3.out',overwrite:true}):mb.classList.toggle('in',w)};
addEventListener('scroll',mbSync,{passive:true});mb.tabIndex=-1;mb.setAttribute('aria-hidden','true');

/* Admin: charts and totals draw in so the numbers read as data, not decoration */
const adminFx=()=>{if(!ok)return;
 $$('#apanel .kpi b').forEach(b=>{const n=+b.textContent;if(isNaN(n))return;const o={v:0};g.to(o,{v:n,duration:1,ease:'power2.out',onUpdate:()=>{b.textContent=Math.round(o.v)}})});
 g.from('#apanel .bars i',{scaleY:0,duration:.8,stagger:.06,ease:'power3.out'});
 g.from('#apanel .hb i',{scaleX:0,duration:.8,stagger:.05,ease:'power3.out'});
 g.from('#apanel .ac,#apanel .kpi>div',{y:14,opacity:0,duration:.5,stagger:.05,ease:'power2.out',clearProps:'all'})};
const ap=$('#apanel');if(ap)new MutationObserver(()=>requestAnimationFrame(adminFx)).observe(ap,{childList:true});

/* Filtering feedback: when chips change the list, results settle in rather than snap */
['#allDocs','#rList','#faqAll'].forEach(s=>{const el=$(s);if(!el)return;new MutationObserver(()=>{if(!ok||(document.activeElement&&document.activeElement.type==='search'))return;if(el.closest('.view.show'))g.from(el.children,{y:12,opacity:0,duration:.4,stagger:.05,ease:'power2.out',clearProps:'all'})}).observe(el,{childList:true})});

/* Accordions: height eases open and shut (native details just snaps) */
document.addEventListener('click',e=>{const s=e.target.closest('.svc summary');if(!s||!ok)return;e.preventDefault();const d=s.parentNode;if(d._t)d._t.kill();
 const cs=getComputedStyle(d),pad=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom)+parseFloat(cs.borderBottomWidth),h0=d.offsetHeight;
 if(!d.open){d.open=true;d._t=g.fromTo(d,{height:h0},{height:d.scrollHeight+1,duration:.5,ease:'power3.out',clearProps:'height'})}
 else{d.dataset.s='closing';d._t=g.to(d,{height:s.offsetHeight+pad,duration:.38,ease:'power2.inOut',onComplete:()=>{d.open=false;delete d.dataset.s;g.set(d,{clearProps:'height'})}})}});

/* Forms: errors say where, not just that. Shake + focus the first problem, announce the rest */
['af','cf'].forEach(id=>{const f=$('#'+id);if(!f)return;
 f.querySelectorAll('.err').forEach(e=>e.setAttribute('aria-live','polite'));
 f.addEventListener('submit',()=>{const errs=[...f.querySelectorAll('.err')].filter(e=>e.textContent);
  f.querySelectorAll('[data-for]').forEach(e=>{const i=$('#'+e.dataset.for);if(i)i.setAttribute('aria-invalid',!!e.textContent)});
  if(!errs.length)return;const first=$('#'+errs[0].dataset.for);first.focus();
  if(ok){g.from(errs,{y:-6,opacity:0,duration:.35,stagger:.06,ease:'power2.out'});g.fromTo(first,{x:-7},{x:0,duration:.6,ease:'elastic.out(1,.25)'})}});
 f.addEventListener('input',e=>{const er=f.querySelector(`[data-for="${e.target.id}"]`);if(er&&er.textContent){er.textContent='';e.target.removeAttribute('aria-invalid')}})});

/* Appointment form: only offer doctors from the chosen department */
const dp=$('#dp'),pd=$('#pd');
if(dp&&pd)dp.addEventListener('change',()=>{[...pd.options].forEach(o=>{if(!o.value)return;const d=DOCS.find(x=>x[0]===o.value);o.hidden=o.disabled=!!dp.value&&d[1]!==dp.value});if(pd.selectedOptions[0]&&pd.selectedOptions[0].disabled)pd.value=''});
/* Arriving from a doctor or department page: pre-select them (?doctor=2 or ?dept=Pediatrics) */
if(dp&&pd){const qp=new URLSearchParams(location.search),di=qp.get('doctor'),dn=qp.get('dept'),doc=di!==null?DOCS[+di]:null;
 if(doc)dp.value=doc[1];else if(dn){const o=[...dp.options].find(o=>o.value===dn);if(o)dp.value=o.value}
 dp.dispatchEvent(new Event('change'));if(doc)pd.value=doc[0]}

/* Per-page hooks: active nav state and title are in the HTML; here we only start page motion and hide the mobile bar where it would be redundant */
const page=document.body.dataset.page;
if(page==='home')heroWords();
if(page==='admin')adminFx();
mbHide=page==='appointment'||page==='admin';mbSync();
})();
