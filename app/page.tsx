"use client";

import { FormEvent, useEffect, useState } from "react";
import { BatteryCharging, CircuitBoard, Lightbulb, Power, ShieldCheck, Wrench } from "lucide-react";

const services = [
  { icon: Wrench, title: "Troubleshooting & Repairs", text: "Flickering lights, dead outlets, tripping breakers or partial power? We find the cause and explain the safest next step.", symptoms: "Flickering · Buzzing · No power" },
  { icon: CircuitBoard, title: "Panel Repair & Replacement", text: "We evaluate overloaded, outdated or damaged panels and recommend repair or replacement based on your home’s actual needs.", symptoms: "Hot panel · Frequent trips · Upgrades" },
  { icon: Lightbulb, title: "Outlets, Switches & Lighting", text: "Repair damaged devices, add convenient outlets, improve lighting and correct unsafe electrical connections.", symptoms: "Dead outlets · Dimmers · Fixtures" },
  { icon: BatteryCharging, title: "EV-Charger Installation", text: "Professional home-charger installation with a panel and circuit evaluation for safe, dependable charging.", symptoms: "Level 2 charging · Dedicated circuits" },
  { icon: ShieldCheck, title: "Whole-Home Surge Protection", text: "Help protect appliances and sensitive electronics from voltage spikes with properly installed surge protection.", symptoms: "Storms · Electronics · Appliances" },
  { icon: Power, title: "Generator Connections", text: "Prepare your home for backup power with safe generator connections and electrical-system evaluations.", symptoms: "Inlets · Interlocks · Backup power" },
];

const areas = ["Pasadena", "Pearland", "Friendswood", "Webster", "Clear Lake", "Southeast Houston"];

const heroSlides = [
  { src: "/work/jeff-team.jpg", alt: "Two Jeff Electric technicians standing beside residential electrical service equipment", kicker: "REAL PEOPLE. REAL WORK.", title: "Your local Jeff Electric team" },
  { src: "/work/crew-trenching.png", alt: "Jeff Electric crew installing residential electrical conduit beside a home", kicker: "RESIDENTIAL SERVICE", title: "Professional work at your home" },
  { src: "/work/generator-install.png", alt: "Residential Generac generator and electrical service equipment", kicker: "BACKUP POWER", title: "Generator connection projects" },
  { src: "/work/panel-install.jpg", alt: "Residential electrical panel and meter equipment", kicker: "SERVICE EQUIPMENT", title: "Panel and electrical service work" },
  { src: "/work/pool-lighting-blue.jpg", alt: "Residential swimming pool illuminated with blue underwater lighting at night", kicker: "OUTDOOR LIGHTING", title: "Pool and landscape lighting" },
];

const symptoms = [
  { label: "Breaker keeps tripping", title: "Start with a conversation", text: "Tell us when it happens and what you notice. We’ll ask a few focused questions and help you understand the next step." },
  { label: "Outlet or switch stopped working", title: "We can help you sort it out", text: "You do not need to diagnose it. Let us know what stopped working and we’ll guide the conversation from there." },
  { label: "Lights flicker or dim", title: "Tell us what you’re noticing", text: "Share where and when it happens. Our team will listen, clarify the concern and discuss the right service next step." },
  { label: "Part of the home lost power", title: "Let’s clarify what is affected", text: "Describe which rooms or areas are affected. We’ll gather the useful details and explain what to expect next." },
  { label: "I may need a panel upgrade", title: "Let’s talk about your home’s needs", text: "Tell us what is prompting the upgrade. We’ll discuss your goals and what a professional evaluation would involve." },
  { label: "I want an EV charger", title: "Plan dependable home charging", text: "Tell us about your vehicle and charging goals. We’ll explain the information needed to plan the installation." },
  { label: "I want surge protection", title: "Protect what powers your home", text: "We can discuss whole-home surge protection and how it may fit your electrical system and household priorities." },
  { label: "I’m not sure what the problem is", title: "That’s completely okay", text: "Describe what you see, hear or experience in your own words. You do not need the technical answer before you call." },
];

function Bolt({ small = false }: { small?: boolean }) {
  return <span className={small ? "bolt bolt-small" : "bolt"} aria-hidden="true">ϟ</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [slideshowPaused, setSlideshowPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || slideshowPaused) return;
    const timer = window.setInterval(() => setHeroSlide(current => (current + 1) % heroSlides.length), 6000);
    return () => window.clearInterval(timer);
  }, [slideshowPaused]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = document.querySelectorAll(".reassurance, .power-check, .process-top, .process ol, .section-heading, .compact-services, .real-work-heading, .work-gallery, .areas-copy, .map-card, .contact-copy, .contact form");
    elements.forEach(element => element.classList.add("reveal"));
    if (reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach(element => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: .14, rootMargin: "0px 0px -6%" });
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const w = window as typeof window & { Forminit?: new () => { submit: (formId: string, data: FormData) => Promise<{ error?: { message?: string } }> } };
      if (!w.Forminit) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://forminit.com/sdk/v1/forminit.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Forminit SDK did not load"));
          document.body.appendChild(script);
        });
      }
      if (!w.Forminit) throw new Error("Forminit SDK did not load");
      const forminit = new w.Forminit();
      const result = await forminit.submit("pojgp0vhkve", new FormData(form));
      if (result?.error) throw new Error(result.error.message || "Submission failed");
      setSent(true);
      form.reset();
    } catch (error) {
      console.error("Form submission failed:", error);
      window.alert("Sorry, something went wrong. Please call Jeff Electric at (346) 398-4485.");
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Jeff Electric home">
          <img className="brand-icon" src="/brand/jeff-electric-mark.png" alt="" />
          <img className="brand-wordmark" src="/brand/jeff-electric-wordmark.png" alt="Jeff Electric — Wiring Tomorrow, Today" />
        </a>
        <button className="menu-button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          <a href="#help" onClick={() => setMenuOpen(false)}>Common Problems</a>
          <a href="#process" onClick={() => setMenuOpen(false)}>What to Expect</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#areas" onClick={() => setMenuOpen(false)}>Service Areas</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <div className="header-actions">
          <a className="phone" href="tel:+13463984485"><span>Call now</span>(346) 398-4485</a>
          <a className="button button-gold" href="#contact">Request a Quote</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-content">
          <p className="eyebrow"><span /> LOCAL RESIDENTIAL ELECTRICIANS · SOUTHEAST HOUSTON</p>
          <h1>Something wrong with your<br /><em>home’s electrical?</em></h1>
          <p className="hero-copy">You don’t have to diagnose it yourself. Tell Jeff Electric what you’re noticing, and we’ll help you understand the next step—clearly and without pressure.</p>
          <div className="hero-actions">
            <a className="button button-gold button-large" href="tel:+13463984485">☎ Call (346) 398-4485</a>
            <a className="button button-outline button-large" href="#contact">Request a Quote <span>→</span></a>
          </div>
          <p className="coverage"><span>●</span> Residential electrical service across Southeast Houston</p>
        </div>
        <figure className="hero-photo" onMouseEnter={() => setSlideshowPaused(true)} onMouseLeave={() => setSlideshowPaused(false)} onFocusCapture={() => setSlideshowPaused(true)} onBlurCapture={() => setSlideshowPaused(false)} aria-roledescription="carousel" aria-label="Real Jeff Electric work">
          <div className="hero-slides" aria-live="polite">
            {heroSlides.map((slide, index) => <img key={slide.src} className={heroSlide === index ? "active" : ""} src={slide.src} alt={heroSlide === index ? slide.alt : ""} aria-hidden={heroSlide !== index} />)}
          </div>
          <figcaption><span>{heroSlides[heroSlide].kicker}</span><strong>{heroSlides[heroSlide].title}</strong></figcaption>
          <div className="slide-controls">
            <button onClick={() => setHeroSlide(current => (current - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous project photo">←</button>
            <div className="slide-dots" role="group" aria-label="Choose project photo">{heroSlides.map((slide, index) => <button key={slide.src} className={heroSlide === index ? "active" : ""} onClick={() => setHeroSlide(index)} aria-label={`Show photo ${index + 1}: ${slide.title}`} aria-current={heroSlide === index ? "true" : undefined} />)}</div>
            <button onClick={() => setHeroSlide(current => (current + 1) % heroSlides.length)} aria-label="Next project photo">→</button>
          </div>
          <div className="slide-progress" key={heroSlide}><span /></div>
        </figure>
      </section>

      <section className="trust-strip" id="why-us">
        <div><b>01</b><strong>NO DIAGNOSIS NEEDED</strong><span>Tell us what you notice</span></div>
        <div><b>02</b><strong>CLEAR EXPLANATIONS</strong><span>Understand your options</span></div>
        <div><b>03</b><strong>RESPECT FOR YOUR HOME</strong><span>A straightforward experience</span></div>
        <div><b>04</b><strong>YOU STAY IN CONTROL</strong><span>Choose how to proceed</span></div>
      </section>
      <section className="reassurance" aria-label="What homeowners can expect">
        <p className="eyebrow dark"><span /> START WHERE YOU ARE</p>
        <h2>You bring the concern.<br /><em>We’ll bring the clarity.</em></h2>
        <p>Home electrical problems can feel uncertain. Our job is to make the conversation easy: listen first, explain clearly and let you decide what happens next.</p>
      </section>

      <section className="power-check" id="help">
        <div className="power-check-intro">
          <p className="eyebrow"><span /> WHAT ARE YOU DEALING WITH?</p>
          <h2>Start with what<br />you notice.</h2>
          <p>Choose the closest match. This does not diagnose the problem—it simply helps you start a useful conversation with our team.</p>
          <div className="check-disclaimer">Nothing quite fits? That’s normal. Call us and describe it in your own words.</div>
        </div>
        <div className="check-tool">
          <div className="check-options" role="list" aria-label="Electrical symptoms">
            {symptoms.map((symptom, index) => (
              <button key={symptom.label} className={selectedSymptom === index ? "active" : ""} onClick={() => setSelectedSymptom(index)} aria-pressed={selectedSymptom === index}>
                <span>{String(index + 1).padStart(2, "0")}</span>{symptom.label}<b>→</b>
              </button>
            ))}
          </div>
          <div className="check-result" role="status" aria-live="polite">
            <p>YOUR NEXT STEP</p>
            <div className="result-signal"><span />CALL JEFF ELECTRIC</div>
            <h3>{symptoms[selectedSymptom].title}</h3>
            <p>{symptoms[selectedSymptom].text}</p>
            <a className="button button-gold result-button" href="tel:+13463984485">Call Jeff Electric</a>
          </div>
        </div>
      </section>

      <section className="process" id="process">
        <div className="process-top">
          <div><p className="eyebrow"><span /> WHAT HAPPENS WHEN YOU CONTACT US?</p><h2>Four clear steps.<br /><em>No guessing.</em></h2></div>
          <div className="process-promise"><strong>YOU ALWAYS KNOW WHAT COMES NEXT.</strong><p>A homeowner-first experience built around calm communication, clear expectations and respect for your decisions.</p></div>
        </div>
        <ol>
          <li><span>01</span><div><b>TELL US</b><strong>Share what’s happening</strong><p>Call or send a short request. No technical explanation required—just tell us what you notice.</p></div></li>
          <li><span>02</span><div><b>CLARIFY</b><strong>We discuss the next step</strong><p>We ask useful questions and explain whether a service visit fits your concern.</p></div></li>
          <li><span>03</span><div><b>EXPLAIN</b><strong>Understand the recommendation</strong><p>Your technician evaluates the issue and walks you through the findings in plain language.</p></div></li>
          <li><span>04</span><div><b>YOU DECIDE</b><strong>Choose how to proceed</strong><p>You understand the options before work moves forward. Questions are welcome.</p></div></li>
        </ol>
        <div className="process-cta"><p>Ready for step one?</p><a className="button button-gold" href="tel:+13463984485">Call (346) 398-4485</a><a className="button button-outline" href="#contact">Tell Us What’s Happening</a></div>
      </section>

      <section className="section services" id="services">
        <div className="section-heading">
          <div><p className="eyebrow dark"><span /> HOW WE HELP</p><h2>Home electrical work,<br /><em>explained simply.</em></h2></div>
          <p>You do not need to pick the perfect service. These are common ways we help Southeast Houston homeowners.</p>
        </div>
        <div className="compact-services">
          {services.map((service, index) => {
            const ServiceIcon = service.icon;
            return <article key={service.title}>
              <span>{String(index + 1).padStart(2, "0")}</span><div><b className="service-silhouette"><ServiceIcon aria-hidden="true" /></b><h3>{service.title}</h3><p>{service.text}</p></div><a href="#contact" aria-label={`Ask about ${service.title}`}>→</a>
            </article>;
          })}
        </div>
        <div className="service-assist"><span>NOT SURE?</span><p>Describe what’s happening in your own words. We’ll help identify the right starting point.</p><a href="tel:+13463984485">Call Jeff Electric →</a></div>
      </section>

      <section className="real-work" aria-labelledby="real-work-title">
        <div className="real-work-heading"><p className="eyebrow"><span /> REAL JEFF ELECTRIC WORK</p><h2 id="real-work-title">The people and projects<br /><em>behind the promise.</em></h2><p>No stock-photo crew. These are real Jeff Electric technicians working on real homes.</p></div>
        <div className="work-gallery">
          <figure className="work-tall"><img src="/work/crew-trenching.png" alt="Jeff Electric crew installing residential electrical conduit beside a home" /><figcaption><span>ON-SITE</span>Residential electrical work</figcaption></figure>
          <figure><img src="/work/generator-install.png" alt="Residential Generac generator and electrical service equipment" /><figcaption><span>BACKUP POWER</span>Generator connection project</figcaption></figure>
          <figure><img src="/work/panel-install.jpg" alt="Residential electrical panel and meter equipment" /><figcaption><span>SERVICE EQUIPMENT</span>Panel and service work</figcaption></figure>
          <figure><img src="/work/pool-technician.jpg" alt="Jeff Electric technician working near a residential pool" /><figcaption><span>POOL ELECTRICAL</span>On-site residential work</figcaption></figure>
          <figure className="work-wide"><img src="/work/pool-lighting-green.jpg" alt="Residential swimming pool illuminated with green underwater lighting at night" /><figcaption><span>OUTDOOR LIGHTING</span>Pool and landscape lighting</figcaption></figure>
          <figure><img src="/work/pool-lighting-blue.jpg" alt="Residential swimming pool illuminated with blue underwater lighting at night" /><figcaption><span>FINISHED PROJECT</span>Lighting after dark</figcaption></figure>
        </div>
      </section>

      <section className="section areas" id="areas">
        <div className="areas-copy">
          <p className="eyebrow dark"><span /> PROUDLY SERVING OUR NEIGHBORS</p>
          <h2>Residential electrical service<br /><em>across Southeast Houston.</em></h2>
          <p>Southeast Houston is our service umbrella. Jeff Electric helps homeowners throughout the area with clear communication and professional electrical service.</p>
          <div className="area-tags">{areas.map(area => <span key={area}>⌖ {area}</span>)}</div>
          <a className="text-link" href="#contact">Not sure if we serve your area? Ask us →</a>
        </div>
        <div className="map-card" aria-label="Southeast Houston service area map showing Pasadena, Pearland, Friendswood, Webster and Clear Lake">
          <div className="map-grid" />
          <div className="coverage-zone" />
          <i className="map-route route-225" /><i className="map-route route-45" /><i className="map-route route-beltway" /><i className="map-route route-bay" />
          <span className="route-label label-225">SH 225</span><span className="route-label label-45">I-45</span><span className="route-label label-beltway">BELTWAY 8</span><span className="route-label label-bay">BAY AREA BLVD</span>
          <span className="place place-houston"><i />SOUTHEAST HOUSTON</span>
          <span className="place place-pasadena"><i />PASADENA</span>
          <span className="place place-pearland"><i />PEARLAND</span>
          <span className="place place-friendswood"><i />FRIENDSWOOD</span>
          <span className="place place-clearlake"><i />CLEAR LAKE</span>
          <span className="place place-webster"><i />WEBSTER</span>
          <div className="map-pin"><Bolt small /></div>
          <div className="map-label"><strong>JEFF ELECTRIC</strong><span>Residential service coverage</span></div>
          <div className="map-legend"><span><i />CORE SERVICE UMBRELLA</span><strong>SOUTHEAST HOUSTON</strong></div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-copy">
          <p className="eyebrow"><span /> START THE CONVERSATION</p>
          <h2>Tell us what’s<br /><em>happening.</em></h2>
          <p>You do not need the right terminology. Share what you notice, what you want to add or what you’re unsure about. We’ll contact you to discuss the next step.</p>
          <a className="contact-phone" href="tel:+13463984485"><small>Prefer to talk now?</small><strong>☎ (346) 398-4485</strong></a>
          <p className="privacy">Your information is used only to respond to your service request.</p>
        </div>
        {sent ? (
          <div className="success" role="status"><span>✓</span><h3>Thanks—we received your request.</h3><p>Prefer to talk with us? Call Jeff Electric at <a href="tel:+13463984485">(346) 398-4485</a>.</p><button onClick={() => setSent(false)}>Send another request</button></div>
        ) : (
          <form onSubmit={submitQuote} method="POST" action="https://forminit.com/f/pojgp0vhkve">
            <input type="hidden" name="_subject" value="New service request from jeffelectric.online" />
            <div className="form-row"><label>Full name<input required name="fi-sender-firstName" autoComplete="name" placeholder="Your name" /></label><label>Phone number<input required name="fi-phone-phoneNumber" type="tel" autoComplete="tel" placeholder="(000) 000-0000" /></label></div>
            <div className="form-row"><label>ZIP code<input required name="fi-text-zipCode" inputMode="numeric" autoComplete="postal-code" placeholder="77502" /></label><label>Preferred contact<select name="fi-select-preferredContact"><option>Phone call</option><option>Text message</option><option>Email</option></select></label></div>
            <label>Type of electrical problem<select required name="fi-select-serviceType" defaultValue=""><option value="" disabled>Select a service</option>{services.map(service => <option key={service.title}>{service.title}</option>)}<option>Something else</option></select></label>
            <label>What are you experiencing?<textarea required name="fi-text-message" rows={4} placeholder="Tell us what you noticed, when it started, and anything else that may help." /></label>
            <label>Photo of the issue (optional)<input type="file" name="fi-file-photo" accept="image/*" /></label>
            <button className="button button-gold button-large" type="submit">Send Service Request <span>→</span></button>
          </form>
        )}
      </section>

      <footer>
        <a className="brand footer-brand" href="#top" aria-label="Jeff Electric home"><img src="/brand/jeff-electric-logo.png" alt="Jeff Electric — Wiring Tomorrow, Today" /></a>
        <div><strong>Service Area</strong><span>Southeast Houston</span></div>
        <div><strong>Call Jeff Electric</strong><a href="tel:+13463984485">(346) 398-4485</a></div>
        <div><strong>Quick Links</strong><a href="#services">Services</a><a href="#contact">Request a Quote</a></div>
        <p>© 2026 Jeff Electric. All rights reserved.</p>
      </footer>

      <div className="mobile-bar"><a href="tel:+13463984485">☎ Call Now</a><a href="#contact">Request Quote</a></div>
    </main>
  );
}
