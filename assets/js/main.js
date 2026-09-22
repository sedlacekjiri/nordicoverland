/* Nordic Overland — main.js
   No dependencies. Handles: season switch, mobile menu, enquiry form, URL prefill.
   The first paint of the season is set by the small inline script in <head>
   (so the page never flashes the wrong colours). */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'no-season';
  var THEME_COLOURS = { summer: '#2e5242', winter: '#0e1114' };

  /* ---------- Seasons ----------
     Iceland's traditional calendar has two seasons:
       Summer starts on "Sumardagurinn fyrsti", the Thursday between 19 and 25 April.
       Winter starts on "Fyrsti vetrardagur", the Saturday between 21 and 27 October. */
  function autoSeason(now) {
    now = now || new Date();
    var y = now.getFullYear();
    var summer = new Date(y, 3, 19);
    var winter = new Date(y, 9, 21);
    while (summer.getDay() !== 4) summer.setDate(summer.getDate() + 1);
    while (winter.getDay() !== 6) winter.setDate(winter.getDate() + 1);
    return now >= summer && now < winter ? 'summer' : 'winter';
  }

  var seasonButtons = document.querySelectorAll('[data-season]');

  function syncButtons(season) {
    seasonButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-season') === season ? 'true' : 'false');
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLOURS[season]);
  }

  function setSeason(season) {
    root.classList.add('theme-anim');
    root.setAttribute('data-theme', season);
    syncButtons(season);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice: season, auto: autoSeason() }));
    } catch (e) { /* storage unavailable: the choice just won't persist */ }
    window.setTimeout(function () { root.classList.remove('theme-anim'); }, 600);
  }

  syncButtons(root.getAttribute('data-theme') || autoSeason());
  seasonButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { setSeason(btn.getAttribute('data-season')); });
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.setAttribute('data-open', open ? 'true' : 'false');
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia('(min-width: 64rem)').addEventListener('change', function (mq) { if (mq.matches) setMenu(false); });
  }

  /* ---------- Dealer enquiry form ----------
     Static preview only: validates and shows a confirmation, but sends nothing.
     In WordPress this form is replaced by the contact-form plugin's output. */
  var form = document.querySelector('form[data-enquiry]');
  if (form) {
    var status = form.querySelector('.form__status');
    var messages = {
      company: 'Enter your company name.',
      name: 'Enter your name.',
      email: 'Enter a valid email address, for example name@company.is.',
      message: 'Tell us briefly what you are looking for.'
    };

    // "Who we supply" rows carry data-type so the form opens with the right business type selected
    document.querySelectorAll('[data-type]').forEach(function (link) {
      link.addEventListener('click', function () {
        var sel = form.elements['type'];
        if (sel && sel.querySelector('option[value="' + link.getAttribute('data-type') + '"]')) sel.value = link.getAttribute('data-type');
      });
    });

    function fieldError(input, text) {
      var slot = document.getElementById(input.id + '-error');
      if (!slot) return;
      slot.textContent = text || '';
      if (text) { input.setAttribute('aria-invalid', 'true'); } else { input.removeAttribute('aria-invalid'); }
    }

    form.addEventListener('input', function (e) {
      if (e.target.getAttribute && e.target.getAttribute('aria-invalid') === 'true' && e.target.validity.valid && e.target.value.trim()) fieldError(e.target, '');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      ['company', 'name', 'email', 'message'].forEach(function (key) {
        var input = form.elements[key];
        var bad = !input.value.trim() || !input.validity.valid;
        fieldError(input, bad ? messages[key] : '');
        if (bad && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) { status.hidden = true; firstInvalid.focus(); return; }
      status.hidden = false;
      status.textContent = 'Thanks, your enquiry is ready to send. (This is the static preview, so nothing was sent yet.)';
      status.focus();
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
