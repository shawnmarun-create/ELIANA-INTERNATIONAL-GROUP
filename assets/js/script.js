// Eliana International Group — interactions
(function () {
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Counters
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const dur = 1500; const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target % 1 === 0 ? Math.floor(eased * target) : (eased * target).toFixed(1);
          el.textContent = val.toLocaleString ? val.toLocaleString() : val;
          el.textContent = el.textContent + suffix;
          if (p < 1) { el.textContent = (target % 1 === 0 ? Math.floor(eased*target).toLocaleString() : (eased*target).toFixed(1)) + suffix; requestAnimationFrame(tick); }
          else { el.textContent = (target % 1 === 0 ? target.toLocaleString() : target.toFixed(1)) + suffix; }
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  }

  // Contact form
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim().slice(0,100);
      const email = (data.get('email') || '').toString().trim().slice(0,255);
      const message = (data.get('message') || '').toString().trim().slice(0,1000);
      const msg = document.querySelector('#form-msg');
      if (!name || !email || !message) {
        if (msg) { msg.className = 'form-msg error show'; msg.textContent = 'Please complete all required fields.'; }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (msg) { msg.className = 'form-msg error show'; msg.textContent = 'Please enter a valid email address.'; }
        return;
      }
      if (msg) {
        msg.className = 'form-msg show';
        msg.textContent = 'Thank you, ' + name + '. Your enquiry has been received — our team will respond within one business day.';
      }
      form.reset();
    });
  }

  // Newsletter form
  const news = document.querySelector('#newsletter-form');
  if (news) {
    news.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = news.querySelector('input[type=email]');
      const msg = document.querySelector('#newsletter-msg');
      const email = (input.value || '').trim().slice(0,255);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (msg) msg.textContent = 'Please enter a valid email address.';
        return;
      }
      if (msg) msg.textContent = 'You\'re subscribed. Welcome to Eliana International Group.';
      news.reset();
    });
  }

  // Active nav link
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  // Footer year
  const yr = document.querySelector('#year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
