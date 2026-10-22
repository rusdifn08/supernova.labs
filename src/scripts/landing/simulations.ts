import { initBookingSimulation } from './bookingSimulation';
import { initPosSimulation } from './posSimulation';
import { initRestoSimulation } from './restoSimulation';

export function initServiceDemo() {
  const root = document.querySelector<HTMLElement>('[data-demo-root]');
  if (!root) return;

  const tabs = root.querySelectorAll<HTMLButtonElement>('[data-demo-tab]');
  const panels = root.querySelectorAll<HTMLElement>('[data-demo-panel]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.demoTab;
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach((p) => {
        if (p.dataset.demoPanel === target) {
          p.classList.add('is-active');
        } else {
          p.classList.remove('is-active');
        }
      });
    });
  });

  initBookingSimulation(root);
  initPosSimulation(root);
  initRestoSimulation(root);
}
