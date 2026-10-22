import { Camera, Users, Package, ArrowRight, Sparkles } from 'lucide-preact';
import { BOOKING_STUDIOS } from '../constants';
import type { BookingStudio } from '../types';
import { formatRupiah } from '../../../lib/format/currency';

interface BookingStudioStepProps {
  onSelectStudio: (studio: BookingStudio) => void;
}

const STUDIO_METADATA: Record<string, { tags: string[]; desc: string }> = {
  A: {
    tags: ['Maks 4 Orang', 'Full Lighting', 'Latar Seamless'],
    desc: 'Ruang privat dengan remote shutter otomatis untuk photoshoot santai.',
  },
  B: {
    tags: ['Maks 10 Orang', '3 Pilihan Backdrop', 'Sofa & Properti'],
    desc: 'Studio luas untuk foto keluarga, grup kantor, dan wisuda.',
  },
  C: {
    tags: ['Komersial B2B', 'High-End Gear', 'Table Top & Model'],
    desc: 'Spesialisasi foto katalog produk, fashion lookbook, dan kuliner.',
  },
};

export function BookingStudioStep({ onSelectStudio }: BookingStudioStepProps) {
  const getIcon = (id: string) => {
    if (id === 'A') return <Camera className="h-7 w-7 text-white" />;
    if (id === 'B') return <Users className="h-7 w-7 text-white" />;
    return <Package className="h-7 w-7 text-white" />;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#DBEAFE] mb-2">
          <Sparkles className="h-3 w-3" />
          Langkah 1 dari 4
        </span>
        <h4 className="text-lg sm:text-xl font-extrabold text-[#0F172A]">
          Pilih Studio &amp; Konsep yang Anda Butuhkan
        </h4>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          Klik salah satu studio untuk mengecek ketersediaan live calendar real-time.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {BOOKING_STUDIOS.map((s) => {
          const meta = STUDIO_METADATA[s.id] ?? { tags: [], desc: '' };
          return (
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
                <span className="block font-extrabold text-lg text-[#0F172A]">{s.name}</span>
                <span className="block text-xs font-semibold text-[#64748B] mt-0.5">{s.type}</span>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 px-1">
                {meta.desc}
              </p>

              <div className="sim-studio-badge-row">
                {meta.tags.map((tag) => (
                  <span key={tag} className="sim-studio-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-2">
                <span className="sim-price-badge">
                  Mulai {formatRupiah(s.from)}
                </span>
              </div>

              <div className="sim-studio-btn-action">
                <span>Pilih Studio Ini</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
