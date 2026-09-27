WebFont.load({  google: {    families: ["Instrument Sans:400,500,600,700","Inter Tight:400,500,600,700"]  }});

;


const lenis = new Lenis({
duration: 1.8,
easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
direction: 'vertical', // vertical, horizontal
gestureDirection: 'vertical', // vertical, horizontal, both
smooth: true,
mouseMultiplier: 1,
smoothTouch: false,
touchMultiplier: 2,
infinite: false,
})

//get scroll value
lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => { console.log({ scroll, limit, velocity, direction, progress })
})

function raf(time)

{
lenis.raf(time)


requestAnimationFrame(raf)
}

requestAnimationFrame(raf)


;


(function () {
  "use strict";

  function initializeLioSupportWidget() {
    const widget = document.getElementById("lioSupportWidget");
    const trigger = document.getElementById("lioSupportTrigger");
    const menu = document.getElementById("lioSupportMenu");

    if (!widget || !trigger || !menu) return;
    if (widget.dataset.initialized === "true") return;

    widget.dataset.initialized = "true";

    const hoverDevice = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    let closeTimer = null;

    function openMenu() {
      window.clearTimeout(closeTimer);

      widget.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      trigger.setAttribute(
        "aria-label",
        "Close template support options"
      );
    }

    function closeMenu(removeFocus) {
      window.clearTimeout(closeTimer);

      widget.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute(
        "aria-label",
        "Open template support options"
      );

      if (removeFocus) {
        trigger.blur();
      }
    }

    function toggleMenu(event) {
      event.preventDefault();
      event.stopPropagation();

      if (widget.classList.contains("is-open")) {
        closeMenu(true);
      } else {
        openMenu();
      }
    }

    function delayedClose() {
      window.clearTimeout(closeTimer);

      closeTimer = window.setTimeout(function () {
        closeMenu(false);
      }, 180);
    }

    /* Click and tap */
    trigger.addEventListener("click", toggleMenu);

    /* Desktop hover */
    widget.addEventListener("mouseenter", function () {
      if (hoverDevice.matches) {
        openMenu();
      }
    });

    widget.addEventListener("mouseleave", function () {
      if (hoverDevice.matches) {
        delayedClose();
      }
    });

    menu.addEventListener("mouseenter", function () {
      window.clearTimeout(closeTimer);
    });

    /* Outside click */
    document.addEventListener("pointerdown", function (event) {
      if (
        widget.classList.contains("is-open") &&
        !widget.contains(event.target)
      ) {
        closeMenu(true);
      }
    });

    /* Escape key */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu(true);
      }
    });

    /* Close after selecting */
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeLioSupportWidget
    );
  } else {
    initializeLioSupportWidget();
  }
})();


;


window.addEventListener("load", function () {
  if (typeof gsap === "undefined") return;

  const sliders = gsap.utils.toArray(".gallery-slide-main");

  sliders.forEach(function (slider) {
    if (slider.dataset.gsapGalleryReady === "true") return;
    slider.dataset.gsapGalleryReady = "true";

    const mask = slider.querySelector(".gallery-mask");
    const tracks = gsap.utils.toArray(slider.querySelectorAll(".gallery-track"));
    const dots = gsap.utils.toArray(slider.querySelectorAll(".active-dot-wrap .dot"));

    if (!mask || !tracks.length) return;

    const track = tracks[0];

    tracks.slice(1).forEach(function (extraTrack) {
      gsap.set(extraTrack, {
        display: "none"
      });
    });

    const cards = gsap.utils.toArray(track.querySelectorAll(".gallery-card"));
    if (!cards.length) return;

    let activeIndex = Math.floor(cards.length / 2);
    let autoplay;
    let resizeCall;
    let config;
    let cardWidth = 0;
    let cardHeight = 0;

    function getConfig() {
      const isMobile = window.innerWidth <= 767;
      const isTablet = window.innerWidth <= 991;

      return {
        gap: isMobile ? 28 : isTablet ? 30 : 32,

        delay: 2.8,
        duration: 0.85,
        ease: "power3.inOut",

        activeWidthScale: 1,
        activeHeightScale: isMobile ? 1.10 : isTablet ? 1.14 : 1.20,

        sideWidthScale: isMobile ? 0.90 : 0.92,
        sideHeightScale: isMobile ? 1.00 : isTablet ? 1.04 : 1.08,

        farWidthScale: isMobile ? 0.82 : 0.84,
        farHeightScale: isMobile ? 0.88 : isTablet ? 0.92 : 0.96,

        activeY: isMobile ? -8 : -16,
        sideY: isMobile ? -4 : -10,
        farY: isMobile ? 0 : -4,

        badgeHiddenY: 44,

        activeDotColor: "#3154ff",
        inactiveDotColor: "rgba(49, 84, 255, 0.28)"
      };
    }

    function getLoopDistance(index, active, total) {
      let distance = index - active;

      if (distance > total / 2) {
        distance -= total;
      }

      if (distance < -total / 2) {
        distance += total;
      }

      return distance;
    }

    function clearInlineStyles() {
      gsap.killTweensOf(cards);
      gsap.killTweensOf(dots);

      cards.forEach(function (card) {
        const image = card.querySelector(".gallery-image, img");
        const badge = card.querySelector(".gallery-badge");

        gsap.killTweensOf(card);

        if (image) {
          gsap.killTweensOf(image);
          gsap.set(image, {
            clearProps: "all"
          });
        }

        if (badge) {
          gsap.killTweensOf(badge);
          gsap.set(badge, {
            clearProps: "all"
          });
        }

        gsap.set(card, {
          clearProps: "all"
        });
      });

      gsap.set(track, {
        clearProps: "all"
      });

      gsap.set(mask, {
        clearProps: "height,position,overflow"
      });
    }

    function measureCards() {
      cardWidth = 0;
      cardHeight = 0;

      cards.forEach(function (card) {
        cardWidth = Math.max(cardWidth, card.offsetWidth);
        cardHeight = Math.max(cardHeight, card.offsetHeight);
      });

      const sliderHeight = Math.ceil(cardHeight * config.activeHeightScale + 100);

      gsap.set(mask, {
        overflow: "hidden",
        position: "relative",
        height: sliderHeight
      });

      gsap.set(track, {
        position: "relative",
        width: "100%",
        height: sliderHeight,
        overflow: "visible"
      });
    }

    function getSizeByDistance(absDistance) {
      if (absDistance === 0) {
        return {
          width: cardWidth * config.activeWidthScale,
          height: cardHeight * config.activeHeightScale,
          y: config.activeY
        };
      }

      if (absDistance === 1) {
        return {
          width: cardWidth * config.sideWidthScale,
          height: cardHeight * config.sideHeightScale,
          y: config.sideY
        };
      }

      return {
        width: cardWidth * config.farWidthScale,
        height: cardHeight * config.farHeightScale,
        y: absDistance === 2 ? config.farY : 0
      };
    }

    function getPositionX(distance) {
      if (distance === 0) return 0;

      const sign = distance < 0 ? -1 : 1;
      const absDistance = Math.abs(distance);

      let position = 0;

      for (let step = 1; step <= absDistance; step++) {
        const previousSize = getSizeByDistance(step - 1);
        const currentSize = getSizeByDistance(step);

        position += previousSize.width / 2 + currentSize.width / 2 + config.gap;
      }

      return sign * position;
    }

    function setupStyles() {
      gsap.set(cards, {
        position: "absolute",
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        margin: 0,
        flexShrink: 0,
        overflow: "hidden",
        transformOrigin: "center center",
        willChange: "transform, width, height, opacity",
        userSelect: "none"
      });

      cards.forEach(function (card) {
        const image = card.querySelector(".gallery-image, img");
        const badge = card.querySelector(".gallery-badge");

        if (image) {
          image.setAttribute("draggable", "false");

          gsap.set(image, {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            maxWidth: "none",
            display: "block",
            objectFit: "cover",
            objectPosition: "center center",
            borderRadius: "inherit",
            transformOrigin: "center center",
            willChange: "transform"
          });
        }

        if (badge) {
          gsap.set(badge, {
            y: config.badgeHiddenY,
            autoAlpha: 0,
            scale: 1,
            zIndex: 5,
            transformOrigin: "center center",
            willChange: "transform, opacity"
          });
        }
      });

      gsap.set(dots, {
        transformOrigin: "center center"
      });
    }

    function updateCards(duration) {
      cards.forEach(function (card, index) {
        const badge = card.querySelector(".gallery-badge");
        const distance = getLoopDistance(index, activeIndex, cards.length);
        const absDistance = Math.abs(distance);
        const isActive = index === activeIndex;
        const size = getSizeByDistance(absDistance);

        gsap.to(card, {
          x: getPositionX(distance),
          y: size.y,
          width: size.width,
          height: size.height,
          opacity: absDistance > 3 ? 0 : absDistance === 3 ? 0.35 : 1,
          zIndex: isActive ? 30 : 20 - absDistance,
          duration: duration,
          ease: config.ease,
          overwrite: true
        });

        if (badge) {
          gsap.to(badge, {
            y: isActive ? 0 : config.badgeHiddenY,
            autoAlpha: isActive ? 1 : 0,
            scale: 1,
            duration: duration * 0.75,
            ease: "power3.out",
            overwrite: true
          });
        }
      });
    }

    function updateDots(duration) {
      dots.forEach(function (dot, index) {
        const isActive = index === activeIndex;

        gsap.to(dot, {
          scale: isActive ? 1.8 : 1,
          backgroundColor: isActive ? config.activeDotColor : config.inactiveDotColor,
          opacity: isActive ? 1 : 0.45,
          duration: duration * 0.65,
          ease: "power3.out",
          overwrite: true
        });
      });
    }

    function render(duration) {
      updateCards(duration);
      updateDots(duration);
    }

    function nextSlide() {
      activeIndex = (activeIndex + 1) % cards.length;
      render(config.duration);
    }

    function startAutoplay() {
      if (autoplay) autoplay.kill();

      autoplay = gsap.delayedCall(config.delay, function loop() {
        nextSlide();
        autoplay = gsap.delayedCall(config.delay, loop);
      });
    }

    function refreshSlider() {
      config = getConfig();

      clearInlineStyles();
      measureCards();
      setupStyles();
      render(0);
    }

    refreshSlider();
    startAutoplay();

    window.addEventListener("resize", function () {
      if (resizeCall) resizeCall.kill();

      resizeCall = gsap.delayedCall(0.2, function () {
        refreshSlider();
      });
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (autoplay) autoplay.kill();
      } else {
        startAutoplay();
      }
    });
  });
});
