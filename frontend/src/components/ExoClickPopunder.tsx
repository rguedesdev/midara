import Script from "next/script";

function ExoClickPopunder({ zoneId }) {
  return (
    <>
      {/* Script do provedor */}
      <Script
        async
        strategy="afterInteractive"
        src="https://a.magsrv.com/ad-provider.js"
      />

      {/* Container do Popunder */}
      <ins className="eas6a97888e2" data-zoneid={zoneId}></ins>

      {/* Script inline para disparar */}
      <Script id={`popunder-init-${zoneId}`} strategy="afterInteractive">
        {`(AdProvider = window.AdProvider || []).push({"serve": {}});`}
      </Script>
    </>
  );
}

export { ExoClickPopunder };
