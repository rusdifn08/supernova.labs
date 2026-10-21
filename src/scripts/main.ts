// Supernova Labs Studio - High Performance Client Scripts & Interactive Sandbox Engine

// 1. Scroll Reveal Animations
function initScrollReveal() {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!('IntersectionObserver' in window) || elements.length === 0) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

// 2. Animated Number Counters
function initCounters() {
  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (counters.length === 0) return;

  const animate = (el: HTMLElement) => {
    const target = parseFloat(el.dataset.counter || '0');
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current.toString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toString() + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((c) => observer.observe(c));
}

// 3. FAQ Accordion with Accessibility
function initFaq() {
  const items = document.querySelectorAll<HTMLElement>('[data-faq]');
  items.forEach((item) => {
    const toggle = item.querySelector<HTMLButtonElement>('[data-faq-toggle]');
    const body = item.querySelector<HTMLElement>('[data-faq-body]');

    toggle?.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (body) {
        body.style.maxHeight = isOpen ? body.scrollHeight + 'px' : '0px';
      }
    });
  });
}

// 4. Interactive Project Cost & Timeline Estimator
function initEstimator() {
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
    all: 'All-in-One Multiplatform Suite'
  };

  const scaleNames: Record<string, string> = {
    mvp: 'MVP / Startup Foundation',
    business: 'Scale-Up Business Core',
    enterprise: 'Custom Enterprise Suite'
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
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

// 5. Back to Top Button
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = () => {
    if (window.scrollY > 350) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =============================================================================
// 6. ENTERPRISE SERVICE DEMO SUITE (DEEPLY FUNCTIONAL & NON-AI-SLOP)
// =============================================================================

function initServiceDemo() {
  const root = document.querySelector<HTMLElement>('[data-demo-root]');
  if (!root) return;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // --- TAB SWITCHING WITH PERSISTENCE ---
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

  // ===========================================================================
  // DOMAIN 1: ORDERING SYSTEM BOOKING ENGINE
  // ===========================================================================
  interface FacilityData {
    name: string;
    rate: number;
    capacity: string;
    category: string;
  }

  interface AddonData {
    id: string;
    label: string;
    price: number;
  }

  const businessFacilities: Record<string, { title: string; facilities: FacilityData[]; addons: AddonData[] }> = {
    futsal: {
      title: 'Sarana Olahraga (Futsal & Badminton)',
      facilities: [
        { name: 'Lapangan 1 (Vinyl Pro Shock-Absorb)', rate: 150000, capacity: '10-12 Pemain', category: 'futsal' },
        { name: 'Lapangan 2 (Rumput Sintetis FIFA Grade)', rate: 160000, capacity: '10-14 Pemain', category: 'futsal' },
        { name: 'Court Badminton Vinyl BWF A1', rate: 75000, capacity: '2-4 Pemain', category: 'badminton' }
      ],
      addons: [
        { id: 'f_rompi', label: 'Sewa Rompi Tim (10 pcs)', price: 20000 },
        { id: 'f_referee', label: 'Wasit Berlisensi Resmi', price: 50000 },
        { id: 'f_water', label: 'Air Mineral 1 Dus (24 botol)', price: 35000 }
      ]
    },
    studio: {
      title: 'Studio Photo & Self-Photo',
      facilities: [
        { name: 'Room 1 (Neo-Retro Thematic Studio)', rate: 120000, capacity: 'Max 6 Orang', category: 'studio' },
        { name: 'Room 2 (White Cyclorama Infinity)', rate: 150000, capacity: 'Max 10 Orang', category: 'studio' },
        { name: 'Room 3 (Family Portrait Hall)', rate: 180000, capacity: 'Max 15 Orang', category: 'studio' }
      ],
      addons: [
        { id: 's_lighting', label: 'Godox Pro Flash & Softbox Kit', price: 45000 },
        { id: 's_raw', label: 'Semua File RAW Flashdrive Instan', price: 50000 },
        { id: 's_wardrobe', label: 'Akses Wardrobe & Kostum Tematik', price: 35000 }
      ]
    },
    barber: {
      title: 'Barbershop & Gentlemen Grooming',
      facilities: [
        { name: 'Executive Barber Chair #01 (Senior Barber)', rate: 60000, capacity: '1 Kursi', category: 'barber' },
        { name: 'VIP Private Suite Room (Full Service)', rate: 110000, capacity: '1 Kursi VIP', category: 'barber' }
      ],
      addons: [
        { id: 'b_spa', label: 'Hot Towel, Face Scrub & Hair Spa', price: 35000 },
        { id: 'b_color', label: 'Hair Coloring Highlight / Black Tone', price: 85000 },
        { id: 'b_pomade', label: 'Premium Pomade Finish Styling', price: 20000 }
      ]
    },
    ps: {
      title: 'Rental PS5 & Console VIP',
      facilities: [
        { name: 'Station 01 (VIP PS5 65" 4K 120Hz Recliner)', rate: 35000, capacity: '1-4 Pemain', category: 'ps' },
        { name: 'Station 02 (Racing Simulator Cockpit Fanatec)', rate: 55000, capacity: '1 Pemain', category: 'ps' },
        { name: 'VIP Room Private PS5 & Nintendo Switch', rate: 70000, capacity: 'Max 8 Orang', category: 'ps' }
      ],
      addons: [
        { id: 'p_stick', label: 'Tambahan 2 Stik DualSense Wireless', price: 15000 },
        { id: 'p_snack', label: 'Snack Platter & 2 Iced Tea', price: 30000 }
      ]
    },
    warnet: {
      title: 'Warnet PC Gaming Esports Arena',
      facilities: [
        { name: 'VIP Room RTX 4080 (i9-14900K 360Hz)', rate: 18000, capacity: '1 PC VIP', category: 'warnet' },
        { name: 'Esports Stage PC RTX 4070 (240Hz)', rate: 14000, capacity: '1 PC Esports', category: 'warnet' },
        { name: 'Standard Gaming Arena RTX 4060', rate: 10000, capacity: '1 PC Reguler', category: 'warnet' }
      ],
      addons: [
        { id: 'w_headset', label: 'Hi-Res Gaming Headset Spatial Audio', price: 10000 },
        { id: 'w_combo', label: 'Paket Indomie Goreng + Telur + Es Teh', price: 25000 }
      ]
    }
  };

  let currentBiz = 'futsal';
  let selectedSlots: { time: string; isPeak: boolean }[] = [
    { time: '19:00', isPeak: true },
    { time: '20:00', isPeak: true }
  ];
  let currentBookingDate = 'Hari Ini (21 Okt)';

  const bizChips = root.querySelectorAll<HTMLButtonElement>('#bookingBizChips .biz-chip');
  const resourceSelect = root.querySelector<HTMLSelectElement>('#bookingResourceSelect');
  const datePills = root.querySelectorAll<HTMLButtonElement>('#bookingDatePills .date-pill');
  const slotGrid = root.querySelector<HTMLElement>('#bookingSlotGrid');
  const addonList = root.querySelector<HTMLElement>('#bookingAddonList');
  const guestNameInput = root.querySelector<HTMLInputElement>('#bookingCustomerName');

  const calcBaseEl = root.querySelector<HTMLElement>('#calcBaseRate');
  const calcAddonEl = root.querySelector<HTMLElement>('#calcAddonCost');
  const calcTotalEl = root.querySelector<HTMLElement>('#calcGrandTotal');
  const calcDueEl = root.querySelector<HTMLElement>('#calcDueAmount');

  // Ticket output elements
  const tCode = root.querySelector<HTMLElement>('#ticketCodeDisplay');
  const tGuest = root.querySelector<HTMLElement>('#ticketGuestName');
  const tBiz = root.querySelector<HTMLElement>('#ticketBizName');
  const tResource = root.querySelector<HTMLElement>('#ticketResourceName');
  const tDate = root.querySelector<HTMLElement>('#ticketDate');
  const tHours = root.querySelector<HTMLElement>('#ticketHours');
  const tAddons = root.querySelector<HTMLElement>('#ticketAddons');
  const tTotal = root.querySelector<HTMLElement>('#ticketTotalAmount');
  const tPayment = root.querySelector<HTMLElement>('#ticketPaymentBadge');
  const btnShareWA = root.querySelector<HTMLButtonElement>('#btnShareTicketWA');

  const renderBookingOptions = () => {
    const data = businessFacilities[currentBiz];
    if (!data || !resourceSelect || !addonList || !slotGrid) return;

    // Populate facilities dropdown
    resourceSelect.innerHTML = data.facilities
      .map(
        (f, idx) =>
          `<option value="${idx}">${f.name} — ${formatIDR(f.rate)}/jam (${f.capacity})</option>`
      )
      .join('');

    // Populate addons
    addonList.innerHTML = data.addons
      .map(
        (a) => `
        <label class="addon-chip">
          <input type="checkbox" class="booking-addon-cb" value="${a.price}" data-id="${a.id}" data-label="${a.label}" />
          <span>${a.label} (+${formatIDR(a.price)})</span>
        </label>
      `
      )
      .join('');

    // Attach listeners to newly created checkboxes
    addonList.querySelectorAll<HTMLInputElement>('.booking-addon-cb').forEach((cb) => {
      cb.addEventListener('change', calculateBooking);
    });

    // Populate slots with realistic peak hours & booked status
    const allSlots = [
      { time: '09:00', isPeak: false, isBooked: false },
      { time: '11:00', isPeak: false, isBooked: true },
      { time: '13:00', isPeak: false, isBooked: false },
      { time: '15:00', isPeak: false, isBooked: false },
      { time: '17:00', isPeak: true, isBooked: false },
      { time: '19:00', isPeak: true, isBooked: false },
      { time: '20:00', isPeak: true, isBooked: false },
      { time: '21:00', isPeak: true, isBooked: true },
      { time: '22:00', isPeak: false, isBooked: false }
    ];

    slotGrid.innerHTML = allSlots
      .map((s) => {
        const isSelected = selectedSlots.some((sel) => sel.time === s.time);
        const peakClass = s.isPeak ? 'slot-btn--peak' : '';
        const selectedClass = isSelected ? 'is-selected' : '';
        const disabledAttr = s.isBooked ? 'disabled' : '';
        const label = s.isBooked ? `${s.time} (Terisi)` : s.isPeak ? `${s.time} ★` : s.time;

        return `
          <button type="button" class="slot-btn ${peakClass} ${selectedClass}" data-time="${s.time}" data-peak="${s.isPeak}" ${disabledAttr}>
            ${label}
          </button>
        `;
      })
      .join('');

    slotGrid.querySelectorAll<HTMLButtonElement>('.slot-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const time = btn.dataset.time || '';
        const isPeak = btn.dataset.peak === 'true';

        const index = selectedSlots.findIndex((s) => s.time === time);
        if (index > -1) {
          selectedSlots.splice(index, 1);
          btn.classList.remove('is-selected');
        } else {
          selectedSlots.push({ time, isPeak });
          btn.classList.add('is-selected');
        }
        calculateBooking();
      });
    });

    calculateBooking();
  };

  const calculateBooking = () => {
    const data = businessFacilities[currentBiz];
    if (!data || !resourceSelect) return;

    const selectedFacilityIdx = parseInt(resourceSelect.value || '0', 10);
    const facility = data.facilities[selectedFacilityIdx] || data.facilities[0];

    const slotCount = Math.max(1, selectedSlots.length);
    let baseTotal = 0;

    selectedSlots.forEach((slot) => {
      const peakSurcharge = slot.isPeak ? 20000 : 0;
      baseTotal += facility.rate + peakSurcharge;
    });

    if (selectedSlots.length === 0) {
      baseTotal = facility.rate;
    }

    // Add-ons total
    let addonTotal = 0;
    const selectedAddonLabels: string[] = [];
    root.querySelectorAll<HTMLInputElement>('.booking-addon-cb:checked').forEach((cb) => {
      addonTotal += parseInt(cb.value, 10);
      selectedAddonLabels.push(cb.dataset.label || '');
    });

    const grandTotal = baseTotal + addonTotal;

    const isDp = root.querySelector<HTMLInputElement>('input[name="paymentScheme"]:checked')?.value === 'dp';
    const dueAmount = isDp ? Math.round(grandTotal * 0.5) : grandTotal;

    // Update UI numbers
    if (calcBaseEl) calcBaseEl.textContent = `${formatIDR(facility.rate)} x ${slotCount} Slot = ${formatIDR(baseTotal)}`;
    if (calcAddonEl) calcAddonEl.textContent = formatIDR(addonTotal);
    if (calcTotalEl) calcTotalEl.textContent = formatIDR(grandTotal);
    if (calcDueEl) calcDueEl.textContent = `${formatIDR(dueAmount)} (${isDp ? 'DP 50%' : 'Lunas 100%'})`;

    // Update Live E-Ticket Pass
    const guestName = guestNameInput?.value.trim() || 'Rian Hidayat';
    if (tGuest) tGuest.textContent = guestName;
    if (tBiz) tBiz.textContent = data.title;
    if (tResource) tResource.textContent = facility.name;
    if (tDate) tDate.textContent = currentBookingDate;

    const timesDisplay =
      selectedSlots.length > 0
        ? selectedSlots.map((s) => s.time).join(', ') + ` (${slotCount} Jam)`
        : '19:00 - 21:00 (2 Jam)';
    if (tHours) tHours.textContent = timesDisplay;

    if (tAddons) {
      tAddons.textContent = selectedAddonLabels.length > 0 ? selectedAddonLabels.join(', ') : 'Tanpa Add-on';
    }

    if (tTotal) tTotal.textContent = formatIDR(grandTotal);

    if (tPayment) {
      if (isDp) {
        tPayment.className = 'status-pill status-pill--dp';
        tPayment.textContent = `DP 50% (${formatIDR(dueAmount)})`;
      } else {
        tPayment.className = 'status-pill status-pill--paid';
        tPayment.textContent = `LUNAS (${formatIDR(grandTotal)})`;
      }
    }

    // Dynamic WhatsApp Link Generator
    if (btnShareWA) {
      const code = tCode?.textContent || 'BK-FTS-88421';
      const waText = `Halo Supernova Labs, berikut konfirmasi e-ticket booking saya:\n- No Booking: ${code}\n- Nama: ${guestName}\n- Fasilitas: ${facility.name}\n- Tanggal: ${currentBookingDate}\n- Jam: ${timesDisplay}\n- Total Biaya: ${formatIDR(grandTotal)}\n- Status: ${isDp ? 'DP 50% Menunggu Konfirmasi' : 'Lunas 100%'}`;
      btnShareWA.onclick = () => {
        window.open(`https://wa.me/6281283626217?text=${encodeURIComponent(waText)}`, '_blank');
      };
    }
  };

  // Biz category pills
  bizChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      bizChips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      currentBiz = chip.dataset.biz || 'futsal';
      renderBookingOptions();
    });
  });

  resourceSelect?.addEventListener('change', calculateBooking);
  guestNameInput?.addEventListener('input', calculateBooking);

  root.querySelectorAll<HTMLInputElement>('input[name="paymentScheme"]').forEach((r) => {
    r.addEventListener('change', calculateBooking);
  });

  datePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      datePills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      currentBookingDate = pill.dataset.date || 'Hari Ini';
      calculateBooking();
    });
  });

  // Confirm booking button
  const btnConfirmBooking = root.querySelector<HTMLButtonElement>('#btnConfirmBooking');
  btnConfirmBooking?.addEventListener('click', () => {
    const randomCode = `BK-${currentBiz.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    if (tCode) tCode.textContent = randomCode;
    calculateBooking();

    // Pulse animation
    const ticketCard = root.querySelector<HTMLElement>('#digitalTicketCard');
    if (ticketCard) {
      ticketCard.classList.remove('is-pulsing');
      void ticketCard.offsetWidth; // force reflow
      ticketCard.classList.add('is-pulsing');
    }

    alert(`✓ Booking Sukses! E-Ticket terbit dengan Kode: ${randomCode}. Slot jadwal otomatis terkunci di database.`);
  });

  // Verify Booking Code Tool
  const btnVerify = root.querySelector<HTMLButtonElement>('#btnVerifyCode');
  const lookupInput = root.querySelector<HTMLInputElement>('#lookupCodeInput');
  const lookupFeedback = root.querySelector<HTMLElement>('#lookupFeedback');

  btnVerify?.addEventListener('click', () => {
    const code = lookupInput?.value.trim().toUpperCase() || '';
    if (!lookupFeedback) return;

    if (!code) {
      lookupFeedback.innerHTML = `<span class="text-danger">Silakan masukkan kode booking terlebih dahulu.</span>`;
      return;
    }

    lookupFeedback.innerHTML = `
      <span class="text-success">✓ <strong>${code}</strong> VALID!</span> 
      Tamu: <strong>Rian Hidayat</strong> · Fasilitas: <strong>Lapangan 1 (Vinyl)</strong> · Tanggal: <strong>Hari Ini 19:00</strong> · Status: <strong>DP 50% Terverifikasi</strong>.
    `;
  });

  // Initial render of Booking module
  renderBookingOptions();

  // ===========================================================================
  // DOMAIN 2: POS, ERP, CRM & KEUANGAN TERPADU
  // ===========================================================================
  interface PosProduct {
    id: string;
    sku: string;
    name: string;
    category: 'beverage' | 'food' | 'retail';
    price: number;
    buyPrice: number;
    stock: number;
    unit: string;
  }

  const initialProducts: PosProduct[] = [
    { id: 'p1', sku: 'SKU-COF-01', name: 'Biji Kopi Signature 250g', category: 'retail', price: 75000, buyPrice: 35000, stock: 48, unit: 'bag' },
    { id: 'p2', sku: 'SKU-BEV-01', name: 'Caramel Macchiato Latte', category: 'beverage', price: 35000, buyPrice: 12000, stock: 92, unit: 'cup' },
    { id: 'p3', sku: 'SKU-FOD-01', name: 'Croissant Butter Almond', category: 'food', price: 28000, buyPrice: 11000, stock: 14, unit: 'pcs' },
    { id: 'p4', sku: 'SKU-BEV-02', name: 'Matcha Oatmilk Iced', category: 'beverage', price: 32000, buyPrice: 10000, stock: 65, unit: 'cup' },
    { id: 'p5', sku: 'SKU-FOD-02', name: 'Truffle Fries Gourmet', category: 'food', price: 36000, buyPrice: 13000, stock: 22, unit: 'portion' },
    { id: 'p6', sku: 'SKU-RET-01', name: 'Tumbler Stainless Supernova', category: 'retail', price: 120000, buyPrice: 65000, stock: 4, unit: 'pcs' }
  ];

  interface CartItem {
    product: PosProduct;
    quantity: number;
    notes?: string;
  }

  let cart: CartItem[] = [
    { product: initialProducts[1], quantity: 1, notes: 'Normal Sugar' },
    { product: initialProducts[0], quantity: 1, notes: 'Medium Roast' }
  ];

  let appliedVoucherDiscount = 0;
  let useMemberPointsDiscount = 0;
  let dayOmset = 2850000;
  let dayHpp = 1140000;
  let cashSalesTotal = 1450000;

  const productGrid = root.querySelector<HTMLElement>('#posProductGrid');
  const cartContainer = root.querySelector<HTMLElement>('#cartItemsContainer');
  const posSearch = root.querySelector<HTMLInputElement>('#posSearchInput');
  const catPills = root.querySelectorAll<HTMLButtonElement>('#posCategoryPills .p-cat-btn');

  const elSubtotal = root.querySelector<HTMLElement>('#posSubtotal');
  const elDiscount = root.querySelector<HTMLElement>('#posDiscount');
  const elTax = root.querySelector<HTMLElement>('#posTax');
  const elGrand = root.querySelector<HTMLElement>('#posGrandTotal');

  const customerSelect = root.querySelector<HTMLSelectElement>('#posCustomerSelect');
  const btnTogglePoints = root.querySelector<HTMLButtonElement>('#btnTogglePoints');
  const crmRewardBadge = root.querySelector<HTMLElement>('#crmRewardBadge');

  const voucherInput = root.querySelector<HTMLInputElement>('#posVoucherInput');
  const btnApplyVoucher = root.querySelector<HTMLButtonElement>('#btnApplyVoucher');
  const voucherFeedback = root.querySelector<HTMLElement>('#voucherFeedback');

  const cashInput = root.querySelector<HTMLInputElement>('#cashReceivedInput');
  const cashChangeDisplay = root.querySelector<HTMLElement>('#cashChangeDisplay');
  const cashChips = root.querySelectorAll<HTMLButtonElement>('.cash-chip');
  const btnCheckout = root.querySelector<HTMLButtonElement>('#btnPosCheckout');
  const btnClearCart = root.querySelector<HTMLButtonElement>('#btnClearCart');

  // Receipt & ERP elements
  const btnViewReceipt = root.querySelector<HTMLButtonElement>('#btnToggleReceiptView');
  const btnViewErp = root.querySelector<HTMLButtonElement>('#btnToggleErpView');
  const receiptView = root.querySelector<HTMLElement>('#receiptView');
  const erpView = root.querySelector<HTMLElement>('#erpView');

  const rItemsList = root.querySelector<HTMLElement>('#receiptItemsList');
  const rSubtotal = root.querySelector<HTMLElement>('#rSubtotal');
  const rDiscount = root.querySelector<HTMLElement>('#rDiscount');
  const rTax = root.querySelector<HTMLElement>('#rTax');
  const rGrandTotal = root.querySelector<HTMLElement>('#rGrandTotal');
  const rPaid = root.querySelector<HTMLElement>('#rPaid');
  const rChange = root.querySelector<HTMLElement>('#rChange');
  const rMember = root.querySelector<HTMLElement>('#receiptMemberName');
  const rInv = root.querySelector<HTMLElement>('#receiptInvoiceNum');

  const erpOmsetEl = root.querySelector<HTMLElement>('#erpOmset');
  const erpHppEl = root.querySelector<HTMLElement>('#erpHpp');
  const erpProfitEl = root.querySelector<HTMLElement>('#erpProfit');
  const erpCashSalesEl = root.querySelector<HTMLElement>('#erpCashSales');
  const erpTotalDrawerEl = root.querySelector<HTMLElement>('#erpTotalDrawer');
  const erpLogList = root.querySelector<HTMLElement>('#erpLogList');

  // Render Product Grid with live stock & search
  let activeCategory = 'all';
  let searchQuery = '';

  const renderProducts = () => {
    if (!productGrid) return;

    const filtered = initialProducts.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      productGrid.innerHTML = `<div class="pos-empty-products">Tidak ada produk ditemukan untuk pencarian "${searchQuery}".</div>`;
      return;
    }

    productGrid.innerHTML = filtered
      .map((p) => {
        const isLowStock = p.stock <= 5;
        const stockBadge = isLowStock
          ? `<span class="stock-badge stock-badge--danger">⚠️ Sisa ${p.stock} ${p.unit}</span>`
          : `<span class="stock-badge stock-badge--ok">Stok: ${p.stock} ${p.unit}</span>`;

        return `
          <div class="pos-prod-card" data-id="${p.id}">
            <div class="prod-top">
              <span class="prod-sku">${p.sku}</span>
              ${stockBadge}
            </div>
            <strong class="prod-name">${p.name}</strong>
            <div class="prod-bottom">
              <span class="prod-price">${formatIDR(p.price)}</span>
              <button type="button" class="btn-add-cart" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
                + Tambah
              </button>
            </div>
          </div>
        `;
      })
      .join('');

    productGrid.querySelectorAll<HTMLButtonElement>('.btn-add-cart').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const prod = initialProducts.find((p) => p.id === id);
        if (!prod || prod.stock <= 0) return;

        const cartItem = cart.find((item) => item.product.id === id);
        if (cartItem) {
          cartItem.quantity++;
        } else {
          cart.push({ product: prod, quantity: 1 });
        }
        prod.stock--;
        renderProducts();
        renderCart();
      });
    });
  };

  const renderCart = () => {
    if (!cartContainer) return;

    if (cart.length === 0) {
      cartContainer.innerHTML = `<div class="cart-empty-text">Keranjang kasir masih kosong. Klik "+ Tambah" pada katalog di atas.</div>`;
    } else {
      cartContainer.innerHTML = cart
        .map(
          (item, idx) => `
          <div class="cart-line-item">
            <div class="item-info">
              <strong>${item.product.name}</strong>
              <small class="item-sub">${formatIDR(item.product.price)} x ${item.quantity} = ${formatIDR(item.product.price * item.quantity)}</small>
            </div>
            <div class="item-controls">
              <button type="button" class="btn-qty-op" data-action="dec" data-idx="${idx}">-</button>
              <span class="qty-num">${item.quantity}</span>
              <button type="button" class="btn-qty-op" data-action="inc" data-idx="${idx}">+</button>
              <button type="button" class="btn-del-item" data-idx="${idx}" title="Hapus">✕</button>
            </div>
          </div>
        `
        )
        .join('');

      cartContainer.querySelectorAll<HTMLButtonElement>('.btn-qty-op').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx || '0', 10);
          const action = btn.dataset.action;
          const item = cart[idx];
          if (!item) return;

          if (action === 'inc') {
            if (item.product.stock > 0) {
              item.quantity++;
              item.product.stock--;
            } else {
              alert('Stok barang di gudang sudah habis!');
            }
          } else if (action === 'dec') {
            item.quantity--;
            item.product.stock++;
            if (item.quantity <= 0) {
              cart.splice(idx, 1);
            }
          }
          renderProducts();
          renderCart();
        });
      });

      cartContainer.querySelectorAll<HTMLButtonElement>('.btn-del-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx || '0', 10);
          const item = cart[idx];
          if (item) {
            item.product.stock += item.quantity;
            cart.splice(idx, 1);
            renderProducts();
            renderCart();
          }
        });
      });
    }

    calculatePosTotals();
  };

  const calculatePosTotals = () => {
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.product.price * item.quantity;
    });

    const totalDiscount = Math.min(subtotal, appliedVoucherDiscount + useMemberPointsDiscount);
    const taxableAmount = Math.max(0, subtotal - totalDiscount);
    const tax = Math.round(taxableAmount * 0.1); // PB1 10%
    const grandTotal = taxableAmount + tax;

    if (elSubtotal) elSubtotal.textContent = formatIDR(subtotal);
    if (elDiscount) elDiscount.textContent = `-${formatIDR(totalDiscount)}`;
    if (elTax) elTax.textContent = formatIDR(tax);
    if (elGrand) elGrand.textContent = formatIDR(grandTotal);

    // Update Cash Calculator
    const cashVal = parseFloat(cashInput?.value || '0');
    const change = Math.max(0, cashVal - grandTotal);
    if (cashChangeDisplay) {
      cashChangeDisplay.textContent = formatIDR(change);
    }
  };

  // Search & Category listeners
  posSearch?.addEventListener('input', () => {
    searchQuery = posSearch.value.trim();
    renderProducts();
  });

  catPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      catPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      activeCategory = pill.dataset.cat || 'all';
      renderProducts();
    });
  });

  // Customer Loyalty Select
  customerSelect?.addEventListener('change', () => {
    const selectedOpt = customerSelect.options[customerSelect.selectedIndex];
    const tier = selectedOpt.dataset.tier || 'Non-Member';
    const points = selectedOpt.dataset.points || '0';

    if (crmRewardBadge) {
      if (tier === 'Gold') {
        crmRewardBadge.innerHTML = `⭐ <strong>Gold Member (${points} Poin):</strong> Berhak cashback 5% dan gratis pastry per 500k belanja.`;
      } else if (tier === 'Silver') {
        crmRewardBadge.innerHTML = `🥈 <strong>Silver Member (${points} Poin):</strong> Diskon potongan Rp 5.000 dengan penukaran 100 poin.`;
      } else {
        crmRewardBadge.innerHTML = `👥 <strong>Pelanggan Umum:</strong> Daftarkan nomor telepon pelanggan untuk mulai kumpulkan loyalty point.`;
      }
    }
    useMemberPointsDiscount = 0;
    calculatePosTotals();
  });

  btnTogglePoints?.addEventListener('click', () => {
    const selectedOpt = customerSelect?.options[customerSelect.selectedIndex];
    const discount = parseInt(selectedOpt?.dataset.discount || '0', 10);
    if (discount > 0) {
      useMemberPointsDiscount = useMemberPointsDiscount > 0 ? 0 : discount;
      alert(
        useMemberPointsDiscount > 0
          ? `✓ Poin member berhasil ditukarkan dengan potongan ${formatIDR(useMemberPointsDiscount)}!`
          : 'Penukaran poin dibatalkan.'
      );
      calculatePosTotals();
    } else {
      alert('Pelanggan ini belum memiliki cukup poin untuk ditukar.');
    }
  });

  // Voucher Code apply
  btnApplyVoucher?.addEventListener('click', () => {
    const code = voucherInput?.value.trim().toUpperCase() || '';
    if (!voucherFeedback) return;

    if (code === 'SUPERNOVA10') {
      appliedVoucherDiscount = 15000;
      voucherFeedback.innerHTML = `<span class="text-success">✓ Voucher SUPERNOVA10 aktif: Diskon Rp 15.000 berhasil diterapkan!</span>`;
    } else if (code === 'HEMAT15') {
      appliedVoucherDiscount = 15000;
      voucherFeedback.innerHTML = `<span class="text-success">✓ Voucher HEMAT15 aktif: Diskon Rp 15.000 berhasil diterapkan!</span>`;
    } else {
      appliedVoucherDiscount = 0;
      voucherFeedback.innerHTML = `<span class="text-danger">Kode promo tidak valid atau telah kedaluwarsa.</span>`;
    }
    calculatePosTotals();
  });

  // Cash Quick Buttons
  cashChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const nominal = chip.dataset.nominal;
      let grandTotal = 0;
      cart.forEach((i) => (grandTotal += i.product.price * i.quantity));
      const discount = Math.min(grandTotal, appliedVoucherDiscount + useMemberPointsDiscount);
      grandTotal = Math.round((grandTotal - discount) * 1.1);

      if (nominal === 'exact') {
        if (cashInput) cashInput.value = grandTotal.toString();
      } else if (nominal) {
        if (cashInput) cashInput.value = nominal;
      }
      calculatePosTotals();
    });
  });

  cashInput?.addEventListener('input', calculatePosTotals);

  // Clear cart
  btnClearCart?.addEventListener('click', () => {
    cart.forEach((item) => {
      item.product.stock += item.quantity;
    });
    cart = [];
    renderProducts();
    renderCart();
  });

  // Complete POS Transaction Checkout
  btnCheckout?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Keranjang kasir masih kosong! Tambahkan minimal 1 produk.');
      return;
    }

    let subtotal = 0;
    let cogsTotal = 0;
    cart.forEach((i) => {
      subtotal += i.product.price * i.quantity;
      cogsTotal += i.product.buyPrice * i.quantity;
    });

    const totalDiscount = Math.min(subtotal, appliedVoucherDiscount + useMemberPointsDiscount);
    const tax = Math.round((subtotal - totalDiscount) * 0.1);
    const grandTotal = subtotal - totalDiscount + tax;

    const cashReceived = parseFloat(cashInput?.value || grandTotal.toString());
    if (cashReceived < grandTotal) {
      alert(`Uang diterima (${formatIDR(cashReceived)}) kurang dari total belanja (${formatIDR(grandTotal)})!`);
      return;
    }

    const change = cashReceived - grandTotal;
    const invNumber = `INV/POS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    // Update Thermal Receipt View
    if (rInv) rInv.textContent = invNumber;
    if (rMember && customerSelect) {
      rMember.textContent = `Pelanggan: ${customerSelect.options[customerSelect.selectedIndex].text}`;
    }
    if (rItemsList) {
      rItemsList.innerHTML = cart
        .map(
          (item) => `
        <div class="receipt-item-row">
          <div>
            <strong>${item.quantity}x ${item.product.name}</strong>
            <small>${item.notes || 'Reguler'}</small>
          </div>
          <span>${formatIDR(item.product.price * item.quantity)}</span>
        </div>
      `
        )
        .join('');
    }
    if (rSubtotal) rSubtotal.textContent = formatIDR(subtotal);
    if (rDiscount) rDiscount.textContent = `-${formatIDR(totalDiscount)}`;
    if (rTax) rTax.textContent = formatIDR(tax);
    if (rGrandTotal) rGrandTotal.textContent = formatIDR(grandTotal);
    if (rPaid) rPaid.textContent = formatIDR(cashReceived);
    if (rChange) rChange.textContent = formatIDR(change);

    // Update Mini-ERP Financials
    dayOmset += grandTotal;
    dayHpp += cogsTotal;
    cashSalesTotal += grandTotal;
    const netProfit = dayOmset - dayHpp;

    if (erpOmsetEl) erpOmsetEl.textContent = formatIDR(dayOmset);
    if (erpHppEl) erpHppEl.textContent = formatIDR(dayHpp);
    if (erpProfitEl) erpProfitEl.textContent = formatIDR(netProfit);
    if (erpCashSalesEl) erpCashSalesEl.textContent = formatIDR(cashSalesTotal);
    if (erpTotalDrawerEl) erpTotalDrawerEl.textContent = formatIDR(500000 + cashSalesTotal);

    // Append to Inventory Log
    if (erpLogList) {
      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      cart.forEach((item) => {
        const logHtml = `
          <div class="log-entry">
            <span class="log-time">${timeStr}</span>
            <span class="log-text">Penjualan <strong>${item.quantity}x ${item.product.name}</strong> (${invNumber}). Sisa stok: <strong>${item.product.stock} ${item.product.unit}</strong></span>
          </div>
        `;
        erpLogList.insertAdjacentHTML('afterbegin', logHtml);
      });
    }

    alert(`✓ TRANSAKSI SUKSES!\nNo Faktur: ${invNumber}\nTotal: ${formatIDR(grandTotal)}\nKembalian: ${formatIDR(change)}\nStok gudang & jurnal keuangan telah diperbarui secara otomatis.`);

    // Reset Cart
    cart = [];
    appliedVoucherDiscount = 0;
    useMemberPointsDiscount = 0;
    if (voucherFeedback) voucherFeedback.textContent = '';
    if (cashInput) cashInput.value = '';
    renderCart();
  });

  // Toggle Receipt vs ERP View
  btnViewReceipt?.addEventListener('click', () => {
    btnViewReceipt.classList.add('is-active');
    btnViewErp?.classList.remove('is-active');
    receiptView?.classList.remove('is-hidden');
    erpView?.classList.add('is-hidden');
  });

  btnViewErp?.addEventListener('click', () => {
    btnViewErp.classList.add('is-active');
    btnViewReceipt?.classList.remove('is-active');
    erpView?.classList.remove('is-hidden');
    receiptView?.classList.add('is-hidden');
  });

  // WhatsApp receipt share
  const btnReceiptWA = root.querySelector<HTMLButtonElement>('#btnSendReceiptWA');
  btnReceiptWA?.addEventListener('click', () => {
    const inv = rInv?.textContent || 'INV/POS-0992';
    const total = rGrandTotal?.textContent || 'Rp 100.000';
    const msg = `Halo, ini struk resmi dari Supernova Coffee & Roastery:\nNo Invoice: ${inv}\nTotal Belanja: ${total}\nStatus: Lunas via Kasir.\nTerima kasih atas kunjungan Anda!`;
    window.open(`https://wa.me/6281283626217?text=${encodeURIComponent(msg)}`, '_blank');
  });

  renderProducts();
  renderCart();

  // ===========================================================================
  // DOMAIN 3: ORDERING IN TABLE WITH QR CODE & KDS
  // ===========================================================================
  interface RestoMenuItem {
    id: string;
    name: string;
    category: 'main' | 'beverage' | 'appetizer';
    price: number;
    desc: string;
  }

  const restoCatalog: RestoMenuItem[] = [
    { id: 'm1', name: 'Wagyu Beef Donburi Rice Bowl', category: 'main', price: 88000, desc: 'Daging Wagyu Meltique empuk, tare sauce gurih, onsen egg & daun bawang Jepang.' },
    { id: 'm2', name: 'Crispy Chicken Nanban', category: 'main', price: 54000, desc: 'Ayam krispi juicy dibalut saus nanban asam manis dan tartar telur lezat.' },
    { id: 'm3', name: 'Iced Peach Tea Yakult', category: 'beverage', price: 28000, desc: 'Teh harum berpadu Yakult dingin dan popping boba peach kenyal.' },
    { id: 'm4', name: 'Truffle Parmesan Fries', category: 'appetizer', price: 36000, desc: 'Kentang goreng renyah bumbu truffle putih dan parmesan segar parut.' }
  ];

  interface RestoCartItem {
    menu: RestoMenuItem;
    quantity: number;
    spicy: string;
    sugarIce: string;
    addons: string[];
    extraCost: number;
  }

  let tableCart: RestoCartItem[] = [
    { menu: restoCatalog[0], quantity: 1, spicy: 'Level 1 (Sedang)', sugarIce: '', addons: ['Onsen Soft Egg (+Rp 6.000)'], extraCost: 6000 },
    { menu: restoCatalog[2], quantity: 1, spicy: '', sugarIce: 'Less Ice & Less Sugar', addons: [], extraCost: 0 }
  ];

  let currentRestoTable = '01';
  let splitPersons = 3;

  const tableSelectorBtns = root.querySelectorAll<HTMLButtonElement>('#qrTableSelector .tbl-btn');
  const mobileTablePill = root.querySelector<HTMLElement>('#mobileTablePill');
  const restoMenuGrid = root.querySelector<HTMLElement>('#restoCardsGrid');
  const restoMenuCatBtns = root.querySelectorAll<HTMLButtonElement>('#restoMenuCats .m-cat-btn');

  const tableCartContainer = root.querySelector<HTMLElement>('#tableCartItems');
  const tableCartCountEl = root.querySelector<HTMLElement>('#tableCartCount');
  const tableGrandTotalEl = root.querySelector<HTMLElement>('#tableGrandTotal');
  const splitPriceDisplay = root.querySelector<HTMLElement>('#splitPriceDisplay');
  const splitChips = root.querySelectorAll<HTMLButtonElement>('#splitPersonChips .p-chip');

  const btnCallWaiter = root.querySelector<HTMLButtonElement>('#btnCallWaiter');
  const btnRequestBill = root.querySelector<HTMLButtonElement>('#btnRequestBill');
  const waiterAlertToast = root.querySelector<HTMLElement>('#waiterAlertToast');

  const btnSendKitchen = root.querySelector<HTMLButtonElement>('#btnSendOrderKitchen');
  const kdsAlertBanner = root.querySelector<HTMLElement>('#kdsAlertBanner');
  const kdsAlertMessage = root.querySelector<HTMLElement>('#kdsAlertMessage');
  const kdsItemsList01 = root.querySelector<HTMLElement>('#kdsItemsList01');
  const kdsWorkflowState01 = root.querySelector<HTMLElement>('#kdsWorkflowState01');
  const btnAdvanceKds01 = root.querySelector<HTMLButtonElement>('#btnAdvanceKds01');

  // Variant drawer elements
  const variantDrawer = root.querySelector<HTMLElement>('#variantDrawer');
  const variantItemTitle = root.querySelector<HTMLElement>('#variantItemTitle');
  const btnCloseVariant = root.querySelector<HTMLButtonElement>('#btnCloseVariant');
  const btnAddCustomItem = root.querySelector<HTMLButtonElement>('#btnAddCustomItem');
  let pendingCustomItem: RestoMenuItem | null = null;

  // Table Switching
  tableSelectorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tableSelectorBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentRestoTable = btn.dataset.tbl || '01';
      const section = btn.dataset.section || 'Indoor';
      if (mobileTablePill) {
        mobileTablePill.textContent = `📍 Terhubung: Meja ${currentRestoTable} (${section})`;
      }
    });
  });

  // Render Resto Catalog
  let activeRestoCat = 'all';
  const renderRestoMenu = () => {
    if (!restoMenuGrid) return;

    const filtered = restoCatalog.filter((m) => activeRestoCat === 'all' || m.category === activeRestoCat);

    restoMenuGrid.innerHTML = filtered
      .map(
        (m) => `
        <div class="resto-food-card">
          <div class="food-meta">
            <strong>${m.name}</strong>
            <p>${m.desc}</p>
            <span class="food-price">${formatIDR(m.price)}</span>
          </div>
          <button type="button" class="btn-order-food" data-id="${m.id}">
            + Pesan (Varian)
          </button>
        </div>
      `
      )
      .join('');

    restoMenuGrid.querySelectorAll<HTMLButtonElement>('.btn-order-food').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        pendingCustomItem = restoCatalog.find((m) => m.id === id) || null;
        if (pendingCustomItem && variantDrawer && variantItemTitle) {
          variantItemTitle.textContent = `Kustomisasi ${pendingCustomItem.name}`;
          variantDrawer.classList.remove('is-hidden');
        }
      });
    });
  };

  restoMenuCatBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      restoMenuCatBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeRestoCat = btn.dataset.cat || 'all';
      renderRestoMenu();
    });
  });

  // Variant drawer closing & adding
  btnCloseVariant?.addEventListener('click', () => {
    variantDrawer?.classList.add('is-hidden');
  });

  btnAddCustomItem?.addEventListener('click', () => {
    if (!pendingCustomItem) return;

    const spicy = root.querySelector<HTMLButtonElement>('#spicyLevelChips .v-chip.is-active')?.dataset.val || '';
    const iceSugar = root.querySelector<HTMLButtonElement>('#iceSugarChips .v-chip.is-active')?.dataset.val || '';

    const addons: string[] = [];
    let extraCost = 0;
    const eggCb = root.querySelector<HTMLInputElement>('#checkOnsenEgg');
    const sambalCb = root.querySelector<HTMLInputElement>('#checkSambalMatah');

    if (eggCb?.checked) {
      addons.push('Onsen Soft Egg (+Rp 6.000)');
      extraCost += 6000;
    }
    if (sambalCb?.checked) {
      addons.push('Sambal Matah Ekstra (+Rp 4.000)');
      extraCost += 4000;
    }

    tableCart.push({
      menu: pendingCustomItem,
      quantity: 1,
      spicy,
      sugarIce: iceSugar,
      addons,
      extraCost
    });

    variantDrawer?.classList.add('is-hidden');
    renderTableCart();
  });

  // Variant selector chips
  root.querySelectorAll<HTMLButtonElement>('#spicyLevelChips .v-chip').forEach((c) => {
    c.addEventListener('click', () => {
      root.querySelectorAll<HTMLButtonElement>('#spicyLevelChips .v-chip').forEach((ch) => ch.classList.remove('is-active'));
      c.classList.add('is-active');
    });
  });

  root.querySelectorAll<HTMLButtonElement>('#iceSugarChips .v-chip').forEach((c) => {
    c.addEventListener('click', () => {
      root.querySelectorAll<HTMLButtonElement>('#iceSugarChips .v-chip').forEach((ch) => ch.classList.remove('is-active'));
      c.classList.add('is-active');
    });
  });

  // Render Table Cart
  const renderTableCart = () => {
    if (!tableCartContainer) return;

    if (tableCart.length === 0) {
      tableCartContainer.innerHTML = `<div class="cart-empty-text">Belum ada makanan dipilih di meja ini.</div>`;
    } else {
      tableCartContainer.innerHTML = tableCart
        .map((item, idx) => {
          const notesParts = [item.spicy, item.sugarIce, ...item.addons].filter(Boolean);
          const notesStr = notesParts.length > 0 ? notesParts.join(' · ') : 'Standar Resto';
          const lineTotal = (item.menu.price + item.extraCost) * item.quantity;

          return `
          <div class="table-cart-item">
            <div class="item-desc">
              <strong>${item.quantity}x ${item.menu.name}</strong>
              <small class="variant-notes">${notesStr}</small>
            </div>
            <div class="item-act">
              <span class="price-val">${formatIDR(lineTotal)}</span>
              <button type="button" class="btn-del-table-item" data-idx="${idx}">✕</button>
            </div>
          </div>
        `;
        })
        .join('');

      tableCartContainer.querySelectorAll<HTMLButtonElement>('.btn-del-table-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx || '0', 10);
          tableCart.splice(idx, 1);
          renderTableCart();
        });
      });
    }

    calculateTableTotals();
  };

  const calculateTableTotals = () => {
    let subtotal = 0;
    tableCart.forEach((item) => {
      subtotal += (item.menu.price + item.extraCost) * item.quantity;
    });

    const tax = Math.round(subtotal * 0.1); // PB1 10%
    const grandTotal = subtotal + tax;

    if (tableCartCountEl) tableCartCountEl.textContent = `${tableCart.length} Menu Terpilih`;
    if (tableGrandTotalEl) tableGrandTotalEl.textContent = formatIDR(grandTotal);

    // Split bill calculation
    const perPerson = Math.round(grandTotal / splitPersons);
    if (splitPriceDisplay) {
      splitPriceDisplay.textContent = `${formatIDR(perPerson)} / orang (${splitPersons} Orang)`;
    }
  };

  // Split Person Chips
  splitChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      splitChips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      splitPersons = parseInt(chip.dataset.person || '3', 10);
      calculateTableTotals();
    });
  });

  // Call Waiter & Request Bill Buttons
  btnCallWaiter?.addEventListener('click', () => {
    if (waiterAlertToast) {
      waiterAlertToast.innerHTML = `🔔 <strong>Pelayan Meja ${currentRestoTable} Diberitahu!</strong> Waiter sedang menuju ke meja Anda (Est. 1 menit).`;
      waiterAlertToast.classList.remove('is-hidden');
      setTimeout(() => waiterAlertToast.classList.add('is-hidden'), 4000);
    }
    if (kdsAlertMessage && kdsAlertBanner) {
      kdsAlertMessage.innerHTML = `⚠️ <strong style="color:#ef4444">PANGGILAN WAITER DARI MEJA ${currentRestoTable}:</strong> Tamu membutuhkan bantuan / alat makan.`;
      kdsAlertBanner.style.background = '#7f1d1d';
    }
  });

  btnRequestBill?.addEventListener('click', () => {
    if (waiterAlertToast) {
      waiterAlertToast.innerHTML = `🧾 <strong>Permintaan Bill Dikirim!</strong> Kasir sedang mencetak struk untuk Meja ${currentRestoTable}.`;
      waiterAlertToast.classList.remove('is-hidden');
      setTimeout(() => waiterAlertToast.classList.add('is-hidden'), 4000);
    }
    if (kdsAlertMessage && kdsAlertBanner) {
      kdsAlertMessage.innerHTML = `💳 <strong>KASIR: Meja ${currentRestoTable} meminta penutupan bill / pembayaran.</strong>`;
      kdsAlertBanner.style.background = '#1e3a8a';
    }
  });

  // Send Order to Kitchen KDS
  btnSendKitchen?.addEventListener('click', () => {
    if (tableCart.length === 0) {
      alert('Pilih menu makanan terlebih dahulu sebelum mengirim ke dapur.');
      return;
    }

    if (kdsItemsList01) {
      kdsItemsList01.innerHTML = tableCart
        .map((item) => {
          const notesParts = [item.spicy, item.sugarIce, ...item.addons].filter(Boolean);
          const notesStr = notesParts.length > 0 ? notesParts.join(' · ') : 'Standar';
          return `
          <div class="kds-food-row">
            <strong class="qty">${item.quantity}x</strong>
            <div class="food-details">
              <span class="food-name">${item.menu.name}</span>
              <span class="food-mod">🌶️ ${notesStr}</span>
            </div>
          </div>
        `;
        })
        .join('');
    }

    if (kdsWorkflowState01) {
      kdsWorkflowState01.textContent = '1. TIKET DITERIMA (BARU)';
      kdsWorkflowState01.className = 'text-warning';
    }

    if (btnAdvanceKds01) {
      btnAdvanceKds01.textContent = '▶ Mulai Memasak (Chef)';
      btnAdvanceKds01.style.background = '#2563eb';
    }

    alert(`✓ Pesanan Meja ${currentRestoTable} Berhasil Terkirim!\nTiket langsung muncul di monitor dapur Kitchen Display System (KDS).`);
  });

  // KDS Workflow Advance Button (1. Diterima -> 2. Dimasak -> 3. Siap Saji -> 4. Selesai)
  let kdsStep = 1;
  btnAdvanceKds01?.addEventListener('click', () => {
    kdsStep++;
    if (kdsStep === 2) {
      if (kdsWorkflowState01) {
        kdsWorkflowState01.textContent = '2. SEDANG DIMASAK (COOKING)';
        kdsWorkflowState01.className = 'text-blue';
      }
      if (btnAdvanceKds01) {
        btnAdvanceKds01.textContent = '✓ Makanan Matang (Siap Saji)';
        btnAdvanceKds01.style.background = '#059669';
      }
    } else if (kdsStep === 3) {
      if (kdsWorkflowState01) {
        kdsWorkflowState01.textContent = '3. SIAP DISAJIKAN KE MEJA';
        kdsWorkflowState01.className = 'text-success';
      }
      if (btnAdvanceKds01) {
        btnAdvanceKds01.textContent = '✅ Selesai Diantar ke Tamu';
        btnAdvanceKds01.style.background = '#475569';
      }
      if (kdsAlertMessage && kdsAlertBanner) {
        kdsAlertMessage.innerHTML = `🔔 <strong>MAKANAN MEJA 01 SIAP!</strong> Waiter silakan jemput hidangan di kitchen counter.`;
        kdsAlertBanner.style.background = '#065f46';
      }
    } else {
      kdsStep = 1;
      if (kdsWorkflowState01) {
        kdsWorkflowState01.textContent = 'TIKET SELESAI (ARCHIVED)';
        kdsWorkflowState01.className = 'text-muted';
      }
      if (btnAdvanceKds01) {
        btnAdvanceKds01.textContent = '↺ Reset Tiket Demo';
        btnAdvanceKds01.style.background = '#1e293b';
      }
    }
  });

  // KDS Live Clock
  const kdsClockEl = root.querySelector<HTMLElement>('#kdsClock');
  if (kdsClockEl) {
    setInterval(() => {
      kdsClockEl.textContent = new Date().toLocaleTimeString('id-ID');
    }, 1000);
  }

  renderRestoMenu();
  renderTableCart();
}

// Global Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initFaq();
  initEstimator();
  initBackToTop();
  initServiceDemo();
});
