import Script from "next/script";

function ExoClickPopunder() {
  return (
    <>
      <Script
        id="popunder-exoclick"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          (function() {
            function randStr(e,t){for(var n="",r=t||"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",o=0;o<e;o++)n+=r.charAt(Math.floor(Math.random()*r.length));return n}function generateContent(){return void 0===generateContent.val&&(generateContent.val="document.dispatchEvent("+randStr(4*Math.random()+3)+");"),generateContent.val}try{Object.defineProperty(document.currentScript,"innerHTML",{get:generateContent}),Object.defineProperty(document.currentScript,"textContent",{get:generateContent})}catch(e){};

            var adConfig = {
              "ads_host": "a.pemsrv.com",
              "syndication_host": "s.pemsrv.com",
              "idzone": 5706214,
              "popup_fallback": false,
              "popup_force": false,
              "chrome_enabled": true,
              "new_tab": false,
              "frequency_period": 720,
              "frequency_count": 1,
              "trigger_method": 1,
              "trigger_class": "",
              "trigger_delay": 0,
              "capping_enabled": false,
              "tcf_enabled": true,
              "only_inline": false
            };

            popMagic.init(adConfig);
          })();
          `,
        }}
      />
    </>
  );
}

export { ExoClickPopunder };
