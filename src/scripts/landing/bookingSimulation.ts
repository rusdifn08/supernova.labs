/**
 * SUPERNOVA MARKETING — BOOKING ANIMATED SIMULATOR
 * Clean, lightweight, senior-level interactive workflow simulator
 */

interface BizConfig {
  facility: string;
  rate: string;
  total: string;
  dp: string;
  remaining: string;
  code: string;
}

const BIZ_DATA: Record<string, BizConfig> = {
  futsal: {
    facility: 'Lapangan 1 (Vinyl Pro)',
    rate: 'Tarif: Rp 150.000/jam',
    total: 'Rp 300.000',
    dp: 'Rp 150.000',
    remaining: 'Rp 150.000',
    code: 'BK-FTS-99421',
  },
  studio: {
    facility: 'Studio A (Infinity Cyc)',
    rate: 'Tarif: Rp 200.000/jam',
    total: 'Rp 400.000',
    dp: 'Rp 200.000',
    remaining: 'Rp 200.000',
    code: 'BK-STD-77142',
  },
  barber: {
    facility: 'Kursi VIP (Gentlemen Grooming)',
    rate: 'Tarif: Rp 90.000/sesi',
    total: 'Rp 180.000',
    dp: 'Rp 90.000',
    remaining: 'Rp 90.000',
    code: 'BK-BRB-44120',
  },
  ps: {
    facility: 'PS5 VIP Room (DualSense 4K)',
    rate: 'Tarif: Rp 45.000/jam',
    total: 'Rp 135.000',
    dp: 'Rp 67.500',
    remaining: 'Rp 67.500',
    code: 'BK-PS5-11984',
  },
};

const STEP_DATA = [
  {
    title: '1. Deteksi Ketersediaan & Validasi Otomatis',
    desc: 'Pelanggan memilih waktu sewa. Sistem langsung mengecek database cloud dalam milidetik guna mencegah jadwal tumpang tindih (collision detection).',
    status: 'Slot Aman (0 Bentrok)',
  },
  {
    title: '2. Penguncian Jadwal & Kalkulasi DP',
    desc: 'Sistem mengunci slot selama 15 menit dan membagi pembayaran uang muka (DP 50%) secara otomatis tanpa hitung manual.',
    status: 'Terkunci 15:00 Menit',
  },
  {
    title: '3. Penerbitan E-Ticket & WhatsApp Gateway',
    desc: 'Setelah DP terkonfirmasi, e-ticket resmi beserta QR Code scan lokasi langsung dikirimkan ke WhatsApp pelanggan secara instan.',
    status: 'WhatsApp e-Ticket Terkirim',
  },
];

export function initBookingSimulation(root: HTMLElement) {
  const panel = root.querySelector<HTMLElement>('#panel-booking');
  if (!panel) return;

  const stepPills = panel.querySelectorAll<HTMLButtonElement>('[data-sim-stepper="booking"] button');
  const scenes = panel.querySelectorAll<HTMLElement>('[data-sim-scene^="booking-"]');
  const bizChips = panel.querySelectorAll<HTMLButtonElement>('#bookingBizChips button');

  const titleEl = panel.querySelector<HTMLElement>('#bookingStepTitle span');
  const descEl = panel.querySelector<HTMLElement>('#bookingStepDesc');
  const metricStatusEl = panel.querySelector<HTMLElement>('#bookingMetricStatus');

  const facilityEl = panel.querySelector<HTMLElement>('#bookingSimFacility');
  const totalEl = panel.querySelector<HTMLElement>('#bookingSimTotal');
  const dpEl = panel.querySelector<HTMLElement>('#bookingSimDp');
  const remainingEl = panel.querySelector<HTMLElement>('#bookingSimRemaining');
  const passCodeEl = panel.querySelector<HTMLElement>('#bookingSimPassCode');

  let currentStep = 1;
  let autoTimer: number | null = null;
  let isUserInteracted = false;

  const setStep = (step: number) => {
    currentStep = step;

    // Update pill styles
    stepPills.forEach((btn) => {
      const s = Number(btn.dataset.step);
      btn.classList.toggle('is-active', s === step);
    });

    // Update scene visibility
    scenes.forEach((scene) => {
      const s = Number(scene.dataset.simScene?.replace('booking-', ''));
      scene.classList.toggle('is-active', s === step);
    });

    // Update textual context
    const info = STEP_DATA[step - 1];
    if (info) {
      if (titleEl) titleEl.textContent = info.title;
      if (descEl) descEl.textContent = info.desc;
      if (metricStatusEl) metricStatusEl.textContent = info.status;
    }
  };

  const applyBizData = (bizKey: string) => {
    const data = BIZ_DATA[bizKey] || BIZ_DATA.futsal;
    if (facilityEl) facilityEl.textContent = data.facility;
    if (totalEl) totalEl.textContent = data.total;
    if (dpEl) dpEl.textContent = data.dp;
    if (remainingEl) remainingEl.textContent = data.remaining;
    if (passCodeEl) passCodeEl.textContent = data.code;
  };

  // Step button clicks
  stepPills.forEach((btn) => {
    btn.addEventListener('click', () => {
      isUserInteracted = true;
      const step = Number(btn.dataset.step) || 1;
      setStep(step);
    });
  });

  // Business switcher chip clicks
  bizChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      bizChips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const bizKey = chip.dataset.biz || 'futsal';
      applyBizData(bizKey);
    });
  });

  // Auto animation cycle (runs every 3.5 seconds unless user paused)
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
