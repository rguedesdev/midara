import Script from "next/script";

function ExoClickBannerTop({ zoneId, className }) {
  return (
    <>
      {/* Script do provedor (carregado só uma vez) */}
      <Script
        async
        strategy="afterInteractive"
        src="https://a.magsrv.com/ad-provider.js"
      />

      {/* Container do anúncio */}
      <ins className={className} data-zoneid={zoneId}></ins>

      {/* Script inline para ativar o banner */}
      <Script id={`exo-init-${zoneId}`} strategy="afterInteractive">
        {`(AdProvider = window.AdProvider || []).push({"serve": {}});`}
      </Script>
    </>
  );
}

export { ExoClickBannerTop };
