// Scroll reveal via IntersectionObserver + counter animation + sticky nav
function initScrollReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  els.forEach((el) => obs.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (counters.length === 0) return;
  const animate = (el: HTMLElement) => {
    const target = parseFloat(el.dataset.counter || '0');
    const suffix = el.dataset.suffix || '';
    const dur = 1600;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(eased * target);
      el.textContent = val.toString() + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toString() + suffix;
    };
    requestAnimationFrame(step);
  };
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { animate(e.target as HTMLElement); obs.unobserve(e.target); } }),
    { threshold: 0.5 }
  );
  counters.forEach((c) => obs.observe(c));
}

function initStickyNav() {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initFaq() {
  const items = document.querySelectorAll<HTMLElement>('[data-faq]');
  items.forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>('[data-faq-toggle]');
    const body = item.querySelector<HTMLElement>('[data-faq-body]');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      if (body) body.style.maxHeight = isOpen ? body.scrollHeight + 'px' : '0px';
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initStickyNav();
  initFaq();
});
