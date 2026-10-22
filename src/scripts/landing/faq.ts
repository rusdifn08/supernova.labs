export function initFaq() {
  const items = document.querySelectorAll<HTMLElement>('[data-faq]');
  items.forEach((item) => {
    const toggle = item.querySelector<HTMLButtonElement>('[data-faq-toggle]');
    const body = item.querySelector<HTMLElement>('[data-faq-body]');

    toggle?.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (body) {
        body.style.maxHeight = isOpen ? `${body.scrollHeight}px` : '0px';
      }
    });
  });
}
