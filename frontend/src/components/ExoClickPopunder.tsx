"use client";

import { useEffect } from "react";
import Script from "next/script";

function ExoClickPopunder() {
  useEffect(() => {
    function handleClick() {
      if (window.popMagic && typeof window.popMagic.preparePop === "function") {
        window.popMagic.preparePop();
      }
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {/* Script do Popunder */}
      <Script
        id="popunder-exoclick"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function() {
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
              "trigger_method": 3, 
              "trigger_class": "",
              "trigger_delay": 0,
              "capping_enabled": false,
              "tcf_enabled": true,
              "only_inline": false
            };
            window.popMagic && window.popMagic.init && window.popMagic.init(adConfig);
          })();`,
        }}
      />
    </>
  );
}

export { ExoClickPopunder };
