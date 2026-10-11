const fs=require('fs'),path=require('path');
const ROOT=__dirname;
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const js=['main.js','truss-bg.js'].map(f=>fs.readFileSync(path.join(ROOT,'assets/js',f),'utf8')).join('\n');

const refs=new Set();
for(const m of html.matchAll(/(?:src|href)="([^"#?]+)"/g)) refs.add(m[1]);
for(const m of js.matchAll(/(?:src|href)\s*=\s*['"]([^'"#?]+)['"]/g)) refs.add(m[1]);

const local=[...refs].filter(u=>!/^https?:|^data:|^mailto:|^tel:|^#/.test(u));
// paths built dynamically in JS
['assets/img/projects/p1.pdf','assets/img/projects/p7.pdf','assets/img/memories/memory-1.jpg','assets/img/memories/memory-16.jpg']
  .concat(['assets/img/icons.svg']).forEach(p=>local.push(p));

const core=[],user=[];
const USER_PAT=/(assets\/img\/(profile|projects|memories|og)\/|assets\/cv\/)/;
for(const p of [...new Set(local)]) (USER_PAT.test(p)?user:core).push(p);

let fail=0;
console.log('── MUST EXIST (shipped with the site) ──');
for(const p of core.sort()){ const ok=fs.existsSync(path.join(ROOT,p)); if(!ok)fail++; console.log(`${ok?'OK  ':'MISS'}  ${p}`); }
console.log('\n── YOU WILL ADD THESE ──');
for(const p of user.sort()){ const ok=fs.existsSync(path.join(ROOT,p)); console.log(`${ok?'HAVE':'todo'}  ${p}`); }

// CSS coverage: classes that only appear inside JS template strings
const css=fs.readFileSync(path.join(ROOT,'assets/css/styles.css'),'utf8');
console.log('\n── CSS COVERAGE (classes emitted by JS must be in the built CSS) ──');
['project-art','glass-panel','tag','rounded-3xl','hover\\:-translate-y-1\\.5','font-heading','carousel-thumb','marquee','btn-primary','section-title','nav-link']
  .forEach(c=>{ const ok=css.replace(/\\/g,'').includes(c.replace(/\\/g,'')); if(!ok)fail++; console.log(`${ok?'OK  ':'MISS'}  .${c.replace(/\\/g,'')}`); });

console.log('\n'+(fail===0?'✅ ALL ASSET/CSS CHECKS PASSED':`❌ ${fail} problem(s)`));
process.exit(fail?1:0);
