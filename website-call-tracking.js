// Google Ads measures completed calls on Google's forwarding infrastructure.
// This config requests a forwarding number; it never emits a conversion event.
(() => {
  if (window.jeffWebsiteCallsLoaded || typeof window.gtag !== 'function') return;
  window.jeffWebsiteCallsLoaded = true;

  let forwarding = null;
  const originalDigits = '13463984485';
  const displayedNumber = /(?:\+?1[ .-]?)?\(?346\)?[ .-]?398[ .-]?4485/g;
  const digits = value => value.replace(/\D/g, '');
  const isBusinessNumber = value => {
    const number = digits(value);
    return number === originalDigits || number === originalDigits.slice(1);
  };

  const replaceNumbers = () => {
    if (!forwarding || !document.body) return;
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      if (isBusinessNumber(link.getAttribute('href').slice(4))) {
        const href = 'tel:+' + forwarding.digits;
        if (link.getAttribute('href') !== href) link.setAttribute('href', href);
      }
    });
    // Preserve nested icons, CTA copy, form values, JSON-LD and event handlers.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('script,style,noscript,textarea,option,[contenteditable]')) continue;
      const value = node.nodeValue.replace(displayedNumber, forwarding.formatted);
      if (value !== node.nodeValue) node.nodeValue = value;
    }
  };

  window.gtag('config', 'AW-18475284552/1mtNCPqO2KAdEMjw2elE', {
    phone_conversion_number: '(346) 398-4485',
    phone_conversion_callback: (formatted, mobile) => {
      if (typeof formatted !== 'string' || typeof mobile !== 'string') return;
      const number = digits(mobile);
      if (!/^\d{10,15}$/.test(number) || !/^[+()\d .-]+$/.test(formatted)) return;
      forwarding = { formatted, digits: number.length === 10 ? '1' + number : number };
      replaceNumbers();
    }
  });

  // Forms and mobile enhancements can insert new phone links after page load.
  const watch = () => {
    replaceNumbers();
    if (document.body && typeof MutationObserver === 'function') {
      new MutationObserver(replaceNumbers).observe(document.body, {
        childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href']
      });
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watch, { once: true });
  else watch();
})();
