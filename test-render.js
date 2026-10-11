/* Test harness — runs the real site in jsdom and asserts what actually rendered. */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = __dirname;
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { if (!/Could not load|Not implemented/.test(e.message)) errors.push('jsdomError: ' + e.message); });
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

const dom = new JSDOM(html, {
  runScripts: 'dangerously',

  pretendToBeVisual: true,
  url: 'http://localhost:8000/',
  virtualConsole: vc
});

const { window } = dom;
const { document } = window;

// jsdom has no canvas 2d context -> stub so truss-bg.js takes its null-ctx exit path
window.HTMLCanvasElement.prototype.getContext = function () { return null; };

// REGRESSION GUARD: nothing may yank the page around (the old scrollIntoView bug)
let scrollIntoViewCalls = 0, windowScrollCalls = 0;
window.Element.prototype.scrollIntoView = function () { scrollIntoViewCalls++; };
window.scrollTo = function () { windowScrollCalls++; };

// run BOTH real scripts, in the same order the page does
function load(rel) {
  const code = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  window.eval(code);
}

// actually execute the page's scripts, in the same order the page does
load('assets/js/truss-bg.js');
load('assets/js/main.js');

let failures = 0;
function check(name, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: ${actual}${ok ? '' : ` (expected ${expected})`}`);
}
function checkTrue(name, cond, detail) {
  if (!cond) failures++;
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

setTimeout(() => {
  console.log('\n──── RENDERED CONTENT ────');
  check('project cards',        document.querySelectorAll('#project-grid article').length, 7);
  check('skill groups',         document.querySelectorAll('#skills-grid > div').length, 3);
  check('skill items',          document.querySelectorAll('#skills-grid .space-y-3 > div').length, 12);
  check('certification cards',  document.querySelectorAll('#cert-grid article').length, 16);
  check('carousel slides',      document.querySelectorAll('#carousel-stage img.carousel-item').length, 16);
  check('carousel thumbnails',  document.querySelectorAll('#carousel-thumbs button').length, 16);
  check('marquee row 1 chips',  document.querySelectorAll('#marquee-row-1 > span').length, 20);
  check('marquee row 2 chips',  document.querySelectorAll('#marquee-row-2 > span').length, 20);

  console.log('\n──── THE ORIGINAL BUG (must NOT recur) ────');
  const slides = [...document.querySelectorAll('#carousel-stage img.carousel-item')];
  const srcs = slides.map(s => s.getAttribute('src'));
  checkTrue('all 16 memory srcs are distinct & comma-separated',
    new Set(srcs).size === 16, srcs.length + ' srcs, ' + new Set(srcs).size + ' unique');
  checkTrue('memory-16 present', srcs.includes('assets/img/memories/memory-16.jpg'));
  checkTrue('carousel counter shows total 16',
    document.getElementById('carousel-total').textContent === '16');
  checkTrue('carousel counter starts at 01',
    document.getElementById('carousel-current').textContent === '01');

  console.log('\n──── REMOVED / FIXED ITEMS ────');
  checkTrue('no dead href="#" links anywhere', document.querySelectorAll('a[href="#"]').length === 0);
  checkTrue('no "Verify" buttons remain', !/>\s*Verify\s*</.test(document.body.innerHTML));
  checkTrue('hero has no "(up to G+15)with" typo',
    !document.body.innerHTML.includes('G+15)</strong>with'));
  checkTrue('hero space fixed -> "G+15) with"',
    /G\+15\)<\/strong>\s*with strict/.test(document.body.innerHTML));
  checkTrue('SSC card restored', document.body.innerHTML.includes('Secondary School Certificate'));
  checkTrue('JSC card restored', document.body.innerHTML.includes('Junior School Certificate'));
  checkTrue('HSC card kept', document.body.innerHTML.includes('Higher Secondary Certificate'));
  check('education cards (B.Sc + HSC + SSC + JSC)',
    document.querySelectorAll('#education .grid > div').length, 4);
  checkTrue('SSC & JSC both show GPA 5.00/5.00',
    (document.body.innerHTML.match(/GPA 5\.00\/5\.00/g) || []).length >= 2);
  checkTrue('same school name for SSC & JSC',
    (document.body.innerHTML.match(/Umir Uddin Pilot High School/g) || []).length === 2);
  checkTrue('no FontAwesome <i class="fa-..."> left', document.querySelectorAll('i[class*="fa-"]').length === 0);
  checkTrue('no Tailwind CDN script', !/cdn\.tailwindcss\.com/.test(document.documentElement.outerHTML));
  checkTrue('no AOS library', !/unpkg\.com\/aos/.test(document.documentElement.outerHTML));
  checkTrue('no placehold.co external fallback', !/placehold\.co/.test(document.documentElement.outerHTML));
  checkTrue('mobile menu button exists', !!document.getElementById('menu-btn'));

  console.log('\n──── SEO / META ────');
  checkTrue('meta description', !!document.querySelector('meta[name="description"]'));
  checkTrue('og:image', !!document.querySelector('meta[property="og:image"]'));
  checkTrue('twitter:card', !!document.querySelector('meta[name="twitter:card"]'));
  checkTrue('canonical', !!document.querySelector('link[rel="canonical"]'));
  checkTrue('favicon', !!document.querySelector('link[rel="icon"]'));
  checkTrue('JSON-LD Person', /"@type":\s*"Person"/.test(document.documentElement.outerHTML));
  let jsonldOK = true;
  try { JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent); }
  catch (e) { jsonldOK = false; }
  checkTrue('JSON-LD parses as valid JSON', jsonldOK);

  console.log('\n──── CV / CONTACT ────');
  const cvLinks = [...document.querySelectorAll('a[download]')];
  check('CV download buttons', cvLinks.length, 2);
  checkTrue('all CV links point at the supplied filename',
    cvLinks.every(a => a.getAttribute('href') === 'assets/cv/Imran-Hasan-CV.pdf'));
  checkTrue('profile photo points at imran.jpg',
    document.querySelector('img[alt^="Imran Hasan"]').getAttribute('src') === 'assets/img/profile/imran.jpg');
  checkTrue('contact form targets Formspree',
    /formspree\.io\/f\//.test(document.getElementById('contact-form').getAttribute('action')));

}, 800);

// second phase: let the 4s autoplay fire at least once, then check nothing scrolled
setTimeout(() => {
  console.log('\n──── REGRESSION: page must never auto-scroll ────');
  console.log('  (waited through one full 4s autoplay cycle)');
  check('scrollIntoView calls', scrollIntoViewCalls, 0);
  check('window.scrollTo calls', windowScrollCalls, 0);
  const strip = document.getElementById('carousel-thumbs');
  checkTrue('no scrollIntoView CALL remains in main.js (comments are fine)',
    !/\.scrollIntoView\s*\(/.test(fs.readFileSync(path.join(ROOT, 'assets/js/main.js'), 'utf8')));
  checkTrue('carousel advanced past slide 1 by autoplay',
    document.getElementById('carousel-current').textContent !== '01',
    'counter now ' + document.getElementById('carousel-current').textContent);

  console.log('\n──── RUNTIME ERRORS ────');
  check('js errors during boot', errors.length, 0);
  errors.slice(0, 8).forEach(e => console.log('   ' + e));

  console.log('\n' + (failures === 0 ? '✅ ALL CHECKS PASSED' : `❌ ${failures} CHECK(S) FAILED`));
  process.exit(failures === 0 ? 0 : 1);
}, 4700);
