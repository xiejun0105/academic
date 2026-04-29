
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = saved || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  window.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;

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
  });
})();
