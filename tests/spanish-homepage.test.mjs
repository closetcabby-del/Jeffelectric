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
  assert.match(es, /Nombre completo/);
  assert.match(es, /Solicitud recibida\./);
  assert.match(es, /Lo sentimos, no se pudo enviar/);
  assert.doesNotMatch(es, /<title>Residential Electrician/);
});

test('translated reviews and untranslated video are labeled honestly', () => {
  assert.equal((es.match(/Traducci\u00f3n del ingl\u00e9s/g) || []).length, 7);
  assert.match(read('es/mobile-motion.js'), /Video en ingl\u00e9s\./);
  assert.match(read('es/mobile-motion.js'), /jeff-electric-feature-full.mp4/);
  for (const name of ['Joshua Ly','Teresa Rainer','Stephen Evans']) assert.ok(es.includes(name));
});

test('page language and optional follow-up language are separate fields', () => {
  for (const [lang, html] of [['en',en],['es',es]]) {
    assert.ok(html.includes(`name="fi-text-pageLanguage" value="${lang}"`));
    assert.match(html, /select name="fi-select-preferredLanguage"/);
    assert.match(html, /option value="" selected/);
    assert.match(html, /option value="Spanish"/);
  }
  assert.match(es, /<option value="Email">Correo electr\u00f3nico<\/option>/);
  assert.match(es, /<option value="Something else">Otro servicio<\/option>/);
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

test('form route, phone, intake helper and lead tracker remain the same', () => {
  for (const html of [en,es]) {
    assert.match(html, /action="https:\/\/forminit.com\/f\/pojgp0vhkve"/);
    assert.match(html, /src="(?:\.\/|\/)intake-submit.js/);
    assert.match(html, /src="\/lead-tracking.js"/);
    assert.match(html, /href="tel:\+13463984485"/);
    assert.match(html, /JeffElectricIntake.submit\(data, form\)/);
  }
  assert.match(es, /8 a\. m\. a 7 p\. m\./);
  assert.match(read('intake-submit.js'), /\/intake\/website/);
});

test('language navigation guards incomplete forms and does not auto-redirect or store their contents', () => {
  const code=read('language-switch.js');
  assert.match(code,/confirm\(say\(/);
  assert.match(code,/btn|button\[type=/);
  assert.doesNotMatch(code,/navigator.language|location\.assign|location\.replace|localStorage|sessionStorage/);
  assert.match(code,/8 \* 1024 \* 1024/);
  assert.match(code,/image\/jpeg/);
  assert.match(code,/filename.textContent/);
  assert.match(read('language-switch.css'),/input.language-file-input\{display:none!important/);
});

test('all generated JavaScript parses without a translation-induced syntax error', () => {
  for (const file of ['language-switch.js','es/mobile-motion.js','es/mobile-motion-legacy.js']) new vm.Script(read(file),{filename:file});
  for (const match of es.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!match[1].includes('application/ld+json') && match[2].trim()) new vm.Script(match[2]);
  }
});

async function submitSpanish({fail=false,missing=false}={}) {
  const start=es.indexOf('      const form = document.querySelector');
  const handler=es.slice(start,es.indexOf('    </script>',start));
  let handlerFn, callCount=0;
  const button={disabled:false}, events=[], alerts=[];
  const preferred={value:'Email',addEventListener(){}}, email={required:false};
  const form={outerHTML:'',querySelector:s=>s.includes('preferredContact')?preferred:s.includes('sender-email')?email:button,addEventListener:(name,fn)=>{handlerFn=fn;}};
  class FakeData extends Map {constructor(){super([['fi-phone-phoneNumber','(346) 555-0100']]);}}
  vm.runInNewContext(handler,{
    document:{querySelector:()=>form},FormData:FakeData,location:{pathname:'/es/'},
    window:{JeffElectricIntake:missing?undefined:{submit:async data=>{callCount++;assert.equal(data.get('fi-phone-phoneNumber'),'+13465550100');if(fail)throw Error('mock');return {data:{hashId:'qa-test'}};}},gtag:(...args)=>events.push(args)},
    alert:msg=>alerts.push(msg),console:{error(){}}
  });
  await Promise.all([handlerFn({preventDefault(){}}),handlerFn({preventDefault(){}})]);
  return {form,button,events,alerts,callCount,email};
}

test('Spanish successful submission normalizes the phone and counts one lead despite duplicate submits',async()=>{
  const r=await submitSpanish();
  assert.equal(r.callCount,1);
  assert.equal(r.events.length,1);
  assert.equal(r.events[0][1],'generate_lead');
  assert.equal(r.events[0][2].page_path,'/es/');
  assert.equal(Object.keys(r.events[0][2]).join(','),'page_path');
  assert.match(r.form.outerHTML,/Solicitud recibida\./);
  assert.equal(r.email.required,true);
});

test('Spanish failed and missing-helper submissions keep the form and do not count leads',async()=>{
  for (const scenario of [{fail:true},{missing:true}]) {
    const r=await submitSpanish(scenario);
    assert.equal(r.events.length,0);assert.equal(r.form.outerHTML,'');assert.equal(r.button.disabled,false);
    assert.ok(r.alerts.length>=1);assert.match(r.alerts[0],/Lo sentimos/);
  }
});
