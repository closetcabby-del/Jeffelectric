(()=>{
  const legacy=document.createElement('script');
  legacy.src='./mobile-motion-legacy.js?v=3';
  legacy.defer=true;
  document.head.appendChild(legacy);

  const injectFeatureVideo=()=>{
    const hero=document.querySelector('section.hero');
    if(!hero||document.querySelector('.jeff-feature-video'))return;

    const style=document.createElement('style');
    style.id='jeff-feature-video-style';
    style.textContent=`
      .jeff-feature-video{position:relative;padding:clamp(34px,4vw,54px) clamp(22px,7vw,110px);background:#070807;color:#fff;border-top:1px solid #272922;border-bottom:1px solid #272922;overflow:hidden}
      .jeff-feature-video:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 70% 24%,rgba(242,178,26,.13),transparent 30%),linear-gradient(120deg,rgba(242,178,26,.035),transparent 48%)}
      .jeff-feature-inner{position:relative;z-index:1;max-width:1180px;margin:0 auto;display:grid;grid-template-columns:minmax(220px,320px) minmax(300px,430px);justify-content:center;align-items:center;gap:clamp(26px,5vw,68px)}
      .jeff-feature-copy{max-width:320px}
      .jeff-feature-copy h2{margin:0;color:#fff;font-size:clamp(42px,4.6vw,64px);line-height:.95;letter-spacing:-.045em;font-weight:900}
      .jeff-feature-frame{position:relative;justify-self:center;width:min(100%,410px);aspect-ratio:512/910;background:#000;border:1px solid #45483f;box-shadow:18px 18px 0 #f2b21a;overflow:hidden}
      .jeff-feature-player{display:block;width:100%;height:100%;object-fit:contain;background:#000}
      .jeff-feature-play{position:absolute;z-index:3;left:50%;top:50%;transform:translate(-50%,-50%);width:92px;height:92px;border:1px solid rgba(255,255,255,.72);border-radius:50%;background:rgba(5,5,5,.74);color:#f2b21a;display:grid;place-items:center;cursor:pointer;box-shadow:0 14px 42px rgba(0,0,0,.48);backdrop-filter:blur(8px);transition:transform .2s ease,background .2s ease,border-color .2s ease,opacity .2s ease}
      .jeff-feature-play:hover,.jeff-feature-play:focus-visible{transform:translate(-50%,-50%) scale(1.06);background:#f2b21a;color:#080908;border-color:#f2b21a;outline:none}
      .jeff-feature-play svg{width:34px;height:34px;fill:currentColor;transform:translateX(2px)}
      .jeff-feature-video.has-started .jeff-feature-play{opacity:0;pointer-events:none}
      .jeff-feature-replay{position:absolute;z-index:4;left:50%;top:50%;transform:translate(-50%,-50%);display:none;min-height:52px;padding:0 22px;border:1px solid #f2b21a;background:#0a0b09e8;color:#fff;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
      .jeff-feature-video.has-ended .jeff-feature-replay{display:inline-flex;align-items:center;justify-content:center}
      .jeff-feature-video.has-ended .jeff-feature-play{display:none}
      @media(max-width:900px){.jeff-feature-video{padding:26px 20px 50px}.jeff-feature-inner{grid-template-columns:1fr;gap:14px}.jeff-feature-copy{max-width:none;margin:0 auto;text-align:center}.jeff-feature-copy h2{font-size:clamp(34px,9vw,46px)}.jeff-feature-frame{width:min(88vw,420px);box-shadow:12px 12px 0 #f2b21a}}
      @media(max-width:720px){.jeff-feature-video{padding:14px 16px 78px}.jeff-feature-inner{gap:10px}.jeff-feature-copy h2{font-size:clamp(32px,9vw,40px)}.jeff-feature-frame{width:min(92vw,390px);box-shadow:9px 9px 0 #f2b21a}.jeff-feature-play{width:82px;height:82px}.jeff-feature-video.is-playing~.mobile-bar{transform:translateY(100%);transition:transform .2s ease}}
      @media(prefers-reduced-motion:reduce){.jeff-feature-play{transition:none}}
    `;
    document.head.appendChild(style);

    const section=document.createElement('section');
    section.className='jeff-feature-video';
    section.setAttribute('aria-labelledby','jeff-feature-title');
    section.innerHTML=`
      <div class="jeff-feature-inner">
        <div class="jeff-feature-copy">
          <h2 id="jeff-feature-title">Meet Jeff</h2>
        </div>
        <div class="jeff-feature-frame">
          <video class="jeff-feature-player" src="./public/media/jeff-electric-feature-full.mp4?v=1" playsinline webkit-playsinline preload="metadata" aria-label="Full Jeff Electric featured video with sound"></video>
          <button class="jeff-feature-play" type="button" aria-label="Play Jeff Electric featured video with sound">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button class="jeff-feature-replay" type="button" aria-label="Replay Jeff Electric featured video">↻ Watch again</button>
        </div>
      </div>`;
    hero.before(section);

    const video=section.querySelector('.jeff-feature-player');
    const play=section.querySelector('.jeff-feature-play');
    const replay=section.querySelector('.jeff-feature-replay');
    if(!video||!play||!replay)return;

    const startPlayback=async()=>{
      try{
        video.controls=true;
        video.muted=false;
        await video.play();
      }catch(error){
        console.warn('Jeff Electric featured video could not start',error);
      }
    };

    play.addEventListener('click',startPlayback);
    replay.addEventListener('click',()=>{
      video.currentTime=0;
      section.classList.remove('has-ended');
      startPlayback();
    });
    video.addEventListener('play',()=>{
      video.controls=true;
      section.classList.add('has-started','is-playing');
      section.classList.remove('has-ended');
    });
    video.addEventListener('pause',()=>section.classList.remove('is-playing'));
    video.addEventListener('ended',()=>{
      section.classList.remove('is-playing');
      section.classList.add('has-ended');
    });
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

  const init=()=>{injectFeatureVideo();injectSocials();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
