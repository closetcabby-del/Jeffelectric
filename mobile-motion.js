(()=>{
  const HERO_PARTS=Array.from({length:10},(_,i)=>`./public/media/hero-b64/part-${String(i).padStart(2,'0')}.txt`);

  const legacy=document.createElement('script');
  legacy.src='./mobile-motion-legacy.js?v=3';
  legacy.defer=true;
  document.head.appendChild(legacy);

  const loadHeroVideo=async(video)=>{
    try{
      video.muted=true;
      video.defaultMuted=true;
      video.playsInline=true;
      const chunks=await Promise.all(HERO_PARTS.map(async(src)=>{
        const response=await fetch(src,{cache:'force-cache'});
        if(!response.ok)throw new Error(`Hero video part failed: ${src}`);
        return (await response.text()).trim();
      }));
      const binary=atob(chunks.join(''));
      const bytes=new Uint8Array(binary.length);
      for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
      const url=URL.createObjectURL(new Blob([bytes],{type:'video/mp4'}));
      video.addEventListener('playing',()=>video.closest('.jeff-video-stage')?.classList.add('is-playing'),{once:true});
      video.src=url;
      video.load();
      const attemptPlay=()=>video.play().catch(()=>{});
      attemptPlay();
      document.addEventListener('visibilitychange',()=>{if(!document.hidden&&video.paused)attemptPlay();});
      window.addEventListener('pagehide',()=>URL.revokeObjectURL(url),{once:true});
    }catch(error){
      console.warn('Jeff Electric hero video failed to load',error);
      video.closest('.jeff-video-stage')?.classList.add('video-failed');
    }
  };

  const injectHero=()=>{
    const hero=document.querySelector('section.hero');
    if(!hero||hero.classList.contains('jeff-video-hero'))return;

    const style=document.createElement('style');
    style.id='jeff-video-hero-native-style';
    style.textContent=`
      .hero.jeff-video-hero{min-height:calc(100svh - 82px)!important;padding:44px clamp(24px,8vw,124px)!important;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(300px,430px)!important;align-items:center!important;gap:clamp(34px,6vw,88px)!important;background:#050505!important;color:#fff!important;overflow:hidden!important;position:relative!important}
      .hero.jeff-video-hero:before{content:""!important;display:block!important;position:absolute!important;inset:0!important;background:radial-gradient(circle at 78% 32%,rgba(242,178,26,.12),transparent 30%),linear-gradient(115deg,rgba(242,178,26,.035),transparent 45%)!important;opacity:1!important;transform:none!important;width:auto!important;height:auto!important;right:auto!important;top:auto!important;pointer-events:none!important}
      .jeff-video-copy,.jeff-video-stage{position:relative!important;z-index:2!important}
      .jeff-video-kicker{margin:0 0 18px!important;color:#f2b21a!important;font-size:10px!important;font-weight:900!important;letter-spacing:.2em!important;text-transform:uppercase!important}
      .jeff-video-copy h1{margin:0 0 22px!important;font-size:clamp(52px,6.4vw,92px)!important;line-height:.92!important;letter-spacing:-.055em!important;font-weight:900!important;color:#fff!important}
      .jeff-video-copy h1 em{display:block!important;color:#f2b21a!important;font-style:normal!important}
      .jeff-video-copy>p:not(.jeff-video-kicker){max-width:620px!important;margin:0 0 30px!important;color:#c0c2ba!important;font-size:17px!important;line-height:1.7!important}
      .jeff-video-actions{display:flex!important;gap:14px!important;flex-wrap:wrap!important;align-items:center!important}
      .jeff-video-stage{justify-self:center!important;width:min(100%,390px)!important;aspect-ratio:9/16!important;background:#000!important;border:1px solid #44483f!important;box-shadow:18px 18px 0 #f2b21a!important;overflow:hidden!important;display:block!important;color:#fff!important}
      .jeff-video-stage:after{content:""!important;position:absolute!important;z-index:2!important;inset:0!important;background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,.28) 100%)!important;pointer-events:none!important}
      .jeff-video-reel{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;background:#000!important;display:block!important}
      .jeff-video-loading{position:absolute!important;z-index:3!important;left:20px!important;right:20px!important;bottom:18px!important;text-align:center!important;color:#fff!important;font-size:10px!important;font-weight:900!important;letter-spacing:.13em!important;text-transform:uppercase!important;opacity:.9!important;transition:opacity .25s ease!important;pointer-events:none!important}
      .jeff-video-stage.is-playing .jeff-video-loading{opacity:0!important}
      .jeff-video-stage.video-failed .jeff-video-loading:after{content:" · Tap Request a Quote below"}
      @media(max-width:900px){.hero.jeff-video-hero{min-height:auto!important;padding:28px 22px 52px!important;grid-template-columns:1fr!important;gap:30px!important}.jeff-video-copy{text-align:center!important}.jeff-video-copy h1{font-size:clamp(44px,13vw,68px)!important}.jeff-video-copy>p:not(.jeff-video-kicker){margin-left:auto!important;margin-right:auto!important;font-size:15px!important}.jeff-video-actions{justify-content:center!important}.jeff-video-stage{width:min(92vw,430px)!important;box-shadow:12px 12px 0 #f2b21a!important}}
      @media(max-width:720px){.hero.jeff-video-hero{min-height:calc(100svh - 156px)!important;padding:0!important;display:block!important;background:#000!important}.hero.jeff-video-hero:before{background:linear-gradient(180deg,transparent 38%,rgba(0,0,0,.58) 64%,#000 100%)!important;z-index:3!important}.jeff-video-stage{width:100%!important;max-width:none!important;height:calc(100svh - 156px)!important;aspect-ratio:auto!important;border:0!important;box-shadow:none!important;margin:0!important}.jeff-video-copy{position:absolute!important;z-index:5!important;left:22px!important;right:22px!important;bottom:26px!important;text-align:left!important;pointer-events:none!important}.jeff-video-copy h1{font-size:clamp(42px,12vw,64px)!important;margin-bottom:16px!important}.jeff-video-copy>p:not(.jeff-video-kicker){display:none!important}.jeff-video-actions{justify-content:flex-start!important;pointer-events:auto!important}.jeff-video-kicker{font-size:8px!important;margin-bottom:10px!important}.jeff-video-loading{bottom:145px!important}}
    `;
    document.head.appendChild(style);

    hero.classList.add('jeff-video-hero');
    hero.innerHTML=`
      <div class="jeff-video-copy">
        <p class="jeff-video-kicker">Real Jeff Electric work · Southeast Houston</p>
        <h1>Real work.<em>Real Jeff Electric.</em></h1>
        <p>See Jeff Electric in action, then reach out when you're ready.</p>
        <div class="jeff-video-actions">
          <a class="button button-gold button-large" href="tel:+13463984485">☎ Call Now</a>
          <a class="button button-outline button-large" href="#contact">Request a Quote</a>
        </div>
      </div>
      <div class="jeff-video-stage" aria-label="Jeff Electric in action">
        <video class="jeff-video-reel" autoplay muted loop playsinline webkit-playsinline preload="auto" poster="./public/work/jeff-team.jpg" aria-label="Jeff Electric in action"></video>
        <span class="jeff-video-loading">Jeff Electric in action</span>
      </div>`;

    const video=hero.querySelector('.jeff-video-reel');
    if(video)loadHeroVideo(video);
  };

  const injectSocials=()=>{
    const footer=document.querySelector('footer');
    if(!footer||footer.querySelector('.jeff-socials'))return;
    const quickLinks=[...footer.querySelectorAll('div')].find(div=>div.querySelector('strong')?.textContent?.trim()==='Quick Links');
    if(!quickLinks)return;

    const style=document.createElement('style');
    style.id='jeff-social-style';
    style.textContent=`.jeff-socials{margin-top:18px;padding-top:16px;border-top:1px solid #20221e}.jeff-socials strong{margin-bottom:10px!important}.jeff-social-row{display:flex!important;gap:9px!important;align-items:center!important;flex-wrap:wrap!important}.jeff-social-row a{width:38px!important;height:38px!important;margin:0!important;display:grid!important;place-items:center!important;border:1px solid #4a4c45!important;background:#0d0e0d!important;color:#f2b21a!important;transition:.2s!important}.jeff-social-row a:hover,.jeff-social-row a:focus-visible{border-color:#f2b21a!important;background:#f2b21a!important;color:#080908!important;outline:none!important;transform:translateY(-2px)!important}.jeff-social-row svg{width:18px;height:18px;display:block;fill:currentColor}@media(max-width:720px){.jeff-socials{margin-top:16px}.jeff-social-row a{width:42px!important;height:42px!important}}`;
    document.head.appendChild(style);

    const social=document.createElement('div');
    social.className='jeff-socials';
    social.innerHTML=`<strong>Follow Us</strong><div class="jeff-social-row"><a href="https://www.instagram.com/jeffelectricllc/" target="_blank" rel="noopener noreferrer" aria-label="Jeff Electric on Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm10.5 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg></a><a href="https://www.facebook.com/share/1Eot7yVzxN/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Jeff Electric on Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.75l.41-3.2H13.5V8.76c0-.93.26-1.56 1.59-1.56H16.8V4.34c-.3-.04-1.31-.13-2.49-.13-2.46 0-4.14 1.5-4.14 4.26v2.33H7.4V14h2.77v8h3.33Z"/></svg></a></div>`;
    quickLinks.appendChild(social);
  };

  const init=()=>{injectHero();injectSocials();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
