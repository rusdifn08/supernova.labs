import { Clock, ChefHat, Check, ReceiptText } from 'lucide-preact';
import type { OrderStatus } from '../types';
import { formatRupiah } from '../../../lib/format/currency';

interface PlacedOrder {
  items: { name: string; emoji: string; price: number; qty: number }[];
  total: number;
}

interface QrDisplayScreensProps {
  order: PlacedOrder | null;
  status: OrderStatus;
  cashierAck: boolean;
  onAdvanceKds: () => void;
  onAckCashier: () => void;
}

export function QrDisplayScreens({
  order,
  status,
  cashierAck,
  onAdvanceKds,
  onAckCashier,
}: QrDisplayScreensProps) {
  return (
    <div className="sim-displays-col">
      {/* 1. Kitchen Display System (KDS) */}
      <div className="sim-kds-panel">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0F172A] text-white">
              <ChefHat className="h-4 w-4 text-[#06B6D4]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Kitchen Display System (KDS)</h4>
              <p className="text-[11px] text-[#64748B]">Layar Sentuh Dapur Real-Time</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            LIVE KDS
          </span>
        </div>

        {order ? (
          <div className="sim-kds-ticket animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-xs text-[#0F172A]">MEJA 04 (DINE-IN)</span>
              <span className="flex items-center gap-1 font-mono text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Clock className="h-3 w-3" /> 04:32 m
              </span>
            </div>
            <div className="space-y-1 my-2">
              {order.items.map((it) => (
                <div key={it.name} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0F172A]">
                    {it.qty}x {it.name}
                  </span>
                  <span className="text-[10px] text-slate-400">Siap olah</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#64748B]">
                Status Koki: <strong className="text-[#0F172A] capitalize">{status}</strong>
              </span>
              <button
                type="button"
                onClick={onAdvanceKds}
                className="sim-btn-primary !py-1.5 !px-3 !text-xs !rounded-lg"
              >
                <span>Ubah Status Dapur →</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#64748B]">
            Dapur standby — menunggu tamu Meja 04 mengirim pesanan.
          </div>
        )}
      </div>

      {/* 2. Cashier Monitor */}
      <div className="sim-cashier-panel">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0F172A] text-white">
              <ReceiptText className="h-4 w-4 text-[#2563EB]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Kasir &amp; POS Monitor</h4>
              <p className="text-[11px] text-[#64748B]">Monitoring Status Billing Otomatis</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
            KASIR ACTIVE
          </span>
        </div>

        {order ? (
          <div className="rounded-xl bg-slate-50 p-3 mt-3 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Meja 04: {formatRupiah(order.total)}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">● Terbayar via QRIS</p>
            </div>
            <button
              type="button"
              onClick={onAckCashier}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                cashierAck
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#0F172A] text-white hover:bg-[#2563EB]'
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              <span>{cashierAck ? 'Tervalidasi' : 'Validasi Kasir'}</span>
            </button>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#64748B]">
            Kasir standby — tagihan meja terhubung otomatis saat pesanan masuk.
          </div>
        )}
      </div>
    </div>
  );
}
