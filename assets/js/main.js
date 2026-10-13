/* ================================================================
   Imran Hasan — Portfolio  ·  main.js
   No build step, no dependencies. Everything degrades safely.
   ================================================================ */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var ICON = 'assets/img/icons.svg#';
  function icon(id, cls) {
    return '<svg class="icon ' + (cls || '') + '" aria-hidden="true"><use href="' + ICON + id + '"></use></svg>';
  }

  /* Placeholder art used whenever a real image is missing, so the page
     never shows a broken-image icon. */
  function placeholder(label, w, h) {
    var lines = '';
    for (var x = 0; x < w; x += 40) lines += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + h + '"/>';
    for (var y = 0; y < h; y += 40) lines += '<line x1="0" y1="' + y + '" x2="' + w + '" y2="' + y + '"/>';
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<rect width="' + w + '" height="' + h + '" fill="#0f172a"/>' +
      '<g stroke="#1e293b" stroke-width="1">' + lines + '</g>' +
      '<text x="50%" y="52%" font-family="monospace" font-size="' + Math.round(w / 14) +
      '" fill="#3b82f6" text-anchor="middle">' + label + '</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ====================================================================
     ✏️✏️✏️  EDIT YOUR CONTENT HERE  ✏️✏️✏️
     ==================================================================== */

  /* ---- Projects: cover images in assets/img/projects/proj-*.jpg ----
     ✏️ EDIT: role / scope / challenge / solution / result text নিজের মতো বদলে নিও */
  var PROJECTS = [
    { img: 'assets/img/projects/proj-15.jpg', cat: 'Residential Tower', accent: 'blue',
      title: 'B+G+13 Storied Tower — Lovely Road, Subid Bazar, Sylhet',
      storey: 'B+G+13', location: 'Subid Bazar, Sylhet', client: 'Apon Associates',
      role: 'Structural design engineer (EPCT team) — full ETABS modelling, analysis, member design and reinforcement detailing; joined site visits for mat-concreting and column verticality checks.',
      scope: 'Complete structural package for a 14-level tower: gravity, wind and BNBC 2020 seismic analysis, mat–pile foundation design, slab–beam–column detailing and bar bending schedules.',
      challenge: 'High-seismic Sylhet zone on soft alluvial soil, with irregular balcony setbacks producing torsion under lateral load.',
      solution: 'Stiffness-regularised frame with capacity-designed joints and a pile–mat composite foundation, checked against BNBC 2020 and ACI 318.',
      result: 'Drawing package approved with minimal correction — 126 coordinated sheets delivered across architectural, structural, electrical and sanitary trades.',
      tags: ['ETABS', 'CSI SAFE', 'BNBC 2020', 'ACI 318', 'AutoCAD'] },

    { img: 'assets/img/projects/proj-09.jpg', cat: 'Residential · G+8', accent: 'emerald',
      title: '(G+8) 9 Storied Residence — Lechubagan, Sylhet',
      storey: 'G+8', location: 'Lechubagan, Sylhet', client: 'Mr. Nurul Islam Khan',
      role: 'Structural engineer under EPCT — modelling, design and detailing; site inspection during foundation and upper-floor slab casting.',
      scope: 'Nine-level RC frame: seismic analysis, foundation design, full reinforcement detailing and quantity estimation.',
      challenge: 'Narrow urban plot with adjacent structures — limited workspace for excavation and strict drift control.',
      solution: 'Compact lateral system with regularised stiffness, plus staged construction checks coordinated with the contractor.',
      result: '51-sheet structural package delivered; construction progressed with zero design revisions after issue.',
      tags: ['ETABS', 'CSI SAFE', 'AutoCAD', 'BNBC 2020'] },

    { img: 'assets/img/projects/proj-07.jpg', cat: 'Apartment · G+6', accent: 'amber',
      title: 'G+6 Apartment Blocks A–E — Suvechcha, Miafazilchist, Sylhet',
      storey: 'G+6', location: 'Miafazilchist, Sylhet', client: 'Dreamland Property Developer',
      role: 'Structural designer (EPCT) — five apartment blocks modelled and detailed; periodic site supervision visits.',
      scope: 'Repeatable multi-block structural system: typical-floor plate optimisation, foundation design and BBS for all five blocks.',
      challenge: 'Five blocks with mirrored unit plans — keeping one consistent, error-free detailing standard across blocks.',
      solution: 'Parameterised typical-plate design with a shared detailing template and Excel-driven bar bending schedules.',
      result: '71-sheet package covering all blocks; repetitive floors cut detailing time significantly.',
      tags: ['ETABS', 'AutoCAD', 'MS Excel', 'BBS'] },

    { img: 'assets/img/projects/proj-05.jpg', cat: 'Residential · 5-Storied', accent: 'blue',
      title: 'Five Storied Residence — North Bagbari, Sylhet',
      storey: 'G+4', location: 'North Bagbari, Sylhet', client: 'Mrs. Jhuma Rani Talukder',
      role: 'Structural engineer (EPCT) — design, detailing and soil-investigation coordination; borehole testing supervised on site.',
      scope: 'Five-level residence on borehole-informed foundation: site plan, substructure design and full superstructure detailing.',
      challenge: 'Weak near-surface soil next to a canal — settlement and bearing-capacity risk for a shallow foundation.',
      solution: 'Foundation selected from borehole data (BH-1/BH-2) with settlement checks and conservative bearing design.',
      result: '45-sheet package with site & borehole-integrated foundation design, approved for construction.',
      tags: ['ETABS', 'CSI SAFE', 'Borehole Data', 'AutoCAD'] },

    { img: 'assets/img/projects/proj-04.jpg', cat: 'Residential · G+3', accent: 'emerald',
      title: 'G+3 Residence — Lake City, Akhalia, Sylhet',
      storey: 'G+3', location: 'Lake City, Akhalia, Sylhet', client: 'Dr. Nadira Begum',
      role: 'Structural designer (EPCT) — analysis, detailing and quantity take-off; site checks at key casting stages.',
      scope: 'Four-level residence: gravity and seismic design, foundation and full reinforcement drawings.',
      challenge: 'Multi-unit typical floor (two mirrored units per plate) requiring clean, clash-free detailing.',
      solution: 'Symmetric layout exploited for modelling efficiency; standardised beam–slab detailing across floors.',
      result: '39-sheet structural set issued for construction with consistent unit-wise quantity estimates.',
      tags: ['ETABS', 'AutoCAD', 'BNBC 2020'] },

    { img: 'assets/img/projects/proj-03.jpg', cat: 'Residential · G+3', accent: 'amber',
      title: 'G+3 Residence — Shilam, Sylhet',
      storey: 'G+3', location: 'Shilam, Sylhet', client: 'Private Client',
      role: 'Structural engineer (EPCT) — compact 2,600 sft residence designed and detailed end-to-end.',
      scope: 'Four-level, 2,600 sft residence: frame analysis, foundation design, GF/typical floor detailing.',
      challenge: 'Small footprint with a 5′-7″ corridor core — fitting an efficient stair and frame into a tight plan.',
      solution: 'Optimised column grid aligned to partition walls; economical member sizes within BNBC 2020 limits.',
      result: '19-sheet lean drawing set — full structural design for a modest budget without over-design.',
      tags: ['ETABS', 'AutoCAD', 'BNBC 2020'] }
  ];

  /* ---- Marquee tool rows ---- */
  var TOOLS_ROW_1 = ['ETABS', 'CSI SAFE', 'AutoCAD 2D/3D', 'Revit', 'ArcGIS Pro', 'Python', 'EPANET', 'FLOW-3D', 'BNBC 2020', 'ACI 318'];
  var TOOLS_ROW_2 = ['SPSS', 'Minitab', 'MS Excel (Advanced)', 'Google Workspace', 'HTML / CSS / JS', 'Java', 'QGIS', 'AISC', 'Genetic Algorithms', 'AI-Assisted Workflows'];

  /* ---- Skills matrix ---- */
  var SKILL_GROUPS = [
    {
      title: 'Structural Design', sub: 'Analysis & Detailing', accent: 'blue', icon: 'i-cubes',
      items: [
        { name: 'ETABS & CSI SAFE',    note: 'Structural & Foundation Analysis', badge: 'Core',        kind: 'blue' },
        { name: 'AutoCAD 2D / 3D & Revit', note: 'Structural Drafting & BIM',    badge: 'Expert',      kind: 'blue' },
        { name: 'EPANET & FLOW-3D',    note: 'Hydraulic & CFD Simulation',       badge: 'Simulations', kind: 'plain' },
        { name: 'BNBC 2020 / ACI / AISC', note: 'Design Codes & Standards',      badge: 'Codal',       kind: 'blue' }
      ]
    },
    {
      title: 'GIS & Data Analytics', sub: 'Geospatial Intelligence', accent: 'amber', icon: 'i-earth-americas',
      items: [
        { name: 'ArcGIS Pro',              note: 'Spatial Mapping & Vulnerability', badge: 'Advanced',   kind: 'amber' },
        { name: 'Python for GIS Automation', note: 'Geospatial Scripting & Workflows', badge: 'Automation', kind: 'amber' },
        { name: 'SPSS & Minitab Modeling', note: 'Hypothesis Testing & Statistics',  badge: 'Analytics',  kind: 'plain' },
        { name: 'AI Integration',          note: 'ChatGPT & Gemini for Automation',  badge: 'Modern',     kind: 'amber' }
      ]
    },
    {
      title: 'Software & Tech Stack', sub: 'Programming & Web', accent: 'emerald', icon: 'i-laptop-code',
      items: [
        { name: 'MS Office (Word, Excel, PowerPoint)', note: 'Professional Engineering Suite', badge: 'Proficient', kind: 'emerald' },
        { name: 'HTML5 / CSS3 / JavaScript',           note: 'Frontend Web Fundamentals',      badge: 'Web',        kind: 'plain' },
        { name: 'Java Programming',                    note: 'Core Object-Oriented Logic',     badge: 'Code',       kind: 'plain' },
        { name: 'Google Workspace (Certified)',        note: 'Cloud Collaboration & Data',     badge: 'Certified',  kind: 'emerald' }
      ]
    }
  ];

  /* ---- Certifications — all 16 from the CV, in CV order ----
     Groups: Structural Design & Codal Compliance (1)
             Core Structural & Civil Engineering Software (2–8)
             Programming, Automation & Professional Skills (9–16) */
  var G_STRUCT = 'Structural Design & Codal Compliance';
  var G_SOFTWARE = 'Core Structural & Civil Engineering Software';
  var G_PROGRAMMING = 'Programming, Automation & Professional Skills';

  var CERTS = [
    { plat: 'PROFESSIONAL', kind: 'blue',    grp: G_STRUCT,      img: null, title: 'Analysis and Design of RC Structure with Codal Provision', sub: 'BNBC 2020 & ACI 318-19 · Instructor: Engr. Zahid Hasan Khan (PWD)', date: 'Dec 2025 – Jun 2026', desc: 'Advanced design of reinforced concrete structures as per BNBC 2020 and ACI 318-19 codal provisions, taught by Engr. Zahid Hasan Khan (PWD).' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_SOFTWARE,    img: 'c-etabs-zero-hero', title: 'ETABS (Zero to Hero) — Comprehensive Analysis & Modeling', sub: 'Advanced Structural Modeling · 5.5 hrs', date: 'Oct 2025', desc: 'End-to-end ETABS course covering building modelling, load definition, analysis and interpretation of results for structural frames.' },
    { plat: 'COURSERA',     kind: 'blue',    grp: G_SOFTWARE,    img: 'c-etabs-scheme-setting', title: 'Structural Scheme Setting & ETABS Analysis of RCC Building', sub: 'L&T EduTech Structural Module', date: 'Oct 2025', desc: 'Structural scheme setting and ETABS analysis of an RCC building. Online course authorized by L&T EduTech and offered through Coursera.' },
    { plat: 'COURSERA',     kind: 'blue',    grp: G_SOFTWARE,    img: 'c-rcc-design-basics', title: 'Design Basics of RCC Buildings', sub: 'L&T EduTech · Reinforced Concrete Design Fundamentals', date: 'Oct 2025', desc: 'Fundamentals of reinforced concrete design for buildings. Online course authorized by L&T EduTech and offered through Coursera.' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_SOFTWARE,    img: 'c-autocad-2d3d-zero-hero', title: 'AutoCAD 2D & 3D (Zero to Hero)', sub: 'Expert-level Engineering Drafting · 13 hrs', date: 'Oct 2025', desc: 'Expert-level engineering drafting in 2D and 3D: layouts, sections, details and production of construction drawings.' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_SOFTWARE,    img: 'c-autocad-beginner-advanced', title: 'AutoCAD: Beginner to Advanced', sub: 'Advanced Technical Modules · 3 hrs', date: 'Jun 2026', desc: 'Advanced technical AutoCAD modules, taking drawing skills from basic commands to detailed, production-ready drawings.' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_SOFTWARE,    img: 'c-epanet-water-supply', title: 'Water Supply System Design by EPANET', sub: 'Hydraulic Modeling · 2 hrs', date: 'Jun 2026', desc: 'Hydraulic modelling of water supply networks in EPANET: pipes, nodes, pumps, and pressure and flow analysis.' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_SOFTWARE,    img: 'c-flow3d-cfd', title: 'CFD Simulation using FLOW-3D', sub: 'Computational Fluid Dynamics · 1 hr', date: 'Jun 2026', desc: 'Computational fluid dynamics (CFD) simulation of flow problems using FLOW-3D.' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, img: 'c-ms-office-ai', title: 'MS Office with AI — Word, Excel, PowerPoint, ChatGPT & Gemini', sub: 'Professional Applications · 9.5 hrs', date: 'Nov 2025', desc: 'Word, Excel and PowerPoint used together with ChatGPT and Gemini to work faster and produce better professional documents.' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, img: 'c-html-css-2026', title: 'HTML, CSS for Freshers 2026!', sub: 'Web Development Fundamentals · 25.5 hrs', date: 'Jun 2026', desc: 'Web development fundamentals: HTML page structure and CSS styling for responsive layouts.' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, img: 'c-ai-python-ml', title: 'Learn AI, Python, Machine Learning, Data Science & Big Data', sub: 'Technical Core · 8 hrs', date: 'Jul 2026', desc: 'Core concepts of Python, machine learning, data science and big data, with an introduction to AI tools.' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, img: 'c-powerpoint-ai', title: 'Professional PowerPoint AI Course: From Basic to Advanced', sub: 'Presentation Optimization · 1 hr', date: 'Jul 2026', desc: 'Building and optimising presentations with AI tools, from basic slide design to advanced techniques.' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, img: 'c-python-gis', title: 'Python for GIS Automation & Geospatial Applications', sub: 'Spatial Analytics Automation · 5 hrs', date: 'Nov 2025', desc: 'Automating GIS and geospatial analysis workflows with Python.' },
    { plat: 'WADHWANI',     kind: 'sky',     grp: G_PROGRAMMING, img: 'c-wadhwani-employability', title: '21st Century Employability Skilling Program (Advanced)', sub: 'Wadhwani Foundation', date: 'Nov 2023', desc: 'Advanced employability skilling programme by Wadhwani Foundation, completed on 9 November 2023.' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, img: 'c-javascript-bootcamp', title: 'JavaScript Beginner’s Bootcamp', sub: 'Web Development Basics · 1 hr', date: 'Apr 2023', desc: 'Beginner JavaScript bootcamp covering core language basics for web development.' },
    { plat: 'GOOGLE',       kind: 'emerald', grp: G_PROGRAMMING, img: 'c-google-applied-digital-skills', title: 'Applied Digital Skills — Google Certified', sub: 'Google Workspace: Sheets Part 1 & 2', date: 'Mar 2025', desc: 'Google-certified skills in Google Workspace Sheets (Part 1 & 2), covering spreadsheet data handling and analysis.' } ,
    { plat: 'MINDLUSTER',   kind: 'sky',     grp: G_SOFTWARE,    img: 'c-arcgis-advanced-mapping', title: 'Advanced Mapping with ArcGIS', sub: 'Mindluster · 1 hr', date: 'Aug 2026', desc: 'Advanced mapping and spatial analysis with ArcGIS, certified by Mindluster (1-hour course).' },
    { plat: 'MINDLUSTER',   kind: 'sky',     grp: G_SOFTWARE,    img: 'c-arcgis-mapping', title: 'ArcGIS Mapping', sub: 'Mindluster · 1 hr', date: 'Aug 2026', desc: 'Fundamentals of mapping with ArcGIS, certified by Mindluster (1-hour course).' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_SOFTWARE,    img: 'c-bim-steel-detailing', title: 'BIM | Structural Steel Detailing Course | Zero to Hero', sub: 'Structural Steel Detailing · 1.5 hrs', date: 'Jul 2026', desc: 'Structural steel detailing using BIM, from zero to hands-on practice.' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, img: 'c-master-python-ds', title: 'Master Python for Data Science, Machine Learning & Automation', sub: 'Technical Core · 7.5 hrs', date: 'Jul 2026', desc: 'Python for data science, machine learning and automation.' },
    { plat: 'CISCO',        kind: 'blue',    grp: G_PROGRAMMING, img: 'c-cisco-python-essentials', title: 'Python Essentials 1', sub: 'Cisco Networking Academy · Python Institute', date: 'Jul 2026', desc: 'Introductory Python programming course offered by Cisco Networking Academy through the Python Institute programme.' }
  ];

  /* ---- Gallery images ---- */
  var MEMORY_COUNT = 16;
  var MEMORY_DIR   = 'assets/img/memories/';

  /* ---- Rotating headline roles ---- */
  var ROLES = [
    'Structural Design Engineer',
    'GIS & Python Automation Specialist',
    'Computational Design Researcher',
    'BNBC 2020 / ACI Compliance Reviewer'
  ];

    /* ====================================================================
     RENDER: projects — horizontal auto carousel + detail modal
     ==================================================================== */
  var ACCENT = {
    blue:    { text: 'text-blue-400',    chip: 'bg-blue-950/70 text-blue-400 border-blue-800/50',    art: 'text-blue-500/35' },
    amber:   { text: 'text-amber-400',   chip: 'bg-amber-950/70 text-amber-400 border-amber-800/50',  art: 'text-amber-500/30' },
    emerald: { text: 'text-emerald-400', chip: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/50', art: 'text-emerald-500/30' },
    purple:  { text: 'text-purple-400',  chip: 'bg-purple-950/70 text-purple-400 border-purple-800/50', art: 'text-purple-500/30' },
    sky:     { text: 'text-sky-400',     chip: 'bg-sky-950/70 text-sky-400 border-sky-800/50',        art: 'text-sky-500/30' }
  };

  var ProjCarousel = (function () {
    var AUTOPLAY = 3800;
    var items = [], idx = 0, timer = null, modalOpen = false;
    var stage, curEl, totEl, statusEl;
    var onScreen = false, paused = false;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function build() {
      stage = $('#project-stage');
      if (!stage) return false;
      curEl = $('#project-current'); totEl = $('#project-total');
      statusEl = $('#project-status');
      PROJECTS.forEach(function (p, i) {
        var a = ACCENT[p.accent] || ACCENT.blue;
        var el = document.createElement('article');
        el.className = 'proj-item';
        el.setAttribute('role', 'group');
        el.setAttribute('aria-roledescription', 'slide');
        el.setAttribute('aria-label', (i + 1) + ' of ' + PROJECTS.length + ': ' + p.title);
        el.innerHTML =
          '<div class="proj-card glass-panel rounded-3xl border border-slate-800 overflow-hidden flex flex-col h-full">' +
            '<div class="proj-media relative overflow-hidden">' +
              '<img src="' + p.img + '" alt="' + p.title + '" loading="lazy" class="w-full h-full object-cover transition-transform duration-500">' +
              '<span class="absolute left-4 top-3 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ' + a.chip + '">' + p.cat + '</span>' +
            '</div>' +
            '<div class="p-5 flex flex-col flex-1 text-left">' +
              '<h3 class="font-heading text-lg font-bold text-white leading-snug">' + p.title + '</h3>' +
              '<p class="text-slate-400 text-xs mt-1.5">' + p.storey + ' &middot; ' + p.location + ' &middot; Client: ' + p.client + '</p>' +
              '<div class="flex flex-wrap gap-1.5 mt-3">' + p.tags.slice(0, 3).map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('') + '</div>' +
              '<span class="proj-open mt-auto pt-4 inline-flex items-center gap-2 text-sm font-bold ' + a.text + '">' +
                'View Details ' + icon('i-arrow-right', 'text-[10px]') + '</span>' +
            '</div>' +
          '</div>';
        el.addEventListener('click', function () {
          if (i === idx) openModal(p, el);
          else { idx = i; render(); restart(); }
        });
        stage.appendChild(el);
        items.push(el);
      });
      if (totEl) totEl.textContent = String(PROJECTS.length).padStart(2, '0');
      return true;
    }

    function render() {
      var total = items.length;
      items.forEach(function (el, i) {
        var off = i - idx;
        if (off >  total / 2) off -= total;
        if (off < -total / 2) off += total;
        var abs = Math.abs(off);
        el.classList.toggle('is-center', abs === 0);
        if (abs === 0) {
          el.style.cssText = 'opacity:1;transform:translateX(-50%) scale(1);z-index:10;pointer-events:auto;';
        } else if (abs === 1) {
          el.style.cssText = 'opacity:.45;transform:translateX(-50%) translateX(' + (off * 66) + '%) scale(.82);z-index:5;pointer-events:auto;';
        } else {
          el.style.cssText = 'opacity:0;transform:translateX(-50%) translateX(' + (off * 78) + '%) scale(.7);z-index:0;pointer-events:none;';
        }
        el.setAttribute('aria-hidden', abs === 0 ? 'false' : 'true');
      });
      if (curEl) curEl.textContent = String(idx + 1).padStart(2, '0');
      if (statusEl) statusEl.textContent = 'Project ' + (idx + 1) + ' of ' + items.length + ': ' + PROJECTS[idx].title;
    }

    function next() { idx = (idx + 1) % items.length; render(); }
    function prev() { idx = (idx - 1 + items.length) % items.length; render(); }
    function start() { stop(); if (!reduced) timer = setInterval(next, AUTOPLAY); }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }
    function updateAutoplay() {
      if (onScreen && !paused && !modalOpen && !document.hidden) start(); else stop();
    }
    function restart() { stop(); updateAutoplay(); }

    function wire() {
      var pb = $('#project-prev'), nb = $('#project-next');
      if (pb) pb.addEventListener('click', function () { prev(); restart(); });
      if (nb) nb.addEventListener('click', function () { next(); restart(); });
      stage.addEventListener('mouseenter', function () { paused = true;  updateAutoplay(); });
      stage.addEventListener('mouseleave', function () { paused = false; updateAutoplay(); });
      stage.addEventListener('focusin',  function () { paused = true;  updateAutoplay(); });
      stage.addEventListener('focusout', function () { paused = false; updateAutoplay(); });
      stage.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); restart(); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); restart(); }
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; updateAutoplay(); }, { threshold: 0.2 }).observe(stage);
      } else { onScreen = true; }
      document.addEventListener('visibilitychange', updateAutoplay);
    }

    return {
      init: function () { if (build()) { render(); wire(); updateAutoplay(); } },
      setModalOpen: function (v) { modalOpen = v; updateAutoplay(); }
    };
  })();

  /* ---- project detail modal ---- */
  var pmLastFocus = null;
  function pmChip(ic, txt) {
    return '<span class="pm-chip">' + icon(ic) + '<span>' + txt + '</span></span>';
  }
  function openModal(p, fromEl) {
    var m = $('#proj-modal'); if (!m) return;
    pmLastFocus = fromEl || document.activeElement;
    var img = $('#pm-img'); img.src = p.img; img.alt = p.title;
    var cat = $('#pm-cat'); cat.textContent = p.cat;
    cat.className = 'pm-cat ' + ((ACCENT[p.accent] || ACCENT.blue).chip);
    $('#pm-title').textContent = p.title;
    $('#pm-meta').innerHTML =
      pmChip('i-building', p.storey) + pmChip('i-location-dot', p.location) + pmChip('i-building-user', p.client);
    $('#pm-role').textContent = p.role;
    $('#pm-scope').textContent = p.scope;
    $('#pm-challenge').textContent = p.challenge;
    $('#pm-solution').textContent = p.solution;
    $('#pm-result').textContent = p.result;
    $('#pm-tags').innerHTML = p.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
    m.classList.remove('hidden');
    requestAnimationFrame(function () { m.classList.add('is-open'); });
    document.body.classList.add('modal-lock');
    ProjCarousel.setModalOpen(true);
    var c = m.querySelector('.proj-modal__close'); if (c) c.focus();
  }
  function closeModal() {
    var m = $('#proj-modal'); if (!m || m.classList.contains('hidden')) return;
    m.classList.remove('is-open');
    document.body.classList.remove('modal-lock');
    ProjCarousel.setModalOpen(false);
    setTimeout(function () { m.classList.add('hidden'); }, 260);
    if (pmLastFocus && pmLastFocus.focus) pmLastFocus.focus();
  }
  function initProjectModal() {
    var m = $('#proj-modal'); if (!m) return;
    m.addEventListener('click', function (e) { if (e.target.closest('[data-pm-close]')) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !m.classList.contains('hidden')) closeModal();
    });
  }

  /* ====================================================================
     RENDER: skills     RENDER: skills
     ==================================================================== */
  function renderSkills() {
    var grid = $('#skills-grid');
    if (!grid) return;
    grid.innerHTML = SKILL_GROUPS.map(function (g, gi) {
      var a = ACCENT[g.accent] || ACCENT.blue;
      var border = g.accent === 'amber' ? 'hover:border-amber-500/40' : (g.accent === 'emerald' ? 'hover:border-emerald-500/40' : 'hover:border-blue-500/40');
      var chipFor = {
        blue:    'bg-blue-950 text-blue-400 border-blue-800/40',
        amber:   'bg-amber-950 text-amber-400 border-amber-800/40',
        emerald: 'bg-emerald-950 text-emerald-400 border-emerald-800/40',
        plain:   'bg-slate-800 text-slate-300 border-slate-700'
      };
      var items = g.items.map(function (it) {
        return '<div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center gap-3">' +
                 '<div class="min-w-0">' +
                   '<p class="text-sm font-semibold text-slate-100 truncate">' + it.name + '</p>' +
                   '<p class="text-xs text-slate-500 truncate">' + it.note + '</p>' +
                 '</div>' +
                 '<span class="shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-md border ' + chipFor[it.kind] + '">' + it.badge + '</span>' +
               '</div>';
      }).join('');

      return '<div class="glass-panel p-6 rounded-3xl border border-slate-800 transition-all duration-300 ' + border + '" data-reveal style="--reveal-delay:' + (gi * 100) + 'ms">' +
               '<div class="flex items-center gap-3 pb-5 mb-5 border-b border-slate-800">' +
                 '<div class="w-12 h-12 rounded-xl grid place-items-center text-xl border ' +
                      (g.accent === 'amber' ? 'bg-amber-600/20 text-amber-400 border-amber-500/30'
                       : g.accent === 'emerald' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                       : 'bg-blue-600/20 text-blue-400 border-blue-500/30') + '">' +
                    icon(g.icon) +
                 '</div>' +
                 '<div><h3 class="font-heading text-xl font-bold text-white">' + g.title + '</h3>' +
                 '<p class="text-xs text-slate-400">' + g.sub + '</p></div>' +
               '</div>' +
               '<div class="space-y-3">' + items + '</div>' +
             '</div>';
    }).join('');
  }

  /* ====================================================================
     RENDER: certifications  (Verify button intentionally removed)
     ==================================================================== */
  var CERT_IMG = 'assets/img/certs/';
  function certCard(c, i, ghost) {
    var a = ACCENT[c.kind] || ACCENT.blue;
    return '<button type="button" class="cert-card"' +
             (ghost ? ' tabindex="-1" aria-hidden="true"' : ' data-cert="' + i + '"') + '>' +
             '<span class="cert-card__top">' +
               '<span class="inline-block px-2.5 py-1 text-[10px] font-mono font-bold rounded border ' + a.chip + '">' + c.plat + '</span>' +
               '<span class="text-[10px] font-mono text-slate-600 font-bold">' + String(i + 1).padStart(2, '0') + '/' + CERTS.length + '</span>' +
             '</span>' +
             '<span class="cert-card__title">' + c.title + '</span>' +
             '<span class="cert-card__foot"><span>' + c.date + '</span>' +
               '<span class="cert-card__view">View <span aria-hidden="true">&rsaquo;</span></span></span>' +
           '</button>';
  }
  function certRowHTML(from, to) {
    var one = '', ghost = '';
    for (var i = from; i < to; i++) { one += certCard(CERTS[i], i, false); ghost += certCard(CERTS[i], i, true); }
    /* two identical sets → track translates -50% for a seamless loop */
    return '<div class="cert-track">' +
             '<div class="cert-set">' + one + '</div>' +
             '<div class="cert-set" aria-hidden="true">' + ghost + '</div>' +
           '</div>';
  }
  /* ---- Certification marquee: auto-moves, pauses on hover/touch, drag to move ----
     Position is driven by JS (translate3d) so mouse / touch drag and auto-move share one value.
     Two identical sets in the track + wrap() keep the loop seamless. */
  var CertMarquee = (function () {
    var SPEED = 36;                 /* px per second */
    var rows = [], raf = 0, last = 0;

    function wrap(x, half) { x = x % half; if (x > 0) x -= half; return x; }
    function apply(s) { s.track.style.transform = 'translate3d(' + s.x.toFixed(2) + 'px,0,0)'; }
    function measure(s) { s.half = s.track.children[0].offsetWidth || 1; s.x = wrap(s.x, s.half); apply(s); }

    function setup(el, dir) {
      var s = { el: el, track: el.querySelector('.cert-track'), dir: dir, x: 0, half: 1,
                hover: false, hold: false, holdT: null, drag: null, moved: false };

      /* mouse hover pauses (touch is handled by `hold`, so taps don't freeze the row) */
      el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') s.hover = true; });
      el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') s.hover = false; });

      /* touch: hold still while the finger is on the row */
      el.addEventListener('touchstart', function () { clearTimeout(s.holdT); s.hold = true; }, { passive: true });
      ['touchend', 'touchcancel'].forEach(function (ev) {
        el.addEventListener(ev, function () {
          clearTimeout(s.holdT);
          s.holdT = setTimeout(function () { s.hold = false; }, 1200);
        }, { passive: true });
      });

      /* drag (mouse + touch; touch-action: pan-y keeps vertical page scroll) */
      el.addEventListener('pointerdown', function (e) {
        if (e.button > 0) return;
        s.drag = { x0: e.clientX, pos0: s.x, id: e.pointerId };
        s.moved = false;
        el.classList.add('is-dragging');
      });
      window.addEventListener('pointermove', function (e) {
        if (!s.drag || e.pointerId !== s.drag.id) return;
        var dx = e.clientX - s.drag.x0;
        if (!s.moved && Math.abs(dx) < 5) return;
        s.moved = true;
        s.x = wrap(s.drag.pos0 + dx, s.half);
        apply(s);
      });
      function endDrag(e) {
        if (!s.drag || (e && e.pointerId !== s.drag.id)) return;
        s.drag = null;
        el.classList.remove('is-dragging');
      }
      window.addEventListener('pointerup', endDrag);
      window.addEventListener('pointercancel', endDrag);

      /* a real drag must not open a certificate: swallow the click that follows it */
      el.addEventListener('click', function (e) {
        if (s.moved) { e.preventDefault(); e.stopPropagation(); s.moved = false; }
      }, true);
      return s;
    }

    function tick(now) {
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      var grid = document.getElementById('cert-grid');
      var globalPause = document.hidden || !!(grid && grid.classList.contains('is-paused'));
      rows.forEach(function (s) {
        if (globalPause || s.drag || s.hover || s.hold || s.el.matches(':focus-within')) return;
        s.x = wrap(s.x + s.dir * SPEED * dt, s.half);
        apply(s);
      });
      raf = requestAnimationFrame(tick);
    }

    function init(els) {
      /* reduced motion: no auto-move; rows stay native horizontally scrollable */
      if (!window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      rows = els.map(function (el, i) { return setup(el, i === 0 ? -1 : 1); });
      function measureAll() { rows.forEach(measure); }
      measureAll();
      window.addEventListener('resize', measureAll);
      raf = requestAnimationFrame(tick);
    }
    return { init: init };
  })();

  function renderCerts() {
    var r1 = $('#cert-row-1'), r2 = $('#cert-row-2');
    if (!r1 || !r2) return;
    var half = Math.ceil(CERTS.length / 2);
    r1.innerHTML = certRowHTML(0, half);
    r2.innerHTML = certRowHTML(half, CERTS.length);
    CertMarquee.init([r1, r2]);
    $('#cert-grid').addEventListener('click', function (e) {
      var b = e.target.closest('[data-cert]');
      if (b) openCertModal(+b.getAttribute('data-cert'), b);
    });
  }

  /* ---- Certificate detail modal ---- */
  var certLastFocus = null;
  function cmChip(ic, txt) {
    return '<span class="pm-chip">' + icon(ic) + '<span>' + txt + '</span></span>';
  }
  function openCertModal(i, fromEl) {
    var m = $('#cert-modal'); if (!m) return;
    var c = CERTS[i];
    certLastFocus = fromEl || document.activeElement;
    var img = $('#cm-img'), none = $('#cm-noimg');
    if (c.img) {
      img.src = CERT_IMG + c.img + '.jpg'; img.alt = c.title + ' — certificate';
      img.hidden = false; none.hidden = true;
    } else {
      img.removeAttribute('src'); img.alt = ''; img.hidden = true; none.hidden = false;
    }
    var a = ACCENT[c.kind] || ACCENT.blue;
    var plat = $('#cm-plat'); plat.textContent = c.plat; plat.className = 'pm-cat ' + a.chip;
    $('#cm-title').textContent = c.title;
    $('#cm-meta').innerHTML = cmChip('i-certificate', c.sub) + cmChip('i-r-calendar', c.date) + cmChip('i-layer-group', c.grp);
    $('#cm-desc').textContent = c.desc;
    m.classList.remove('hidden');
    requestAnimationFrame(function () { m.classList.add('is-open'); });
    document.body.classList.add('modal-lock');
    var row = $('#cert-grid'); if (row) row.classList.add('is-paused');
    var cl = m.querySelector('.proj-modal__close'); if (cl) cl.focus();
  }
  function closeCertModal() {
    var m = $('#cert-modal'); if (!m || m.classList.contains('hidden')) return;
    m.classList.remove('is-open');
    document.body.classList.remove('modal-lock');
    var row = $('#cert-grid'); if (row) row.classList.remove('is-paused');
    setTimeout(function () { m.classList.add('hidden'); }, 260);
    if (certLastFocus && certLastFocus.focus) certLastFocus.focus();
  }
  function initCertModal() {
    var m = $('#cert-modal'); if (!m) return;
    m.addEventListener('click', function (e) { if (e.target.closest('[data-cm-close]')) closeCertModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !m.classList.contains('hidden')) closeCertModal();
    });
  }

  /* ====================================================================
     RENDER: tool marquee
     ==================================================================== */
  function renderMarquee() {
    function chip(t) {
      return '<span class="shrink-0 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 ' +
                    'text-slate-300 text-sm font-semibold whitespace-nowrap">' +
               '<span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>' + t + '</span>';
    }
    var r1 = $('#marquee-row-1'), r2 = $('#marquee-row-2');
    if (r1) r1.innerHTML = (TOOLS_ROW_1.map(chip).join('')).repeat(2);
    if (r2) r2.innerHTML = (TOOLS_ROW_2.map(chip).join('')).repeat(2);
  }

  /* ====================================================================
     RENDER: memories carousel
     ==================================================================== */
  var Carousel = (function () {
    var AUTOPLAY = 3000;
    var stage, thumbs, curEl, totEl, statusEl;
    var items = [], thumbEls = [], idx = 0, timer = null;
    var onScreen = false, paused = false;   // autoplay gating state
    // On phones we never keep 16 full-size images decoded at once — only the
    // slides near the center hold a real src; the rest hold a 1-byte blank.
    var isMobile = !!(window.matchMedia && window.matchMedia('(max-width: 767px)').matches);
    var BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    function build() {
      stage    = $('#carousel-stage');
      thumbs   = $('#carousel-thumbs');
      curEl    = $('#carousel-current');
      totEl    = $('#carousel-total');
      statusEl = $('#carousel-status');
      if (!stage) return false;

      for (var i = 1; i <= MEMORY_COUNT; i++) {
        var src = MEMORY_DIR + 'memory-' + i + '.jpg';

        var img = document.createElement('img');
        img.alt = 'Memory ' + i;
        img.loading = i < 4 ? 'eager' : 'lazy';
        img.decoding = 'async';
        img.className = 'carousel-item';
        img.draggable = false;
        img.setAttribute('data-src', src);
        if (isMobile && i > 4) {           // far slides start blank on phones
          img.src = BLANK;
          img.setAttribute('data-state', 'blank');
        } else {
          img.src = src;
          img.setAttribute('data-state', 'real');
        }
        img.onerror = function (n) {
          return function () { this.onerror = null; this.setAttribute('data-state', 'ph'); this.src = placeholder('Memory ' + n, 800, 500); };
        }(i);
        (function (n) {
          img.addEventListener('click', function () { if (n - 1 !== idx) { idx = n - 1; render(); restart(); } });
        })(i);
        stage.appendChild(img);
        items.push(img);

        if (thumbs) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'carousel-thumb';
          b.setAttribute('aria-label', 'Show memory ' + i);
          var ti = document.createElement('img');
          ti.src = src; ti.alt = ''; ti.loading = 'lazy'; ti.className = 'w-full h-full object-cover';
          ti.onerror = function (n) { return function () { this.onerror = null; this.src = placeholder(String(n), 120, 90); }; }(i);
          b.appendChild(ti);
          (function (n) {
            b.addEventListener('click', function () { idx = n - 1; render(); restart(); });
          })(i);
          thumbs.appendChild(b);
          thumbEls.push(b);
        }
      }
      if (totEl) totEl.textContent = String(MEMORY_COUNT).padStart(2, '0');
      return true;
    }

    function render() {
      var total = items.length;
      items.forEach(function (item, i) {
        var off = i - idx;
        if (off >  total / 2) off -= total;
        if (off < -total / 2) off += total;
        var abs = Math.abs(off);

        // mobile memory windowing: only slides near the center keep a
        // decoded full-size image; the rest release it back to a blank
        if (isMobile) {
          var st = item.getAttribute('data-state');
          if (abs <= 2 && st === 'blank') {
            item.setAttribute('data-state', 'real');
            item.src = item.getAttribute('data-src');
          } else if (abs > 2 && st === 'real') {
            item.setAttribute('data-state', 'blank');
            item.src = BLANK;
          }
        }

        item.classList.toggle('is-center', abs === 0);
        if (abs === 0) {
          item.style.cssText += ';opacity:1;transform:translateX(-50%) scale(1);z-index:10;filter:none;';
        } else if (abs === 1) {
          item.style.cssText += ';opacity:.5;transform:translateX(-50%) translateX(' + (off * 44) + '%) scale(.76);z-index:5;filter:brightness(.55) blur(1.5px);';
        } else if (abs === 2) {
          item.style.cssText += ';opacity:.18;transform:translateX(-50%) translateX(' + (off * 58) + '%) scale(.58);z-index:2;filter:brightness(.35) blur(2.5px);';
        } else {
          item.style.cssText += ';opacity:0;transform:translateX(-50%) translateX(' + (off * 65) + '%) scale(.5);z-index:0;filter:brightness(.2);pointer-events:none;';
        }
      });

      thumbEls.forEach(function (t, i) {
        t.classList.toggle('is-active', i === idx);
        if (i === idx) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
      });
      // Keep the active thumb centered INSIDE its strip only.
      // (scrollIntoView was used before — it also scrolls the whole page down
      //  to the gallery on every autoplay tick. Never use it here.)
      if (thumbs) {
        var t = thumbEls[idx];
        if (t) {
          var cRect = thumbs.getBoundingClientRect();
          var tRect = t.getBoundingClientRect();
          var delta = (tRect.left - cRect.left) - (cRect.width - tRect.width) / 2;
          if (thumbs.scrollTo) thumbs.scrollTo({ left: thumbs.scrollLeft + delta, behavior: 'smooth' });
          else thumbs.scrollLeft += delta;
        }
      }

      if (curEl) curEl.textContent = String(idx + 1).padStart(2, '0');
      if (statusEl) statusEl.textContent = 'Memory ' + (idx + 1) + ' of ' + items.length;
    }

    function next() { idx = (idx + 1) % items.length; render(); }
    function prev() { idx = (idx - 1 + items.length) % items.length; render(); }
    function start() { stop(); timer = setInterval(next, AUTOPLAY); }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }
    // autoplay runs ONLY when: gallery on screen + not hovered/focused + tab visible
    function updateAutoplay() {
      if (onScreen && !paused && !document.hidden && !reducedMotion()) start();
      else stop();
    }
    function restart() { stop(); updateAutoplay(); }

    function reducedMotion() {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function wire() {
      var nb = $('#next-btn'), pb = $('#prev-btn');
      if (nb) nb.addEventListener('click', function () { next(); restart(); });
      if (pb) pb.addEventListener('click', function () { prev(); restart(); });

      stage.addEventListener('mouseenter', function () { paused = true;  stop(); });
      stage.addEventListener('mouseleave', function () { paused = false; updateAutoplay(); });
      stage.addEventListener('focusin',    function () { paused = true;  stop(); });
      stage.addEventListener('focusout',   function () { paused = false; updateAutoplay(); });

      // keyboard
      stage.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); restart(); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); restart(); }
      });

      // touch swipe
      var x0 = 0;
      stage.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
      stage.addEventListener('touchend', function (e) {
        var d = e.changedTouches[0].clientX - x0;
        if (Math.abs(d) > 40) { d < 0 ? next() : prev(); }
        updateAutoplay();
      }, { passive: true });

      // the gate: autoplay only while the gallery is actually on screen
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { onScreen = en.isIntersecting; updateAutoplay(); });
        }, { threshold: 0.05 }).observe(stage);
      } else {
        onScreen = true;    // no IO support (e.g. test env) — behave as visible
        updateAutoplay();
      }

      document.addEventListener('visibilitychange', function () { updateAutoplay(); });
    }

    return {
      // autoplay is started/stopped by updateAutoplay() (see wire) — never here
      init: function () { if (build()) { render(); wire(); } }
    };
  })();

  /* ====================================================================
     SCROLL REVEAL
     ==================================================================== */
  function initReveal() {
    var els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ====================================================================
     COUNT-UP METRICS
     ==================================================================== */
  function initCounters() {
    var els = $$('[data-count]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.textContent = e.getAttribute('data-count'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseInt(el.getAttribute('data-count'), 10) || 0;
        io.unobserve(el);
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.textContent = String(target).padStart(2, '0'); return;
        }
        var t0 = null, dur = 1400;
        function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(target * eased)).padStart(2, '0');
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ====================================================================
     TYPEWRITER
     ==================================================================== */
  function initTypewriter() {
    var el = $('#typewriter');
    if (!el) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = ROLES[0]; return;
    }
    var r = 0, c = 0, deleting = false;
    (function tick() {
      var word = ROLES[r];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);
      var delay = deleting ? 34 : 62;
      if (!deleting && c === word.length) { deleting = true; delay = 1900; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % ROLES.length; delay = 380; }
      setTimeout(tick, delay);
    })();
  }

  /* ====================================================================
     SCROLL PROGRESS + NAV STATE + BACK TO TOP
     ==================================================================== */
  function initScrollUI() {
    var bar  = $('#scroll-progress');
    var nav  = $('#site-nav');
    var top  = $('#back-to-top');
    var ticking = false;

    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      if (bar) bar.style.width = p + '%';
      if (nav) nav.classList.toggle('shadow-2xl', window.scrollY > 20);
      if (top) top.classList.toggle('is-visible', window.scrollY > 700);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    if (top) top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ====================================================================
     SCROLL-SPY (active nav link)
     ==================================================================== */
  function initScrollSpy() {
    var links = $$('[data-navlink]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    links.forEach(function (l) {
      var id = l.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = l;
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var link = map[en.target.id];
        if (!link) return;
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* ====================================================================
     MOBILE MENU
     ==================================================================== */
  function initMenu() {
    var btn = $('#menu-btn'), panel = $('#mobile-menu');
    if (!btn || !panel) return;

    function setOpen(open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      panel.style.maxHeight = open ? (panel.scrollHeight + 'px') : '0px';
    }
    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    $$('[data-mnav]').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (btn.getAttribute('aria-expanded') === 'true') panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  }

  /* ====================================================================
     CONTACT FORM (Formspree)
     ==================================================================== */
  function initForm() {
    var form = $('#contact-form');
    if (!form) return;
    var status = $('#cf-status'), btn = $('#cf-submit');
    var label  = btn ? btn.querySelector('.cf-label') : null;
    var original = label ? label.innerHTML : '';
    var success = $('#cf-success'), again = $('#cf-again');

    // "Send another message" — hide the success card, show the form again
    if (again) again.addEventListener('click', function () {
      if (success) success.classList.add('hidden');
      form.classList.remove('hidden');
      status.textContent = '';
      if (btn) btn.focus();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) { form.reportValidity(); return; }

      if (/YOUR_FORM_ID/.test(form.action)) {
        status.className = 'text-sm font-medium text-amber-400';
        status.textContent = 'Formspree is not connected yet — please email imran.cee23@gmail.com for now.';
        return;
      }

      if (btn) { btn.disabled = true; btn.classList.add('opacity-60', 'cursor-not-allowed'); }
      if (label) label.innerHTML = icon('i-spinner', 'animate-spin') + ' Sending…';
      status.className = 'text-sm font-medium text-slate-400';
      status.textContent = '';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          status.textContent = '';
          if (success) {
            form.classList.add('hidden');
            success.classList.remove('hidden');
            // restart the CSS draw animation if the card is shown again
            success.classList.remove('cf-success--play');
            void success.offsetWidth;
            success.classList.add('cf-success--play');
          } else {
            status.className = 'text-sm font-medium text-emerald-400';
            status.textContent = '✓ Thank you for your message — I will reply within 24 hours.';
          }
        } else {
          return res.json().catch(function () { return {}; }).then(function (d) {
            throw new Error((d.errors && d.errors[0] && d.errors[0].message) || 'Something went wrong.');
          });
        }
      }).catch(function (err) {
        status.className = 'text-sm font-medium text-rose-400';
        status.textContent = '✕ ' + err.message + ' Try WhatsApp instead.';
      }).then(function () {
        if (btn) { btn.disabled = false; btn.classList.remove('opacity-60', 'cursor-not-allowed'); }
        if (label) label.innerHTML = original;
      });
    });
  }

  /* ====================================================================
     SKILL RADAR CHART  (✏️ values 0–100 নিচে বদলানো যায়)
     ==================================================================== */
  var RADAR = [
    { label: 'Structural (ETABS)',  v: 92 },
    { label: 'Codal (BNBC/ACI)',    v: 88 },
    { label: 'Drafting & BIM',      v: 90 },
    { label: 'GIS & Spatial',       v: 82 },
    { label: 'Python & Automation', v: 78 },
    { label: 'Hydraulics',          v: 72 }
  ];

  function initRadar() {
    var cv = $('#skill-radar');
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    var drawn = false;

    function draw(progress) {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = cv.clientWidth || 520, h = 380;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      var cx = w / 2, cy = h / 2 + 4;
      var R = Math.min(w, h) / 2 - 58;
      var n = RADAR.length, i, a;

      ctx.lineWidth = 1;
      for (var g = 1; g <= 4; g++) {                      // rings
        ctx.strokeStyle = 'rgba(148,163,184,0.14)';
        ctx.beginPath();
        for (i = 0; i <= n; i++) {
          a = (Math.PI * 2 * (i % n) / n) - Math.PI / 2;
          var rr = R * g / 4;
          i ? ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr)
            : ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
        }
        ctx.stroke();
      }

      ctx.font = '600 11px Outfit, sans-serif';           // spokes + labels
      for (i = 0; i < n; i++) {
        a = (Math.PI * 2 * i / n) - Math.PI / 2;
        ctx.strokeStyle = 'rgba(148,163,184,0.12)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = Math.abs(Math.cos(a)) < 0.35 ? 'center' : (Math.cos(a) > 0 ? 'left' : 'right');
        ctx.textBaseline = 'middle';
        ctx.fillText(RADAR[i].label, cx + Math.cos(a) * (R + 26), cy + Math.sin(a) * (R + 20));
      }

      ctx.beginPath();                                    // value polygon
      for (i = 0; i <= n; i++) {
        a = (Math.PI * 2 * (i % n) / n) - Math.PI / 2;
        var rv = R * (RADAR[i % n].v / 100) * progress;
        i ? ctx.lineTo(cx + Math.cos(a) * rv, cy + Math.sin(a) * rv)
          : ctx.moveTo(cx + Math.cos(a) * rv, cy + Math.sin(a) * rv);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(59,130,246,0.22)';
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();

      for (i = 0; i < n; i++) {                           // vertex dots
        a = (Math.PI * 2 * i / n) - Math.PI / 2;
        var rd = R * (RADAR[i].v / 100) * progress;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * rd, cy + Math.sin(a) * rd, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function animate() {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(1); return; }
      var t0 = null, dur = 1100;
      requestAnimationFrame(function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        draw(1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(step);
      });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries, io) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !drawn) { drawn = true; animate(); io.disconnect(); }
        });
      }, { threshold: 0.3 }).observe(cv);
    } else { animate(); }

    var rt = null;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { draw(1); }, 180);
    });
  }

  /* ====================================================================
     COPY BUTTONS (email / phone / WhatsApp)
     ==================================================================== */
  function initCopy() {
    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-copy');
        var span = b.querySelector('span');
        function done() {
          b.classList.add('copied');
          if (span) span.textContent = 'Copied!';
          setTimeout(function () {
            b.classList.remove('copied');
            if (span) span.textContent = 'Copy';
          }, 1600);
        }
        function legacy() {
          var t = document.createElement('textarea');
          t.value = v;
          t.style.position = 'fixed';
          t.style.opacity = '0';
          document.body.appendChild(t);
          t.select();
          try { document.execCommand('copy'); } catch (e) { /* ignore */ }
          document.body.removeChild(t);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(v).then(done, function () { legacy(); done(); });
        } else { legacy(); done(); }
      });
    });
  }

  /* ====================================================================
     BOOT
     ==================================================================== */
  function boot() {
    ProjCarousel.init();
    initProjectModal();
    initCertModal();
    renderSkills();
    renderCerts();
    renderMarquee();
    Carousel.init();

    initReveal();
    initCounters();
    initTypewriter();
    initScrollUI();
    initScrollSpy();
    initMenu();
    initForm();
    initRadar();
    initCopy();

    var y = $('#year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
