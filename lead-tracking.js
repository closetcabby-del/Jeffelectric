// Track actions, never form contents. A phone click is not a completed call.
(() => {
  if (window.jeffTrackingLoaded) return;
  window.jeffTrackingLoaded = true;
  const track = (name) => {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, { page_path: location.pathname });
      }
    } catch (_) { /* Analytics must not interrupt an enquiry. */ }
  };
  document.addEventListener('click', (event) => {
    if (event.target.closest && event.target.closest('a[href^="tel:"]')) track('phone_click');
  });
  window.jeffTrackLead = () => track('generate_lead');
})();
