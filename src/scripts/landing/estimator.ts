/**
 * Supernova Labs Studio — Project Estimator Interactive Tool
 * Handles platform selection, system scale, feature module toggles,
 * timeline calculations, stack recommendation, and dynamic WhatsApp CTA dispatch.
 */

export function initEstimator() {
  const root = document.querySelector<HTMLElement>('[data-estimator]');
  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  // State
  let platformKey = 'web';
  let baseWeeks = 4;
  let scaleKey = 'mvp';
  let multiplier = 1;

  // Metadata mappings
  const platformMeta: Record<string, { label: string; defaultWeeks: number }> = {
    web: { label: 'Web Ecosystem', defaultWeeks: 4 },
    mobile: { label: 'Mobile Apps (iOS & Android)', defaultWeeks: 5 },
    desktop: { label: 'Desktop System', defaultWeeks: 5 },
    all: { label: 'All-in-One Multiplatform Suite', defaultWeeks: 8 },
  };

  const scaleMeta: Record<string, { label: string; multiplier: number }> = {
    mvp: { label: 'MVP / Peluncuran Cepat', multiplier: 1.0 },
    growth: { label: 'Growth Business', multiplier: 1.3 },
    enterprise: { label: 'Enterprise Mission-Critical', multiplier: 1.7 },
  };

  const stackRecommendations: Record<string, Record<string, string>> = {
    web: {
      mvp: 'Astro · React · Tailwind · Supabase',
      growth: 'Next.js · Node.js · PostgreSQL · Redis',
      enterprise: 'Astro / Next.js · Go Microservices · PostgreSQL · Docker',
    },
    mobile: {
      mvp: 'Flutter · Dart · Firebase / REST API',
      growth: 'Flutter · Riverpod · PostgreSQL · WebSockets',
      enterprise: 'Native Kotlin / Swift · Go Core · gRPC · Kafka',
    },
    desktop: {
      mvp: 'Tauri (Rust) · React · SQLite',
      growth: 'Electron / Tauri · TypeScript · SQLite Local Sync',
      enterprise: 'Tauri (Rust) · Go Core · Offline-First Multi-Branch Sync',
    },
    all: {
      mvp: 'Astro Web + Flutter Mobile + Tauri POS · 1 REST API',
      growth: 'Next.js + Flutter + Tauri · PostgreSQL Cloud Core',
      enterprise: 'Enterprise Monorepo · Go Core · Kubernetes · CI/CD',
    },
  };

  // DOM elements
  const platformCards = root.querySelectorAll<HTMLButtonElement>('.option-card');
  const scaleButtons = root.querySelectorAll<HTMLButtonElement>('.scale-btn');
  const featurePills = root.querySelectorAll<HTMLLabelElement>('.feature-pill');
  const featureCheckboxes = root.querySelectorAll<HTMLInputElement>('.feature-pill input[type="checkbox"]');

  const timelineEl = root.querySelector<HTMLElement>('[data-summary-timeline]');
  const platformEl = root.querySelector<HTMLElement>('[data-summary-platform]');
  const scaleEl = root.querySelector<HTMLElement>('[data-summary-scale]');
  const featuresEl = root.querySelector<HTMLElement>('[data-summary-features]');
  const stackEl = root.querySelector<HTMLElement>('[data-summary-stack]');
  const ctaBtn = root.querySelector<HTMLAnchorElement>('[data-estimator-cta]');

  function updateCalculation() {
    // Collect active features
    const checkedFeatures: { name: string; days: number }[] = [];
    featureCheckboxes.forEach((cb) => {
      if (cb.checked) {
        const days = parseFloat(cb.dataset.addDays || '4');
        checkedFeatures.push({ name: cb.value, days });
      }
    });

    const totalFeatureDays = checkedFeatures.reduce((sum, f) => sum + f.days, 0);
    const featureWeeks = totalFeatureDays / 5; // 5 working days per week

    const calculatedWeeks = Math.max(3, Math.round(baseWeeks * multiplier + featureWeeks));
    const maxWeeks = Math.round(calculatedWeeks * 1.3);

    // Update DOM displays
    if (timelineEl) {
      timelineEl.textContent = `${calculatedWeeks} - ${maxWeeks}`;
    }

    const currentPlatform = platformMeta[platformKey]?.label || 'Web Ecosystem';
    if (platformEl) {
      platformEl.textContent = currentPlatform;
    }

    const currentScale = scaleMeta[scaleKey]?.label || 'MVP / Peluncuran Cepat';
    if (scaleEl) {
      scaleEl.textContent = currentScale;
    }

    if (featuresEl) {
      featuresEl.textContent = `${checkedFeatures.length} Modul Terpilih`;
    }

    const recommendedStack = stackRecommendations[platformKey]?.[scaleKey] || 'Astro · React · PostgreSQL';
    if (stackEl) {
      stackEl.textContent = recommendedStack;
    }

    // Dynamic WhatsApp message dispatch
    if (ctaBtn) {
      const featureListText = checkedFeatures.length > 0 
        ? checkedFeatures.map((f) => f.name).join(', ') 
        : 'Sistem Inti Dasar';

      const waMessage = 
        `Halo Supernova Labs Studio, saya telah melakukan simulasi estimasi proyek:\n` +
        `• Platform: ${currentPlatform}\n` +
        `• Skala: ${currentScale}\n` +
        `• Estimasi Waktu: ${calculatedWeeks} - ${maxWeeks} Minggu\n` +
        `• Modul Terpilih (${checkedFeatures.length}): ${featureListText}\n` +
        `• Rekomendasi Arsitektur: ${recommendedStack}\n\n` +
        `Saya ingin mendiskusikan kebutuhan arsitektur dan timeline ini lebih lanjut bersama Lead Architect.`;

      ctaBtn.href = `https://wa.me/6285174289548?text=${encodeURIComponent(waMessage)}`;
    }
  }

  // 1. Platform selector listeners
  platformCards.forEach((card) => {
    card.addEventListener('click', () => {
      platformCards.forEach((c) => c.classList.remove('is-active'));
      card.classList.add('is-active');

      const plat = card.dataset.platform;
      const weeks = card.dataset.weeks;
      if (plat) platformKey = plat;
      if (weeks) baseWeeks = parseInt(weeks, 10);

      updateCalculation();
    });
  });

  // 2. Scale selector listeners
  scaleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      scaleButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const scale = btn.dataset.scale;
      const mult = btn.dataset.multiplier;
      if (scale) scaleKey = scale;
      if (mult) multiplier = parseFloat(mult);

      updateCalculation();
    });
  });

  // 3. Feature checkbox listeners
  featurePills.forEach((pill) => {
    const cb = pill.querySelector<HTMLInputElement>('input[type="checkbox"]');
    if (!cb) return;

    cb.addEventListener('change', () => {
      if (cb.checked) {
        pill.classList.add('is-checked');
      } else {
        pill.classList.remove('is-checked');
      }
      updateCalculation();
    });
  });

  // Initial calculation on load
  updateCalculation();
}
