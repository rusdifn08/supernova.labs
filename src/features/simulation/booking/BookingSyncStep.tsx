import { Smartphone, Monitor, Globe, CheckCircle2, RotateCcw } from 'lucide-preact';
import type { BookingStudio } from '../types';

interface BookingSyncStepProps {
  studio: BookingStudio;
  slot: string;
  onReset: () => void;
}

export function BookingSyncStep({ studio, slot, onReset }: BookingSyncStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Success Notification Banner */}
      <div className="sim-sync-banner">
        <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
        <div>
          <p className="font-extrabold text-sm text-emerald-950">
            Booking &amp; Pembayaran Berhasil!
          </p>
          <p className="text-xs text-emerald-800 mt-0.5">
            Sesi {studio.name} ({slot} WIB) langsung tersinkronisasi ke 3 platform operasional bisnis Anda.
          </p>
        </div>
      </div>

      {/* 3 Platforms Grid */}
      <div className="sim-sync-grid">
        {/* Platform 1: Customer Mobile App */}
        <div className="sim-sync-card">
          <div className="sim-sync-card-header">
            <div className="sim-sync-card-icon">
              <Smartphone className="h-5 w-5 text-[#06B6D4]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Customer Mobile App</p>
              <p className="text-[10px] text-[#64748B]">Push Notifikasi &amp; Tiket</p>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100 flex flex-col gap-1">
            <span className="font-mono text-[10px] text-slate-400">KODE TIKET: SNV-9082</span>
            <span className="font-bold text-[#0F172A]">{studio.name} · {slot} WIB</span>
            <span className="text-[11px] text-slate-500">QR Check-in otomatis terbit di HP pelanggan.</span>
          </div>
          <span className="sim-sync-badge">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            TIKET AKTIF
          </span>
        </div>

        {/* Platform 2: Desktop POS Kasir */}
        <div className="sim-sync-card">
          <div className="sim-sync-card-header">
            <div className="sim-sync-card-icon">
              <Monitor className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Desktop POS Kasir</p>
              <p className="text-[10px] text-[#64748B]">Terminal Kasir Di Tempat</p>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100 flex flex-col gap-1">
            <span className="font-mono text-[10px] text-slate-400">SLOT {slot} WIB:</span>
            <span className="font-bold text-rose-600">LOCKED (ANTI DOUBLE-BOOKING)</span>
            <span className="text-[11px] text-slate-500">Kasir melihat slot terkunci tanpa delay.</span>
          </div>
          <span className="sim-sync-badge">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            SLOT TERKUNCI
          </span>
        </div>

        {/* Platform 3: Cloud Web Admin */}
        <div className="sim-sync-card">
          <div className="sim-sync-card-header">
            <div className="sim-sync-card-icon">
              <Globe className="h-5 w-5 text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Cloud Web Admin</p>
              <p className="text-[10px] text-[#64748B]">Owner &amp; Finance Report</p>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100 flex flex-col gap-1">
            <span className="font-mono text-[10px] text-slate-400">LEDGER OMSET:</span>
            <span className="font-bold text-emerald-600">+ PENDAPATAN TERCATAT</span>
            <span className="text-[11px] text-slate-500">Jurnal akuntansi &amp; laporan harian otomatis update.</span>
          </div>
          <span className="sim-sync-badge">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            TERCATAT DI CLOUD
          </span>
        </div>
      </div>

      {/* Reset CTA */}
      <div className="text-center">
        <button
          type="button"
          onClick={onReset}
          className="sim-btn-primary"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Coba Simulasi Skenario Lain</span>
        </button>
      </div>
    </div>
  );
}
