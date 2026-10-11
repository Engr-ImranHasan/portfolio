/* Browser-like verification:
   1. fetch index.html over HTTP from the live server
   2. inline the exact JS files the page references (defer order) and execute
   3. wait through a full autoplay cycle, assert nothing auto-scrolls      */
const fs = require('fs'), path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const ROOT = __dirname;

const errs = [];
const vc = new VirtualConsole();
// jsdom itself lacks canvas 2d — known env noise, not a page error
// (truss-bg.js guards with `if (!ctx) return`)
vc.on('jsdomError', e => {
  if (/HTMLCanvasElement's getContext/.test(e.message)) return;
  errs.push('jsdomError: ' + e.message);
});
vc.on('error', (...a) => errs.push('console.error: ' + a.join(' ')));

(async () => {
  const res = await fetch('http://localhost:8000/');
  const html = await res.text();

  // inline local scripts exactly as referenced (keeps defer order)
  let inlined = html.replace(
    /<script src="((?!https?:)[^"]+)" defer><\/script>/g,
    (_, src) => {
      const file = path.join(ROOT, src.split('?')[0]);
      return '<script>' + fs.readFileSync(file, 'utf8') + '</script>';
    });

  const dom = new JSDOM(inlined, {
    runScripts: 'dangerously', pretendToBeVisual: true,
    url: 'http://localhost:8000/', virtualConsole: vc
  });
  const { window } = dom;
  window.HTMLCanvasElement.prototype.getContext = () => null;

  let siv = 0, wst = 0;
  window.Element.prototype.scrollIntoView = function () { siv++; };
  window.scrollTo = function () { wst++; };

  let fail = 0;
  const ok = (n, cond, extra) => { if (!cond) fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${n}${extra ? ' — ' + extra : ''}`); };

  setTimeout(() => {
    const d = window.document;
    console.log('── page fetched over HTTP, real scripts executed ──');
    ok('served index.html uses cache-busting query', /main\.js\?v=\d+/.test(html));
    ok('project cards rendered', d.querySelectorAll('#project-grid article').length === 7);
    ok('16 cert cards rendered', d.querySelectorAll('#cert-grid article').length === 16);
    ok('16 carousel slides', d.querySelectorAll('#carousel-stage img.carousel-item').length === 16);
    ok('truss canvas present', !!d.getElementById('truss-canvas'));

    console.log('\n── REGRESSION (after a full 4s autoplay cycle) ──');
    ok('zero scrollIntoView calls', siv === 0, 'count ' + siv);
    ok('zero window.scrollTo calls', wst === 0, 'count ' + wst);
    ok('autoplay did run', d.getElementById('carousel-current').textContent !== '01',
       'counter ' + d.getElementById('carousel-current').textContent);
    ok('no runtime errors', errs.length === 0, errs.slice(0, 5).join(' | '));

    console.log('\n' + (fail === 0 ? '✅ LIVE PAGE VERIFIED CLEAN' : `❌ ${fail} FAILED`));
    process.exit(fail ? 1 : 0);
  }, 5000);
})();
