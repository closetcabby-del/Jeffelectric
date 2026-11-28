// Static and mocked tests. These do not submit leads or verify live delivery.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const en = read('index.html'), es = read('es/index.html');

test('language homepages have reciprocal alternates and their own canonical URL', () => {
  for (const [lang, html, path] of [['en', en, '/'], ['es', es, '/es/']]) {
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    assert.ok(html.includes(`rel="canonical" href="https://jeffelectric.online${path}"`));
    for (const [code, url] of [['en','/'], ['es','/es/'], ['x-default','/']]) {
      assert.equal(html.split(`rel="alternate" hreflang="${code}" href="https://jeffelectric.online${url}"`).length - 1, 1);
    }
    assert.match(html, /class="language-switch"/);
    assert.ok(html.includes(`lang="${lang}" hreflang="${lang}" aria-current="page"`));
  }
  assert.match(read('sitemap.xml'), /<loc>https:\/\/jeffelectric.online\/es\/<\/loc>/);
});

test('English headline and metadata stay English; Spanish is present in static HTML', () => {
  assert.match(en, /<title>Residential Electrician in Southeast Houston \| Jeff Electric<\/title>/);
  assert.match(en, /Residential electrician<br\s*\/><em>in Southeast Houston\./);
  assert.match(es, /Electricista residencial en el sureste de Houston/);
  assert.match(es, /Dirección del servicio \(opcional\)/);
  assert.match(es, /name="fi-text-pageLanguage" value="es"/);
  assert.doesNotMatch(es, /<title>Residential Electrician/);
});

test('translated reviews and untranslated video are labeled honestly', () => {
  assert.equal((es.match(/Traducci\u00f3n del ingl\u00e9s/g) || []).length, 7);
  assert.match(read('es/mobile-motion.js'), /Video en ingl\u00e9s\./);
  assert.match(read('es/mobile-motion.js'), /jeff-electric-feature-full.mp4/);
  for (const name of ['Joshua Ly','Teresa Rainer','Stephen Evans']) assert.ok(es.includes(name));
});

test('Spanish local assets resolve and English-only service links are identified', () => {
  for (const match of es.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const value=match[1];
    if (/^(?:https?:|tel:|mailto:|data:)/.test(value)) continue;
    const pathname = value.split(/[?#]/)[0];
    const path = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
    assert.ok(existsSync(new URL(path.replace(/^\//,''),root)), value);
  }
  assert.match(es, /data-english-target="true"/);
  assert.match(es, /\(en ingl\u00e9s\)/);
  assert.doesNotMatch(es, /(?:src|href)="\.\/public/);
  assert.match(read('es/mobile-motion.js'), /\/es\/mobile-motion-legacy.js/);
});

test('both languages retain phone contact, hours and private language navigation', () => {
  for (const html of [en, es]) assert.ok(html.includes('href="tel:+13463984485"'));
  assert.match(es, /8 a\. m\. a 7 p\. m\./);
  const code = read('language-switch.js');
  assert.doesNotMatch(code, /navigator.language|localStorage|sessionStorage/);
  assert.ok(code.includes("location.hash === '#mobile-quote' ? '#contact'"));
});

test('all generated JavaScript parses without a translation-induced syntax error', () => {
  for (const file of ['language-switch.js','es/mobile-motion.js','es/mobile-motion-legacy.js']) new vm.Script(read(file),{filename:file});
  for (const match of es.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!match[1].includes('application/ld+json') && match[2].trim()) new vm.Script(match[2]);
  }
});
