import { Clock, ArrowRight, Camera, Users, Package } from 'lucide-preact';
import { BOOKING_TIMES, BOOKING_PACKAGES } from '../constants';
import type { BookingPackage, BookingStudio } from '../types';
import { formatRupiah } from '../../../lib/format/currency';

interface BookingCalendarStepProps {
  studio: BookingStudio;
  slot: string | null;
  pkg: BookingPackage | null;
  onSetSlot: (slot: string) => void;
  onSetPkg: (pkg: BookingPackage) => void;
  onBack: () => void;
  onNext: () => void;
}

export function BookingCalendarStep({
  studio,
  slot,
  pkg,
  onSetSlot,
  onSetPkg,
  onBack,
  onNext,
}: BookingCalendarStepProps) {
  const getIcon = (id: string) => {
    if (id === 'A') return <Camera className="h-4 w-4 text-white" />;
    if (id === 'B') return <Users className="h-4 w-4 text-white" />;
    return <Package className="h-4 w-4 text-white" />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Studio Header & Live Status */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] shadow-md shadow-slate-900/10">
            {getIcon(studio.id)}
          </div>
          <div>
            <p className="text-sm font-bold text-[#0F172A]">{studio.name} — Hari Ini</p>
            <p className="text-xs text-[#64748B]">{studio.type}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          LIVE CALENDAR
        </span>
      </div>

      {/* Time Slot Picker */}
      <div className="mb-7">
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
          Pilih Jam Sesi
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {BOOKING_TIMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onSetSlot(t)}
              className={`sim-time-slot ${slot === t ? 'is-selected' : ''}`}
            >
              <Clock className="mb-1 h-4 w-4" />
              <span>{t} WIB</span>
            </button>
          ))}
        </div>
      </div>

      {/* Package Picker */}
      <div className="mb-7">
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-[#0F172A]">
          Pilih Paket Tambahan
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          {BOOKING_PACKAGES.map((p) => {
            const isSelected = pkg?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSetPkg(p)}
                className={`sim-package-card ${isSelected ? 'is-selected' : ''}`}
              >
                <div>
                  <span className="block text-sm font-bold">{p.name}</span>
                  <span className="sim-package-dur block text-xs text-[#64748B] mt-1">{p.dur}</span>
                </div>
                <span className="sim-package-price mt-3 block text-xs font-extrabold text-[#0891b2]">
                  {p.add === 0 ? 'Termasuk Sesi' : `+ ${formatRupiah(p.add)}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-slate-200/80 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="sim-btn-secondary"
        >
          ← Ganti Studio
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!slot || !pkg}
          className="sim-btn-primary"
        >
          <span>Lanjut ke Pembayaran</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
