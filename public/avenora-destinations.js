(function () {
  var destinations = [
    { title: 'Ushuaia', location: 'Tierra del Fuego, Argentina', image: '/destinations/ushuaia.jpg', href: '/viajes/ushuaia', duration: '5 días / 4 noches' },
    { title: 'Trevelin en temporada de Tulipanes', location: 'Chubut, Argentina', image: '/destinations/trevelin.jpg', href: '/viajes/trevelin', duration: '5 días / 4 noches' },
    { title: 'Catamarca', location: 'Catamarca, Argentina', image: '/destinations/catamarca.jpg', href: '/viajes/catamarca', duration: '7 días / 6 noches' },
    { title: 'San Martín de los Andes', location: 'Neuquén, Argentina', image: '/destinations/san-martin.jpg', href: '/viajes/san-martin-de-los-andes', duration: '5 días / 4 noches' },
    { title: 'Puerto Rico', location: 'Caribe', image: '/destinations/puerto-rico.jpg', href: '/viajes/puerto-rico', duration: 'Aventura internacional' }
  ];

  function boot(attempt) {
    var root = document.querySelector('.destionation-wrapper');
    if (!root) {
      if ((attempt || 0) < 40) setTimeout(function(){ boot((attempt || 0) + 1); }, 150);
      return;
    }

    var sticky = root.querySelector('.sticky-wrap');
    var wrapper = root.querySelector('.destination-card-wrapper');
    var sourceList = Array.prototype.slice.call(root.querySelectorAll('.destination-card-list'))
      .find(function(el){ return !el.classList.contains('hide-desktop'); });
    var railItems = Array.prototype.slice.call(root.querySelectorAll('.destination-right .destination-place-item'));
    if (!sticky || !wrapper || !sourceList) return;

    railItems.forEach(function(item, index){
      var data = destinations[index];
      if (!data) return;
      var name = item.querySelector('.destination-name');
      if (name) name.textContent = data.title;
    });

    var oldStage = wrapper.querySelector('.locas-destination-stage');
    if (oldStage) oldStage.remove();

    var stage = document.createElement('div');
    stage.className = 'locas-destination-stage';

    var slides = destinations.map(function(data, index){
      var slide = document.createElement('a');
      slide.className = 'locas-destination-slide';
      slide.href = data.href;
      slide.setAttribute('aria-label', data.title);

      var media = document.createElement('div');
      media.className = 'locas-destination-media';
      var img = document.createElement('img');
      img.className = 'locas-destination-image';
      img.alt = data.title;
      img.loading = index === 0 ? 'eager' : 'lazy';
      img.src = data.image;
      media.appendChild(img);

      var content = document.createElement('div');
      content.className = 'locas-destination-content';

      var meta = document.createElement('div');
      meta.className = 'locas-destination-meta';

      var duration = document.createElement('div');
      duration.className = 'locas-destination-rating';
      duration.textContent = data.duration;
      meta.appendChild(duration);

      var title = document.createElement('div');
      title.className = 'locas-destination-title';
      title.textContent = data.title;
      meta.appendChild(title);

      var location = document.createElement('div');
      location.className = 'locas-destination-location';
      location.textContent = data.location;
      meta.appendChild(location);

      var arrow = document.createElement('div');
      arrow.className = 'locas-destination-arrow';
      arrow.innerHTML = '&#8599;';

      content.appendChild(meta);
      content.appendChild(arrow);
      slide.appendChild(media);
      slide.appendChild(content);
      stage.appendChild(slide);
      return slide;
    });

    wrapper.appendChild(stage);
    sourceList.style.setProperty('display', 'none', 'important');

    function render() {
      if (window.innerWidth < 992) {
        stage.style.display = 'none';
        sourceList.style.removeProperty('display');
        railItems.forEach(function(item){ item.classList.remove('is-active'); });
        return;
      }

      stage.style.display = 'block';
      sourceList.style.setProperty('display', 'none', 'important');

      var rect = sticky.getBoundingClientRect();
      var scrollable = Math.max(sticky.offsetHeight - window.innerHeight, 1);
      var progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      var position = progress * (slides.length - 1);
      var active = Math.min(slides.length - 1, Math.max(0, Math.round(position)));

      slides.forEach(function(slide, index){
        var delta = index - position;
        var distance = Math.abs(delta);
        var y = delta * 118;
        var scale = 1 - Math.min(distance * 0.055, 0.12);
        var opacity = distance > 1.25 ? 0 : Math.max(0, 1 - Math.max(0, distance - 0.55) * 1.7);

        slide.style.transform = 'translate3d(-50%, calc(-50% + ' + y + '%), 0) scale(' + scale + ')';
        slide.style.opacity = String(opacity);
        slide.style.zIndex = String(100 - Math.round(distance * 20));
        slide.style.pointerEvents = distance < 0.55 ? 'auto' : 'none';
      });

      railItems.forEach(function(item, index){
        var on = index === active;
        item.classList.toggle('is-active', on);
        item.style.opacity = on ? '1' : '.42';
        var name = item.querySelector('.destination-name');
        var num = item.querySelector('.number');
        var line = item.querySelector('.blue-line');
        if (name) name.style.opacity = on ? '1' : '.2';
        if (num) num.style.transform = on ? 'scale(1)' : 'scale(0)';
        if (line) line.style.width = on ? '100%' : '0%';
      });
    }

    var ticking = false;
    function requestRender() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function(){ ticking = false; render(); });
    }

    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender);
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ boot(0); });
  } else {
    boot(0);
  }
})();
