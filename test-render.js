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
  check('project slides',       document.querySelectorAll('#project-stage .proj-item').length, 6);
  check('no PDF links in projects', document.querySelectorAll('#projects a[href$=".pdf"]').length, 0);
  const projModal = document.querySelector('#proj-modal');
  checkTrue('project modal exists & hidden', !!projModal && projModal.classList.contains('hidden'));
  ['proj-15','proj-09','proj-07','proj-05','proj-04','proj-03'].forEach(n =>
    checkTrue('cover ' + n + '.jpg on disk', fs.existsSync(path.join(ROOT, 'assets/img/projects', n + '.jpg'))));
  // open the detail modal by clicking the centered slide
  document.querySelectorAll('#project-stage .proj-item')[0]
    .dispatchEvent(new window.Event('click', { bubbles: true }));
  checkTrue('modal opens with project title',
    !projModal.classList.contains('hidden') && /B\+G\+13/.test(document.querySelector('#pm-title').textContent));
  checkTrue('modal role/scope/challenge/solution/result filled',
    ['pm-role','pm-scope','pm-challenge','pm-solution','pm-result']
      .every(id => document.getElementById(id).textContent.length > 20));
  checkTrue('modal meta chips + tags', document.querySelectorAll('#pm-meta .pm-chip').length === 3 &&
    document.querySelectorAll('#pm-tags .tag').length >= 4);
  document.querySelector('#proj-modal .proj-modal__close')
    .dispatchEvent(new window.Event('click', { bubbles: true }));
  setTimeout(() => {
    checkTrue('modal closes again', projModal.classList.contains('hidden'));
  }, 400);
  check('skill groups',         document.querySelectorAll('#skills-grid > div').length, 3);
  check('skill items',          document.querySelectorAll('#skills-grid .space-y-3 > div').length, 12);
  check('certification cards',  document.querySelectorAll('#cert-grid .cert-card:not([aria-hidden])').length, 21);
  check('certification loop clones (aria-hidden)', document.querySelectorAll('#cert-grid .cert-card[aria-hidden="true"]').length, 21);
  check('certification marquee rows', document.querySelectorAll('#cert-grid .cert-row').length, 2);
  {
    const certModal = document.querySelector('#cert-modal');
    document.querySelector('#cert-grid .cert-card[data-cert="4"]')
      .dispatchEvent(new window.Event('click', { bubbles: true }));
    checkTrue('cert modal opens on card click', !certModal.classList.contains('hidden') &&
      /AutoCAD 2D/.test(document.getElementById('cm-title').textContent));
    checkTrue('cert modal shows its certificate image',
      document.getElementById('cm-img').getAttribute('src') === 'assets/img/certs/c-autocad-2d3d-zero-hero.jpg');
    checkTrue('cert modal has a description', document.getElementById('cm-desc').textContent.length > 40);
    certModal.querySelector('.proj-modal__close')
      .dispatchEvent(new window.Event('click', { bubbles: true }));
    checkTrue('cert modal closes', !certModal.classList.contains('is-open'));
  }
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
  check('CV download buttons (nav + hero + mobile menu)', cvLinks.length, 3);
  checkTrue('nav CV button sits right before Contact Me',
    (() => { const n = document.querySelector('nav a[download]');
             return n && n.nextElementSibling && n.nextElementSibling.textContent.trim() === 'Contact Me'; })());
  checkTrue('all CV links point at the supplied filename',
    cvLinks.every(a => a.getAttribute('href') === 'assets/cv/Imran-Hasan-CV.pdf'));
  checkTrue('profile photo points at imran.jpg',
    document.querySelector('img[alt^="Imran Hasan"]').getAttribute('src') === 'assets/img/profile/imran.jpg');
  checkTrue('contact form targets Formspree',
    /formspree\.io\/f\//.test(document.getElementById('contact-form').getAttribute('action')));

  console.log('\n──── NEW FEATURES ────');
  check('testimonial cards', document.querySelectorAll('#testimonials figure').length, 2);
  check('tools repo cards',
    document.querySelectorAll('#tools a[href^="https://github.com/Engr-ImranHasan/"]').length, 3);
  checkTrue('tools profile view-all link',
    !!document.querySelector('#tools a[href="https://github.com/Engr-ImranHasan"]'));
  const copyBtns = [...document.querySelectorAll('[data-copy]')];
  check('copy buttons', copyBtns.length, 3);
  checkTrue('copy values unique', new Set(copyBtns.map(b => b.getAttribute('data-copy'))).size === 3);
  const wa = [...document.querySelectorAll('a[href^="https://wa.me/"]')];
  checkTrue('all ' + wa.length + ' WhatsApp links prefilled',
    wa.every(a => a.getAttribute('href').includes('?text=')));
  checkTrue('radar canvas present', !!document.getElementById('skill-radar'));
  check('timeline items', document.querySelectorAll('.timeline .tl-item').length, 2);
  checkTrue('nav + mobile menu have Tools link',
    !!document.querySelector('#nav-links a[href="#tools"]') &&
    !!document.querySelector('#mobile-menu a[href="#tools"]'));
  checkTrue('404.html exists', fs.existsSync(path.join(ROOT, '404.html')));
  const gscMeta = document.querySelector('meta[name="google-site-verification"]');
  checkTrue('GSC meta is active with real code',
    !!gscMeta && gscMeta.getAttribute('content') === 'poTiwcz5QKWwkQglddZh9AzY2KWJaZIfqKeIVIU8-6I');
  const gcScript = document.querySelector('script[data-goatcounter]');
  checkTrue('GoatCounter script active with real code',
    !!gcScript && gcScript.getAttribute('data-goatcounter') === 'https://imran2050.goatcounter.com/count');
  const cfSuccess = document.querySelector('#cf-success');
  checkTrue('form success card exists', !!cfSuccess);
  checkTrue('success card says Thank you',
    !!cfSuccess && /Thank you for your message/i.test(cfSuccess.textContent));
  checkTrue('success card starts hidden',
    !!cfSuccess && cfSuccess.classList.contains('hidden'));
  checkTrue('send-another button present', !!document.querySelector('#cf-again'));

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
