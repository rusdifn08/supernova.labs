import { Camera, Users, Package } from 'lucide-preact';
import { BOOKING_STUDIOS } from '../constants';
import type { BookingStudio } from '../types';
import { formatRupiah } from '../../../lib/format/currency';

interface BookingStudioStepProps {
  onSelectStudio: (studio: BookingStudio) => void;
}

export function BookingStudioStep({ onSelectStudio }: BookingStudioStepProps) {
  const getIcon = (id: string) => {
    if (id === 'A') return <Camera className="h-6 w-6 text-white" />;
    if (id === 'B') return <Users className="h-6 w-6 text-white" />;
    return <Package className="h-6 w-6 text-white" />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <p className="mb-6 text-center text-sm font-bold text-[#0F172A]">
        Langkah 1 — Pilih Studio yang Anda Inginkan
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {BOOKING_STUDIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectStudio(s)}
            className="sim-studio-card group"
          >
            <div className="sim-studio-icon-box">
              {getIcon(s.id)}
            </div>
            <div>
              <span className="block font-bold text-base text-[#0F172A]">{s.name}</span>
              <span className="block text-xs text-[#64748B] mt-0.5">{s.type}</span>
            </div>
            <span className="sim-price-badge">
              Mulai {formatRupiah(s.from)}
            </span>
            <span className="text-[11px] font-bold text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
              Pilih Studio →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
