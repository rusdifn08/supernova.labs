export function initRestoSimulation(root: HTMLElement) {
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
    { id: 'm4', name: 'Truffle Parmesan Fries', category: 'appetizer', price: 36000, desc: 'Kentang goreng renyah bumbu truffle putih dan parmesan segar parut.' },
  ];

  interface RestoCartItem {
    menu: RestoMenuItem;
    quantity: number;
    extraCost: number;
  }

  let tableCart: RestoCartItem[] = [
    { menu: restoCatalog[0], quantity: 1, extraCost: 6000 },
    { menu: restoCatalog[2], quantity: 1, extraCost: 0 },
  ];

  let currentRestoTable = '01';
  let splitPersons = 3;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const tableSelectorBtns = root.querySelectorAll<HTMLButtonElement>('#qrTableSelector .tbl-btn');
  const restoMenuGrid = root.querySelector<HTMLElement>('#restoCardsGrid');
  const tableCartContainer = root.querySelector<HTMLElement>('#tableCartItems');
  const tableGrandTotalEl = root.querySelector<HTMLElement>('#tableGrandTotal');
  const splitPriceDisplay = root.querySelector<HTMLElement>('#splitPriceDisplay');
  const splitChips = root.querySelectorAll<HTMLButtonElement>('#splitPersonChips .p-chip');

  const btnCallWaiter = root.querySelector<HTMLButtonElement>('#btnCallWaiter');
  const btnRequestBill = root.querySelector<HTMLButtonElement>('#btnRequestBill');
  const waiterAlertToast = root.querySelector<HTMLElement>('#waiterAlertToast');
  const btnSendKitchen = root.querySelector<HTMLButtonElement>('#btnSendOrderKitchen');
  const kdsItemsList01 = root.querySelector<HTMLElement>('#kdsItemsList01');
  const kdsWorkflowState01 = root.querySelector<HTMLElement>('#kdsWorkflowState01');
  const btnAdvanceKds01 = root.querySelector<HTMLButtonElement>('#btnAdvanceKds01');

  tableSelectorBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tableSelectorBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentRestoTable = btn.dataset.tbl || '01';
    });
  });

  const renderRestoMenu = () => {
    if (!restoMenuGrid) return;
    restoMenuGrid.innerHTML = restoCatalog
      .map(
        (m) => `
        <div class="resto-food-card">
          <div class="food-meta">
            <strong>${m.name}</strong>
            <p>${m.desc}</p>
            <span class="food-price">${formatIDR(m.price)}</span>
          </div>
          <button type="button" class="btn-order-food" data-id="${m.id}">
            + Tambah
          </button>
        </div>
      `
      )
      .join('');

    restoMenuGrid.querySelectorAll<HTMLButtonElement>('.btn-order-food').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = restoCatalog.find((m) => m.id === id);
        if (item) {
          tableCart.push({ menu: item, quantity: 1, extraCost: 0 });
          renderTableCart();
        }
      });
    });
  };

  const calculateTableTotals = () => {
    let subtotal = 0;
    tableCart.forEach((item) => {
      subtotal += (item.menu.price + item.extraCost) * item.quantity;
    });

    const tax = Math.round(subtotal * 0.1);
    const grandTotal = subtotal + tax;

    if (tableGrandTotalEl) tableGrandTotalEl.textContent = formatIDR(grandTotal);

    const perPerson = Math.round(grandTotal / splitPersons);
    if (splitPriceDisplay) {
      splitPriceDisplay.textContent = `${formatIDR(perPerson)} / orang (${splitPersons} Orang)`;
    }
  };

  const renderTableCart = () => {
    if (!tableCartContainer) return;
    if (tableCart.length === 0) {
      tableCartContainer.innerHTML = `<div class="cart-empty-text">Belum ada makanan dipilih di meja ini.</div>`;
    } else {
      tableCartContainer.innerHTML = tableCart
        .map((item, idx) => {
          const lineTotal = (item.menu.price + item.extraCost) * item.quantity;
          return `
          <div class="table-cart-item">
            <div class="item-desc">
              <strong>${item.quantity}x ${item.menu.name}</strong>
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

  splitChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      splitChips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      splitPersons = parseInt(chip.dataset.person || '3', 10);
      calculateTableTotals();
    });
  });

  btnCallWaiter?.addEventListener('click', () => {
    if (waiterAlertToast) {
      waiterAlertToast.innerHTML = `🔔 <strong>Pelayan Meja ${currentRestoTable} Diberitahu!</strong> Waiter sedang menuju ke meja Anda.`;
      waiterAlertToast.classList.remove('is-hidden');
      setTimeout(() => waiterAlertToast.classList.add('is-hidden'), 4000);
    }
  });

  btnRequestBill?.addEventListener('click', () => {
    if (waiterAlertToast) {
      waiterAlertToast.innerHTML = `🧾 <strong>Permintaan Bill Dikirim!</strong> Kasir sedang menyiapkan struk Meja ${currentRestoTable}.`;
      waiterAlertToast.classList.remove('is-hidden');
      setTimeout(() => waiterAlertToast.classList.add('is-hidden'), 4000);
    }
  });

  btnSendKitchen?.addEventListener('click', () => {
    if (tableCart.length === 0) {
      alert('Pilih menu makanan terlebih dahulu sebelum mengirim ke dapur.');
      return;
    }

    if (kdsItemsList01) {
      kdsItemsList01.innerHTML = tableCart
        .map(
          (item) => `
          <div class="kds-food-row">
            <strong class="qty">${item.quantity}x</strong>
            <div class="food-details">
              <span class="food-name">${item.menu.name}</span>
            </div>
          </div>
        `
        )
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

    alert(`✓ Pesanan Meja ${currentRestoTable} Berhasil Terkirim ke Dapur!`);
  });

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

  renderRestoMenu();
  renderTableCart();
}
