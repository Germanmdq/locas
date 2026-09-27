(function () {
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

    var sourceCards = Array.prototype.slice.call(sourceList.querySelectorAll('.destination-card'));
    if (!sourceCards.length) return;

    var oldStage = wrapper.querySelector('.locas-destination-stage');
    if (oldStage) oldStage.remove();

    var stage = document.createElement('div');
    stage.className = 'locas-destination-stage';

    var slides = sourceCards.map(function(sourceCard, index){
      var sourceImage = sourceCard.querySelector('.destination-image');
      var sourceTitle = sourceCard.querySelector('.destination-card-info .font-1-large');
      var sourceLocation = sourceCard.querySelector('.destination-location-text');
      var sourceRating = sourceCard.querySelector('.destination-rating-wrapper .font-1-extra-small');

      var slide = document.createElement('a');
      slide.className = 'locas-destination-slide';
      slide.href = sourceCard.getAttribute('href') || '#';
      slide.setAttribute('aria-label', sourceTitle ? sourceTitle.textContent.trim() : ('Destino ' + (index + 1)));

      var media = document.createElement('div');
      media.className = 'locas-destination-media';
      var img = document.createElement('img');
      img.className = 'locas-destination-image';
      img.alt = sourceImage ? (sourceImage.alt || '') : '';
      img.loading = index === 0 ? 'eager' : 'lazy';
      if (sourceImage) {
        img.src = sourceImage.getAttribute('src') || '';
        var srcset = sourceImage.getAttribute('srcset');
        if (srcset) img.setAttribute('srcset', srcset);
        var sizes = sourceImage.getAttribute('sizes');
        if (sizes) img.setAttribute('sizes', sizes);
      }
      media.appendChild(img);

      var content = document.createElement('div');
      content.className = 'locas-destination-content';

      var meta = document.createElement('div');
      meta.className = 'locas-destination-meta';

      if (sourceRating) {
        var rating = document.createElement('div');
        rating.className = 'locas-destination-rating';
        rating.textContent = '★ ' + sourceRating.textContent.trim();
        meta.appendChild(rating);
      }

      var title = document.createElement('div');
      title.className = 'locas-destination-title';
      title.textContent = sourceTitle ? sourceTitle.textContent.trim() : ('Destino ' + (index + 1));
      meta.appendChild(title);

      var location = document.createElement('div');
      location.className = 'locas-destination-location';
      location.textContent = sourceLocation ? sourceLocation.textContent.trim() : '';
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
      requestAnimationFrame(function(){
        ticking = false;
        render();
      });
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
