/* ================================================================
   Imran Hasan — Portfolio  ·  truss-bg.js
   BACKGROUND LAYER A — a slowly breathing structural truss / node
   network drawn on a <canvas> inside the hero section.

   Behaviour
   ---------
   • Nodes drift; links are drawn between any two nodes closer than
     LINK_DIST, giving a space-frame / truss look.
   • The pointer acts as an extra node: nearby links glow brighter and
     nodes lean toward the cursor.
   • The animation loop STOPS as soon as the hero scrolls out of view
     and restarts when it comes back (IntersectionObserver).
   • Disabled entirely on narrow screens (< 768 px) and when the user
     has asked the OS to reduce motion — zero cost in those cases.
   ================================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('truss-canvas');
  if (!canvas) return;

  var hero = canvas.parentElement;
  var ctx  = canvas.getContext('2d');
  if (!ctx) return;

  var MIN_WIDTH   = 768;    // below this the canvas is skipped completely
  var LINK_DIST   = 155;    // px — max distance for a member to be drawn
  var MOUSE_DIST  = 190;    // px — radius of pointer influence
  var NODE_R      = 2.1;
  var SPEED       = 0.20;   // drift speed multiplier

  var nodes = [];
  var w = 0, h = 0, dpr = 1;
  var mouse = { x: -9999, y: -9999, active: false };
  var raf = null;
  var running = false;

  /* ---------------------------------------------------------- */
  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  /* Density scales with area, but is clamped so low-end laptops stay smooth. */
  function seed() {
    var target = Math.round(Math.min(64, Math.max(26, (w * h) / 22000)));
    nodes = [];
    for (var i = 0; i < target; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: NODE_R + Math.random() * 1.4,
        gold: Math.random() < 0.16          // a few amber "bolt" nodes
      });
    }
  }

  function step() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      // soft wrap so the field never thins out at the edges
      if (n.x < -30) n.x = w + 30; else if (n.x > w + 30) n.x = -30;
      if (n.y < -30) n.y = h + 30; else if (n.y > h + 30) n.y = -30;

      // gentle attraction toward the pointer
      if (mouse.active) {
        var dx = mouse.x - n.x, dy = mouse.y - n.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_DIST * MOUSE_DIST && d2 > 1) {
          var d = Math.sqrt(d2);
          var f = (1 - d / MOUSE_DIST) * 0.035;
          n.vx += (dx / d) * f;
          n.vy += (dy / d) * f;
        }
      }
      // clamp velocity so attraction never runs away
      var sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      var max = SPEED * 2.4;
      if (sp > max) { n.vx = (n.vx / sp) * max; n.vy = (n.vy / sp) * max; }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    /* --- members (links) --- */
    var i, j, a, b, dx, dy, d, alpha;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d > LINK_DIST) continue;

        alpha = (1 - d / LINK_DIST) * 0.22;

        // brighten members that pass near the pointer
        if (mouse.active) {
          var mx = (a.x + b.x) / 2 - mouse.x;
          var my = (a.y + b.y) / 2 - mouse.y;
          var md = Math.sqrt(mx * mx + my * my);
          if (md < MOUSE_DIST) alpha += (1 - md / MOUSE_DIST) * 0.34;
        }

        ctx.strokeStyle = 'rgba(59,130,246,' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // pointer tether
      if (mouse.active) {
        dx = a.x - mouse.x; dy = a.y - mouse.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_DIST) {
          ctx.strokeStyle = 'rgba(245,158,11,' + ((1 - d / MOUSE_DIST) * 0.30).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    /* --- joints (nodes) drawn as small squares = structural bolts --- */
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      var glow = 0;
      if (mouse.active) {
        dx = a.x - mouse.x; dy = a.y - mouse.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_DIST) glow = 1 - d / MOUSE_DIST;
      }
      ctx.fillStyle = a.gold
        ? 'rgba(245,158,11,' + (0.30 + glow * 0.55).toFixed(3) + ')'
        : 'rgba(96,165,250,' + (0.30 + glow * 0.55).toFixed(3) + ')';
      var s = a.r + glow * 1.6;
      ctx.fillRect(a.x - s / 2, a.y - s / 2, s, s);
    }
  }

  function loop() {
    step();
    draw();
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    loop();
  }
  function stop() {
    if (!running) return;
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    ctx.clearRect(0, 0, w, h);
  }

  /* ---------------------------------------------------------- */
  function pointerHandler(e) {
    var rect = canvas.getBoundingClientRect();
    var cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    var cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    mouse.x = cx; mouse.y = cy; mouse.active = true;
  }

  function init() {
    if (window.innerWidth < MIN_WIDTH || reducedMotion()) {
      canvas.style.display = 'none';
      return;
    }

    resize();
    draw();                       // paint one static frame immediately

    // pause/resume with hero visibility
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !document.hidden) start(); else stop();
        });
      }, { threshold: 0.02 }).observe(hero);
    } else {
      start();
    }

    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    window.addEventListener('mousemove', pointerHandler, { passive: true });
    hero.addEventListener('mouseleave', function () { mouse.active = false; });

    var rt = null;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        if (window.innerWidth < MIN_WIDTH || reducedMotion()) { stop(); canvas.style.display = 'none'; return; }
        canvas.style.display = '';
        resize(); draw();
      }, 180);
    });

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      var onChange = function () {
        if (mq.matches) { stop(); canvas.style.display = 'none'; }
        else { canvas.style.display = ''; resize(); draw(); start(); }
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
