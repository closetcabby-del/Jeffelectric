// GitHub Pages serves index.html, not the separate vinext build.
// Run with: node --test tests/production-homepage.test.mjs
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { inflateSync } from 'node:zlib';

const root = new URL('../', import.meta.url);
const html = readFileSync(new URL('index.html', root), 'utf8');
const motion = readFileSync(new URL('mobile-motion.js', root), 'utf8');
const legacy = readFileSync(new URL('mobile-motion-legacy.js', root), 'utf8');
const css = readFileSync(new URL('mobile-motion.css', root), 'utf8');
const digest = text => createHash('sha256').update(text).digest('hex');
const section = name => html.match(new RegExp(`<section class="${name}"[\\s\\S]*?<\\/section>`))[0];
const handlerStart = html.indexOf('      const form = document.querySelector');
const handler = html.slice(handlerStart, html.indexOf('    </script>', handlerStart));

test('hero has real team image, verified credentials and working CTA destinations', () => {
  const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)[0];
  assert.match(hero, /hero-team-photo/);
  assert.match(hero, /src="\.\/public\/work\/jeff-team.jpg"/);
  assert.match(hero, /alt="Two Jeff Electric team members on a residential electrical project"/);
  assert.match(hero, /5\.0/);
  assert.match(hero, /13 Google reviews/);
  assert.match(hero, /TECL 39762/);
  assert.match(hero, /Texas Electrical Contractor License/);
  assert.match(hero, /SOUTHEAST HOUSTON/);
  assert.match(hero, /href="tel:\+13463984485"/);
  assert.match(hero, /href="#contact"/);
  assert.doesNotMatch(hero, /hero-slides|slide-controls/);
  assert.doesNotMatch(html, /setInterval\(.*showSlide/);
});

test('approved testimonials and financing remain intact; form uses original provider', () => {
  // Exact baseline hashes from approved production commit 47aa1ba.
  assert.equal(digest(section('reviews-section')), 'cc2f5afa2df4ecf3e1f7f72b59ee30ad6b6e36e20f5f2df7ce827328293f87c1');
  assert.equal(digest(section('financing-section')), 'b52f3c1ee0f5a4c65d0fb6ba2fa92bfc1c30bd962c01d44d517ecccf34e1e6da');
  assert.match(html, /https:\/\/forminit.com\/sdk\/v1\/forminit.js/);
  assert.equal((html.match(/<form\b/g) || []).length, 1);
});

test('existing service and city pages are reachable from homepage', () => {
  const pages = [
    'services.html', 'electrical-troubleshooting.html',
    'electrical-panel-replacement.html', 'ev-charger-installation.html',
    'surge-protection.html', 'generator-interlock-installation.html',
    'electrician-pasadena-tx.html', 'electrician-pearland-tx.html',
    'electrician-friendswood-tx.html', 'electrician-webster-clear-lake-tx.html',
  ];
  for (const page of pages) {
    assert.ok(html.includes(`href="./${page}"`), `Missing link: ${page}`);
    assert.ok(existsSync(new URL(page, root)), `Missing page: ${page}`);
  }
  for (const [, target] of html.matchAll(/href="(\.\/[^"#?]+\.html)"/g)) {
    assert.ok(existsSync(new URL(target, root)), `Broken page link: ${target}`);
  }
  assert.doesNotMatch(html.match(/<nav class="nav"[\s\S]*?<\/nav>/)[0], /href="#help"/);
});

test('video follows reviews, mobile uses DOM order, and mobile estimate links find the form', () => {
  assert.match(motion, /section.id='meet-jeff'/);
  assert.match(motion, /\(document.querySelector\('#reviews'\)\|\|hero\)\.after\(section\)/);
  assert.doesNotMatch(motion, /hero.before/);
  assert.match(css, /body main\{display:block\}/);
  assert.match(legacy, /document.querySelectorAll\('a\[href="#contact"\]'\)/);
  assert.match(legacy, /location.hash==='#contact'/);
  assert.match(legacy, /quick.append\(form\)/);
  assert.match(legacy, /mobileBarQuote.textContent='Request Estimate'/);
  assert.match(html, /mobile-motion\.css\?v=4/);
  assert.match(html, /mobile-motion\.js\?v=4/);
  assert.match(motion, /mobile-motion-legacy\.js\?v=4/);
});

test('all homepage JavaScript parses', () => {
  new vm.Script(motion);
  new vm.Script(legacy);
  for (const [, script] of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    if (!script.trim().startsWith('{')) new vm.Script(script);
  }
});

test('favicon files are valid, square and declared at stable root URLs', () => {
  for (const name of ['favicon-48.png', 'favicon-192.png', 'favicon-512.png', 'apple-touch-icon.png', 'public/favicon.png']) {
    const png = readFileSync(new URL(name, root));
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${name} is not a PNG`);
    let offset = 8, width, height, bitDepth, colorType;
    const idat = [];
    while (offset < png.length) {
      const length = png.readUInt32BE(offset);
      const type = png.subarray(offset + 4, offset + 8).toString('ascii');
      const data = png.subarray(offset + 8, offset + 8 + length);
      if (type === 'IHDR') {
        width = data.readUInt32BE(0);
        height = data.readUInt32BE(4);
        bitDepth = data[8];
        colorType = data[9];
      }
      if (type === 'IDAT') idat.push(data);
      offset += 12 + length;
      if (type === 'IEND') break;
    }
    assert.equal(width, height, `${name} must be square`);
    assert.equal(bitDepth, 8, `${name} must use 8-bit color`);
    assert.equal(colorType, 2, `${name} must use RGB color`);
    assert.equal(inflateSync(Buffer.concat(idat)).length, height * (1 + width * 3), `${name} has damaged image data`);
  }

  const ico = readFileSync(new URL('favicon.ico', root));
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.ok(ico.readUInt16LE(4) >= 1, 'favicon.ico must contain at least one image');
  assert.match(html, /rel="icon" type="image\/png" sizes="192x192" href="\/favicon-192\.png"/);
  assert.match(html, /rel="shortcut icon" href="\/favicon\.ico"/);
  assert.match(html, /rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png"/);
});

async function simulateSubmission({ phone, response = { data: { hashId: "test-submission" } }, sdkMissing = false, networkError = false }) {
  const btn = { disabled: false };
  let submit, sent, prevented = false;
  const alerts = [];
  const leadEvents = [];
  const preferred = { value: 'Phone call', addEventListener() {} };
  const email = { required: false };
  const form = {
    outerHTML: '',
    querySelector: selector => selector.includes('preferredContact') ? preferred : selector.includes('sender-email') ? email : btn,
    addEventListener: (event, callback) => { assert.equal(event, 'submit'); submit = callback; },
  };
  class FakeFormData extends Map {
    constructor() { super([['fi-phone-phoneNumber', phone]]); }
  }
  class FakeForminit {
    async submit(id, data) {
      sent = { id, phone: data.get('fi-phone-phoneNumber') };
      if (networkError) throw new Error('Mock network failure');
      return response;
    }
  }
  vm.runInNewContext(handler, {
    document: { querySelector: () => form },
    window: { Forminit: sdkMissing ? undefined : FakeForminit, jeffTrackLead: () => leadEvents.push('generate_lead') },
    Forminit: FakeForminit, FormData: FakeFormData,
    alert: message => alerts.push(message), console: { error() {} },
  });
  await submit({ preventDefault() { prevented = true; } });
  return { btn, form, alerts, sent, prevented, leadEvents };
}

test('mocked success confirms receipt with the original form ID and normalized phone', async () => {
  for (const phone of ['(346) 555-0100', '1-346-555-0100']) {
    const result = await simulateSubmission({ phone });
    assert.ok(result.prevented);
    assert.deepEqual(result.sent, { id: 'pojgp0vhkve', phone: '+13465550100' });
    assert.match(result.form.outerHTML, /Request received\./);
    assert.match(result.form.outerHTML, /role="status" aria-live="polite"/);
    assert.equal(result.alerts.length, 0);
    assert.deepEqual(result.leadEvents, ['generate_lead']);
  }
});

test('mocked API, SDK and network failures preserve the form and allow retry', async () => {
  for (const scenario of [{ response: {} }, { response: { data: null } }, { response: { error: { message: 'Mock API error' } } }, { sdkMissing: true }, { networkError: true }]) {
    const result = await simulateSubmission({ phone: '(346) 555-0100', ...scenario });
    assert.equal(result.form.outerHTML, '');
    assert.equal(result.btn.disabled, false);
    assert.equal(result.alerts.length, 1);
    assert.equal(result.leadEvents.length, 0);
    assert.match(result.alerts[0], /\(346\) 398-4485/);
  }
});
