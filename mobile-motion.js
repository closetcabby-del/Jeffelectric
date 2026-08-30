(()=>{
  const legacy=document.createElement('script');
  legacy.src='./mobile-motion-legacy.js?v=3';
  legacy.defer=true;
  document.head.appendChild(legacy);

  const injectSocials=()=>{
    const footer=document.querySelector('footer');
    if(!footer||footer.querySelector('.jeff-socials'))return;

    const quickLinks=[...footer.querySelectorAll('div')].find(div=>div.querySelector('strong')?.textContent?.trim()==='Quick Links');
    if(!quickLinks)return;

    const style=document.createElement('style');
    style.id='jeff-social-style';
    style.textContent=`
      .jeff-socials{margin-top:18px;padding-top:16px;border-top:1px solid #20221e}
      .jeff-socials strong{margin-bottom:10px!important}
      .jeff-social-row{display:flex!important;gap:9px!important;align-items:center!important;flex-wrap:wrap!important}
      .jeff-social-row a{width:38px!important;height:38px!important;margin:0!important;display:grid!important;place-items:center!important;border:1px solid #4a4c45!important;background:#0d0e0d!important;color:#f2b21a!important;transition:.2s!important}
      .jeff-social-row a:hover,.jeff-social-row a:focus-visible{border-color:#f2b21a!important;background:#f2b21a!important;color:#080908!important;outline:none!important;transform:translateY(-2px)!important}
      .jeff-social-row svg{width:18px;height:18px;display:block;fill:currentColor}
      @media(max-width:720px){.jeff-socials{margin-top:16px}.jeff-social-row a{width:42px!important;height:42px!important}}
    `;
    document.head.appendChild(style);

    const social=document.createElement('div');
    social.className='jeff-socials';
    social.innerHTML=`
      <strong>Follow Us</strong>
      <div class="jeff-social-row">
        <a href="https://www.instagram.com/jeffelectricllc/" target="_blank" rel="noopener noreferrer" aria-label="Jeff Electric on Instagram" title="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm10.5 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
        </a>
        <a href="https://www.facebook.com/share/1Eot7yVzxN/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Jeff Electric on Facebook" title="Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.75l.41-3.2H13.5V8.76c0-.93.26-1.56 1.59-1.56H16.8V4.34c-.3-.04-1.31-.13-2.49-.13-2.46 0-4.14 1.5-4.14 4.26v2.33H7.4V14h2.77v8h3.33Z"/></svg>
        </a>
      </div>`;
    quickLinks.appendChild(social);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectSocials,{once:true});
  else injectSocials();
})();
