import { useState } from 'preact/hooks';
import { CreditCard, QrCode, Wallet, Loader2, ShieldCheck, X } from 'lucide-preact';
import type { BookingPackage, BookingStudio } from '../types';
import { formatRupiah } from '../../../lib/format/currency';

interface BookingCheckoutModalProps {
  studio: BookingStudio;
  slot: string;
  pkg: BookingPackage;
  total: number;
  paying: boolean;
  onPay: () => void;
  onCancel: () => void;
}

export function BookingCheckoutModal({
  studio,
  slot,
  pkg,
  total,
  paying,
  onPay,
  onCancel,
}: BookingCheckoutModalProps) {
  const [method, setMethod] = useState(0);

  const methods = [
    { label: 'QRIS Instant', icon: QrCode, fee: 'Bebas Admin' },
    { label: 'Virtual Account', icon: CreditCard, fee: 'BCA / Mandiri' },
    { label: 'Kartu Kredit', icon: CreditCard, fee: 'Visa / MC' },
    { label: 'E-Wallet', icon: Wallet, fee: 'GoPay / OVO' },
  ];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300">
      <div className="sim-checkout-modal">
        {/* Header */}
        <div className="sim-checkout-header">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure Checkout</span>
            </div>
            <h3 className="mt-1 text-lg font-extrabold text-[#0F172A]">Konfirmasi &amp; Pembayaran</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Order Breakdown */}
        <div className="sim-summary-box">
          <div className="sim-summary-row">
            <span>Studio Dipilih</span>
            <span>{studio.name} ({studio.type})</span>
          </div>
          <div className="sim-summary-row">
            <span>Jadwal Sesi</span>
            <span>{slot} WIB</span>
          </div>
          <div className="sim-summary-row">
            <span>Paket</span>
            <span>{pkg.name} ({pkg.dur})</span>
          </div>
          <div className="sim-summary-row sim-summary-total">
            <span>Total Pembayaran</span>
            <span className="text-[#0F172A]">{formatRupiah(total)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-bold text-[#0F172A]">
            Pilih Kanal Pembayaran
          </label>
          <div className="sim-pay-method-grid">
            {methods.map((m, idx) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setMethod(idx)}
                  className={`sim-pay-method-btn ${method === idx ? 'is-active' : ''}`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <div className="text-left">
                    <span className="block">{m.label}</span>
                    <span className="block text-[10px] text-slate-400 font-normal">{m.fee}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Pay */}
        <button
          type="button"
          onClick={onPay}
          disabled={paying}
          className="sim-btn-pay"
        >
          {paying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memproses Pembayaran...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              <span>Bayar {formatRupiah(total)} &amp; Sinkronisasi</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
