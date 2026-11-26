/* Cross-checks the site's CERTS against the CV's own numbered list (1–16). */
const fs = require('fs'), path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');
const ROOT = __dirname;

const vc = new VirtualConsole();
const dom = new JSDOM(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'),
  { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost:8000/', virtualConsole: vc });
const { window } = dom;
window.HTMLCanvasElement.prototype.getContext = () => null;
window.eval(fs.readFileSync(path.join(ROOT, 'assets/js/truss-bg.js'), 'utf8'));
window.eval(fs.readFileSync(path.join(ROOT, 'assets/js/main.js'), 'utf8'));

setTimeout(() => {
  const doc = window.document;
  const cards = [...doc.querySelectorAll('#cert-grid .cert-card:not([aria-hidden])')];

  console.log('── CV "PROFESSIONAL DEVELOPMENT & TRAINING" (1–16) vs site ──\n');
  let fail = 0;
  cards.forEach((c, i) => {
    const title = c.querySelector('.cert-card__title').textContent.trim();
    const date  = c.querySelector('.cert-card__foot span').textContent.trim();
    const badge = c.querySelector('.cert-card__top span').textContent.trim();
    const num   = c.querySelector('.cert-card__top span:last-child').textContent.trim();
    console.log(`${String(i + 1).padStart(2)}. [${badge.padEnd(12)}] ${title}`);
    console.log(`      ${date}  ·  counter ${num}`);
  });

  console.log('\n── checks ──');
  const ok = (n, cond) => { if (!cond) fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${n}`); };
  ok('21 cards rendered (16 CV + 5 added)', cards.length === 21);
  const body = doc.getElementById('cert-grid').textContent;
  const mustHave = [
    'AutoCAD: Beginner to Advanced',
    'Professional PowerPoint AI Course',
    '21st Century Employability Skilling Program',
    'JavaScript Beginner',
    'ETABS (Zero to Hero)',
    'CFD Simulation using FLOW-3D',
    'Python for GIS Automation',
    'Applied Digital Skills'
  ];
  mustHave.forEach(t => ok(`contains "${t}"`, body.includes(t)));
  ok('all cards show a /21 counter', (cards.map(x => x.textContent).join('').match(/\/21/g) || []).length === 21);
  const mainSrc = fs.readFileSync(path.join(ROOT, 'assets/js/main.js'), 'utf8');
  ok('three CV category groups defined in CERTS',
     ['Structural Design & Codal Compliance', 'Core Structural & Civil Engineering Software',
      'Programming, Automation & Professional Skills'].every(g => mainSrc.includes(g)));
  const metric = doc.querySelector('[data-count]');
  const counts = [...doc.querySelectorAll('[data-count]')].map(e => e.getAttribute('data-count'));
  ok('metrics cert counter is 21', counts[2] === '21');
  console.log('     metrics data-count values:', counts.join(', '));

  console.log('\n' + (fail === 0 ? '✅ ALL 21 CERTIFICATE CARDS CHECKED' : `❌ ${fail} FAILED`));
  process.exit(fail ? 1 : 0);
}, 700);
