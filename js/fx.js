/* Vernyuy Clinic: motion layer (GSAP + ScrollTrigger).
   Ambient loops: drifting blobs, radar ring, bobbing badges, heartbeat logo, ECG pulse line,
   department marquee, rising crosses in the call-to-action, button shine, slow hero zoom.
   One-shot / interactive: headline word-rise on every h2, image parallax, 3D card tilt.
   Everything is skipped when the visitor prefers reduced motion; all loops pause when off-screen. */
(function(){
const g=window.gsap,ST=window.ScrollTrigger;
if(!g||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
if(ST)g.registerPlugin(ST);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const page=document.body.dataset.page,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const el=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e};
const rnd=(a,b)=>a+Math.random()*(b-a);

/* Pause a looping tween/timeline while its trigger is off-screen (saves battery on phones). */
function whileVisible(trigger,tw){
  if(!ST||!trigger)return tw;
  ST.create({trigger,start:'top bottom',end:'bottom top',onToggle:s=>s.isActive?tw.resume():tw.pause()});
  return tw;
}

/* 1. Drifting colour blobs behind a section: slow, never-repeating-looking wander */
function blobs(host,specs){
  host.classList.add('fx-host');
  specs.forEach(([c,size,x,y])=>{
    const b=el('i','fx-blob');b.setAttribute('aria-hidden','true');
    Object.assign(b.style,{width:size+'px',height:size+'px',left:x,top:y,background:`radial-gradient(circle at 50% 50%,${c},transparent 68%)`});
    host.prepend(b);
    const tl=g.timeline({repeat:-1,yoyo:true,defaults:{ease:'sine.inOut'}});
    tl.to(b,{x:rnd(-60,60),y:rnd(-50,50),scale:rnd(.85,1.25),duration:rnd(6,9)})
      .to(b,{x:rnd(-60,60),y:rnd(-50,50),scale:rnd(.85,1.25),duration:rnd(6,9)});
    whileVisible(host,tl);
  });
}

/* 2. Hero extras (home) */
function hero(){
  const hero=$('.hero'),ph=$('#ph');if(!hero||!ph)return;
  blobs(hero,[['var(--sky)',420,'-6%','-8%'],['var(--sage)',340,'56%','30%'],['var(--mint)',300,'30%','-18%']]);

  // wrap the photo so badges and the radar ring can be positioned against it
  const wrap=el('div','fx-photo');ph.parentNode.insertBefore(wrap,ph);wrap.appendChild(ph);
  const ring=el('i','fx-ring');ring.setAttribute('aria-hidden','true');wrap.prepend(ring);
  const ring2=ring.cloneNode();wrap.prepend(ring2);
  const rt=g.timeline({repeat:-1});
  [ring,ring2].forEach((r,i)=>rt.fromTo(r,{scale:.96,opacity:.5},{scale:1.22,opacity:0,duration:3.2,ease:'power1.out'},i*1.6));
  whileVisible(hero,rt);

  const badges=[
    el('div','fx-badge b1','<span class="dot"></span>Care for every age'),
    el('div','fx-badge b2','<b>+</b>Family-friendly clinic')
  ];
  badges.forEach(b=>{b.setAttribute('aria-hidden','true');wrap.appendChild(b)});
  g.from(badges,{scale:0,opacity:0,duration:.7,ease:'back.out(2.2)',stagger:.25,delay:1.2});
  badges.forEach((b,i)=>whileVisible(hero,g.to(b,{y:i?10:-12,x:i?-6:6,rotate:i?-1.5:1.5,duration:rnd(2.6,3.4),ease:'sine.inOut',repeat:-1,yoyo:true,delay:i*.6})));

  // slow "breathing" zoom if a real photo has been added
  const zoom=img=>whileVisible(hero,g.fromTo(img,{scale:1},{scale:1.08,duration:14,ease:'sine.inOut',repeat:-1,yoyo:true}));
  const hi=ph.querySelector('.ph-img');if(hi)zoom(hi);else new MutationObserver((m,o)=>{const i=ph.querySelector('.ph-img');if(i){o.disconnect();zoom(i)}}).observe(ph,{childList:true});

  // ECG strip + department marquee under the hero
  const anchor=hero.nextElementSibling&&hero.nextElementSibling.classList.contains('note')?hero.nextElementSibling:hero;
  const ecg=el('div','fx-ecg',`<svg viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true"><path class="base" pathLength="1000" d="M0 40H180l14-4 12 4h40l10 6 10-6h30l8-4 6 4h40l12 8 14-52 18 66 10-22h56l12-6 12 6h60l12-4 12 4H1000"/><path class="beat" pathLength="1000" d="M0 40H180l14-4 12 4h40l10 6 10-6h30l8-4 6 4h40l12 8 14-52 18 66 10-22h56l12-6 12 6h60l12-4 12 4H1000"/></svg>`);
  anchor.after(ecg);
  const beat=ecg.querySelector('.beat');
  g.set(beat,{strokeDasharray:'160 840',strokeDashoffset:160});
  whileVisible(ecg,g.to(beat,{strokeDashoffset:-840,duration:2.8,ease:'none',repeat:-1}));

  const D=(()=>{try{return eval('DEPTS')}catch(e){return null}})();
  if(D){
    const items=D.map(d=>`<span>${d[0]}</span><b>+</b>`).join('');
    const m=el('div','fx-marq');m.setAttribute('aria-hidden','true');
    m.innerHTML=`<div class="track"><div>${items}</div><div>${items}</div></div>`;
    ecg.after(m);
    const track=m.firstChild,mt=g.to(track,{xPercent:-50,duration:34,ease:'none',repeat:-1});
    whileVisible(m,mt);
    if(fine){m.addEventListener('pointerenter',()=>g.to(mt,{timeScale:.2,duration:.6}));m.addEventListener('pointerleave',()=>g.to(mt,{timeScale:1,duration:.6}))}
  }
}

/* 3. Heartbeat on the logo mark: lub-dub, pause, repeat */
function logo(){
  const i=$('.logo i');if(!i)return;
  g.timeline({repeat:-1,repeatDelay:2.6,delay:2})
   .to(i,{scale:1.22,duration:.14,ease:'power2.out'}).to(i,{scale:1,duration:.16,ease:'power2.in'})
   .to(i,{scale:1.14,duration:.12,ease:'power2.out'}).to(i,{scale:1,duration:.3,ease:'elastic.out(1,.4)'});
}

/* 4. Call-to-action: rising crosses + drifting orbs + button shine */
function cta(){
  $$('.cta').forEach(c=>{
    c.classList.add('fx-cta');
    const tl=g.timeline();
    for(let n=0;n<9;n++){
      const p=el('i','fx-plus','+'),d=rnd(6,10);p.setAttribute('aria-hidden','true');
      Object.assign(p.style,{left:rnd(3,95)+'%',fontSize:rnd(14,34)+'px'});c.prepend(p);
      tl.add(g.timeline({repeat:-1,delay:rnd(0,6)})
        .fromTo(p,{y:()=>c.offsetHeight+30,rotate:rnd(-40,40)},{y:-60,rotate:rnd(-90,90),duration:d,ease:'none'},0)
        .fromTo(p,{opacity:0},{opacity:.35,duration:d*.2,ease:'none'},0)
        .to(p,{opacity:0,duration:d*.2,ease:'none'},d*.8),0);
    }
    whileVisible(c,tl);
  });
  $$('.hero .btn:not(.ghost),.cta .btn').forEach((b,i)=>{
    b.classList.add('fx-shine');const s=el('span','shine');s.setAttribute('aria-hidden','true');b.appendChild(s);
    whileVisible(b,g.fromTo(s,{xPercent:-160},{xPercent:260,duration:1.1,ease:'power2.inOut',repeat:-1,repeatDelay:3.2,delay:1.5+i*.5}));
  });
}

/* 5. Section headings: words rise out of a mask as they scroll into view */
function headings(){
  if(!ST||page==='admin')return;
  $$('main h2').forEach(h=>{
    if(h.childElementCount||h.closest('.fx-done')||h.dataset.fx)return;
    h.dataset.fx=1;const t=h.textContent.trim();if(!t)return;
    h.setAttribute('aria-label',t);
    h.innerHTML=t.split(' ').map(w=>`<span class="w" aria-hidden="true"><span class="wi">${w}</span></span>`).join(' ');
    g.set(h.querySelectorAll('.wi'),{yPercent:115});
    ST.create({trigger:h,start:'top 88%',once:true,onEnter:()=>g.to(h.querySelectorAll('.wi'),{yPercent:0,duration:.85,stagger:.06,ease:'power4.out'})});
  });
}

/* 6. Photos (added later by images.js): reveal + gentle parallax */
function photos(){
  const seen=new WeakSet();
  const go=img=>{
    if(seen.has(img))return;seen.add(img);
    const host=img.parentElement;
    g.fromTo(img,{scale:1.18,opacity:0},{scale:1.04,opacity:1,duration:1.1,ease:'power3.out'});
    if(ST&&!host.matches('.hero .photo,.fx-photo *'))
      g.fromTo(img,{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:host,start:'top bottom',end:'bottom top',scrub:.6}});
  };
  document.addEventListener('load',e=>{const t=e.target;if(t&&t.matches&&t.matches('img.ph-img'))go(t)},true);
  $$('img.ph-img').forEach(i=>i.complete&&go(i));
}

/* 7. 3D tilt that follows the pointer on cards (mouse devices only) */
function tilt(){
  if(!fine)return;
  const SEL='.doc,.rc,.tzf,.fam div,.pill3>div';
  const q=new WeakMap();
  const get=c=>{if(!q.has(c)){g.set(c,{transformPerspective:900});q.set(c,{rx:g.quickTo(c,'rotationX',{duration:.5,ease:'power3.out'}),ry:g.quickTo(c,'rotationY',{duration:.5,ease:'power3.out'})})}return q.get(c)};
  document.addEventListener('pointermove',e=>{
    const c=e.target.closest&&e.target.closest(SEL);if(!c||e.pointerType!=='mouse')return;
    const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5,t=get(c);
    t.ry(x*7);t.rx(-y*7);
  });
  document.addEventListener('pointerout',e=>{
    const c=e.target.closest&&e.target.closest(SEL);if(!c||(e.relatedTarget&&c.contains(e.relatedTarget)))return;
    const t=q.get(c);if(t){t.rx(0);t.ry(0)}
  });
}

/* 8. Department letters / initials float gently */
function floaters(){
  $$('.dp:not(.has-img) .ph-txt, .dp:not(.has-img)').slice(0,7).forEach((d,i)=>{
    whileVisible(d,g.to(d,{y:-8,rotate:i%2?2:-2,duration:rnd(2.8,3.8),ease:'sine.inOut',repeat:-1,yoyo:true,delay:i*.2}));
  });
}

logo();cta();headings();photos();tilt();
if(page==='home')hero();
if(page==='departments')floaters();
$$('.chd').forEach(c=>blobs(c,[['var(--sage)',300,'62%','-30%'],['var(--mint)',240,'-4%','40%']]));
window.addEventListener('load',()=>ST&&ST.refresh());
})();
