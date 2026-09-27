(function () {
  function boot(attempt) {
    var root = document.querySelector('.destionation-wrapper');
    if (!root) {
      if ((attempt || 0) < 40) setTimeout(function(){ boot((attempt || 0) + 1); }, 150);
      return;
    }

    var sticky = root.querySelector('.sticky-wrap');
    var lists = Array.prototype.slice.call(root.querySelectorAll('.destination-card-list'));
    var list = lists.find(function(el){ return !el.classList.contains('hide-desktop'); });
    var items = Array.prototype.slice.call(root.querySelectorAll('.destination-right .destination-place-item'));
    if (!sticky || !list) return;

    var cards = Array.prototype.slice.call(list.children).filter(function(el){
      return el.classList.contains('destination-collection-wrap');
    });
    if (!cards.length) return;

    document.documentElement.classList.add('w-mod-ix3');

    function render() {
      if (window.innerWidth < 992) {
        cards.forEach(function(card){ card.removeAttribute('style'); });
        items.forEach(function(item){ item.classList.remove('is-active'); });
        return;
      }

      var rect = sticky.getBoundingClientRect();
      var scrollable = Math.max(sticky.offsetHeight - window.innerHeight, 1);
      var p = Math.min(1, Math.max(0, -rect.top / scrollable));
      var position = p * (cards.length - 1);
      var active = Math.min(cards.length - 1, Math.max(0, Math.round(position)));

      cards.forEach(function(card, index) {
        var innerCard = card.querySelector(".destination-card");
        var image = card.querySelector(".destination-image");
        var dynList = card.querySelector(".w-dyn-list");
        var dynItem = card.querySelector(".w-dyn-item");
        [innerCard, image, dynList, dynItem].forEach(function(el){
          if (!el) return;
          el.style.setProperty("visibility", "visible", "important");
          el.style.setProperty("opacity", "1", "important");
        });
        if (innerCard) innerCard.style.setProperty("transform", "none", "important");
        if (image) {
          image.style.setProperty("display", "block", "important");
          image.style.setProperty("transform", "none", "important");
        }
        var delta = index - position;
        var distance = Math.abs(delta);
        var y = delta * 108;
        var opacity = distance > 1.35 ? 0 : Math.max(0, 1 - Math.max(0, distance - .75) * 1.7);
        var scale = 1 - Math.min(distance * .045, .08);
        card.style.transform = 'translate(-50%, calc(-50% + ' + y + '%)) scale(' + scale + ')';
        card.style.opacity = String(opacity);
        card.style.zIndex = String(50 - Math.round(distance * 10));
        card.style.pointerEvents = distance < .55 ? 'auto' : 'none';
      });

      items.forEach(function(item, index) {
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
