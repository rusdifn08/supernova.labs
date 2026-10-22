export function initPosSimulation(root: HTMLElement) {
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

  interface CartItem {
    product: PosProduct;
    quantity: number;
    notes?: string;
  }

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const initialProducts: PosProduct[] = [
    { id: 'p1', sku: 'SKU-COF-01', name: 'Biji Kopi Signature 250g', category: 'retail', price: 75000, buyPrice: 35000, stock: 48, unit: 'bag' },
    { id: 'p2', sku: 'SKU-BEV-01', name: 'Caramel Macchiato Latte', category: 'beverage', price: 35000, buyPrice: 12000, stock: 92, unit: 'cup' },
    { id: 'p3', sku: 'SKU-FOD-01', name: 'Croissant Butter Almond', category: 'food', price: 28000, buyPrice: 11000, stock: 14, unit: 'pcs' },
    { id: 'p4', sku: 'SKU-BEV-02', name: 'Matcha Oatmilk Iced', category: 'beverage', price: 32000, buyPrice: 10000, stock: 65, unit: 'cup' },
    { id: 'p5', sku: 'SKU-FOD-02', name: 'Truffle Fries Gourmet', category: 'food', price: 36000, buyPrice: 13000, stock: 22, unit: 'portion' },
    { id: 'p6', sku: 'SKU-RET-01', name: 'Tumbler Stainless Supernova', category: 'retail', price: 120000, buyPrice: 65000, stock: 4, unit: 'pcs' },
  ];

  let cart: CartItem[] = [
    { product: initialProducts[1], quantity: 1, notes: 'Normal Sugar' },
    { product: initialProducts[0], quantity: 1, notes: 'Medium Roast' },
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

  const voucherInput = root.querySelector<HTMLInputElement>('#posVoucherInput');
  const btnApplyVoucher = root.querySelector<HTMLButtonElement>('#btnApplyVoucher');
  const voucherFeedback = root.querySelector<HTMLElement>('#voucherFeedback');

  const cashInput = root.querySelector<HTMLInputElement>('#cashReceivedInput');
  const cashChangeDisplay = root.querySelector<HTMLElement>('#cashChangeDisplay');
  const cashChips = root.querySelectorAll<HTMLButtonElement>('.cash-chip');
  const btnCheckout = root.querySelector<HTMLButtonElement>('#btnPosCheckout');

  let activeCategory = 'all';
  let searchQuery = '';

  const calculatePosTotals = () => {
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.product.price * item.quantity;
    });

    const totalDiscount = Math.min(subtotal, appliedVoucherDiscount + useMemberPointsDiscount);
    const taxableAmount = Math.max(0, subtotal - totalDiscount);
    const tax = Math.round(taxableAmount * 0.1);
    const grandTotal = taxableAmount + tax;

    if (elSubtotal) elSubtotal.textContent = formatIDR(subtotal);
    if (elDiscount) elDiscount.textContent = `-${formatIDR(totalDiscount)}`;
    if (elTax) elTax.textContent = formatIDR(tax);
    if (elGrand) elGrand.textContent = formatIDR(grandTotal);

    const cashVal = parseFloat(cashInput?.value || '0');
    const change = Math.max(0, cashVal - grandTotal);
    if (cashChangeDisplay) {
      cashChangeDisplay.textContent = formatIDR(change);
    }
  };

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
    }

    calculatePosTotals();
  };

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

  btnApplyVoucher?.addEventListener('click', () => {
    const code = voucherInput?.value.trim().toUpperCase() || '';
    if (!voucherFeedback) return;
    if (code === 'SUPERNOVA10') {
      appliedVoucherDiscount = 15000;
      voucherFeedback.innerHTML = `<span class="text-success">✓ Voucher SUPERNOVA10 aktif: Diskon Rp 15.000!</span>`;
    } else {
      appliedVoucherDiscount = 0;
      voucherFeedback.innerHTML = `<span class="text-danger">Kode promo tidak valid.</span>`;
    }
    calculatePosTotals();
  });

  cashChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const nominal = chip.dataset.nominal;
      let grandTotal = 0;
      cart.forEach((i) => (grandTotal += i.product.price * i.quantity));
      grandTotal = Math.round((grandTotal - appliedVoucherDiscount) * 1.1);

      if (nominal === 'exact') {
        if (cashInput) cashInput.value = grandTotal.toString();
      } else if (nominal) {
        if (cashInput) cashInput.value = nominal;
      }
      calculatePosTotals();
    });
  });

  cashInput?.addEventListener('input', calculatePosTotals);

  btnCheckout?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Keranjang kasir masih kosong!');
      return;
    }

    let subtotal = 0;
    let cogsTotal = 0;
    cart.forEach((i) => {
      subtotal += i.product.price * i.quantity;
      cogsTotal += i.product.buyPrice * i.quantity;
    });

    const tax = Math.round((subtotal - appliedVoucherDiscount) * 0.1);
    const grandTotal = subtotal - appliedVoucherDiscount + tax;
    const invNumber = `INV/POS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    dayOmset += grandTotal;
    dayHpp += cogsTotal;
    cashSalesTotal += grandTotal;

    const erpOmsetEl = root.querySelector<HTMLElement>('#erpOmset');
    const erpHppEl = root.querySelector<HTMLElement>('#erpHpp');
    const erpProfitEl = root.querySelector<HTMLElement>('#erpProfit');
    if (erpOmsetEl) erpOmsetEl.textContent = formatIDR(dayOmset);
    if (erpHppEl) erpHppEl.textContent = formatIDR(dayHpp);
    if (erpProfitEl) erpProfitEl.textContent = formatIDR(dayOmset - dayHpp);

    alert(`✓ TRANSAKSI SUKSES!\nNo Faktur: ${invNumber}\nTotal: ${formatIDR(grandTotal)}\nStok gudang & jurnal keuangan telah diperbarui.`);
    cart = [];
    renderCart();
  });

  renderProducts();
  renderCart();
}
