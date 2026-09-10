import Script from "next/script";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";
const validGtmId = /^GTM-[A-Z0-9]+$/i.test(gtmId) ? gtmId : "";

export function GoogleMeasurement() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});` }} id="google-consent-default" />
      {validGtmId ? (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${validGtmId}');`}
        </Script>
      ) : null}
    </>
  );
}
