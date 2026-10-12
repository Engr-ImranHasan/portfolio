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

  /* ---- Projects: one entry per PDF in assets/img/projects/ ---- */
  var PROJECTS = [
    { file: 'p1.pdf', cat: 'Structural Design', accent: 'blue',
      title: 'G+15 Residential Tower — Full Structural Design',
      desc: 'Complete ETABS modelling, lateral load-path design and reinforcement detailing for a fifteen-storey residential tower, checked against BNBC 2020 seismic provisions and ACI 318.',
      tags: ['ETABS', 'CSI SAFE', 'BNBC 2020', 'ACI 318'] },

    { file: 'p2.pdf', cat: 'Foundation Engineering', accent: 'amber',
      title: 'Mat & Isolated Foundation Design Package',
      desc: 'Substructure and reinforcement detailing across multiple high-rise projects — mat thickness optimisation, punching-shear checks and bar bending schedules generated from CSI SAFE output.',
      tags: ['CSI SAFE', 'AutoCAD', 'BBS'] },

    { file: 'p3.pdf', cat: 'GIS & Seismic Risk', accent: 'emerald',
      title: 'Seismic Vulnerability Mapping — Dhaka Informal Settlements',
      desc: 'ArcGIS Pro multi-criteria analysis combining building stock, soil class, fault proximity and road access to produce a post-event vulnerability surface for informal settlements.',
      tags: ['ArcGIS Pro', 'MCDM', 'Python'] },

    { file: 'p4.pdf', cat: 'GIS & Hydrology', accent: 'blue',
      title: 'National Bridge Scour Susceptibility Model',
      desc: 'A data-driven, GIS-based national assessment of bridge scour susceptibility under flood hazard, built from catchment, slope, discharge and pier-type predictors.',
      tags: ['ArcGIS Pro', 'Machine Learning'] },

    { file: 'p5.pdf', cat: 'Hydraulic Modelling', accent: 'emerald',
      title: 'EPANET Water Distribution Network Simulation',
      desc: 'Calibrated hydraulic model of an urban supply network — nodal demand allocation, pressure-zone balancing and residual-chlorine travel-time verification.',
      tags: ['EPANET', 'MS Excel'] },

    { file: 'p6.pdf', cat: 'Workflow Automation', accent: 'amber',
      title: 'Bar Bending Schedule & Quantity Automation',
      desc: 'An Excel + Python workflow that converts reinforcement drawings into bar bending schedules and quantity take-offs, cutting manual estimation time on repetitive floor plates.',
      tags: ['Python', 'MS Excel', 'BBS'] },

    { file: 'p7.pdf', cat: 'Computational Design', accent: 'blue',
      title: 'Seismic Optimisation of RC Moment Frames',
      desc: 'Performance-based design study optimising RC special moment resisting frames with a genetic algorithm under BNBC 2020 response-spectrum demand.',
      tags: ['Python', 'Genetic Algorithm', 'ETABS'] }
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
    { plat: 'PROFESSIONAL', kind: 'blue',    grp: G_STRUCT,      title: 'Analysis and Design of RC Structure with Codal Provision', sub: 'BNBC 2020 & ACI 318-19 · Instructor: Engr. Zahid Hasan Khan (PWD)', date: 'Dec 2025 – Jun 2026' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_SOFTWARE,    title: 'ETABS (Zero to Hero) — Comprehensive Analysis & Modeling', sub: 'Advanced Structural Modeling · 5.5 hrs', date: 'Oct 2025' },
    { plat: 'COURSERA',     kind: 'blue',    grp: G_SOFTWARE,    title: 'Structural Scheme Setting & ETABS Analysis of RCC Building', sub: 'L&T EduTech Structural Module', date: 'Oct 2025' },
    { plat: 'COURSERA',     kind: 'blue',    grp: G_SOFTWARE,    title: 'Design Basics of RCC Buildings', sub: 'L&T EduTech · Reinforced Concrete Design Fundamentals', date: 'Oct 2025' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_SOFTWARE,    title: 'AutoCAD 2D & 3D (Zero to Hero)', sub: 'Expert-level Engineering Drafting · 13 hrs', date: 'Oct 2025' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_SOFTWARE,    title: 'AutoCAD: Beginner to Advanced', sub: 'Advanced Technical Modules · 3 hrs', date: 'Jun 2026' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_SOFTWARE,    title: 'Water Supply System Design by EPANET', sub: 'Hydraulic Modeling · 2.5 hrs', date: 'Jun 2026' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_SOFTWARE,    title: 'CFD Simulation using FLOW-3D', sub: 'Computational Fluid Dynamics · 3.5 hrs', date: 'Jun 2026' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, title: 'MS Office with AI — Word, Excel, PowerPoint, ChatGPT & Gemini', sub: 'Professional Applications · 9.5 hrs', date: 'Nov 2025' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, title: 'HTML, CSS for Freshers 2026!', sub: 'Web Development Fundamentals · 25.5 hrs', date: 'Jun 2026' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, title: 'Learn AI, Python, Machine Learning, Data Science & Big Data', sub: 'Technical Core · 8 hrs', date: 'Jul 2026' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, title: 'Professional PowerPoint AI Course: From Basic to Advanced', sub: 'Presentation Optimization · 1 hr', date: 'Jul 2026' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, title: 'Python for GIS Automation & Geospatial Applications', sub: 'Spatial Analytics Automation', date: 'Nov 2025' },
    { plat: 'WADHWANI',     kind: 'sky',     grp: G_PROGRAMMING, title: '21st Century Employability Skilling Program (Advanced)', sub: 'Wadhwani Foundation', date: 'Nov 2023' },
    { plat: 'UDEMY',        kind: 'purple',  grp: G_PROGRAMMING, title: 'JavaScript Beginner’s Bootcamp', sub: 'Web Development Basics', date: 'Apr 2023' },
    { plat: 'GOOGLE',       kind: 'emerald', grp: G_PROGRAMMING, title: 'Applied Digital Skills — Google Certified', sub: 'Google Workspace: Sheets Part 1 & 2', date: '2025' }
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
     RENDER: projects
     ==================================================================== */
  function frameArt() {
    var hatch = '';
    for (var i = 0; i < 18; i++) hatch += '<line x1="' + (20 + i * 20) + '" y1="152" x2="' + (12 + i * 20) + '" y2="163"/>';
    var nodes = '';
    [80, 200, 320].forEach(function (x) {
      [34, 74, 113, 152].forEach(function (y) {
        nodes += '<circle cx="' + x + '" cy="' + y + '" r="3.2" fill="currentColor" stroke="none"/>';
      });
    });
    return '<svg viewBox="0 0 400 180" class="absolute inset-0 h-full w-full" fill="none" stroke="currentColor" stroke-width="1.25" aria-hidden="true">' +
      '<line x1="14" y1="152" x2="386" y2="152" stroke-width="2.2" opacity=".6"/>' +
      '<g opacity=".45">' + hatch + '</g>' +
      '<g stroke-width="2.2">' +
        '<line x1="80" y1="152" x2="80" y2="34"/><line x1="200" y1="152" x2="200" y2="34"/><line x1="320" y1="152" x2="320" y2="34"/>' +
        '<line x1="80" y1="34" x2="320" y2="34"/>' +
      '</g>' +
      '<g stroke-width="1.4" opacity=".85">' +
        '<line x1="80" y1="74" x2="320" y2="74"/><line x1="80" y1="113" x2="320" y2="113"/>' +
      '</g>' +
      '<g opacity=".55"><line x1="80" y1="113" x2="200" y2="74"/><line x1="200" y1="113" x2="320" y2="74"/></g>' +
      '<g opacity=".3"><line x1="80" y1="74" x2="200" y2="34"/><line x1="200" y1="74" x2="320" y2="34"/></g>' +
      nodes +
    '</svg>';
  }

  var ACCENT = {
    blue:    { text: 'text-blue-400',    chip: 'bg-blue-950/70 text-blue-400 border-blue-800/50',    art: 'text-blue-500/35' },
    amber:   { text: 'text-amber-400',   chip: 'bg-amber-950/70 text-amber-400 border-amber-800/50',  art: 'text-amber-500/30' },
    emerald: { text: 'text-emerald-400', chip: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/50', art: 'text-emerald-500/30' },
    purple:  { text: 'text-purple-400',  chip: 'bg-purple-950/70 text-purple-400 border-purple-800/50', art: 'text-purple-500/30' },
    sky:     { text: 'text-sky-400',     chip: 'bg-sky-950/70 text-sky-400 border-sky-800/50',        art: 'text-sky-500/30' }
  };

  function renderProjects() {
    var grid = $('#project-grid');
    if (!grid) return;
    grid.innerHTML = PROJECTS.map(function (p, i) {
      var a = ACCENT[p.accent] || ACCENT.blue;
      var num = String(i + 1).padStart(2, '0');
      var tags = p.tags.map(function (t) { return '<span class="tag">' + t + '</span>'; }).join('');
      return '' +
      '<article class="group glass-panel rounded-3xl border border-slate-800 overflow-hidden flex flex-col ' +
               'hover:border-blue-500/50 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-950/40 transition-all duration-300" data-reveal>' +
        '<div class="project-art relative h-40 border-b border-slate-800 overflow-hidden ' + a.art + '">' +
          frameArt() +
          '<span class="absolute right-4 top-3 font-mono text-[10px] font-bold tracking-widest ' + a.text + ' opacity-80">PDF</span>' +
          '<span class="absolute left-4 bottom-1 font-heading text-5xl font-extrabold text-white/[0.07] group-hover:text-white/[0.12] transition-colors">' + num + '</span>' +
        '</div>' +
        '<div class="p-5 flex flex-col flex-1">' +
          '<span class="self-start px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider mb-3 ' + a.chip + '">' + p.cat + '</span>' +
          '<h3 class="font-heading text-lg font-bold text-white leading-snug">' + p.title + '</h3>' +
          '<p class="text-slate-400 text-sm mt-2.5 leading-relaxed flex-1">' + p.desc + '</p>' +
          '<div class="flex flex-wrap gap-1.5 mt-4">' + tags + '</div>' +
          '<a href="assets/img/projects/' + p.file + '" target="_blank" rel="noopener" ' +
             'class="mt-6 inline-flex items-center gap-2 text-sm font-bold ' + a.text + ' hover:text-white transition-colors">' +
            icon('i-file-pdf') + ' Open Project (PDF)' +
            icon('i-arrow-up-right-from-square', 'text-[10px]') +
          '</a>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ====================================================================
     RENDER: skills
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
  function renderCerts() {
    var grid = $('#cert-grid');
    if (!grid) return;
    grid.innerHTML = CERTS.map(function (c, i) {
      var a = ACCENT[c.kind] || ACCENT.blue;
      return '<article class="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between ' +
                    'transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50" data-reveal style="--reveal-delay:' + ((i % 4) * 70) + 'ms">' +
               '<div>' +
                 '<div class="flex items-center justify-between gap-2 mb-4">' +
                   '<span class="inline-block px-2.5 py-1 text-[10px] font-mono font-bold rounded border ' + a.chip + '">' + c.plat + '</span>' +
                   '<span class="text-[10px] font-mono text-slate-600 font-bold">' + String(i + 1).padStart(2, '0') + '/16</span>' +
                 '</div>' +
                 '<h4 class="text-white font-bold text-[15px] leading-snug">' + c.title + '</h4>' +
                 '<p class="text-slate-400 text-xs mt-2 leading-relaxed">' + c.sub + '</p>' +
                 '<p class="text-[10px] text-slate-500 mt-3 uppercase tracking-wider font-bold">' + c.grp + '</p>' +
               '</div>' +
               '<div class="pt-4 mt-4 border-t border-slate-800/60 flex justify-between items-center">' +
                 '<span class="text-[11px] text-slate-500 font-semibold font-mono">' + c.date + '</span>' +
                 '<span class="text-[11px] text-slate-500 inline-flex items-center gap-1.5">' + icon('i-certificate', 'text-slate-600') + ' Verified</span>' +
               '</div>' +
             '</article>';
    }).join('');
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
    var AUTOPLAY = 4000;
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
          status.className = 'text-sm font-medium text-emerald-400';
          status.textContent = '✓ Message sent — I will reply within 24 hours.';
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
    renderProjects();
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
