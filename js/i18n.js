// Site-wide DE/EN toggle. German lives directly in the HTML (default, no-JS-safe).
// English strings come from a per-page `window.I18N_EN` dictionary keyed by data-i18n.
// Shared nav/footer strings that repeat on every page live in SHARED_EN below.

(function () {
  const SHARED_EN = {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.resume': 'Resume',
    'footer.heading': "Let's talk.",
    'footer.sub': 'Product, UX, AI or research - always up for a good conversation.',
  };

  const STORAGE_KEY = 'site-lang';
  const originals = new Map();

  function dict() {
    return Object.assign({}, SHARED_EN, window.I18N_EN || {});
  }

  function cacheOriginals() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (!originals.has(el)) originals.set(el, el.innerHTML);
    });
  }

  function applyLang(lang) {
    const en = dict();
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (lang === 'en' && en[key] !== undefined) {
        el.innerHTML = en[key];
      } else if (originals.has(el)) {
        el.innerHTML = originals.get(el);
      }
    });
    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  document.addEventListener('DOMContentLoaded', () => {
    cacheOriginals();
    const saved = localStorage.getItem(STORAGE_KEY) || 'de';
    applyLang(saved);

    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
  });
})();
