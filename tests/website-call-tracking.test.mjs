import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');

function* pages(directory) {
  for (const entry of readdirSync(new URL(directory, root), { withFileTypes: true })) {
    const path = directory + entry.name;
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist') {
        yield* pages(path + '/');
      }
    } else if (entry.name.endsWith('.html')) {
      yield path;
    }
  }
}

test('website call links always dial the company line, including on mobile and in Spanish', () => {
  const checked = new Set();
  for (const path of pages('')) {
    const html = read(path);
    const calls = [...html.matchAll(/href=["']tel:([^"']+)["']/gi)];
    if (!calls.length) continue;
    checked.add(path);
    for (const [, number] of calls) assert.equal(number, '+13463984485', path);
    assert.doesNotMatch(html, /website-call-tracking\.js|phone_conversion_number/, path);
  }
  assert.ok(checked.has('index.html'));
  assert.ok(checked.has('es/index.html'));
  assert.doesNotMatch(read('app/layout.tsx'), /website-call-tracking\.js|phone_conversion_number/);
});

test('cached pages can load the retired script without replacing their phone number', () => {
  for (const path of ['website-call-tracking.js', 'public/website-call-tracking.js']) {
    assert.equal(read(path).replace(/^\s*\/\/[^\n]*/gm, '').trim(), '', path);
  }
});
