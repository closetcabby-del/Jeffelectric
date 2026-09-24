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

  // Keep the latest tagged visit within this tab when a service CTA goes home.
  // Only selected campaign fields are copied; no full URL or form values.
  const key = 'jeff_campaign_v1';
  const fields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  let campaign = {};
  try {
    const stored = JSON.parse(sessionStorage.getItem(key) || '{}');
    if (stored && typeof stored === 'object') campaign = stored;
  } catch (_) { /* Storage may be blocked. The form must still work. */ }
  const params = new URLSearchParams(location.search);
  if (fields.some(field => params.has(field))) {
    campaign = {};
    for (const field of fields) {
      const value = params.get(field);
      if (value && /^[a-zA-Z0-9 _.-]{1,100}$/.test(value)) campaign[field] = value;
    }
    campaign.landing_page = location.pathname;
    try { sessionStorage.setItem(key, JSON.stringify(campaign)); } catch (_) {}
  }
  const form = document.querySelector('form[action="https://forminit.com/f/pojgp0vhkve"]');
  if (!form) return;
  for (const field of [...fields, 'landing_page']) {
    const value = campaign[field];
    if (typeof value !== 'string' || value.length > 200 || !/^[a-zA-Z0-9 /_.-]+$/.test(value)) continue;
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = `fi-text-${field}`;
    input.value = value;
    form.append(input);
  }
})();
