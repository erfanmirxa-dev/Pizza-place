/* =====================================================================
   CLAIRA — interactions
   - Scroll-progress bar (pink)
   - Nav: transparent-over-hero -> solid on scroll
   - Mobile drawer
   - Scroll reveals (IntersectionObserver)
   - Newsletter form (front-end only)
   ===================================================================== */
(function () {
  "use strict";

  function safe(fn) {
    try { fn(); } catch (err) { /* one feature failing must never block the others */ }
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- scroll progress + nav solid state ---------- */
  safe(function () {
    var progress = document.getElementById("progress");
    var nav = document.getElementById("nav");
    var hero = document.getElementById("hero");

    function onScroll() {
      var doc = document.documentElement;
      var scrolled = doc.scrollTop || document.body.scrollTop;
      var max = (doc.scrollHeight - doc.clientHeight) || 1;
      if (progress) progress.style.width = Math.min(100, (scrolled / max) * 100) + "%";

      var threshold = hero ? hero.offsetHeight - 90 : 400;
      if (nav) nav.classList.toggle("nav--solid", scrolled > threshold);
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });

  /* ---------- mobile drawer ---------- */
  safe(function () {
    var menuToggle = document.getElementById("menuToggle");
    var drawer = document.getElementById("drawer");
    if (menuToggle && drawer) {
      menuToggle.addEventListener("click", function () {
        var open = drawer.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(open));
        drawer.setAttribute("aria-hidden", String(!open));
        document.body.style.overflow = open ? "hidden" : "";
      });
      drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          drawer.classList.remove("is-open");
          menuToggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });
    }
  });

  /* ---------- scroll reveals ----------
     .reveal elements are visible by default in CSS; JS only ever makes
     them invisible-then-fade-in, and only after opting them in here — so
     if this block fails or IntersectionObserver misbehaves on a given
     device, content still shows instead of staying stuck at opacity:0. */
  safe(function () {
    var reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      return; // leave elements in their default visible state
    }

    reveals.forEach(function (el) { el.classList.add("reveal-armed"); });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            setTimeout(function () { entry.target.classList.add("is-in"); }, (i % 4) * 90);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });

    // safety net: if a given element never intersects (observer quirks,
    // fixed-position ancestors, etc.) force it visible after a few seconds
    setTimeout(function () {
      document.querySelectorAll(".reveal-armed:not(.is-in)").forEach(function (el) {
        el.classList.add("is-in");
      });
    }, 2500);
  });

  /* ---------- newsletter (front-end only) ---------- */
  safe(function () {
    var joinForm = document.getElementById("joinForm");
    if (joinForm) {
      joinForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = document.getElementById("joinEmail");
        var btn = joinForm.querySelector(".link-cta");
        if (btn) btn.textContent = "You're on the list";
        if (input) input.value = "";
      });
    }
  });

  /* ---------- footer year ---------- */
  safe(function () {
    var yr = document.getElementById("yr");
    if (yr) yr.textContent = new Date().getFullYear();
  });
})();
