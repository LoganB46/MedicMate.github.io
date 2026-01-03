// js/auth.js
// NOTE: This is NOT real security. It's a front-end gate only.

(function () {
  const STORAGE_KEY = "mm_auth_ok";
  const STORAGE_TS = "mm_auth_ts";

  // How long the login lasts (in hours)
  const SESSION_HOURS = 12;

  // Change this to your company access code
  // (Again: this can be viewed by anyone who inspects the JS.)
  const ACCESS_CODE = "Admin123";

  function nowMs() {
    return Date.now();
  }

  function isExpired() {
    const ts = Number(localStorage.getItem(STORAGE_TS) || "0");
    if (!ts) return true;
    const maxAge = SESSION_HOURS * 60 * 60 * 1000;
    return nowMs() - ts > maxAge;
  }

  function isLoggedIn() {
    if (localStorage.getItem(STORAGE_KEY) !== "1") return false;
    if (isExpired()) {
      logout();
      return false;
    }
    return true;
  }

  function loginWithCode(code) {
    if ((code || "").trim() === ACCESS_CODE) {
      localStorage.setItem(STORAGE_KEY, "1");
      localStorage.setItem(STORAGE_TS, String(nowMs()));
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TS);
  }

  // Protect a page: redirect to login if not logged in
  function requireAuth() {
    if (isLoggedIn()) return;

    const next = encodeURIComponent(location.pathname.split("/").pop() || "index.html");
    location.href = `login.html?next=${next}`;
  }

  window.MedicMateAuth = {
    requireAuth,
    isLoggedIn,
    loginWithCode,
    logout
  };
})();
