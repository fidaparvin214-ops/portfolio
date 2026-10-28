(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const themeToggle = document.getElementById("theme-toggle");
  const currentYear = document.getElementById("current-year");
  const progressBar = document.getElementById("scroll-progress");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Render Lucide icons when the CDN is available.
  const renderIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  };
  renderIcons();

  // Theme: saved preference wins; otherwise use the refined dark default.
  const savedTheme = (() => {
    try { return localStorage.getItem("portfolio-theme"); } catch (_) { return null; }
  })();
  const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const isLight = theme === "light";
    if (themeToggle) {
      themeToggle.innerHTML = isLight ? '<i data-lucide="moon"></i>' : '<i data-lucide="sun"></i>';
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
      themeToggle.setAttribute("title", isLight ? "Switch to dark theme" : "Switch to light theme");
    }
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", isLight ? "#f6f7f4" : "#0b0d12");
    renderIcons();
  }
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("portfolio-theme", next); } catch (_) { /* Storage may be unavailable. */ }
    });
  }

  // Mobile navigation.
  function closeMenu() {
    if (!menuToggle || !navLinks) return;
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
    renderIcons();
  }
  function openMenu() {
    if (!menuToggle || !navLinks) return;
    navLinks.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    menuToggle.innerHTML = '<i data-lucide="x"></i>';
    renderIcons();
  }
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", () => closeMenu());
    });
    document.addEventListener("click", event => {
      if (!navLinks.classList.contains("is-open")) return;
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
        closeMenu();
        menuToggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Scroll to anchors smoothly, unless reduced motion is requested.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (history.replaceState) history.replaceState(null, "", href);
    });
  });

  // Active section navigation.
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navItems = Array.from(document.querySelectorAll(".nav-link"));
  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navItems.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Scroll reveal: fail open so content remains visible if observers are unsupported.
  const revealItems = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Project filtering.
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll(".project-card[data-category]");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      projectCards.forEach(card => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
      });
    });
  });

  // Footer year and scroll progress.
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
  let ticking = false;
  function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }, { passive: true });
  updateScrollProgress();

  // Ensure no navigation menu is left open after browser history navigation.
  window.addEventListener("hashchange", closeMenu);
})();
