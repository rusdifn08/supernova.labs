import { useState } from 'preact/hooks';
import { Button } from '../../ui/atoms/Button';
import { useQuery } from '../../lib/hooks/useQuery';
import { api } from '../../lib/api/client';
import { formatRupiah } from '../../lib/format/currency';
import { getQueryParam, getStorefrontSlug } from '../../lib/storefront';
import { toast } from '../../lib/hooks/useToast';

interface PublicMenuItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
}

interface PublicRestoTableData {
  table_id: string;
  table_number: string;
  section_area: string;
  menu: PublicMenuItem[];
}

export function RestoStorefront() {
  const slug = getStorefrontSlug('demo');
  const qrToken = getQueryParam('table') || 'QR-MEJA-01';

  const [cart, setCart] = useState<{ item: PublicMenuItem; quantity: number }[]>([]);
  const [customerName] = useState('Tamu Meja');
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [callingWaiter, setCallingWaiter] = useState(false);

  const { data: tableData, loading } = useQuery<PublicRestoTableData>(() =>
    api.get<PublicRestoTableData>(`/public/resto/${slug}/table/${qrToken}`)
  );

  const addToCart = (item: PublicMenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast.success(`${item.name} ditambahkan`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
  };

  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  const taxService = subtotal * 0.15; // 10% tax + 5% service
  const grandTotal = subtotal + taxService;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/public/resto/${slug}/order`, {
        qr_token: qrToken,
        customer_name: customerName,
        payment_method: 'qris',
        items: cart.map((c) => ({
          menu_item_id: c.item.id,
          quantity: c.quantity,
        })),
      });
      setOrderSuccess(res);
      setCart([]);
      toast.success('Pesanan berhasil dikirim ke dapur koki!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengirim pesanan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCallWaiter = async () => {
    setCallingWaiter(true);
    try {
      await api.post(`/public/resto/${slug}/call-waiter`, {
        qr_token: qrToken,
        request_type: 'Panggil Pelayan ke Meja',
      });
      toast.success('Panggilan telah dikirim ke pelayan gerai!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal memanggil pelayan');
    } finally {
      setCallingWaiter(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-sans pb-24">
      {/* Table Dine-in Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--line)] py-3 px-4 sm:px-8 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[var(--bright)] text-white font-bold flex items-center justify-center text-xs">
              🍽️
            </span>
            <div>
              <h1 className="text-sm font-bold text-[var(--ink)]">
                Meja {tableData?.table_number || 'Tamu'} ({tableData?.section_area || 'Indoor'})
              </h1>
              <span className="text-[10px] text-[var(--muted-2)] font-mono">{qrToken}</span>
            </div>
          </div>
          <button
            onClick={handleCallWaiter}
            disabled={callingWaiter}
            className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            🔔 Panggil Pelayan
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 mt-2">
        {orderSuccess ? (
          <div className="max-w-md mx-auto bg-[var(--surface)] border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center shadow-md">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-xl font-bold text-[var(--ink)]">Pesanan Diterima Koki!</h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              Koki sedang menyiapkan hidangan segar untuk Meja {orderSuccess.table_number}.
            </p>

            <div className="my-6 p-4 rounded-xl bg-slate-50 border border-[var(--line)] text-left text-xs flex flex-col gap-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-[var(--muted)]">Kode Pesanan:</span>
                <span className="font-mono font-bold text-[var(--bright)]">{orderSuccess.order_code}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-[var(--muted)]">Subtotal:</span>
                <span className="font-semibold">{formatRupiah(orderSuccess.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-[var(--muted)]">PB1 (10%) & Layanan (5%):</span>
                <span className="font-semibold">{formatRupiah(orderSuccess.tax_service)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted)]">Total Tagihan:</span>
                <span className="font-bold text-[var(--bright)]">{formatRupiah(orderSuccess.total_amount)}</span>
              </div>
            </div>

            <Button variant="primary" fullWidth onClick={() => setOrderSuccess(null)}>
              Pesan Menu Tambahan
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Menu Catalog */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <h2 className="text-base font-bold text-[var(--ink)]">Daftar Menu Hidangan</h2>

              {loading ? (
                <div className="py-16 text-center text-xs text-[var(--muted-2)]">Memuat buku menu...</div>
              ) : !tableData?.menu || tableData.menu.length === 0 ? (
                <div className="py-16 text-center text-xs text-[var(--muted-2)]">Menu sedang disiapkan oleh restoran</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tableData.menu.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-4 shadow-xs hover:border-[var(--bright)] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-[var(--bright)] uppercase tracking-wider bg-[var(--blue-light)] px-2 py-0.5 rounded-full inline-block mb-1">
                          {item.category_id}
                        </span>
                        <h3 className="text-sm font-bold text-[var(--ink)] mt-1">{item.name}</h3>
                        <p className="text-xs text-[var(--muted)] line-clamp-2 mt-0.5">{item.description || 'Pilihan lezat dan segar'}</p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-[var(--line)] flex items-center justify-between">
                        <span className="text-sm font-bold text-[var(--bright)]">{formatRupiah(item.price)}</span>
                        <Button variant="primary" size="sm" onClick={() => addToCart(item)}>
                          + Tambah
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Cart Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs sticky top-20 flex flex-col justify-between min-h-[380px]">
                <div>
                  <h3 className="text-base font-bold text-[var(--ink)] mb-1">Pesanan Anda</h3>
                  <p className="text-xs text-[var(--muted)] mb-4">{cart.length} Item dalam Keranjang</p>

                  {cart.length === 0 ? (
                    <div className="py-10 text-center text-xs text-[var(--muted-2)]">Belum ada hidangan dipilih</div>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {cart.map((c) => (
                        <div key={c.item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                          <div className="flex-1 mr-2">
                            <span className="font-bold text-[var(--ink)]">{c.quantity}x </span>
                            <span className="font-semibold">{c.item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{formatRupiah(c.item.price * c.quantity)}</span>
                            <button
                              onClick={() => removeFromCart(c.item.id)}
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

                <div className="mt-4 pt-3 border-t border-[var(--line)]">
                  <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                    <span>Subtotal:</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--muted)] mb-2">
                    <span>PB1 & Layanan (15%):</span>
                    <span>{formatRupiah(taxService)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[var(--ink)] mb-4 pt-2 border-t border-[var(--line)]">
                    <span>Total Pembayaran:</span>
                    <span className="text-[var(--bright)]">{formatRupiah(grandTotal)}</span>
                  </div>
                  <Button
                    variant="primary"
                    fullWidth
                    loading={submitting}
                    disabled={cart.length === 0}
                    onClick={handlePlaceOrder}
                  >
                    Kirim Pesanan ke Dapur
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
