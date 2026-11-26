/* ================================================================
   Imran Hasan — Portfolio  ·  editor.js
   Owner's edit panel: password → edit any text, link, image, list,
   repeatable block and the CV PDF → "Save to website".
   Save commits assets/data/content.js (+ new images) to the GitHub repo
   via the Contents API. The token lives only in this tab (sessionStorage).
   ================================================================ */
(function () {
  'use strict';

  var CFG = {
    owner: 'Engr-ImranHasan',
    repo: 'portfolio',
    branch: 'main',
    contentPath: 'assets/data/content.js',
    cvPath: 'assets/cv/Imran-Hasan-CV.pdf',
    uploadDir: 'assets/img/uploads/'
  };
  // Optional override (only the test bundle defines window.EDIT_CONFIG).
  if (window.EDIT_CONFIG) { for (var k in window.EDIT_CONFIG) { if (Object.prototype.hasOwnProperty.call(window.EDIT_CONFIG, k)) CFG[k] = window.EDIT_CONFIG[k]; } }
  // SHA-256 of the edit password (the password itself is not written here).
  var PASS_SHA256 = '6178b6896bade1aa91a57ecbaca2396f6a9debe523ffe4201100629f46611b2a';
  var TOKEN_KEY = 'ed-gh-token';
  var BLOCK_LABELS = { experience: 'Experience', testimonials: 'Testimonials', research: 'Publications', education: 'Education', tools: 'Tool card' };

  /* ---------- helpers ---------- */
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'on') Object.keys(v).forEach(function (ev) { n.addEventListener(ev, v[ev]); });
      else if (k === 'value') n.value = v;
      else if (v === true) n.setAttribute(k, '');
      else if (v !== false && v != null) n.setAttribute(k, v);
    });
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }
  function btn(label, fn, cls) { return h('button', { type: 'button', class: 'ed-btn ' + (cls || ''), text: label, on: { click: fn } }); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function trim(s) { return String(s || '').trim(); }
  function sha256Hex(text) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }
  function b64utf8(str) {
    var bytes = new TextEncoder().encode(str), bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function fileToBase64(file) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(String(r.result).split(',')[1]); };
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }
  function newImagePath() { return CFG.uploadDir + Date.now().toString(36) + Math.random().toString(36).slice(2, 6) + '.jpg'; }
  function certSrc(c) { if (!c.img) return ''; return /\//.test(c.img) ? c.img : 'assets/img/certs/' + c.img + '.jpg'; }
  function resizeImage(file, max) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.naturalWidth * s));
        c.height = Math.max(1, Math.round(img.naturalHeight * s));
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('image')); };
      img.src = url;
    });
  }
  // Editor-free copy of a node (no contenteditable / editor controls) as HTML.
  function cleanHTML(node) {
    var c = node.cloneNode(true);
    $$('.ed-itemctl', c).forEach(function (n) { n.remove(); });
    [c].concat($$('*', c)).forEach(function (n) {
      n.removeAttribute && n.removeAttribute('contenteditable');
      if (n.classList) { n.classList.remove('ed-editable'); if (!n.getAttribute('class')) n.removeAttribute('class'); }
    });
    return String(c.innerHTML).replace(/<script[\s\S]*?<\/script>/gi, '');
  }

  /* ---------- state ---------- */
  var W = null;            // working copies of list-type content
  var LEAVES = [], ATTRS = [], BLOCKS = [];
  var pending = {};        // new images: path -> data URL (uploaded on save)
  var dirty = false, textMode = false;
  var bar = null, statusEl = null, textBtn = null, modalRoot = null;

  function imgSrc(p) { return p ? (pending[p] || p) : ''; }
  function getToken() { try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } }

  /* ---------- modal ---------- */
  function closeModal() { if (modalRoot) { modalRoot.remove(); modalRoot = null; } }
  function showModal(title, body, actions) {
    closeModal();
    var box = h('div', { class: 'ed-box', role: 'dialog', 'aria-modal': 'true', 'aria-label': title }, [
      h('div', { class: 'ed-head' }, [
        h('strong', { text: title }),
        h('button', { type: 'button', class: 'ed-x', text: '×', 'aria-label': 'বন্ধ করুন', on: { click: closeModal } })
      ]),
      h('div', { class: 'ed-body' }, [body]),
      h('div', { class: 'ed-foot' }, actions || [])
    ]);
    modalRoot = h('div', { class: 'ed-overlay' }, [box]);
    document.body.appendChild(modalRoot);
    var first = box.querySelector('input,textarea,select');
    if (first) first.focus();
  }

  /* ---------- password gate ---------- */
  function openPassword() {
    var input = h('input', { type: 'password', class: 'ed-in', placeholder: 'Password', autocomplete: 'current-password' });
    var err = h('div', { class: 'ed-err' });
    var tryUnlock = function () {
      sha256Hex(input.value).then(function (hex) {
        if (hex === PASS_SHA256) { closeModal(); enterEdit(); }
        else { err.textContent = 'Password ভুল হয়েছে।'; input.select(); }
      }, function () { err.textContent = 'এই browser-এ password যাচাই করা যাচ্ছে না (https দরকার)।'; });
    };
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryUnlock(); });
    showModal('Edit mode', h('div', {}, [
      h('p', { class: 'ed-hint', text: 'Edit করতে password দিন।' }),
      h('label', { class: 'ed-field' }, [h('span', { class: 'ed-lab', text: 'Password' }), input]),
      err
    ]), [btn('Cancel', closeModal), btn('Unlock', tryUnlock, 'ed-primary')]);
  }

  /* ---------- enter / exit ---------- */
  function enterEdit() {
    var sc = window.SITE_CONTENT || {}, SD = window.SiteData, SDOM = window.SiteDOM;
    /* edit mode: auto-moving rows become a plain grid so the add / move / delete controls are reachable */
    document.body.classList.add('ed-mode');
    W = {
      texts: clone(sc.texts || {}), attrs: clone(sc.attrs || {}), blocks: clone(sc.blocks || {}),
      projects: clone(SD.projects), skills: clone(SD.skills), certs: clone(SD.certs), memories: clone(SD.memories),
      tools1: clone(SD.tools1), tools2: clone(SD.tools2), roles: clone(SD.roles), radar: clone(SD.radar)
    };
    // snapshot of the page as it is now: every change is compared against this
    LEAVES = SDOM.leafNodes(document.body).map(function (node) {
      var key = SDOM.nodeKey(node), isCount = node.hasAttribute('data-count');
      var prev = W.texts[key];
      return {
        key: key, node: node, count: isCount,
        h0: isCount ? node.getAttribute('data-count') : cleanHTML(node),
        o: prev && typeof prev === 'object' ? prev.o : SDOM.origOf(node)
      };
    });
    ATTRS = SDOM.attrNodes().map(function (a) {
      var prev = W.attrs[a.key];
      var a0 = a.node.getAttribute(a.attr);
      return { key: a.key, node: a.node, attr: a.attr, a0: a0, o: prev ? prev.o : a0 };
    });
    BLOCKS = $$('[data-block]').map(function (node) {
      return { name: node.getAttribute('data-block'), node: node, b0: cleanHTML(node) };
    });
    BLOCKS.forEach(function (b) { renderBlockCtl(b.node); });
    applyEditable();
    buildBar();
    window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
  }

  function exitEdit() {
    if (dirty && !confirm('Save না করা পরিবর্তনগুলো হারিয়ে যাবে। বের হবেন?')) return;
    location.reload();
  }

  function buildBar() {
    textBtn = btn('Text edit: OFF', function () { setTextMode(!textMode); });
    statusEl = h('div', { class: 'ed-status', 'aria-live': 'polite' });
    bar = h('div', { id: 'ed-bar', class: 'ed-bar' }, [
      h('span', { class: 'ed-title', text: 'Edit mode' }),
      textBtn,
      btn('Links & ছবি', openLinks),
      btn('Skills', function () { openList('skills'); }),
      btn('Projects', function () { openList('projects'); }),
      btn('Certificates', function () { openList('certs'); }),
      btn('Memories', function () { openList('memories'); }),
      btn('Tools / Radar', openToolsRadar),
      btn('GitHub settings', function () { openSettings(); }),
      btn('Save to website', saveToSite, 'ed-primary'),
      btn('Exit', exitEdit),
      statusEl
    ]);
    document.body.appendChild(bar);
    setStatus('লেখায় click করে বদলান (Text edit ON)। Experience, Education, Publications, Testimonials-এ নতুন item যোগ/মুছা যায়।');
  }

  function setStatus(msg, isErr) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'ed-status' + (isErr ? ' err' : '');
  }

  /* ---------- inline editing ---------- */
  function applyEditable() {
    var nodes = LEAVES.map(function (l) { return l.node; });
    BLOCKS.forEach(function (b) { window.SiteDOM.leafNodes(b.node).forEach(function (n) { nodes.push(n); }); });
    nodes.forEach(function (n) {
      if (textMode) { n.setAttribute('contenteditable', 'true'); n.classList.add('ed-editable'); }
      else { n.removeAttribute('contenteditable'); n.classList.remove('ed-editable'); }
    });
  }
  function setTextMode(on) {
    textMode = on;
    applyEditable();
    textBtn.textContent = 'Text edit: ' + (on ? 'ON' : 'OFF');
    if (on) setStatus('লেখায় click করে বদলান। Enter দিলে নতুন লাইন হবে।');
  }

  document.addEventListener('input', function (e) {
    if (!W || !e.target || !e.target.closest) return;
    var n = e.target.closest('[contenteditable="true"]');
    if (!n) return;
    dirty = true;
    if (n.hasAttribute('data-count')) {          // metric numbers
      var digits = String(n.textContent).replace(/\D/g, '');
      n.setAttribute('data-count', digits || '0');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); return; }
    if (!textMode || e.key !== 'Enter' || !e.target || !e.target.closest) return;
    if (e.target.closest('[contenteditable="true"]')) { e.preventDefault(); document.execCommand('insertLineBreak'); }
  });
  document.addEventListener('paste', function (e) {
    if (!textMode || !e.target || !e.target.closest || !e.target.closest('[contenteditable="true"]')) return;
    e.preventDefault();
    document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text/plain'));
  });

  /* ---------- repeatable blocks ---------- */
  function blockItems(block) {
    return Array.prototype.filter.call(block.children, function (c) { return !c.classList.contains('ed-itemctl'); });
  }
  function renderBlockCtl(block) {
    $$('.ed-itemctl', block).forEach(function (n) { n.remove(); });
    var items = blockItems(block);
    items.forEach(function (item, i) {
      block.insertBefore(h('div', { class: 'ed-itemctl' }, [
        h('span', { class: 'ed-hint', text: (BLOCK_LABELS[block.getAttribute('data-block')] || 'Item') + ' ' + (i + 1) }),
        btn('↑', function () { moveItem(block, i, i - 1); }, 'ed-sm'),
        btn('↓', function () { moveItem(block, i, i + 1); }, 'ed-sm'),
        btn('Delete', function () {
          if (confirm('এই item টি মুছবেন?')) { item.remove(); dirty = true; renderBlockCtl(block); applyEditable(); }
        }, 'ed-sm ed-danger')
      ]), item);
    });
    block.appendChild(h('div', { class: 'ed-itemctl ed-addbar' }, [
      btn('+ নতুন item যোগ (শেষটার কপি, তারপর লেখা বদলান)', function () {
        var list = blockItems(block);
        if (!list.length) return;
        var copy = list[list.length - 1].cloneNode(true);
        copy.removeAttribute('data-reveal');
        copy.setAttribute('data-reveal', '');
        copy.classList.add('is-visible');
        block.insertBefore(copy, block.querySelector('.ed-addbar'));
        dirty = true; renderBlockCtl(block); applyEditable();
      }, 'ed-primary')
    ]));
  }
  function moveItem(block, i, j) {
    var items = blockItems(block);
    if (j < 0 || j >= items.length) return;
    if (j > i) block.insertBefore(items[j], items[i]); else block.insertBefore(items[i], items[j]);
    dirty = true; renderBlockCtl(block); applyEditable();
  }

  /* ---------- links & images panel ---------- */
  function openLinks() {
    var rows = ATTRS.map(function (a) {
      var label = trim(a.node.textContent) || a.node.getAttribute('aria-label') || a.node.getAttribute('alt') || a.node.tagName.toLowerCase();
      var input = h('input', { class: 'ed-in ed-small', type: 'text', value: a.node.getAttribute(a.attr) || '' });
      input.addEventListener('input', function () { a.node.setAttribute(a.attr, input.value); dirty = true; });
      var parts = [h('div', { class: 'ed-rowtxt', text: label.slice(0, 60) + '  ·  ' + a.attr })];
      var line = [input];
      if (a.attr === 'src') {
        var fileIn = h('input', { type: 'file', accept: 'image/*', class: 'ed-small' });
        fileIn.addEventListener('change', function () {
          var f = fileIn.files && fileIn.files[0];
          if (!f) return;
          resizeImage(f, 1600).then(function (durl) {
            var p = newImagePath();
            pending[p] = durl;
            a.node.setAttribute('src', p);
            input.value = p;
            dirty = true;
            setStatus('ছবি প্রস্তুত। Save to website চাপলে upload হবে।');
          }, function () { setStatus('ছবিটি পড়া যায়নি। JPG বা PNG দিন।', true); });
        });
        line.push(fileIn);
      }
      return h('div', { class: 'ed-row ed-row-col' }, parts.concat([h('div', { class: 'ed-linerow' }, line)]));
    });
    showModal('Links, ছবি ও copy-বাটন', h('div', {}, [
      h('p', { class: 'ed-hint', text: 'এখানে ওয়েবসাইটের সব link (WhatsApp, email, LinkedIn, DOI, CV), ছবির path এবং copy করার লেখা বদলানো যায়। ছবি বদলাতে "ফাইল" দিন।' }),
      h('div', { class: 'ed-list' }, rows.length ? rows : [h('p', { class: 'ed-hint', text: 'কিছু নেই।' })])
    ]), [btn('Close', closeModal)]);
  }

  /* ---------- simple lists: strings (tools, roles) and radar ---------- */
  function openStrings(key, label) {
    var list = W[key];
    var rows = list.map(function (v, i) {
      var inp = h('input', { class: 'ed-in', type: 'text', value: v });
      inp.addEventListener('input', function () { list[i] = inp.value; dirty = true; });
      return h('div', { class: 'ed-row' }, [
        inp,
        h('div', { class: 'ed-rowbtns' }, [
          btn('↑', function () { if (i > 0) { var t = list[i]; list[i] = list[i - 1]; list[i - 1] = t; dirty = true; openStrings(key, label); } }, 'ed-sm'),
          btn('↓', function () { if (i < list.length - 1) { var t = list[i]; list[i] = list[i + 1]; list[i + 1] = t; dirty = true; openStrings(key, label); } }, 'ed-sm'),
          btn('✕', function () { list.splice(i, 1); dirty = true; openStrings(key, label); }, 'ed-sm ed-danger')
        ])
      ]);
    });
    showModal(label + ' (' + list.length + ')', h('div', {}, [h('div', { class: 'ed-list' }, rows)]), [
      btn('Close', closeModal),
      btn('+ Add', function () { list.push(''); dirty = true; openStrings(key, label); }, 'ed-primary')
    ]);
  }
  function openRadar() {
    var list = W.radar;
    var rows = list.map(function (r, i) {
      var lab = h('input', { class: 'ed-in', type: 'text', value: r.label });
      var val = h('input', { class: 'ed-in ed-num', type: 'number', min: 0, max: 100, value: r.v });
      lab.addEventListener('input', function () { r.label = lab.value; dirty = true; });
      val.addEventListener('input', function () { r.v = Math.max(0, Math.min(100, parseInt(val.value, 10) || 0)); dirty = true; });
      return h('div', { class: 'ed-row' }, [
        lab, val,
        h('div', { class: 'ed-rowbtns' }, [
          btn('✕', function () { list.splice(i, 1); dirty = true; openRadar(); }, 'ed-sm ed-danger')
        ])
      ]);
    });
    showModal('Skill radar (' + list.length + ')', h('div', {}, [
      h('p', { class: 'ed-hint', text: 'প্রতিটা লাইনের নাম ও মান (0–100)। Chart নিজে থেকে আঁকা হবে।' }),
      h('div', { class: 'ed-list' }, rows)
    ]), [
      btn('Close', closeModal),
      btn('+ Add', function () { list.push({ label: 'New skill', v: 50 }); dirty = true; openRadar(); }, 'ed-primary')
    ]);
  }
  function openToolsRadar() {
    showModal('Tools, typing text ও Radar', h('div', {}, [
      h('p', { class: 'ed-hint', text: 'Hero-র typing লেখা, এবং Tools marquee-র দুই সারির নাম এখান থেকে বদলান।' }),
      h('div', { class: 'ed-linkgrid' }, [
        btn('Hero typing লেখা (' + W.roles.length + ')', function () { openStrings('roles', 'Hero typing লেখা'); }, 'ed-wide'),
        btn('Tools — প্রথম সারি (' + W.tools1.length + ')', function () { openStrings('tools1', 'Tools — প্রথম সারি'); }, 'ed-wide'),
        btn('Tools — দ্বিতীয় সারি (' + W.tools2.length + ')', function () { openStrings('tools2', 'Tools — দ্বিতীয় সারি'); }, 'ed-wide'),
        btn('Skill radar (' + W.radar.length + ')', openRadar, 'ed-wide')
      ])
    ]), [btn('Close', closeModal)]);
  }

  /* ---------- item lists: projects, certificates, skills, memories ---------- */
  var KINDS = {
    projects: {
      label: 'Projects', key: 'projects',
      itemTitle: function (p) { return p.title; },
      thumb: function (p) { return p.img; },
      make: function () { return { img: '', cat: '', accent: 'blue', title: '', storey: '', location: '', client: '', role: '', scope: '', challenge: '', solution: '', result: '', tags: [] }; },
      fields: [
        { k: 'img', t: 'image', l: 'Cover image (landscape photo)', req: true },
        { k: 'title', t: 'text', l: 'Project title', req: true },
        { k: 'cat', t: 'text', l: 'Category (e.g. Residential · G+8)' },
        { k: 'accent', t: 'select', l: 'Colour', o: ['blue', 'emerald', 'amber', 'purple', 'sky'] },
        { k: 'storey', t: 'text', l: 'Storey (e.g. G+8)' },
        { k: 'location', t: 'text', l: 'Location' },
        { k: 'client', t: 'text', l: 'Client' },
        { k: 'role', t: 'textarea', l: 'Your role' },
        { k: 'scope', t: 'textarea', l: 'Scope' },
        { k: 'challenge', t: 'textarea', l: 'Challenge' },
        { k: 'solution', t: 'textarea', l: 'Solution' },
        { k: 'result', t: 'textarea', l: 'Result' },
        { k: 'tags', t: 'tags', l: 'Software tags (comma separated)' }
      ]
    },
    certs: {
      label: 'Certificates', key: 'certs',
      itemTitle: function (c) { return c.title; },
      thumb: certSrc,
      make: function () { return { plat: '', kind: 'blue', grp: window.SiteData.groups.programming, img: '', title: '', sub: '', date: '', desc: '' }; },
      fields: [
        { k: 'title', t: 'text', l: 'Certificate title', req: true },
        { k: 'plat', t: 'text', l: 'Platform (e.g. UDEMY, COURSERA)' },
        { k: 'kind', t: 'select', l: 'Colour', o: function () { return window.SiteData.accents; } },
        { k: 'grp', t: 'select', l: 'Group', o: function () { var g = window.SiteData.groups; return [g.structural, g.software, g.programming]; } },
        { k: 'sub', t: 'text', l: 'Subtitle (issuer, hours)' },
        { k: 'date', t: 'text', l: 'Date (e.g. Jun 2026)' },
        { k: 'img', t: 'image', l: 'Certificate image (optional)', optional: true },
        { k: 'desc', t: 'textarea', l: 'Short description' }
      ]
    },
    skills: {
      label: 'Skill groups', key: 'skills',
      itemTitle: function (g) { return g.title; },
      thumb: null,
      make: function () { return { title: '', sub: '', accent: 'blue', icon: 'i-cubes', items: [] }; },
      fields: [
        { k: 'title', t: 'text', l: 'Group title', req: true },
        { k: 'sub', t: 'text', l: 'Subtitle' },
        { k: 'accent', t: 'select', l: 'Colour', o: ['blue', 'amber', 'emerald'] },
        { k: 'icon', t: 'text', l: 'Icon id (e.g. i-cubes, i-earth-americas, i-laptop-code)' },
        { k: 'items', t: 'lines', l: 'Skills — one per line: Name | Note | Badge | kind (blue / amber / emerald / plain)' }
      ]
    },
    memories: {
      label: 'Memories', key: 'memories',
      itemTitle: function (m) { return m.caption || m.src; },
      thumb: function (m) { return m.src; },
      make: function () { return { src: '', caption: '' }; },
      fields: [
        { k: 'src', t: 'image', l: 'Photo', req: true },
        { k: 'caption', t: 'text', l: 'Caption (optional)' }
      ]
    }
  };
  function optsOf(f) { return typeof f.o === 'function' ? f.o() : f.o; }
  function parseLines(text) {
    return String(text || '').split('\n').map(trim).filter(Boolean).map(function (line) {
      var p = line.split('|').map(trim);
      return { name: p[0] || '', note: p[1] || '', badge: p[2] || '', kind: p[3] || 'plain' };
    });
  }
  function linesText(items) { return (items || []).map(function (i) { return [i.name, i.note, i.badge, i.kind].join(' | '); }).join('\n'); }

  function openList(key) {
    var kind = KINDS[key], list = W[key];
    var rows = list.map(function (it, i) {
      var src = kind.thumb ? kind.thumb(it) : '';
      var thumb = src ? h('img', { class: 'ed-thumb', src: imgSrc(src), alt: '', loading: 'lazy' }) : h('div', { class: 'ed-thumb' });
      return h('div', { class: 'ed-row' }, [
        thumb,
        h('div', { class: 'ed-rowtxt', text: (i + 1) + '. ' + (kind.itemTitle(it) || '(untitled)') }),
        h('div', { class: 'ed-rowbtns' }, [
          btn('↑', function () { swap(key, i, i - 1); }, 'ed-sm'),
          btn('↓', function () { swap(key, i, i + 1); }, 'ed-sm'),
          btn('Edit', function () { openItemForm(key, i); }, 'ed-sm'),
          btn('Delete', function () { if (confirm('এই item টি মুছবেন?')) { list.splice(i, 1); dirty = true; openList(key); } }, 'ed-sm ed-danger')
        ])
      ]);
    });
    showModal(kind.label + ' (' + list.length + ')', h('div', {}, [
      h('div', { class: 'ed-hint', text: 'বদল গুলো live site-এ যাবে "Save to website" চাপলে।' }),
      h('div', { class: 'ed-list' }, rows.length ? rows : [h('p', { class: 'ed-hint', text: 'এখনো কিছু নেই।' })])
    ]), [btn('Close', closeModal), btn('+ Add new', function () { openItemForm(key, null); }, 'ed-primary')]);
  }
  function swap(key, i, j) {
    var list = W[key];
    if (j < 0 || j >= list.length) return;
    var t = list[i]; list[i] = list[j]; list[j] = t;
    dirty = true; openList(key);
  }

  function buildForm(kind, item) {
    var getters = {}, wrap = h('div', { class: 'ed-form' });
    kind.fields.forEach(function (f) {
      var cur = (kind.key === 'certs' && f.k === 'img') ? certSrc(item) : item[f.k];
      var label = h('span', { class: 'ed-lab', text: f.l + (f.req ? ' *' : '') });
      var row;
      if (f.t === 'select') {
        var sel = h('select', { class: 'ed-in' }, optsOf(f).map(function (o) { return h('option', { value: o, text: o, selected: o === cur }); }));
        row = h('label', { class: 'ed-field' }, [label, sel]);
        getters[f.k] = function () { return sel.value; };
      } else if (f.t === 'textarea' || f.t === 'lines') {
        var ta = h('textarea', { class: 'ed-in', rows: f.t === 'lines' ? 7 : 3 });
        ta.value = f.t === 'lines' ? linesText(cur) : (cur || '');
        row = h('label', { class: 'ed-field' }, [label, ta]);
        getters[f.k] = f.t === 'lines' ? function () { return parseLines(ta.value); } : function () { return ta.value; };
      } else if (f.t === 'tags') {
        var ti = h('input', { class: 'ed-in', type: 'text' });
        ti.value = (cur || []).join(', ');
        row = h('label', { class: 'ed-field' }, [label, ti]);
        getters[f.k] = function () { return ti.value.split(',').map(trim).filter(Boolean); };
      } else if (f.t === 'image') {
        var val = cur || '';
        var prev = h('img', { class: 'ed-prev', alt: '' });
        var fileIn = h('input', { type: 'file', accept: 'image/*' });
        var rm = h('button', { type: 'button', class: 'ed-btn ed-sm', text: 'ছবি সরান' });
        var msg = h('div', { class: 'ed-hint' });
        var show = function () {
          var s = imgSrc(val);
          prev.src = s; prev.style.display = s ? '' : 'none';
          rm.style.display = val ? '' : 'none';
        };
        fileIn.addEventListener('change', function () {
          var file = fileIn.files && fileIn.files[0];
          if (!file) return;
          msg.textContent = 'ছবি প্রস্তুত হচ্ছে…';
          resizeImage(file, 1600).then(function (durl) {
            var p = newImagePath();
            pending[p] = durl; val = p; show();
            msg.textContent = 'ছবি প্রস্তুত। Save to website চাপলে upload হবে।';
          }, function () { msg.textContent = 'ছবিটি পড়া যায়নি। JPG বা PNG দিন।'; });
        });
        rm.addEventListener('click', function () { val = ''; fileIn.value = ''; show(); msg.textContent = ''; });
        show();
        row = h('div', { class: 'ed-field' }, [label, h('div', { class: 'ed-imgbox' }, [prev, h('div', { class: 'ed-imgctl' }, [fileIn, rm, msg])])]);
        getters[f.k] = function () { return val; };
      } else {
        var inp = h('input', { class: 'ed-in', type: 'text' });
        inp.value = cur || '';
        row = h('label', { class: 'ed-field' }, [label, inp]);
        getters[f.k] = function () { return inp.value; };
      }
      wrap.appendChild(row);
    });
    return {
      node: wrap,
      collect: function () {
        var out = {}, errs = [];
        kind.fields.forEach(function (f) {
          var v = getters[f.k]();
          if (f.req && (v == null || v === '' || (Array.isArray(v) && !v.length))) errs.push(f.l.replace(' *', '') + ' দিন');
          out[f.k] = v;
        });
        return { value: Object.assign(clone(item), out), error: errs.join(', ') };
      }
    };
  }

  function openItemForm(key, idx) {
    var kind = KINDS[key];
    var item = idx == null ? kind.make() : clone(W[key][idx]);
    var form = buildForm(kind, item);
    var err = h('div', { class: 'ed-err' });
    var save = function () {
      var r = form.collect();
      if (r.error) { err.textContent = r.error; return; }
      if (idx == null) W[key].push(r.value); else W[key][idx] = r.value;
      dirty = true;
      openList(key);
    };
    showModal((idx == null ? 'নতুন ' : 'বদলান: ') + kind.label, h('div', {}, [form.node, err]), [
      btn('Cancel', function () { openList(key); }),
      btn('Save item', save, 'ed-primary')
    ]);
  }

  /* ---------- GitHub settings ---------- */
  function openSettings(note) {
    var inp = h('input', { class: 'ed-in', type: 'password', placeholder: 'github_pat_… (fine-grained token)', autocomplete: 'off' });
    inp.value = getToken();
    var msg = h('div', { class: 'ed-hint', text: note || '' });
    var storeToken = function () { try { sessionStorage.setItem(TOKEN_KEY, trim(inp.value)); } catch (e) {} };
    var cvIn = h('input', { type: 'file', accept: 'application/pdf', class: 'ed-small' });
    cvIn.addEventListener('change', function () {
      var f = cvIn.files && cvIn.files[0];
      if (!f) return;
      if (!getToken()) { msg.textContent = 'আগে token সেভ করুন।'; return; }
      if (!confirm('CV PDF এখন GitHub-এ বদলে যাবে (' + f.name + '). চালিয়ে যাবেন?')) return;
      msg.textContent = 'CV upload হচ্ছে…';
      fileToBase64(f).then(function (b64) { return putFile(CFG.cvPath, b64, 'Replace CV PDF (edit panel)'); })
        .then(function () { msg.textContent = 'CV বদলানো হয়েছে ✓ (live হতে ১–৩ মিনিট)।'; },
              function (e) { msg.textContent = 'CV upload হয়নি: ' + e.message; });
    });
    showModal('GitHub settings', h('div', {}, [
      h('p', { class: 'ed-hint', text: 'Repo: ' + CFG.owner + '/' + CFG.repo + ' (' + CFG.branch + ')। Token শুধু এই browser tab-এর sessionStorage-এ থাকবে, কোথাও save হবে না।' }),
      h('p', { class: 'ed-hint', text: 'Token বানাতে: GitHub → Settings → Developer settings → Fine-grained tokens → শুধু এই repo-তে Contents: Read and write দিন।' }),
      h('label', { class: 'ed-field' }, [h('span', { class: 'ed-lab', text: 'Token' }), inp]),
      h('label', { class: 'ed-field' }, [h('span', { class: 'ed-lab', text: 'CV PDF বদলান (এখনই GitHub-এ যাবে)' }), cvIn]),
      msg
    ]), [
      btn('Forget token', function () { inp.value = ''; try { sessionStorage.removeItem(TOKEN_KEY); } catch (e) {} msg.textContent = 'Token মুছে ফেলা হয়েছে।'; }),
      btn('Test', function () {
        storeToken();
        msg.textContent = 'যাচাই হচ্ছে…';
        gh('/repos/' + CFG.owner + '/' + CFG.repo).then(function (j) {
          msg.textContent = j.permissions && j.permissions.push ? 'সংযুক্ত ✓ — লেখার অনুমতি আছে।' : 'সংযুক্ত, কিন্তু লেখার অনুমতি নেই। Token-এ Contents: Read and write দিন।';
        }, function (e) { msg.textContent = 'Token কাজ করছে না: ' + e.message; });
      }),
      btn('Save token', function () { storeToken(); msg.textContent = 'Token রাখা হয়েছে।'; }, 'ed-primary')
    ]);
    if (note) msg.textContent = note;
  }

  /* ---------- GitHub API ---------- */
  function gh(path, opts) {
    opts = opts || {};
    var headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', Authorization: 'Bearer ' + getToken() };
    if (opts.body) headers['Content-Type'] = 'application/json';
    return fetch('https://api.github.com' + path, { method: opts.method || 'GET', headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined })
      .then(function (r) {
        return r.text().then(function (t) {
          var j = {};
          try { j = t ? JSON.parse(t) : {}; } catch (e) { j = {}; }
          if (!r.ok) { var err = new Error(j.message || ('HTTP ' + r.status)); err.status = r.status; throw err; }
          return j;
        });
      });
  }
  function repoPath(p) { return '/repos/' + CFG.owner + '/' + CFG.repo + '/contents/' + p.split('/').map(encodeURIComponent).join('/'); }
  function getSha(p) {
    return gh(repoPath(p) + '?ref=' + encodeURIComponent(CFG.branch)).then(function (j) { return j.sha; }, function (e) {
      if (e.status === 404) return null;
      throw e;
    });
  }
  function putFile(p, base64, message) {
    /* Re-read the SHA on every attempt. A 409 means the file changed between the read and the write
       (for example an overlapping save), so retry once with the fresh SHA. */
    function attempt(n) {
      return getSha(p).then(function (sha) {
        var body = { message: message, content: base64, branch: CFG.branch };
        if (sha) body.sha = sha;
        return gh(repoPath(p), { method: 'PUT', body: body }).catch(function (e) {
          if (e.status === 409 && n < 2) return attempt(n + 1);
          throw e;
        });
      });
    }
    return attempt(1);
  }

  /* ---------- save ---------- */
  function collectTexts() {
    var texts = clone(W.texts);
    LEAVES.forEach(function (L) {
      var cur = L.count ? L.node.getAttribute('data-count') : cleanHTML(L.node);
      if (cur === L.h0) return;                       // unchanged in this session
      texts[L.key] = { o: L.o, h: cur };
    });
    return texts;
  }
  function collectAttrs() {
    var attrs = clone(W.attrs);
    ATTRS.forEach(function (A) {
      var cur = A.node.getAttribute(A.attr);
      if (cur === A.a0) return;
      attrs[A.key] = { o: A.o, v: cur };
    });
    return attrs;
  }
  function collectBlocks() {
    var blocks = clone(W.blocks);
    BLOCKS.forEach(function (B) {
      var cur = cleanHTML(B.node);
      if (cur !== B.b0 || blocks[B.name] !== undefined) blocks[B.name] = cur;
    });
    return blocks;
  }

  var saving = false;   /* one save at a time: a double-click must not race itself */
  function saveToSite() {
    if (saving) return;
    if (!getToken()) { openSettings('আগে GitHub token দিন।'); return; }
    saving = true;
    var content = {
      texts: collectTexts(), attrs: collectAttrs(), blocks: collectBlocks(),
      projects: W.projects, skills: W.skills, certs: W.certs, memories: W.memories,
      tools1: W.tools1, tools2: W.tools2, roles: W.roles, radar: W.radar
    };
    var json = JSON.stringify(content);
    var used = Object.keys(pending).filter(function (p) { return json.indexOf(p) !== -1; });
    setStatus('Save হচ্ছে…');
    var chain = Promise.resolve();
    used.forEach(function (p) {
      chain = chain.then(function () {
        setStatus('ছবি upload: ' + p.split('/').pop());
        return putFile(p, pending[p].split(',')[1], 'Add image from edit panel');
      });
    });
    chain.then(function () {
      setStatus('Content save হচ্ছে…');
      var file = 'window.SITE_CONTENT = ' + JSON.stringify(content, null, 2) + ';\n';
      return putFile(CFG.contentPath, b64utf8(file), 'Update site content from edit panel');
    }).then(function () {
      pending = {};
      dirty = false;
      saving = false;
      setStatus('Save হয়েছে ✓ — live site ১–৩ মিনিটে update হবে (browser cache-এর জন্য একটু দেরি হতে পারে)।');
    }, function (e) {
      saving = false;
      var hint = e.status === 401 ? ' (token ভুল বা মেয়াদ শেষ)' : e.status === 403 ? ' (token-এ লেখার অনুমতি নেই)' :
                 e.status === 409 ? ' (একই সময়ে অন্য save চলছিল — page reload করে আবার Save চাপুন)' : '';
      setStatus('Save হয়নি: ' + e.message + hint, true);
    });
  }

  /* ---------- styles + entry button ---------- */
  var CSS = [
    '.ed-open{font:700 12px/1 system-ui,sans-serif;letter-spacing:.04em;color:#94a3b8;border:1px dashed #334155;border-radius:999px;padding:7px 12px;background:transparent;cursor:pointer;align-self:center}',
    '.ed-open:hover{color:#fff;border-color:#60a5fa}',
    '.ed-bar{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:300;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;width:max-content;max-width:calc(100vw - 16px);background:#0f172a;border:1px solid #1e3a8a;border-radius:14px;padding:8px 10px;box-shadow:0 10px 40px rgba(0,0,0,.5);font:600 12px/1.2 system-ui,sans-serif;color:#e2e8f0}',
    '.ed-title{color:#60a5fa;font-weight:800;margin-right:2px}',
    '.ed-btn{background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:7px 10px;cursor:pointer;font:inherit}',
    '.ed-btn:hover{background:#334155}',
    '.ed-primary{background:#2563eb;border-color:#3b82f6;color:#fff}',
    '.ed-primary:hover{background:#1d4ed8}',
    '.ed-danger{color:#fca5a5}',
    '.ed-sm{padding:5px 8px;font-size:11px}',
    '.ed-wide{text-align:left;width:100%}',
    '.ed-linkgrid{display:flex;flex-direction:column;gap:8px}',
    '.ed-status{width:100%;text-align:center;font-weight:500;color:#94a3b8}',
    '.ed-status.err{color:#fca5a5}',
    '[contenteditable="true"].ed-editable{outline:1px dashed #3b82f6;outline-offset:4px;cursor:text;border-radius:4px}',
    '.ed-itemctl{display:flex;flex-wrap:wrap;gap:6px;align-items:center;grid-column:1/-1;margin:4px 0;font:600 11px/1.2 system-ui,sans-serif;color:#e2e8f0}',
    '.ed-itemctl .ed-hint{margin:0 6px 0 0}',
    '.ed-addbar{justify-content:center;padding:6px;border:1px dashed #3b82f6;border-radius:12px}',
    '.ed-overlay{position:fixed;inset:0;z-index:400;background:rgba(2,6,23,.75);display:flex;align-items:center;justify-content:center;padding:12px}',
    '.ed-box{width:min(680px,100%);max-height:90vh;display:flex;flex-direction:column;background:#0f172a;border:1px solid #1e3a8a;border-radius:16px;color:#e2e8f0;font:14px/1.45 system-ui,sans-serif}',
    '.ed-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #1e293b}',
    '.ed-x{background:none;border:0;color:#94a3b8;font-size:24px;cursor:pointer;line-height:1}',
    '.ed-body{padding:14px 16px;overflow:auto;flex:1;min-height:0}',
    '.ed-foot{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;padding:12px 16px;border-top:1px solid #1e293b}',
    '.ed-field{display:block;margin-bottom:12px}',
    '.ed-form .ed-field:last-child{margin-bottom:0}',
    '.ed-lab{display:block;font-size:12px;color:#94a3b8;margin-bottom:4px;font-weight:600}',
    '.ed-in{width:100%;background:#020617;border:1px solid #334155;border-radius:8px;color:#fff;padding:8px 10px;font:inherit;min-width:0}',
    '.ed-small{font-size:12px;padding:6px 8px}',
    '.ed-num{width:90px;flex:none}',
    'textarea.ed-in{resize:vertical}',
    '.ed-hint{font-size:12px;color:#94a3b8;margin:0 0 10px}',
    '.ed-err{color:#fca5a5;font-size:13px;margin-top:8px}',
    '.ed-list{display:flex;flex-direction:column;gap:6px;margin-top:12px}',
    '.ed-row{display:flex;align-items:center;gap:8px;background:#020617;border:1px solid #1e293b;border-radius:10px;padding:8px}',
    '.ed-row-col{flex-direction:column;align-items:stretch}',
    '.ed-linerow{display:flex;gap:8px;align-items:center;flex-wrap:wrap}',
    '.ed-linerow .ed-in{flex:1;min-width:200px}',
    '.ed-thumb{width:56px;height:40px;object-fit:cover;border-radius:6px;flex:none;background:#1e293b}',
    '.ed-rowtxt{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}',
    '.ed-rowbtns{display:flex;gap:4px;flex:none;flex-wrap:wrap;justify-content:flex-end}',
    '.ed-imgbox{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap}',
    '.ed-prev{width:140px;height:90px;object-fit:cover;border-radius:8px;border:1px solid #334155;background:#1e293b}',
    '.ed-imgctl{display:flex;flex-direction:column;gap:6px;flex:1;min-width:160px;font-size:12px}'
  ].join('\n');

  function init() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    var open = document.getElementById('edit-open');
    if (open) open.addEventListener('click', openPassword);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
