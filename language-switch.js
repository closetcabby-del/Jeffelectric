/* Language navigation and validation. Never persist form contents. */
(() => {
  document.querySelectorAll('.language-switch a').forEach(link => {
    if (link.getAttribute('aria-current') === 'page') return;
    // Only carry existing allowlisted campaign fields; never arbitrary query/form data.
    const target = new URL(link.href);
    const params = new URLSearchParams(location.search);
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
      const value = params.get(key);
      if (value && /^[a-zA-Z0-9 _.-]{1,100}$/.test(value)) target.searchParams.set(key, value);
    }
    link.href = target.href;
    link.addEventListener('click', () => {
      // Map the existing mobile form anchor to the equivalent page section.
      const hash = location.hash === '#mobile-quote' ? '#contact' : location.hash;
      if (/^#[a-z][a-z0-9-]*$/i.test(hash)) target.hash = hash;
      link.href = target.href;
    });
  });
})();
