import { Minus, Plus, ShoppingCart } from 'lucide-preact';
import { QR_MENU } from '../constants';
import { formatRupiah } from '../../../lib/format/currency';

interface QrMenuScreenProps {
  cart: Record<string, number>;
  totalQty: number;
  cartTotal: number;
  onAddItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onPlaceOrder: () => void;
}

export function QrMenuScreen({
  cart,
  totalQty,
  cartTotal,
  onAddItem,
  onRemoveItem,
  onPlaceOrder,
}: QrMenuScreenProps) {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <h5 className="text-xs font-bold text-[#0F172A]">Menu Meja 04</h5>
          <p className="text-[10px] text-[#64748B]">Pilih hidangan favorit</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
          ORDER ONLINE
        </span>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[220px] pr-1">
        {QR_MENU.map((item) => {
          const qty = cart[item.id] ?? 0;
          return (
            <div key={item.id} className="sim-menu-item">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-[#0F172A] leading-tight">{item.name}</p>
                  <p className="text-[11px] font-bold text-[#0891b2] mt-0.5">
                    {formatRupiah(item.price)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {qty > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="sim-qty-btn"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold font-mono text-[#0F172A]">
                      {qty}
                    </span>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => onAddItem(item.id)}
                  className="sim-qty-btn bg-[#0F172A] text-white hover:bg-[#2563EB]"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Order Button */}
      <div className="mt-4 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={totalQty === 0}
          className="sim-btn-pay w-full"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>
            {totalQty === 0 ? 'Pilih Menu Dulu' : `Kirim Pesanan (${formatRupiah(cartTotal)})`}
          </span>
        </button>
      </div>
    </div>
  );
}
