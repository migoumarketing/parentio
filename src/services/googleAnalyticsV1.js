let loaded = false;

export function loadGoogleAnalytics(measurementId, consentGranted = false) {
  if (!measurementId || !consentGranted || loaded) return false;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true, send_page_view: true });

  loaded = true;
  return true;
}

export function trackEvent(name, params = {}) {
  if (!window.gtag) return false;
  window.gtag("event", name, params);
  return true;
}
