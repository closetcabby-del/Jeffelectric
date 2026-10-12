/* Language navigation and validation. Never persist form contents. */
(() => {
  const es = document.documentElement.lang === 'es';
  const say = (en, spanish) => es ? spanish : en;
  const form = document.querySelector('form[action="https://forminit.com/f/pojgp0vhkve"]');
  let dirty = false;
  const status = document.createElement('p');
  status.className = 'language-form-error'; status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const photo = form?.querySelector('input[type="file"]');
  const validatePhoto = () => {
    if (!photo) return true;
    const file = photo.files?.[0];
    let message = '';
    if (file && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      message = say('Please choose a JPG, PNG or WebP image.', 'Seleccione una imagen JPG, PNG o WebP.');
    else if (file && file.size > 8 * 1024 * 1024)
      message = say('Please choose an image no larger than 8 MB.', 'Seleccione una imagen de hasta 8 MB.');
    photo.setCustomValidity(message); status.textContent = message;
    return !message;
  };
  if (form) {
    form.append(status);
    form.addEventListener('input', (event) => {
      dirty = true;
      if (event.target.setCustomValidity) event.target.setCustomValidity('');
    });
    form.addEventListener('change', (event) => {
      dirty = true;
      if (event.target.setCustomValidity) event.target.setCustomValidity('');
      validatePhoto();
    });
    form.addEventListener('invalid', (event) => {
      const field = event.target;
      if (field === photo) { validatePhoto(); event.preventDefault(); status.scrollIntoView({block:'center'}); return; }
      if (field.validity.valueMissing) field.setCustomValidity(say('Please complete this field.', 'Complete este campo.'));
      else if (field.validity.typeMismatch && field.type === 'email') field.setCustomValidity(say('Please enter a valid email address.', 'Ingrese un correo electrónico válido.'));
    }, true);
    document.addEventListener('submit', (event) => {
      if (event.target !== form) return;
      if (!validatePhoto()) { event.preventDefault(); event.stopImmediatePropagation(); status.scrollIntoView({block:'center'}); }
    }, true);
    if (photo) {
      const chooser = document.createElement('div'); chooser.className = 'language-file-choice';
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = say('Choose photo', 'Elegir foto');
      const filename = document.createElement('span'); filename.setAttribute('aria-live','polite');
      const refresh = () => { filename.textContent = photo.files?.[0]?.name || say('No photo selected', 'Ninguna foto seleccionada'); };
      refresh(); button.addEventListener('click', () => photo.click());
      photo.addEventListener('change', refresh); photo.classList.add('language-file-input');
      photo.setAttribute('tabindex', '-1');
      chooser.append(button, filename); photo.after(chooser);
    }
  }
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
    link.addEventListener('click', event => {
      if (form?.isConnected && form.querySelector('button[type="submit"]')?.disabled) {
        event.preventDefault();
        alert(say('Your request is still sending. Please stay on this page.', 'Su solicitud se está enviando. Permanezca en esta página.'));
        return;
      }
      if (dirty && form?.isConnected && !confirm(say(
        'Switch languages? Your unsent form entries will be cleared and your photo must be selected again.',
        '¿Cambiar de idioma? Se borrarán los datos del formulario que no ha enviado y deberá elegir la foto de nuevo.'
      ))) { event.preventDefault(); return; }
      // Map the existing mobile form anchor to the equivalent page section.
      const hash = location.hash === '#mobile-quote' ? '#contact' : location.hash;
      if (/^#[a-z][a-z0-9-]*$/i.test(hash)) target.hash = hash;
      link.href = target.href;
    });
  });
})();
