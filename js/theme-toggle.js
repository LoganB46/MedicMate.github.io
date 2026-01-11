(function () {
  const STORAGE_KEY = "mm_theme";

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  setTheme(getPreferredTheme());

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);

    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.textContent = next === "dark" ? "🌙 Night" : "🌞 Day";
  };

  window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggleBtn");
    if (btn) {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      btn.textContent = current === "dark" ? "🌙 Night" : "🌞 Day";
    }
  });
})();
