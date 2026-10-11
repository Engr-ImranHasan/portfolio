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
  const cards = [...doc.querySelectorAll('#cert-grid article')];

  console.log('── CV "PROFESSIONAL DEVELOPMENT & TRAINING" (1–16) vs site ──\n');
  let fail = 0;
  cards.forEach((c, i) => {
    const title = c.querySelector('h4').textContent.trim();
    const grp   = [...c.querySelectorAll('p')].pop().textContent.trim();
    const date  = c.querySelector('.font-mono').textContent.trim();
    const badge = c.querySelector('span').textContent.trim();
    const num   = c.querySelector('.font-mono.font-bold') ? c.querySelectorAll('.font-mono')[1].textContent.trim() : '';
    console.log(`${String(i + 1).padStart(2)}. [${badge.padEnd(12)}] ${title}`);
    console.log(`      ${grp}  ·  ${date}  ·  counter ${num}`);
  });

  console.log('\n── checks ──');
  const ok = (n, cond) => { if (!cond) fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${n}`); };
  ok('16 cards rendered', cards.length === 16);
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
  ok('all cards show a /16 counter', (body.match(/\/16/g) || []).length === 16);
  ok('three CV category groups present',
     ['Structural Design & Codal Compliance', 'Core Structural & Civil Engineering Software',
      'Programming, Automation & Professional Skills'].every(g => body.includes(g)));
  const metric = doc.querySelector('[data-count]');
  const counts = [...doc.querySelectorAll('[data-count]')].map(e => e.getAttribute('data-count'));
  ok('metrics cert counter is 16', counts[2] === '16');
  console.log('     metrics data-count values:', counts.join(', '));

  console.log('\n' + (fail === 0 ? '✅ ALL 16 CERTIFICATES MATCH THE CV' : `❌ ${fail} FAILED`));
  process.exit(fail ? 1 : 0);
}, 700);
