// The Inbox and staff alerts are downstream of Forminit. Only its receipt confirms this submission.
(() => {
  const form = document.querySelector('form[data-forminit]');
  if (!form) return;

  const es = document.documentElement.lang === 'es';
  const status = form.querySelector('[data-form-status]');
  const button = form.querySelector('button[type="submit"]');
  const email = form.elements.namedItem('fi-sender-email');
  const preferred = form.elements.namedItem('fi-select-preferredContact');
  const photos = form.querySelector('input[type="file"]');
  let pending = false;

  if (email && preferred) {
    const updateContact = () => { email.required = preferred.value === 'Email'; };
    preferred.addEventListener('change', updateContact);
    updateContact();
  }

  function validatePhotos() {
    const bytes = Array.from(photos.files).reduce((total, file) => total + file.size, 0);
    const message = es ? 'Seleccione fotos de hasta 8 MB en total.' : 'Choose photos totaling 8 MB or less.';
    photos.setCustomValidity(bytes > 8 * 1024 * 1024 ? message : '');
  }
  photos.addEventListener('change', validatePhotos);

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending) return;
    validatePhotos();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const digits = data.get('fi-phone-phoneNumber').replace(/\D/g, '');
    if (digits.length === 10) data.set('fi-phone-phoneNumber', '+1' + digits);
    else if (digits.length === 11 && digits.startsWith('1')) data.set('fi-phone-phoneNumber', '+' + digits);
    if (!photos.files.length) data.delete(photos.name);
    if (!data.get('fi-sender-email')) data.delete('fi-sender-email');

    pending = true;
    button.disabled = true;
    status.textContent = es ? 'Enviando solicitud…' : 'Sending your request…';
    let receipt;
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: data, headers: { Accept: 'application/json' }, credentials: 'omit'
      });
      const result = await response.json();
      if (!response.ok || result.success !== true || !result.submission?.hashId) {
        throw new Error('Missing submission receipt');
      }
      receipt = result.submission.hashId;
    } catch {
      pending = false;
      button.disabled = false;
      status.textContent = es
        ? 'No pudimos confirmar su solicitud. Revise sus datos o llame al (346) 398-4485.'
        : 'We couldn’t confirm your request. Check your details or call (346) 398-4485.';
      return;
    }

    try {
      if (form.dataset.forminit === 'photo') {
        window.gtag?.('event', 'conversion', {
          send_to: 'AW-18475284552/zW6YCJvR548dEMjw2elE', value: 1.0, currency: 'USD', transaction_id: receipt
        });
      } else {
        window.jeffTrackLead?.();
      }
    } catch { /* The customer still gets confirmation if measurement fails. */ }

    const confirmation = document.createElement('div');
    confirmation.className = 'success';
    confirmation.tabIndex = -1;
    confirmation.setAttribute('role', 'status');
    const title = document.createElement('h2');
    title.textContent = es ? 'Solicitud recibida' : 'Request received';
    const message = document.createElement('p');
    message.textContent = es
      ? 'Gracias. Jeff Electric revisará su solicitud y se pondrá en contacto con usted.'
      : 'Thank you. Jeff Electric will review your request and get in touch.';
    confirmation.append(title, message);
    form.replaceWith(confirmation);
    confirmation.focus();
  });
})();
