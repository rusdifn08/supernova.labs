import { initScrollReveal, initCounters } from './landing/reveal';
import { initFaq } from './landing/faq';
import { initEstimator } from './landing/estimator';
import { initBackToTop } from './landing/navigation';
import { initServiceDemo } from './landing/simulations';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initFaq();
  initEstimator();
  initBackToTop();
  initServiceDemo();
});
