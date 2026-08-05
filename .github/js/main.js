// Shared interactivity: scroll reveals, cursor dot, magnetic buttons, active nav.

(function revealOnScroll() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    [...group.children].forEach((child, i) => child.style.setProperty('--i', i));
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );
  items.forEach((el) => io.observe(el));
})();

(function cursorDot() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let cx = x;
  let cy = y;

  window.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
  });

  function tick() {
    cx += (x - cx) * 0.22;
    cy += (y - cy) * 0.22;
    dot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  const hoverTargets = 'a, button, .btn, [data-cursor-hover]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) dot.classList.add('is-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) dot.classList.remove('is-hover');
  });
})();

(function magneticButtons() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  document.querySelectorAll('.btn, [data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${mx * 0.28}px, ${my * 0.32}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
    });
  });
})();

(function workToggle() {
  const toggle = document.querySelector('.work-toggle');
  if (!toggle) return;
  const buttons = [...toggle.querySelectorAll('button')];
  const groups = [...document.querySelectorAll('.work-group')];

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (btn.classList.contains('is-active')) return;

      buttons.forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });

      const showGroup = groups.find((g) => g.dataset.group === target);
      const hideGroups = groups.filter((g) => g.dataset.group !== target);

      hideGroups.forEach((g) => g.classList.add('is-switching'));
      setTimeout(() => {
        hideGroups.forEach((g) => { g.hidden = true; });
        if (showGroup) {
          showGroup.hidden = false;
          showGroup.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
          showGroup.classList.add('is-switching');
          requestAnimationFrame(() => showGroup.classList.remove('is-switching'));
        }
      }, 220);
    });
  });
})();

(function activeNav() {
  const path = location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.site-nav a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http')) return;
    const resolved = new URL(href, location.href).pathname.replace(/index\.html$/, '');
    if (resolved === path) a.classList.add('is-active');
  });
})();
