// Interactive recreation of the Heame app (Heame case study).

(function () {
  const root = document.getElementById('heame-demo');
  if (!root) return;

  const views = root.querySelectorAll('.heame-view');
  const tabButtons = root.querySelectorAll('.heame-tabbar button');
  const logo = root.querySelector('.heame-logo');

  function show(target) {
    views.forEach((v) => v.classList.toggle('is-active', v.dataset.view === target));
    tabButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.target === target));
  }

  root.querySelectorAll('[data-target]').forEach((el) => {
    el.addEventListener('click', () => show(el.dataset.target));
  });
  if (logo) logo.addEventListener('click', () => show('home'));

  /* animate rings in once visible */
  const rings = root.querySelectorAll('.heame-ring-wrap .fg');
  rings.forEach((ring) => {
    const r = parseFloat(ring.getAttribute('r'));
    const circumference = 2 * Math.PI * r;
    const pct = parseFloat(ring.dataset.value) / 100;
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${circumference}`;
    ring.dataset.target = circumference * (1 - pct);
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          rings.forEach((ring) => {
            ring.style.strokeDashoffset = ring.dataset.target;
          });
          io.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  io.observe(root);

  /* interactive water tracker */
  root.querySelectorAll('.heame-glass').forEach((glass) => {
    glass.addEventListener('click', () => {
      if (!glass.classList.contains('is-filled')) glass.classList.add('is-filled');
    });
  });
})();
