import { useState } from 'preact/hooks';
import {
  Camera,
  Check,
  Clock,
  CreditCard,
  Globe,
  Loader2,
  Monitor,
  Package,
  QrCode,
  Smartphone,
  Users,
  Wallet,
  ArrowRight,
} from 'lucide-preact';
import {
  BOOKING_STUDIOS,
  BOOKING_TIMES,
  BOOKING_PACKAGES,
  BOOKING_STEP_LABELS,
} from './constants';
import type { BookingPackage, BookingStudio } from './types';
import { formatRupiah } from '../../lib/format/currency';

export function BookingSim() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [studio, setStudio] = useState<BookingStudio | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [pkg, setPkg] = useState<BookingPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [paying, setPaying] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const total = (studio?.from ?? 0) + (pkg?.add ?? 0);

  const selectStudio = (s: BookingStudio) => {
    setStudio(s);
    setSlot('14:00');
    setPkg(BOOKING_PACKAGES[0]);
    setStep(1);
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setStep(3);
      setToastMsg(
        `Pembayaran berhasil! Booking ${studio?.name} ${slot} tersinkron ke Customer & Admin di 3 platform.`
      );
      setTimeout(() => setToastMsg(null), 4500);
    }, 1200);
  };

  const handleReset = () => {
    setStep(0);
    setStudio(null);
    setSlot(null);
    setPkg(null);
  };

  const getStudioIcon = (id: string) => {
    if (id === 'A') return <Camera className="h-6 w-6 text-white" />;
    if (id === 'B') return <Users className="h-6 w-6 text-white" />;
    return <Package className="h-6 w-6 text-white" />;
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-6 sm:p-8 shadow-glass backdrop-blur-2xl">
      {/* Stepper Header */}
      <div className="mb-8 flex items-center justify-between">
        {BOOKING_STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  step === i
                    ? 'scale-110 bg-navy text-white ring-4 ring-navy/10'
                    : step > i
                    ? 'bg-navy text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > i ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`hidden text-[10px] font-semibold sm:block ${
                  step >= i ? 'text-navy' : 'text-slate-soft'
                }`}
              >
                {label}
              </span>
            </div>
            {i < BOOKING_STEP_LABELS.length - 1 && (
              <div className="relative mx-2 h-0.5 flex-1 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-electric-cyan transition-all duration-400"
                  style={{ width: step > i ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* STEP 0: Pilih Studio */}
      {step === 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="mb-4 text-center text-sm font-semibold text-navy">
            Langkah 1 — Pilih studio yang Anda inginkan
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {BOOKING_STUDIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => selectStudio(s)}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-navy/10 bg-white/90 p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-electric-cyan hover:shadow-glow-cyan cursor-pointer"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy transition-transform group-hover:scale-110">
                  {getStudioIcon(s.id)}
                </span>
                <span>
                  <span className="block font-bold text-base text-navy">{s.name}</span>
                  <span className="block text-xs text-slate-soft">{s.type}</span>
                </span>
                <span className="text-xs font-semibold text-electric-cyan">
                  Mulai {formatRupiah(s.from)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: Live Calendar + Jam + Paket */}
      {step === 1 && studio && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="mb-5 flex items-center justify-between border-b border-navy/5 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy">
                {getStudioIcon(studio.id)}
              </span>
              <div>
                <p className="text-sm font-bold text-navy">{studio.name} — Hari Ini</p>
                <p className="text-[11px] text-slate-soft">{studio.type}</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              LIVE CALENDAR
            </span>
          </div>

          <p className="mb-2 text-xs font-semibold text-navy">Pilih jam</p>
          <div className="mb-5 grid grid-cols-4 gap-2">
            {BOOKING_TIMES.map((t) => (
              <button
                key={t}
                onClick={() => setSlot(t)}
                className={`flex h-14 flex-col items-center justify-center rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  slot === t
                    ? 'border-electric-cyan bg-electric-cyan text-white shadow-glow-cyan'
                    : 'border-navy/10 bg-white/90 text-navy hover:border-electric-cyan'
                }`}
              >
                <Clock className="mb-0.5 h-3.5 w-3.5" />
                {t}
              </button>
            ))}
          </div>

          <p className="mb-2 text-xs font-semibold text-navy">Pilih paket harga</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {BOOKING_PACKAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPkg(p)}
                className={`rounded-2xl border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                  pkg?.id === p.id
                    ? 'border-navy bg-navy text-white shadow-lg'
                    : 'border-navy/10 bg-white/90 text-navy hover:border-navy/30'
                }`}
              >
                <span className="block font-bold text-sm">{p.name}</span>
                <span
                  className={`block text-[11px] ${
                    pkg?.id === p.id ? 'text-white/70' : 'text-slate-soft'
                  }`}
                >
                  {p.dur}
                </span>
                <span className="mt-1 block text-xs font-bold text-electric-cyan">
                  {p.add === 0 ? 'Termasuk' : `+ ${formatRupiah(p.add)}`}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-navy/5 pt-4">
            <button
              onClick={() => setStep(0)}
              className="text-xs font-semibold text-slate-soft transition hover:text-navy cursor-pointer"
            >
              ← Ganti studio
            </button>
            <button
              onClick={() => slot && pkg && setStep(2)}
              disabled={!slot || !pkg}
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-navy/90 hover:shadow-lg disabled:opacity-40 cursor-pointer"
            >
              Lanjut ke Pembayaran
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Pembayaran */}
      {step === 2 && studio && slot && pkg && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg mx-auto bg-white rounded-2xl border border-navy/10 p-6 shadow-xl">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-vivid-purple">
                SECURE CHECKOUT
              </p>
              <p className="mt-1 text-lg font-bold text-navy">Konfirmasi &amp; pembayaran</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
              ● AMAN
            </span>
          </div>

          <div className="mb-4 space-y-2 rounded-2xl border border-navy/5 bg-slate-50 p-4 text-sm">
            {[
              ['Studio', `${studio.name} · ${studio.type}`],
              ['Jam', `${slot} WIB`],
              ['Paket', `${pkg.name} (${pkg.dur})`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-soft">{k}</span>
                <span className="font-semibold text-navy">{v}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-navy/5 pt-2">
              <span className="font-semibold text-navy">Total</span>
              <span className="text-lg font-bold text-navy">{formatRupiah(total)}</span>
            </div>
          </div>

          <p className="mb-2 text-xs font-semibold text-navy">Metode pembayaran</p>
          <div className="mb-5 grid grid-cols-3 gap-2">
            {[
              { label: 'QRIS', icon: <QrCode className="h-5 w-5" /> },
              { label: 'Kartu', icon: <CreditCard className="h-5 w-5" /> },
              { label: 'E-Wallet', icon: <Wallet className="h-5 w-5" /> },
            ].map((mt, i) => (
              <button
                key={mt.label}
                type="button"
                onClick={() => setPaymentMethod(i)}
                className={`relative flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition cursor-pointer ${
                  paymentMethod === i
                    ? 'border-electric-cyan bg-electric-cyan/10 shadow-md'
                    : 'border-navy/10 bg-white hover:border-electric-cyan/40'
                }`}
              >
                {paymentMethod === i && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-electric-cyan" />
                )}
                <span className={paymentMethod === i ? 'text-electric-cyan' : 'text-slate-soft'}>
                  {mt.icon}
                </span>
                <span className="text-[11px] font-semibold text-navy">{mt.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-soft transition hover:text-navy cursor-pointer"
            >
              ← Kembali
            </button>
            <button
              onClick={handlePay}
              disabled={paying}
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-navy/90 hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {paying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Bayar {formatRupiah(total)}
                  <CreditCard className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Sinkronisasi 3 Platform */}
      {step === 3 && studio && slot && pkg && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-electric-cyan shadow-glow-cyan text-white">
              <Check className="h-7 w-7" />
            </span>
            <p className="text-xl font-bold text-navy">Booking Terkonfirmasi &amp; Tersinkron!</p>
            <p className="text-xs text-slate-soft mt-1">
              Data langsung muncul di sisi Customer &amp; Admin — real-time di 3 platform
            </p>
          </div>

          <div className="mb-6 flex items-center justify-center gap-3">
            {[
              { icon: <Smartphone className="h-6 w-6 text-electric-cyan" />, label: 'Mobile' },
              { icon: <Monitor className="h-6 w-6 text-electric-cyan" />, label: 'Desktop' },
              { icon: <Globe className="h-6 w-6 text-electric-cyan" />, label: 'Web' },
            ].map((d) => (
              <div
                key={d.label}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-electric-cyan/50 bg-electric-cyan/10 px-4 py-3 shadow-glow-cyan"
              >
                {d.icon}
                <span className="text-[10px] font-bold uppercase text-navy">{d.label}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-navy/5 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-electric-cyan" />
                <span className="text-xs font-bold text-navy">Aplikasi Customer</span>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-[11px] font-bold text-emerald-800">✓ Booking Berhasil</p>
                <p className="mt-1 text-xs text-navy font-semibold">
                  {studio.name} · {slot} WIB · {pkg.name}
                </p>
                <p className="text-[10px] text-slate-soft mt-0.5">E-ticket &amp; barcode dikirim</p>
              </div>
            </div>

            <div className="rounded-2xl border border-navy/5 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-navy" />
                <span className="text-xs font-bold text-navy">Dashboard Admin</span>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                    Booking Baru
                  </span>
                  <span className="text-[10px] font-bold text-slate-soft">
                    {formatRupiah(total)}
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-semibold text-navy">
                  {studio.name} · {slot} WIB
                </p>
                <p className="text-[10px] text-slate-soft mt-0.5">
                  Slot otomatis terkunci — anti double-booking
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-electric-cyan transition hover:text-navy cursor-pointer"
            >
              ↻ Coba simulasi lagi
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-24 right-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-electric-cyan/30 bg-white/95 p-4 shadow-xl backdrop-blur-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-electric-cyan text-white">
            <Check className="h-4 w-4" />
          </div>
          <p className="text-xs font-medium leading-snug text-navy">{toastMsg}</p>
        </div>
      )}
    </div>
  );
}
