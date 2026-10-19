import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../website-call-tracking.js', import.meta.url), 'utf8');
function fixture(blocked = false) {
  const calls = [], links = [], nodes = [];
  let mutate;
  const document = {
    body: {}, readyState: 'complete',
    querySelectorAll: () => links,
    createTreeWalker: () => { let i = 0; return { nextNode: () => nodes[i++] }; }
  };
  const window = blocked ? {} : { gtag: (...args) => calls.push(args) };
  const context = vm.createContext({ window, document, NodeFilter: { SHOW_TEXT: 4 },
    MutationObserver: class { constructor(fn) { mutate = fn; } observe() {} }
  });
  const add = (href, text, excluded = false) => {
    const node = { nodeValue: text, parentElement: { closest: () => excluded } };
    const link = { href, writes: 0, getAttribute() { return this.href; },
      setAttribute(key, value) { this.href = value; this.writes++; } };
    links.push(link); nodes.push(node);
    return { link, node };
  };
  const run = () => vm.runInContext(source, context);
  run();
  return { window, calls, add, run, mutate: () => mutate?.(),
    callback: (...args) => calls[0][2].phone_conversion_callback(...args) };
}

test('real callback changes displayed numbers and dial links without removing CTA copy or unrelated numbers', () => {
  const f = fixture();
  const header = f.add('tel:+13463984485', 'Call now (346) 398-4485');
  const mobile = f.add('tel:3463984485', '☎ Call Now');
  const other = f.add('tel:8005550100', '800-555-0100');
  const schema = f.add('tel:8005550100', '(346) 398-4485', true);
  f.callback('(713) 555-0123', '+17135550123');
  assert.equal(header.link.href, 'tel:+17135550123');
  assert.equal(header.node.nodeValue, 'Call now (713) 555-0123');
  assert.equal(mobile.link.href, 'tel:+17135550123');
  assert.equal(mobile.node.nodeValue, '☎ Call Now');
  assert.equal(other.link.href, 'tel:8005550100');
  assert.equal(schema.node.nodeValue, '(346) 398-4485');
  const success = f.add('tel:+13463984485', 'Llame al (346) 398-4485');
  f.mutate();
  assert.equal(success.link.href, 'tel:+17135550123');
  assert.equal(success.node.nodeValue, 'Llame al (713) 555-0123');
  f.run();
  assert.equal(f.calls.length, 1, 'reloading must not request duplicate configurations');
  assert.equal(f.calls[0][0], 'config', 'never manufacture a completed-call event');
  assert.equal(f.calls[0][1], 'AW-18475284552/1mtNCPqO2KAdEMjw2elE');
});

test('no attribution, blocked tags, or invalid callback leave the working business number intact', () => {
  const f = fixture();
  const original = f.add('tel:+13463984485', '(346) 398-4485');
  f.mutate();
  f.callback('<script>', 'javascript:alert(1)');
  assert.equal(original.link.href, 'tel:+13463984485');
  assert.equal(original.node.nodeValue, '(346) 398-4485');
  f.callback('(346) 398-4485', '+13463984485');
  f.mutate(); f.mutate();
  assert.equal(original.link.writes, 0, 'unchanged fallback must not loop the observer');
  assert.equal(fixture(true).calls.length, 0);
});

test('every public static page with a phone has one call tracker and preserves GA4 and Ads tags', () => {
  const root = new URL('../', import.meta.url);
  const walk = path => readdirSync(new URL(path, root), { withFileTypes: true }).flatMap(e => {
    if (['.git', 'node_modules', 'public'].includes(e.name)) return [];
    const p = path + e.name;
    return e.isDirectory() ? walk(p + '/') : [p];
  });
  const pages = walk('').filter(p => p.endsWith('.html') && readFileSync(new URL(p, root), 'utf8').includes('tel:'));
  assert.equal(pages.length, 19);
  for (const page of pages) {
    const html = readFileSync(new URL(page, root), 'utf8');
    assert.equal((html.match(/src="\/website-call-tracking.js\?v=1"/g) || []).length, 1, page);
    assert.match(html, /gtag\('config', 'G-4BK4Q6NXD6'\)/);
    assert.match(html, /gtag\('config', 'AW-18475284552'\)/);
  }
  assert.equal(readFileSync(new URL('public/website-call-tracking.js', root), 'utf8'), source);
});
