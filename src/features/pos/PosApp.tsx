import { useState } from 'preact/hooks';
import { AuthGate } from '../auth/AuthGate';
import { useSession } from '../auth/session';
import { AppShell } from '../../ui/organisms/AppShell';
import { StatCard } from '../../ui/molecules/StatCard';
import { PageHeader } from '../../ui/molecules/PageHeader';
import { Button } from '../../ui/atoms/Button';
import { Badge } from '../../ui/atoms/Badge';
import { useQuery } from '../../lib/hooks/useQuery';
import { api } from '../../lib/api/client';
import { formatRupiah } from '../../lib/format/currency';
import { toast } from '../../lib/hooks/useToast';
import type { CustomerItem, PosOrderItem, ProductItem } from '../../lib/api/types';

export function PosApp() {
  return (
    <AuthGate
      product="pos"
      productTitle="POS Cashier, ERP & Keuangan Multi-Outlet"
      tagline="Kelola kasir omnichannel, penyesuaian stok otomatis (FIFO), CRM loyalty, dan pembukuan jurnal instan."
    >
      <PosDashboard />
    </AuthGate>
  );
}

function PosDashboard() {
  const { tenant, logout } = useSession();
  const [activeTab, setActiveTab] = useState<'cashier' | 'products' | 'customers' | 'finance'>('cashier');

  // Products Query
  const { data: products, loading: prodLoading, refetch: refetchProducts } = useQuery<ProductItem[]>(() =>
    api.get<ProductItem[]>('/pos/products')
  );

  // Orders Query
  const { data: orders, refetch: refetchOrders } = useQuery<PosOrderItem[]>(() =>
    api.get<PosOrderItem[]>('/pos/orders')
  );

  // Customers Query
  const { data: customers } = useQuery<CustomerItem[]>(() =>
    api.get<CustomerItem[]>('/crm/customers')
  );

  // Cart State for Cashier
  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);

  const addToCart = (product: ProductItem) => {
    if (product.stock_quantity <= 0) {
      toast.error('Stok produk habis!');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          toast.warning('Jumlah melebihi stok yang tersedia');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.sell_price * item.quantity, 0);
  const cartTax = cartSubtotal * 0.11;
  const cartTotal = cartSubtotal + cartTax;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);
    try {
      await api.post('/pos/orders', {
        items: cart.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        payment_method: 'qris',
      });
      toast.success('Transaksi kasir berhasil dicatat!');
      setCart([]);
      refetchProducts();
      refetchOrders();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Transaksi gagal');
    } finally {
      setCheckingOut(false);
    }
  };

  const navItems = [
    {
      id: 'cashier',
      label: 'Mesin Kasir POS',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      badge: cart.length > 0 ? cart.length : undefined,
    },
    {
      id: 'products',
      label: 'Katalog & Stok',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 'customers',
      label: 'CRM Pelanggan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <AppShell
      product="pos"
      productName="POS & ERP"
      businessName={tenant?.name || 'Supernova POS'}
      tenantCode={tenant?.code || '#SNV-POS'}
      city={tenant?.city || 'Jakarta'}
      slug={tenant?.slug || 'demo'}
      daysRemaining={tenant?.days_remaining || 30}
      navItems={navItems}
      activeNav={activeTab}
      onNavChange={(id) => setActiveTab(id as any)}
      onLogout={logout}
    >
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          variant="hero"
          title="Omzet Kasir Hari Ini"
          value={formatRupiah(orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0)}
          subtitle="Penjualan selesai diproses"
        />
        <StatCard
          title="Total Produk Aktif"
          value={`${products?.length || 0} SKU`}
          subtitle="Tersedia di inventaris"
          trendTone="neutral"
        />
        <StatCard
          title="Pelanggan Terdaftar"
          value={`${customers?.length || 0} Kontak`}
          subtitle="Basis data CRM"
          trend="+8%"
          trendTone="up"
        />
        <StatCard
          title="Pajak PPN (11%)"
          value={formatRupiah((orders?.reduce((sum, o) => sum + o.tax_amount, 0)) || 0)}
          subtitle="Kewajiban pajak tercatat"
          trendTone="neutral"
        />
      </div>

      {activeTab === 'cashier' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Products Grid */}
          <div className="lg:col-span-8">
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
              <PageHeader title="Pilih Produk Kasir" description="Klik produk untuk memasukkan ke struk transaksi" />
              {prodLoading ? (
                <div className="py-12 text-center text-xs text-[var(--muted-2)]">Memuat katalog...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {products?.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--bright)] hover:bg-[var(--blue-light)] transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono text-[var(--muted-2)]">{p.sku}</span>
                        <h4 className="text-xs font-bold text-[var(--ink)] line-clamp-2 mt-0.5">{p.name}</h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[var(--line)] flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--bright)]">{formatRupiah(p.sell_price)}</span>
                        <span className="text-[10px] text-[var(--muted)]">Stok: {p.stock_quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart & Checkout Shelf */}
          <div className="lg:col-span-4">
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs sticky top-20 flex flex-col justify-between min-h-[420px]">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)] mb-1">Struk Kasir Saat Ini</h3>
                <p className="text-xs text-[var(--muted)] mb-4">{cart.length} Jenis Item Terpilih</p>

                {cart.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[var(--muted-2)]">Keranjang kasir masih kosong</div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                        <div className="flex-1 mr-2">
                          <div className="font-semibold text-[var(--ink)] truncate">{item.product.name}</div>
                          <div className="text-[11px] text-[var(--muted-2)]">
                            {item.quantity} x {formatRupiah(item.product.sell_price)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{formatRupiah(item.product.sell_price * item.quantity)}</span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total & Checkout */}
              <div className="mt-4 pt-3 border-t border-[var(--line)]">
                <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-[var(--muted)] mb-2">
                  <span>PPN 11%:</span>
                  <span>{formatRupiah(cartTax)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[var(--ink)] mb-4 pt-2 border-t border-[var(--line)]">
                  <span>Total Bayar:</span>
                  <span className="text-[var(--bright)]">{formatRupiah(cartTotal)}</span>
                </div>
                <Button variant="primary" fullWidth loading={checkingOut} disabled={cart.length === 0} onClick={handleCheckout}>
                  Proses Pembayaran (QRIS / Cash)
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'products' ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
          <PageHeader title="Inventaris Produk & Stok Gudang" description="Daftar produk, SKU, dan kuantitas stok" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--muted)] font-semibold">
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">NAMA PRODUK</th>
                  <th className="py-3 px-3">HARGA BELI</th>
                  <th className="py-3 px-3">HARGA JUAL</th>
                  <th className="py-3 px-3">STOK</th>
                  <th className="py-3 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {products?.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-medium text-slate-500">{p.sku}</td>
                    <td className="py-3 px-3 font-semibold text-[var(--ink)]">{p.name}</td>
                    <td className="py-3 px-3 text-[var(--muted)]">{formatRupiah(p.buy_price)}</td>
                    <td className="py-3 px-3 font-bold text-[var(--bright)]">{formatRupiah(p.sell_price)}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{p.stock_quantity} {p.unit}</td>
                    <td className="py-3 px-3">
                      <Badge tone={p.stock_quantity > p.min_stock_alert ? 'success' : 'danger'}>
                        {p.stock_quantity > p.min_stock_alert ? 'AMAN' : 'MENIPIS'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
          <PageHeader title="Database CRM Pelanggan" description="Daftar pelanggan, loyalty points, dan total belanja" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--line)] text-[var(--muted)] font-semibold">
                  <th className="py-3 px-3">NAMA PELANGGAN</th>
                  <th className="py-3 px-3">WHATSAPP / TELEPON</th>
                  <th className="py-3 px-3">TIER</th>
                  <th className="py-3 px-3">POIN LOYALITAS</th>
                  <th className="py-3 px-3">TOTAL BELANJA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {customers?.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-[var(--ink)]">{c.name}</td>
                    <td className="py-3 px-3 font-mono text-[var(--muted)]">{c.phone}</td>
                    <td className="py-3 px-3">
                      <Badge tone={c.tier.toLowerCase() === 'gold' ? 'warning' : 'info'}>{c.tier}</Badge>
                    </td>
                    <td className="py-3 px-3 font-bold text-[var(--bright)]">{c.loyalty_points} Pts</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{formatRupiah(c.total_spent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
