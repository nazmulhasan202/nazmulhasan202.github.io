/* Nazmul Hasan - personal site
   Vanilla JS, no dependencies. Every feature degrades gracefully:
   with JS off the page is still complete and readable. */

(function () {
  "use strict";

  /* ---- copy to clipboard (email, citations) ---- */

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;
    var text = btn.getAttribute("data-copy");
    var original = btn.getAttribute("data-label") || btn.textContent;

    function done(ok) {
      btn.textContent = ok ? "Copied" : "Press Ctrl+C";
      btn.classList.toggle("done", ok);
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove("done");
      }, 1800);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); },
                                               function () { fallback(); });
    } else {
      fallback();
    }

    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      done(ok);
    }
  });

  /* ---- skills filter ---- */

  var filter = document.getElementById("skill-filter");
  var grid = document.getElementById("skills-grid");
  var count = document.getElementById("filter-count");

  if (filter && grid) {
    var groups = Array.prototype.slice.call(grid.querySelectorAll(".skill-group"));

    filter.addEventListener("input", function () {
      var q = filter.value.trim().toLowerCase();
      var hits = 0;

      groups.forEach(function (group) {
        var items = group.querySelectorAll("li");
        var groupHits = 0;
        var heading = group.querySelector("h3").textContent.toLowerCase();
        var headingMatch = q && heading.indexOf(q) !== -1;

        Array.prototype.forEach.call(items, function (li) {
          var match = q && (li.textContent.toLowerCase().indexOf(q) !== -1 || headingMatch);
          li.classList.toggle("hit", !!match);
          if (match) groupHits++;
        });

        group.classList.toggle("dim", !!q && groupHits === 0);
        hits += groupHits;
      });

      if (!q) {
        count.textContent = "";
      } else if (hits === 0) {
        count.textContent = "Nothing matches “" + filter.value.trim() + "”.";
      } else {
        count.textContent = hits + (hits === 1 ? " match" : " matches") + " highlighted.";
      }
    });
  }

  /* ---- nav scroll spy ---- */

  var nav = document.getElementById("nav");
  if (nav && "IntersectionObserver" in window) {
    var navLinks = Array.prototype.slice
      .call(nav.querySelectorAll('a[href^="#"]'))
      .filter(function (a) { return (a.getAttribute("href") || "").length > 1; });
    var watched = navLinks
      .map(function (a) {
        try { return document.querySelector(a.getAttribute("href")); }
        catch (e) { return null; }
      })
      .filter(Boolean);

    if (watched.length) {
      var visible = new Set();

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });

        var activeId = null;
        for (var i = 0; i < watched.length; i++) {
          if (visible.has(watched[i].id)) { activeId = watched[i].id; break; }
        }

        navLinks.forEach(function (a) {
          a.classList.toggle("current", a.getAttribute("href") === "#" + activeId);
        });
      }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });

      watched.forEach(function (sec) { observer.observe(sec); });
    }
  }

  /* ---- back to top ---- */

  var toTop = document.getElementById("to-top");
  if (toTop) {
    var ticking = false;
    function updateToTop() {
      toTop.classList.toggle("show", window.scrollY > 700);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(updateToTop); ticking = true; }
    }, { passive: true });
    updateToTop();

    toTop.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---- open the relevant disclosure when linked directly ---- */

  function openTarget() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    var el = null;
    try { el = document.querySelector(hash); } catch (e) { return; }
    if (!el) return;
    var d = el.closest("details");
    while (d) { d.open = true; d = d.parentElement && d.parentElement.closest("details"); }
  }
  window.addEventListener("hashchange", openTarget);
  openTarget();

  /* ---- photo carousels (several photos of one event) ---- */

  Array.prototype.forEach.call(document.querySelectorAll("[data-carousel]"), function (car) {
    var track = car.querySelector(".car-track");
    var ctrl = car.querySelector(".car-ctrl");
    var count = car.querySelector(".car-count");
    var prev = car.querySelector(".car-prev");
    var next = car.querySelector(".car-next");
    var slides = track.querySelectorAll(".car-slide");
    if (!track || !ctrl || slides.length < 2) return;
    ctrl.hidden = false;

    function index() { return Math.round(track.scrollLeft / track.clientWidth); }
    function update() { count.textContent = (index() + 1) + " / " + slides.length; }
    function go(step) {
      var i = Math.max(0, Math.min(slides.length - 1, index() + step));
      track.scrollTo({ left: i * track.clientWidth });
    }
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(update); });
    window.addEventListener("resize", update);
    update();
  });

  /* ---- sidebar: highlight the section in view ---- */

  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.side-nav a[href^="#"]'));
  if (spyLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    spyLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyLinks.forEach(function (a) { a.classList.remove("current"); a.removeAttribute("aria-current"); });
        var link = byId[en.target.id];
        if (link) { link.classList.add("current"); link.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  /* ---- expand all disclosures before printing ---- */

  var reopened = [];
  window.addEventListener("beforeprint", function () {
    reopened = Array.prototype.filter.call(document.querySelectorAll("details"),
      function (d) { return !d.open; });
    reopened.forEach(function (d) { d.open = true; });
  });
  window.addEventListener("afterprint", function () {
    reopened.forEach(function (d) { d.open = false; });
    reopened = [];
  });
})();
