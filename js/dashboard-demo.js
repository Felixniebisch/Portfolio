// Interactive recreation of the Splint dashboard (Inklusion Digital case study).

(function () {
  const root = document.getElementById('splint-demo');
  if (!root) return;

  /* ---- competency tabs: swap chart, pill, caption ---- */
  const tabs = root.querySelectorAll('.s-tab');
  const charts = root.querySelectorAll('.s-chart');
  const pill = document.getElementById('comp-pill');
  const caption = document.getElementById('comp-caption');

  const data = {
    emotionale: {
      pill: 'Im Plan',
      pillState: 'ok',
      caption: 'Fortschritt von 4 Punkten in der Fremdbeurteilung - Aktuell 6/7',
    },
    konzentration: {
      pill: 'Nicht im Plan',
      pillState: 'warn',
      caption: 'Fortschritt von 2 Punkten in der Fremdbeurteilung - Aktuell 4/7',
    },
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const metric = tab.dataset.metric;
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      charts.forEach((c) => c.classList.toggle('is-active', c.dataset.metric === metric));
      const d = data[metric];
      pill.textContent = d.pill + (d.pillState === 'ok' ? '  ✓' : '  !');
      pill.classList.toggle('s-pill--ok', d.pillState === 'ok');
      pill.classList.toggle('s-pill--warn', d.pillState === 'warn');
      caption.textContent = d.caption;
    });
  });

  /* ---- progress ring: animate in once visible ---- */
  const ring = root.querySelector('.s-ring__fg');
  if (ring) {
    const circumference = 2 * Math.PI * 54;
    ring.style.strokeDasharray = `${circumference}`;
    ring.style.strokeDashoffset = `${circumference}`;
    const target = circumference * (1 - 4 / 6);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ring.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)';
            ring.style.strokeDashoffset = `${target}`;
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(root);
  }

  /* ---- sidebar: purely tactile active state ---- */
  root.querySelectorAll('.s-nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.s-nav-item').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

  /* ---- add an observation, live ---- */
  const addBtn = document.getElementById('add-obs-btn');
  const form = document.getElementById('add-obs-form');
  const list = document.getElementById('obs-list');
  const cancelBtn = document.getElementById('add-obs-cancel');
  const teacherInput = document.getElementById('add-obs-teacher');
  const textInput = document.getElementById('add-obs-text');

  function todayDE() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  }

  if (addBtn && form) {
    addBtn.addEventListener('click', () => {
      form.hidden = !form.hidden;
      if (!form.hidden) teacherInput.focus();
    });
    cancelBtn.addEventListener('click', () => {
      form.hidden = true;
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const teacher = teacherInput.value.trim() || 'Lehrer';
      const text = textInput.value.trim();
      if (!text) return;

      const li = document.createElement('li');
      li.className = 's-obs-row s-obs-row--new';
      li.innerHTML = `
        <div class="s-obs-meta"><strong>${teacher}</strong><br>${todayDE()}</div>
        <div class="s-obs-text">${text}</div>
        <span class="s-chevron">⌄</span>
      `;
      list.prepend(li);
      requestAnimationFrame(() => li.classList.add('is-in'));

      teacherInput.value = '';
      textInput.value = '';
      form.hidden = true;
    });
  }
})();
