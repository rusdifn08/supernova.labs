/**
 * SUPERNOVA MARKETING — POS & ERP ANIMATED SIMULATOR
 * Clean, lightweight, senior-level interactive workflow simulator
 */

interface LocationConfig {
  name: string;
  subtotal: string;
  syncNote: string;
}

const LOCATION_DATA: Record<string, LocationConfig> = {
  scbd: {
    name: 'OUTLET SCBD',
    subtotal: 'Rp 60.000',
    syncNote: 'Gudang SCBD (-2)',
  },
  bandung: {
    name: 'OUTLET BANDUNG',
    subtotal: 'Rp 54.000',
    syncNote: 'Gudang Dago (-2)',
  },
  surabaya: {
    name: 'OUTLET SURABAYA',
    subtotal: 'Rp 58.000',
    syncNote: 'Gudang Gubeng (-2)',
  },
};

const STEP_DATA = [
  {
    title: '1. Input Kasir Super Cepat',
    desc: 'Kasir men-tap produk menu atau scan barcode fisik. Item langsung terhitung di keranjang belanja dengan kalkulasi promo otomatis.',
    sync: 'Siap Bayar (2 Item)',
  },
  {
    title: '2. Verifikasi Pembayaran Instan (QRIS / Cash)',
    desc: 'Tamu membayar via QRIS dinamis atau tunai. Sistem mendeteksi dana masuk secara seketika tanpa perlu cek mutasi manual.',
    sync: 'Pembayaran Lunas (1 Detik)',
  },
  {
    title: '3. Cetak Struk & Potong Stok Multi-Gudang ERP',
    desc: 'Struk thermal terbit & terkirim ke WhatsApp, sementara database ERP seketika memotong stok bahan baku dan mencatat margin laba.',
    sync: 'Stok Gudang Terupdate',
  },
];

export function initPosSimulation(root: HTMLElement) {
  const panel = root.querySelector<HTMLElement>('#panel-pos');
  if (!panel) return;

  const stepPills = panel.querySelectorAll<HTMLButtonElement>('[data-sim-stepper="pos"] button');
  const scenes = panel.querySelectorAll<HTMLElement>('[data-sim-scene^="pos-"]');
  const locChips = panel.querySelectorAll<HTMLButtonElement>('#posLocationChips button');

  const titleEl = panel.querySelector<HTMLElement>('#posStepTitle span');
  const descEl = panel.querySelector<HTMLElement>('#posStepDesc');
  const metricSyncEl = panel.querySelector<HTMLElement>('#posMetricSync');

  const locBadgeEl = panel.querySelector<HTMLElement>('#posStageLocBadge');
  const subtotalEl = panel.querySelector<HTMLElement>('#posSimSubtotal');

  let currentStep = 1;
  let autoTimer: number | null = null;
  let isUserInteracted = false;

  const setStep = (step: number) => {
    currentStep = step;

    stepPills.forEach((btn) => {
      const s = Number(btn.dataset.step);
      btn.classList.toggle('is-active', s === step);
    });

    scenes.forEach((scene) => {
      const s = Number(scene.dataset.simScene?.replace('pos-', ''));
      scene.classList.toggle('is-active', s === step);
    });

    const info = STEP_DATA[step - 1];
    if (info) {
      if (titleEl) titleEl.textContent = info.title;
      if (descEl) descEl.textContent = info.desc;
      if (metricSyncEl) metricSyncEl.textContent = info.sync;
    }
  };

  const applyLocationData = (locKey: string) => {
    const data = LOCATION_DATA[locKey] || LOCATION_DATA.scbd;
    if (locBadgeEl) locBadgeEl.textContent = data.name;
    if (subtotalEl) subtotalEl.textContent = data.subtotal;
  };

  stepPills.forEach((btn) => {
    btn.addEventListener('click', () => {
      isUserInteracted = true;
      const step = Number(btn.dataset.step) || 1;
      setStep(step);
    });
  });

  locChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      locChips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const locKey = chip.dataset.loc || 'scbd';
      applyLocationData(locKey);
    });
  });

  const startCycle = () => {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = window.setInterval(() => {
      if (panel.classList.contains('is-active') && !isUserInteracted) {
        const next = currentStep >= 3 ? 1 : currentStep + 1;
        setStep(next);
      }
    }, 3500);
  };

  startCycle();
}
