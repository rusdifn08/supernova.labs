import { CheckCircle2, RotateCcw } from 'lucide-preact';
import type { OrderStatus } from '../types';
import { formatRupiah } from '../../../lib/format/currency';

interface PlacedOrder {
  items: { name: string; emoji: string; price: number; qty: number }[];
  total: number;
}

interface QrStatusScreenProps {
  order: PlacedOrder;
  status: OrderStatus;
  onReset: () => void;
}

const STATUS_PROGRESS: Record<OrderStatus, number> = {
  new: 25,
  accepted: 50,
  cooking: 75,
  ready: 100,
};

const STATUS_LABELS: Record<OrderStatus, { title: string; desc: string }> = {
  new: { title: 'Pesanan Diterima', desc: 'Sistem KDS dapur menerima pesanan' },
  accepted: { title: 'Pesanan Dikonfirmasi', desc: 'Koki mempersiapkan bahan' },
  cooking: { title: 'Sedang Dimasak', desc: 'Dapur sedang memasak pesanan Anda' },
  ready: { title: 'Siap Diantar!', desc: 'Pelayan sedang mengantar ke Meja 04' },
};

export function QrStatusScreen({ order, status, onReset }: QrStatusScreenProps) {
  const progress = STATUS_PROGRESS[status];
  const { title, desc } = STATUS_LABELS[status];

  return (
    <div className="flex flex-col h-full p-4">
      <div className="text-center pb-3 border-b border-slate-100">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h5 className="text-sm font-extrabold text-[#0F172A]">{title}</h5>
        <p className="text-[11px] text-[#64748B] mt-0.5">{desc}</p>
      </div>

      {/* Progress Bar */}
      <div className="my-4">
        <div className="flex justify-between text-[10px] font-bold text-[#64748B] mb-1.5">
          <span>STATUS PESANAN</span>
          <span className="text-[#0891b2]">{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Summary Box */}
      <div className="rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100 mb-3 space-y-1">
        {order.items.map((it) => (
          <div key={it.name} className="flex justify-between text-[11px]">
            <span className="text-slate-600">
              {it.emoji} {it.name} ×{it.qty}
            </span>
            <span className="font-bold text-[#0F172A]">
              {formatRupiah(it.price * it.qty)}
            </span>
          </div>
        ))}
        <div className="border-t border-slate-200 pt-1 flex justify-between font-bold text-xs text-[#0F172A]">
          <span>Total Meja 04:</span>
          <span>{formatRupiah(order.total)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="sim-btn-secondary w-full justify-center mt-auto border border-slate-200 bg-white"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Ulangi Simulasi QR</span>
      </button>
    </div>
  );
}
