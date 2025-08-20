"use client";
import { useEffect } from "react";

exort function ExoClickPopunder() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/javascript";
    script.async = true;

    script.innerHTML = `
      (function() {
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
          "capping_enabled": false
        };
        if(window.popMagic && typeof window.popMagic.init === "function") {
          window.popMagic.init(adConfig);
        }
      })();
    `;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}

export {ExoClickPopunder}