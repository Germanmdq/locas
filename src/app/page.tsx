import Script from "next/script";
import { avenoraBody } from "./avenora-body";

const scripts = [
  "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
  "https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6a13e532999601af0ed6354d",
  "https://cdn.prod.website-files.com/6a13e532999601af0ed6354d/js/webflow.schunk.f2efb3c5440a81cf.js",
  "https://cdn.prod.website-files.com/6a13e532999601af0ed6354d/js/webflow.schunk.a4928385b176e506.js",
  "https://cdn.prod.website-files.com/6a13e532999601af0ed6354d/js/webflow.90f71066.7687a6d70935c897.js",
  "https://cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js",
  "https://cdn.prod.website-files.com/gsap/3.15.0/ScrollTrigger.min.js",
  "https://cdn.prod.website-files.com/gsap/3.15.0/SplitText.min.js",
  "https://cdn.jsdelivr.net/gh/studio-freight/lenis@0.2.28/bundled/lenis.js",
];

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: avenoraBody }} />
      <Script id="avenora-webfont" strategy="afterInteractive">{`if(window.WebFont){WebFont.load({google:{families:["Instrument Sans:400,500,600,700","Inter Tight:400,500,600,700"]}});}`}</Script>
      {scripts.map((src, i) => <Script key={src} src={src} strategy="afterInteractive" data-order={i} />)}
      <Script src="/avenora-inline.js" strategy="lazyOnload" />
      <Script src="/avenora-destinations.js" strategy="lazyOnload" />
      <Script id="locas-cleanup" strategy="lazyOnload">{`
        (function(){
          var brand = document.querySelector('.nav-brand .nav-text');
          if (brand) brand.textContent = 'Locas por la aventura';
          function removeTemplateBadges(){
            var widget = document.getElementById('lioSupportWidget');
            if (widget) widget.remove();
            document.querySelectorAll('.w-webflow-badge, .lio-support-widget').forEach(function(el){ el.remove(); });
          }
          removeTemplateBadges();
          setTimeout(removeTemplateBadges, 250);
          setTimeout(removeTemplateBadges, 1000);
          new MutationObserver(removeTemplateBadges).observe(document.body,{childList:true,subtree:true});
        })();
      `}</Script>
      <Script id="avenora-reinit" strategy="lazyOnload">{`
        (function reinitAvenora(attempt){
          if (window.Webflow) {
            try {
              if (typeof window.Webflow.destroy === 'function') window.Webflow.destroy();
            } catch (e) {}
            try {
              if (typeof window.Webflow.ready === 'function') window.Webflow.ready();
            } catch (e) {}
            try {
              var ix2 = window.Webflow.require && window.Webflow.require('ix2');
              if (ix2 && typeof ix2.init === 'function') ix2.init();
            } catch (e) {}
            document.documentElement.classList.add('w-mod-ix3');
            window.dispatchEvent(new Event('resize'));
            return;
          }
          if ((attempt || 0) < 30) {
            setTimeout(function(){ reinitAvenora((attempt || 0) + 1); }, 150);
          }
        })(0);
      `}</Script>
    </>
  );
}
