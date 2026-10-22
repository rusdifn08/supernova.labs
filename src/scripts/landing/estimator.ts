export function initEstimator() {
  const root = document.querySelector<HTMLElement>('[data-estimator]');
  if (!root) return;

  let platform = 'web';
  let baseWeeks = 4;
  let scale = 'mvp';
  let multiplier = 1;

  const platformNames: Record<string, string> = {
    web: 'Web Ecosystem (SaaS & PWA)',
    mobile: 'Mobile Apps (iOS & Android)',
    desktop: 'Desktop System (POS & Internal)',
    all: 'All-in-One Multiplatform Suite',
  };

  const scaleNames: Record<string, string> = {
    mvp: 'MVP / Startup Foundation',
    business: 'Scale-Up Business Core',
    enterprise: 'Custom Enterprise Suite',
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const calculate = () => {
    const selectedFeatures = root.querySelectorAll<HTMLInputElement>('.feature-item input:checked');
    let featureCost = 0;
    let featureWeeks = 0;

    selectedFeatures.forEach((input) => {
      featureCost += parseInt(input.value, 10);
      featureWeeks += parseFloat(input.dataset.weeks || '0');
    });

    const totalCost = Math.round(featureCost * multiplier);
    const totalWeeks = Math.max(3, Math.round(baseWeeks + featureWeeks));

    const costEl = root.querySelector<HTMLElement>('#calcCost');
    const timeEl = root.querySelector<HTMLElement>('#calcTime');
    const platEl = root.querySelector<HTMLElement>('#summaryPlatform');
    const scaleEl = root.querySelector<HTMLElement>('#summaryScale');
    const featEl = root.querySelector<HTMLElement>('#summaryFeatures');
    const ctaBtn = root.querySelector<HTMLAnchorElement>('#estimatorCta');

    if (costEl) costEl.textContent = formatIDR(totalCost);
    if (timeEl) timeEl.textContent = `± ${totalWeeks} Minggu Kerja`;
    if (platEl) platEl.textContent = platformNames[platform];
    if (scaleEl) scaleEl.textContent = scaleNames[scale];
    if (featEl) featEl.textContent = `${selectedFeatures.length} Modul Terpilih`;

    if (ctaBtn) {
      const msg = `Halo Supernova Labs, saya ingin konsultasi estimasi proyek:\n- Platform: ${platformNames[platform]}\n- Skala: ${scaleNames[scale]}\n- Estimasi Budget: ${formatIDR(totalCost)}\n- Timeline: ±${totalWeeks} Minggu\n- Jumlah Modul: ${selectedFeatures.length}`;
      ctaBtn.href = `https://wa.me/6281283626217?text=${encodeURIComponent(msg)}`;
    }
  };

  root.querySelectorAll<HTMLInputElement>('input[name="platform"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      platform = target.value;
      baseWeeks = parseInt(target.dataset.baseWeeks || '4', 10);
      calculate();
    });
  });

  root.querySelectorAll<HTMLInputElement>('input[name="scale"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      scale = target.value;
      multiplier = parseFloat(target.dataset.multiplier || '1');
      calculate();
    });
  });

  root.querySelectorAll<HTMLInputElement>('.feature-item input').forEach((cb) => {
    cb.addEventListener('change', (e) => {
      const item = (e.target as HTMLInputElement).closest('.feature-item');
      if (item) {
        item.classList.toggle('is-selected', (e.target as HTMLInputElement).checked);
      }
      calculate();
    });
  });

  calculate();
}
