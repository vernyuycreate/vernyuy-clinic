/* Vernyuy Clinic: automatic photo loader.
   Drop files named as in README.md into assets/images/ and they appear on the next page load.
   Nothing to edit in the code: each placeholder is checked for its matching file and swapped
   for a real <img> when found. Missing files simply leave the illustrated placeholder in place. */
(function(){
const DIR='assets/images/',EXT=['jpg','webp','png','jpeg'];
const cache=new Map();
// Top-level const arrays in main.js are global lexical bindings, reachable by name:
const safe=f=>{try{return f()}catch(e){return null}};

/* Find assets/images/<name>.(jpg|webp|png|jpeg); resolves to {url} or null. Cached per page. */
function probe(name){
  if(cache.has(name))return cache.get(name);
  const p=new Promise(res=>{
    let i=0;
    (function next(){
      if(i>=EXT.length)return res(null);
      const url=DIR+name+'.'+EXT[i++],im=new Image();
      im.onload=()=>res({url});
      im.onerror=next;
      im.src=url;
    })();
  });
  cache.set(name,p);return p;
}

/* Only probe once the element is close to the viewport, so a page never downloads every photo up front. */
const io='IntersectionObserver' in window?new IntersectionObserver((es)=>{
  es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);e.target._load&&e.target._load()}});
},{rootMargin:'400px 0px'}):null;

function wrapText(el){
  [...el.childNodes].forEach(n=>{
    if(n.nodeType===3&&n.textContent.trim()){
      const s=document.createElement('span');s.className='ph-txt';s.setAttribute('aria-hidden','true');
      n.replaceWith(s);s.appendChild(n);
    }
  });
}

function fill(el,name,alt){
  if(!el||!name||el.dataset.img===name)return;
  el.dataset.img=name;
  el._load=()=>probe(name).then(r=>{
    if(!r||!el.isConnected)return;
    wrapText(el);
    let im=el.querySelector(':scope>img.ph-img');
    if(!im){im=document.createElement('img');im.className='ph-img';im.loading='lazy';im.decoding='async';el.prepend(im)}
    im.alt=alt||'';im.src=r.url;
    el.classList.add('has-img');
    if(alt)el.removeAttribute('aria-hidden');
  });
  io?io.observe(el):el._load();
}

const titleToRes=el=>{
  const h=el.closest('.rc,.tzi'),t=h&&h.querySelector('h3'),list=safe(()=>eval('RC'));
  if(!t||!list)return null;
  const k=list.findIndex(r=>r[0]===t.textContent.trim());
  return k<0?null:{name:'resource-'+(k+1),alt:''};
};
const facility={'Reception':'reception','Consultation rooms':'consultation','Pediatric area':'pediatric','Laboratory':'laboratory','Waiting area':'waiting','Treatment rooms':'treatment'};
const deptFile={'d-womens':'dept-womens-health'};
const famFiles=['family-children','family-adults','family-women','family-older-adults'];
const ageFiles=['infants','toddlers','preschool','school-age','adolescents'];

/* selector -> (element, index) => {name, alt} */
const RULES=[
  ['.hero .photo',()=>({name:'hero-family-care',alt:'A doctor with a child and parent at Vernyuy Clinic'})],
  ['.doc .pt',el=>{
    const a=el.closest('.doc').querySelector('a[href*="doctor.html?id="]');if(!a)return null;
    const id=+a.href.split('id=')[1],docs=safe(()=>eval('DOCS'));
    return{name:'doctor-'+(id+1),alt:docs&&docs[id]?'Portrait of '+docs[id][0]:''};
  }],
  ['.pp',()=>{
    const id=parseInt(new URLSearchParams(location.search).get('id'),10)||0,docs=safe(()=>eval('DOCS'));
    return{name:'doctor-'+(id+1),alt:docs&&docs[id]?'Portrait of '+docs[id][0]:''};
  }],
  ['.tlead .tp',(el,i)=>{const list=safe(()=>eval('TL'));return{name:'team-lead-'+(i+1),alt:list&&list[i]?'Portrait of '+list[i][0]:''}}],
  ['#tNurse .tc',(el,i)=>{const list=safe(()=>eval('TN'));return{name:'team-nurse-'+(i+1),alt:list&&list[i]?'Portrait of '+list[i][0]:''}}],
  ['.dept .dp',el=>{const id=el.closest('.dept').id;return{name:deptFile[id]||('dept-'+id.replace(/^d-/,'')),alt:''}}],
  ['.cs',el=>{const b=el.querySelector('figcaption b'),k=b&&facility[b.textContent.trim()];return k?{name:'facility-'+k,alt:b.textContent.trim()}:null}],
  ['.rcp',titleToRes],['.tp2',titleToRes],['.sq',titleToRes],
  ['.fam div',(el,i)=>famFiles[i]?{name:famFiles[i],alt:''}:null]
];

function scan(){
  RULES.forEach(([sel,fn])=>{
    document.querySelectorAll(sel).forEach((el,i)=>{const r=safe(()=>fn(el,i));if(r)fill(el,r.name,r.alt)});
  });

  /* Home: children's section illustration */
  const ks=document.querySelector('.kids>svg');
  if(ks&&!ks.dataset.img){ks.dataset.img=1;probe('children-feature').then(r=>{
    if(!r)return;const im=new Image();im.className='kids-img';im.alt='A pediatrician with a young patient';im.loading='lazy';im.src=r.url;
    ks.style.display='none';ks.after(im);
  })}

  /* Children's care: optional age-group photos */
  document.querySelectorAll('.ages .age').forEach((row,i)=>{
    if(row.dataset.img||!ageFiles[i])return;row.dataset.img=1;
    probe('children-'+ageFiles[i]).then(r=>{
      if(!r)return;const im=new Image();im.className='age-img';im.loading='lazy';
      const t=row.querySelector('.age-t');im.alt=t?t.textContent:'';im.src=r.url;row.firstElementChild.prepend(im);
    });
  });
}

/* About: optional team photo */
function aboutTeam(){
  if(document.body.dataset.page!=='about')return;
  probe('about-team').then(r=>{
    if(!r)return;const s=document.querySelector('main section.blk');if(!s)return;
    const f=document.createElement('figure');f.className='about-fig';
    f.innerHTML='<img src="'+r.url+'" alt="The Vernyuy Clinic team" loading="lazy">';s.before(f);
  });
}

/* Home: optional testimonial avatars that follow the rotating quote */
function avatars(){
  const qn=document.getElementById('qn'),qt=document.getElementById('qt');if(!qn||!qt)return;
  let im=null;
  const sync=()=>{
    const list=safe(()=>eval('QT'));if(!list)return;
    const k=list.findIndex(q=>q[1]===qn.textContent.trim());if(k<0)return;
    probe('patient-'+(k+1)).then(r=>{
      if(!r){if(im)im.hidden=true;return}
      if(!im){im=new Image();im.className='avatar';im.alt='';qt.prepend(im)}
      im.src=r.url;im.hidden=false;
    });
  };
  new MutationObserver(sync).observe(qn,{childList:true,characterData:true,subtree:true});sync();
}

/* Favicon and social preview */
function meta(){
  probe('favicon').then(r=>{
    if(!r)return;let l=document.querySelector('link[rel="icon"]');
    if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l)}
    l.href=r.url;l.removeAttribute('type');
  });
  probe('social-share').then(r=>{
    if(!r)return;const m=document.createElement('meta');m.setAttribute('property','og:image');
    m.content=new URL(r.url,location.href).href;document.head.appendChild(m);
  });
}

/* Re-scan whenever main.js renders new cards (filters, carousel, search results, page views) */
let queued=false;
const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan()})};
const start=()=>{scan();aboutTeam();avatars();meta();new MutationObserver(queue).observe(document.body,{childList:true,subtree:true})};
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();
})();
