/* =====================================================================
   Pizza Place — interactions
   - Live open/closed status from real hours
   - Sticky nav shrink
   - Scroll reveals (IntersectionObserver)
   - Menu tabs
   - Hero ember particle canvas (respects reduced-motion)
   ===================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- year ---------- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- hours: Mon-Thu 10:30-20:00, Fri/Sat 10:30-20:30, Sun 10:30-20:00 ---------- */
  // index 0 = Sunday
  var SCHEDULE = {
    0: [630, 1200], // Sun  10:30a - 8:00p   (minutes from midnight)
    1: [630, 1200],
    2: [630, 1200],
    3: [630, 1200],
    4: [630, 1200],
    5: [630, 1230], // Fri  - 8:30p
    6: [630, 1230]  // Sat  - 8:30p
  };

  function fmt(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    var ap = h >= 12 ? "pm" : "am";
    var hh = h % 12; if (hh === 0) hh = 12;
    return hh + (m ? ":" + (m < 10 ? "0" + m : m) : "") + ap;
  }

  function updateStatus() {
    var now = new Date();
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var today = SCHEDULE[day];
    var pill = document.getElementById("statusPill");
    var text = document.getElementById("statusText");
    if (!pill || !text) return;

    var open = today && mins >= today[0] && mins < today[1];
    pill.classList.remove("is-open", "is-closed");

    if (open) {
      pill.classList.add("is-open");
      var closingSoon = today[1] - mins <= 30;
      text.textContent = closingSoon
        ? "Open · closes " + fmt(today[1])
        : "Open now · til " + fmt(today[1]);
    } else {
      pill.classList.add("is-closed");
      // find next opening
      var probe = day, guard = 0, label = "";
      if (today && mins < today[0]) {
        label = "Opens " + fmt(today[0]) + " today";
      } else {
        var names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        do { probe = (probe + 1) % 7; guard++; } while (!SCHEDULE[probe] && guard < 8);
        label = "Opens " + fmt(SCHEDULE[probe][0]) + " " + names[probe];
      }
      text.textContent = "Closed · " + label;
    }

    // highlight today's row
    var rows = document.querySelectorAll("#hoursTable tr");
    rows.forEach(function (r) {
      r.classList.toggle("is-today", parseInt(r.getAttribute("data-day"), 10) === day);
    });
  }
  updateStatus();
  setInterval(updateStatus, 60 * 1000);

  /* ---------- sticky nav shrink ---------- */
  var nav = document.getElementById("nav");
  var lastY = -1;
  function onScroll() {
    var y = window.scrollY;
    if (y === lastY) return;
    lastY = y;
    if (nav) nav.classList.toggle("shrink", y > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- scroll reveals ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          setTimeout(function () { el.classList.add("in"); },
            Math.min(i * 70, 240));
          io.unobserve(el);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- menu tabs ---------- */
  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-tab");
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-panel") === key);
      });
    });
  });

  /* ---------- hero embers ---------- */
  var canvas = document.getElementById("embers");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var hero = canvas.parentElement;
    var W, H, dpr, embers = [];

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spark() {
      return {
        x: W * (0.5 + Math.random() * 0.55),     // bias to the right (oven side)
        y: H + Math.random() * 40,
        r: 0.6 + Math.random() * 2.2,
        vy: -(0.25 + Math.random() * 0.85),
        vx: -0.25 + Math.random() * 0.5,
        life: 0, max: 120 + Math.random() * 160,
        hue: 18 + Math.random() * 22
      };
    }
    function init() {
      size();
      embers = [];
      var n = Math.round(W / 22);
      for (var i = 0; i < n; i++) { var s = spark(); s.life = Math.random() * s.max; embers.push(s); }
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < embers.length; i++) {
        var e = embers[i];
        e.x += e.vx; e.y += e.vy; e.life++;
        e.vx += (Math.random() - 0.5) * 0.03;
        if (e.life > e.max || e.y < -10) { embers[i] = spark(); continue; }
        var t = e.life / e.max;
        var a = Math.sin(t * Math.PI) * 0.8;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = "hsla(" + e.hue + ",95%,60%," + a.toFixed(3) + ")";
        ctx.shadowBlur = 8; ctx.shadowColor = "rgba(244,134,58," + a.toFixed(3) + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    var raf;
    init();
    tick();
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt); rt = setTimeout(init, 200);
    });
    // pause when hero off-screen
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        en.forEach(function (x) {
          if (x.isIntersecting) { if (!raf) tick(); }
          else { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 }).observe(hero);
    }
  }
})();
