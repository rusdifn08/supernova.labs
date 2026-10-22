/**
 * SUPERNOVA MARKETING — RESTO & KDS ANIMATED SIMULATOR
 * Clean, lightweight, senior-level interactive workflow simulator
 */

interface TableConfig {
  name: string;
}

const TABLE_DATA: Record<string, TableConfig> = {
  '02': { name: 'MEJA 02 (INDOOR)' },
  '04': { name: 'MEJA 04 (TERRACE)' },
  '08': { name: 'MEJA 08 (VIP)' },
};

const STEP_DATA = [
  {
    title: '1. Pesan Mandiri dari Meja Makan',
    desc: 'Tamu cukup men-scan stiker QR di atas meja. Menu digital berfoto HD langsung tampil tanpa instal aplikasi, pesanan langsung masuk sistem.',
    metric: 'Menu Dipilih (2 Item)',
  },
  {
    title: '2. Kalkulasi Split Bill Meja Otomatis',
    desc: 'Tak perlu pelayan menghitung tagihan dengan kalkulator. Tamu dapat membagi rata tagihan dan membayar via QRIS mandiri.',
    metric: 'Bagi Rata: Rp 34.833/org',
  },
  {
    title: '3. Transmisi Instan ke Layar Dapur KDS',
    desc: 'Pesanan terkirim ke monitor juru masak secara realtime dengan status otomatis (Sedang Dimasak ➔ Siap Antar).',
    metric: 'Layar Dapur Terupdate',
  },
];

export function initRestoSimulation(root: HTMLElement) {
  const panel = root.querySelector<HTMLElement>('#panel-qr');
  if (!panel) return;

  const stepPills = panel.querySelectorAll<HTMLButtonElement>('[data-sim-stepper="resto"] button');
  const scenes = panel.querySelectorAll<HTMLElement>('[data-sim-scene^="resto-"]');
  const tableChips = panel.querySelectorAll<HTMLButtonElement>('#restoTableChips button');

  const titleEl = panel.querySelector<HTMLElement>('#restoStepTitle span');
  const descEl = panel.querySelector<HTMLElement>('#restoStepDesc');

  const tableBadgeEl = panel.querySelector<HTMLElement>('#restoStageTableBadge');

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
      const s = Number(scene.dataset.simScene?.replace('resto-', ''));
      scene.classList.toggle('is-active', s === step);
    });

    const info = STEP_DATA[step - 1];
    if (info) {
      if (titleEl) titleEl.textContent = info.title;
      if (descEl) descEl.textContent = info.desc;
    }
  };

  const applyTableData = (tblKey: string) => {
    const data = TABLE_DATA[tblKey] || TABLE_DATA['02'];
    if (tableBadgeEl) tableBadgeEl.textContent = data.name;
  };

  stepPills.forEach((btn) => {
    btn.addEventListener('click', () => {
      isUserInteracted = true;
      const step = Number(btn.dataset.step) || 1;
      setStep(step);
    });
  });

  tableChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      tableChips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const tblKey = chip.dataset.tbl || '02';
      applyTableData(tblKey);
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
