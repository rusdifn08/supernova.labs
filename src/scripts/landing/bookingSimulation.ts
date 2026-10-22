export function initBookingSimulation(root: HTMLElement) {
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

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const businessFacilities: Record<string, { title: string; facilities: FacilityData[]; addons: AddonData[] }> = {
    futsal: {
      title: 'Sarana Olahraga (Futsal & Badminton)',
      facilities: [
        { name: 'Lapangan 1 (Vinyl Pro Shock-Absorb)', rate: 150000, capacity: '10-12 Pemain', category: 'futsal' },
        { name: 'Lapangan 2 (Rumput Sintetis FIFA Grade)', rate: 160000, capacity: '10-14 Pemain', category: 'futsal' },
        { name: 'Court Badminton Vinyl BWF A1', rate: 75000, capacity: '2-4 Pemain', category: 'badminton' },
      ],
      addons: [
        { id: 'f_rompi', label: 'Sewa Rompi Tim (10 pcs)', price: 20000 },
        { id: 'f_referee', label: 'Wasit Berlisensi Resmi', price: 50000 },
        { id: 'f_water', label: 'Air Mineral 1 Dus (24 botol)', price: 35000 },
      ],
    },
    studio: {
      title: 'Studio Photo & Self-Photo',
      facilities: [
        { name: 'Room 1 (Neo-Retro Thematic Studio)', rate: 120000, capacity: 'Max 6 Orang', category: 'studio' },
        { name: 'Room 2 (White Cyclorama Infinity)', rate: 150000, capacity: 'Max 10 Orang', category: 'studio' },
        { name: 'Room 3 (Family Portrait Hall)', rate: 180000, capacity: 'Max 15 Orang', category: 'studio' },
      ],
      addons: [
        { id: 's_lighting', label: 'Godox Pro Flash & Softbox Kit', price: 45000 },
        { id: 's_raw', label: 'Semua File RAW Flashdrive Instan', price: 50000 },
        { id: 's_wardrobe', label: 'Akses Wardrobe & Kostum Tematik', price: 35000 },
      ],
    },
    barber: {
      title: 'Barbershop & Gentlemen Grooming',
      facilities: [
        { name: 'Executive Barber Chair #01 (Senior Barber)', rate: 60000, capacity: '1 Kursi', category: 'barber' },
        { name: 'VIP Private Suite Room (Full Service)', rate: 110000, capacity: '1 Kursi VIP', category: 'barber' },
      ],
      addons: [
        { id: 'b_spa', label: 'Hot Towel, Face Scrub & Hair Spa', price: 35000 },
        { id: 'b_color', label: 'Hair Coloring Highlight / Black Tone', price: 85000 },
        { id: 'b_pomade', label: 'Premium Pomade Finish Styling', price: 20000 },
      ],
    },
    ps: {
      title: 'Rental PS5 & Console VIP',
      facilities: [
        { name: 'Station 01 (VIP PS5 65" 4K 120Hz Recliner)', rate: 35000, capacity: '1-4 Pemain', category: 'ps' },
        { name: 'Station 02 (Racing Simulator Cockpit Fanatec)', rate: 55000, capacity: '1 Pemain', category: 'ps' },
        { name: 'VIP Room Private PS5 & Nintendo Switch', rate: 70000, capacity: 'Max 8 Orang', category: 'ps' },
      ],
      addons: [
        { id: 'p_stick', label: 'Tambahan 2 Stik DualSense Wireless', price: 15000 },
        { id: 'p_snack', label: 'Snack Platter & 2 Iced Tea', price: 30000 },
      ],
    },
    warnet: {
      title: 'Warnet PC Gaming Esports Arena',
      facilities: [
        { name: 'VIP Room RTX 4080 (i9-14900K 360Hz)', rate: 18000, capacity: '1 PC VIP', category: 'warnet' },
        { name: 'Esports Stage PC RTX 4070 (240Hz)', rate: 14000, capacity: '1 PC Esports', category: 'warnet' },
        { name: 'Standard Gaming Arena RTX 4060', rate: 10000, capacity: '1 PC Reguler', category: 'warnet' },
      ],
      addons: [
        { id: 'w_headset', label: 'Hi-Res Gaming Headset Spatial Audio', price: 10000 },
        { id: 'w_combo', label: 'Paket Indomie Goreng + Telur + Es Teh', price: 25000 },
      ],
    },
  };

  let currentBiz = 'futsal';
  let selectedSlots: { time: string; isPeak: boolean }[] = [
    { time: '19:00', isPeak: true },
    { time: '20:00', isPeak: true },
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

    let addonTotal = 0;
    const selectedAddonLabels: string[] = [];
    root.querySelectorAll<HTMLInputElement>('.booking-addon-cb:checked').forEach((cb) => {
      addonTotal += parseInt(cb.value, 10);
      selectedAddonLabels.push(cb.dataset.label || '');
    });

    const grandTotal = baseTotal + addonTotal;
    const isDp = root.querySelector<HTMLInputElement>('input[name="paymentScheme"]:checked')?.value === 'dp';
    const dueAmount = isDp ? Math.round(grandTotal * 0.5) : grandTotal;

    if (calcBaseEl) calcBaseEl.textContent = `${formatIDR(facility.rate)} x ${slotCount} Slot = ${formatIDR(baseTotal)}`;
    if (calcAddonEl) calcAddonEl.textContent = formatIDR(addonTotal);
    if (calcTotalEl) calcTotalEl.textContent = formatIDR(grandTotal);
    if (calcDueEl) calcDueEl.textContent = `${formatIDR(dueAmount)} (${isDp ? 'DP 50%' : 'Lunas 100%'})`;

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
    if (tAddons) tAddons.textContent = selectedAddonLabels.length > 0 ? selectedAddonLabels.join(', ') : 'Tanpa Add-on';
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

    if (btnShareWA) {
      const code = tCode?.textContent || 'BK-FTS-88421';
      const waText = `Halo Supernova Labs, berikut konfirmasi e-ticket booking saya:\n- No Booking: ${code}\n- Nama: ${guestName}\n- Fasilitas: ${facility.name}\n- Tanggal: ${currentBookingDate}\n- Jam: ${timesDisplay}\n- Total Biaya: ${formatIDR(grandTotal)}\n- Status: ${isDp ? 'DP 50% Menunggu Konfirmasi' : 'Lunas 100%'}`;
      btnShareWA.onclick = () => {
        window.open(`https://wa.me/6281283626217?text=${encodeURIComponent(waText)}`, '_blank');
      };
    }
  };

  const renderBookingOptions = () => {
    const data = businessFacilities[currentBiz];
    if (!data || !resourceSelect || !addonList || !slotGrid) return;

    resourceSelect.innerHTML = data.facilities
      .map((f, idx) => `<option value="${idx}">${f.name} — ${formatIDR(f.rate)}/jam (${f.capacity})</option>`)
      .join('');

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

    addonList.querySelectorAll<HTMLInputElement>('.booking-addon-cb').forEach((cb) => {
      cb.addEventListener('change', calculateBooking);
    });

    const allSlots = [
      { time: '09:00', isPeak: false, isBooked: false },
      { time: '11:00', isPeak: false, isBooked: true },
      { time: '13:00', isPeak: false, isBooked: false },
      { time: '15:00', isPeak: false, isBooked: false },
      { time: '17:00', isPeak: true, isBooked: false },
      { time: '19:00', isPeak: true, isBooked: false },
      { time: '20:00', isPeak: true, isBooked: false },
      { time: '21:00', isPeak: true, isBooked: true },
      { time: '22:00', isPeak: false, isBooked: false },
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

  const btnConfirmBooking = root.querySelector<HTMLButtonElement>('#btnConfirmBooking');
  btnConfirmBooking?.addEventListener('click', () => {
    const randomCode = `BK-${currentBiz.toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    if (tCode) tCode.textContent = randomCode;
    calculateBooking();
    alert(`✓ Booking Sukses! E-Ticket terbit dengan Kode: ${randomCode}. Slot jadwal otomatis terkunci di database.`);
  });

  renderBookingOptions();
}
