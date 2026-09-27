(function(){
  const trips = [
    {title:'Ushuaia', desc:'5 días / 4 noches. Faro Les Éclaireurs, Parque Nacional, Tren del Fin del Mundo y aventura 4x4.', price:'$3.690.000', image:'/destinations/ushuaia.jpg', href:'/viajes/ushuaia'},
    {title:'Trevelin · Tulipanes', desc:'5 días / 4 noches. Patagonia, glamping, campo de tulipanes, Parque Nacional Los Alerces y té galés.', price:'$3.390.000', image:'/destinations/trevelin.jpg', href:'/viajes/trevelin'},
    {title:'El Calafate & El Chaltén', desc:'5 días / 4 noches. Perito Moreno, navegación de glaciares, Fitz Roy y Patagonia compartida.', price:'$3.190.000', image:'/packages/el-calafate.jpg', href:'/viajes/el-calafate-el-chalten'},
    {title:'San Martín de los Andes', desc:'5 días / 4 noches. Siete Lagos, kayak, bosque, montaña y cabañas de lujo.', price:'$2.490.000', image:'/destinations/san-martin.jpg', href:'/viajes/san-martin-de-los-andes'},
    {title:'Norte Argentino', desc:'7 días / 6 noches. Quebradas, pueblos, cerros, gastronomía y rutas del norte.', price:'$2.960.000', image:'/packages/norte.jpg', href:'/viajes/norte-argentino'},
    {title:'Catamarca', desc:'7 días / 6 noches. Puna, volcanes, salares y paisajes inmensos.', price:'$3.840.000', image:'/destinations/catamarca.jpg', href:'/viajes/catamarca'},
    {title:'New York', desc:'9 días / 8 noches. Manhattan, Brooklyn, barrios, clásicos y días para caminar la ciudad juntas.', price:'USD 4.950', image:'/packages/new-york.jpeg', href:'/viajes/new-york'},
    {title:'Puerto Rico', desc:'Caribe, historia, playas, música y naturaleza tropical en una experiencia grupal.', price:'Consultar', image:'/destinations/puerto-rico.jpg', href:'/viajes/puerto-rico'}
  ];
  function apply(){
    const root=document.querySelector('.package-wrapper .collection-list');
    if(!root) return false;
    let items=[...root.querySelectorAll(':scope > .w-dyn-item')];
    if(!items.length) return false;
    while(items.length<trips.length){
      const clone=items[items.length%Math.min(items.length,4)].cloneNode(true);
      root.appendChild(clone); items.push(clone);
    }
    items.forEach((item,i)=>{
      if(i>=trips.length){item.remove();return;}
      const d=trips[i], card=item.querySelector('.package-card'); if(!card)return;
      card.href=d.href;
      const img=card.querySelector('.package-image'); if(img){img.src=d.image;img.removeAttribute('srcset');img.removeAttribute('sizes');img.alt=d.title;}
      const title=card.querySelector('.package-title-wrapper .font-1-medium'); if(title) title.textContent=d.title;
      const desc=card.querySelector('.package-title-wrapper .font-1-extra-small'); if(desc) desc.textContent=d.desc;
      const price=card.querySelector('.package-price-text'); if(price) price.textContent=d.price;
      const review=card.querySelector('.package-review-text'); if(review) review.textContent='Viaje grupal · Locas';
      const demo=card.querySelector('.demo'); if(demo) demo.textContent='Ver viaje';
    });
    const btn=[...document.querySelectorAll('.package-wrapper a')].find(a=>a.textContent.includes('Explorar paquetes'));
    if(btn) btn.href='/viajes';
    return true;
  }
  if(!apply()){let n=0;const t=setInterval(()=>{if(apply()||++n>30)clearInterval(t)},150)}
})();
