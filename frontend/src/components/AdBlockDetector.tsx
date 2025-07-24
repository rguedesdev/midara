"use client";

import { useEffect, useState } from "react";

function AdBlockDetector({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  const checkAdBlock = () => {
    setChecking(true);

    const script = document.createElement("script");
    // Altere o domínio abaixo se necessário
    script.src = `${process.env.NEXT_PUBLIC_API}/adserver.js?cb=${Date.now()}`;
    script.async = true;

    // Se carregar, tenta detectar via DOM
    script.onload = () => {
      detectByDOM();
      cleanup(script);
    };

    // Se falhar, adblock detectado
    script.onerror = () => {
      setAdBlockDetected(true);
      setChecking(false);
      cleanup(script);
    };

    document.body.appendChild(script);
  };

  // Detecção fallback via DOM
  const detectByDOM = () => {
    const bait = document.createElement("div");
    bait.className = "adsbox";
    bait.style.height = "1px";
    bait.style.width = "1px";
    bait.style.position = "absolute";
    bait.style.left = "-9999px";
    document.body.appendChild(bait);

    setTimeout(() => {
      const blocked =
        getComputedStyle(bait).display === "none" || bait.offsetParent === null;

      setAdBlockDetected(blocked);
      setChecking(false);
      bait.remove();
    }, 100);
  };

  const cleanup = (script: HTMLScriptElement) => {
    setTimeout(() => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    }, 1000);
  };

  useEffect(() => {
    checkAdBlock();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black text-lg">
          Verificando bloqueador de anúncios…
        </p>
      </div>
    );
  }

  if (adBlockDetected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">AdBlock Detectado</h1>
          <p className="mb-2">
            Parece que você está usando um bloqueador de anúncios.
          </p>
          <p className="mb-4">
            Desative-o e clique abaixo para continuar navegando.
          </p>
          <button
            onClick={checkAdBlock}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export { AdBlockDetector };
