
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));

  window.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      function syncLabel() {
        const theme = root.getAttribute("data-theme");
        btn.setAttribute("aria-label", theme === "dark" ? "Switch to warm light background" : "Switch to dark background");
        btn.setAttribute("title", theme === "dark" ? "Warm light" : "Dark");
      }
      btn.addEventListener("click", function () {
        const current = root.getAttribute("data-theme") || "light";
        const next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        syncLabel();
      });
      syncLabel();
    }

    document.querySelectorAll("[data-blog-carousel]").forEach((carousel) => {
      const slides = Array.from(carousel.querySelectorAll("[data-blog-slide]"));
      if (!slides.length) return;

      const wrap = carousel.closest(".featured-blog");
      const prev = wrap ? wrap.querySelector("[data-blog-prev]") : null;
      const next = wrap ? wrap.querySelector("[data-blog-next]") : null;
      const dots = wrap ? Array.from(wrap.querySelectorAll("[data-blog-dot]")) : [];
      let current = 0;

      function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
          const active = slideIndex === current;
          slide.setAttribute("aria-hidden", active ? "false" : "true");
        });
        carousel.scrollTo({
          left: carousel.clientWidth * current,
          behavior: "smooth"
        });
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("active", dotIndex === current);
          dot.setAttribute("aria-current", dotIndex === current ? "true" : "false");
        });
      }

      if (prev) prev.addEventListener("click", () => showSlide(current - 1));
      if (next) next.addEventListener("click", () => showSlide(current + 1));
      dots.forEach((dot, dotIndex) => {
        dot.addEventListener("click", () => showSlide(dotIndex));
      });
      showSlide(0);
    });

    const timelineLinks = Array.from(document.querySelectorAll(".timeline-nav a"));
    const sections = Array.from(document.querySelectorAll("[data-year-section]"));
    if (timelineLinks.length && sections.length && "IntersectionObserver" in window) {
      const byId = new Map(timelineLinks.map(a => [a.getAttribute("href").replace("#",""), a]));
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            timelineLinks.forEach(a => a.classList.remove("active"));
            const active = byId.get(entry.target.id);
            if (active) active.classList.add("active");
          }
        });
      }, { rootMargin: "-20% 0px -65% 0px", threshold: 0.01 });
      sections.forEach(section => observer.observe(section));
    }
    // Mobile: make Publications / Teaching go directly to default pages
    document.querySelectorAll(".nav-item .nav-trigger").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        if (window.innerWidth > 900) return;

        const item = trigger.closest(".nav-item");
        if (!item || !item.querySelector(".dropdown")) return;

        const text = trigger.textContent.trim();

        event.preventDefault();
        event.stopPropagation();

        const path = window.location.pathname;
        const prefix =
          path.startsWith("/ja/") ? "/ja" :
          path.startsWith("/zh/") ? "/zh" :
          "";

        if (
          text === "Publications" ||
          text === "業績" ||
          text === "发表成果"
        ) {
          window.location.href = `${prefix}/publications/journal/`;
        }

        if (
          text === "Teaching" ||
          text === "教育・研究指導" ||
          text === "教学与指导"
        ) {
          window.location.href = `${prefix}/teaching/supervision/`;
        }
      });
    });
  });
})();
