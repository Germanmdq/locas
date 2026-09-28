(function(){
  async function getTrips(){
    try{
      const r=await fetch('/api/public-trips',{cache:'no-store'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      return await r.json();
    }catch(e){console.warn('Locas trips:',e);return[]}
  }
  function apply(trips){
    const root=document.querySelector('.package-wrapper .collection-list');
    if(!root||!trips.length) return false;
    let items=[...root.querySelectorAll(':scope > .w-dyn-item')];
    if(!items.length) return false;
    while(items.length<trips.length){
      const clone=items[items.length%Math.min(items.length,4)].cloneNode(true);
      root.appendChild(clone); items.push(clone);
    }
    items.forEach((item,i)=>{
      if(i>=trips.length){item.remove();return;}
      const d=trips[i],card=item.querySelector('.package-card'); if(!card)return;
      card.href='/viajes/'+d.slug;
      const img=card.querySelector('.package-image'); if(img){img.src=d.image;img.removeAttribute('srcset');img.removeAttribute('sizes');img.alt=d.title;}
      const title=card.querySelector('.package-title-wrapper .font-1-medium'); if(title) title.textContent=d.title;
      const desc=card.querySelector('.package-title-wrapper .font-1-extra-small'); if(desc) desc.textContent=[d.duration,d.lead].filter(Boolean).join('. ');
      const price=card.querySelector('.package-price-text'); if(price) price.textContent=d.price;
      const review=card.querySelector('.package-review-text'); if(review) review.textContent=(d.spots!=null?d.spots+' lugares · ':'')+'Viaje grupal · Locas';
      const demo=card.querySelector('.demo'); if(demo) demo.textContent='Ver viaje';
    });
    const btn=[...document.querySelectorAll('.package-wrapper a')].find(a=>a.textContent.includes('Explorar paquetes'));
    if(btn) btn.href='/viajes';
    return true;
  }
  getTrips().then(trips=>{
    if(!apply(trips)){let n=0;const t=setInterval(()=>{if(apply(trips)||++n>40)clearInterval(t)},150)}
  });
})();
