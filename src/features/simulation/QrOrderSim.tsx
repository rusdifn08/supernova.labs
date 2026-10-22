import { useState } from 'preact/hooks';
import {
  Camera,
  Check,
  Clock,
  Minus,
  Plus,
  QrCode,
  RefreshCw,
  ScanLine,
  ShoppingCart,
} from 'lucide-preact';
import { QR_MENU, QR_PHONE_STEPS } from './constants';
import type { OrderStatus, QrPhase } from './types';
import { formatRupiah } from '../../lib/format/currency';

interface PlacedOrder {
  items: { name: string; emoji: string; price: number; qty: number }[];
  total: number;
}

const STATUS_STEP: Record<OrderStatus, number> = {
  new: 0,
  accepted: 1,
  cooking: 2,
  ready: 3,
};

export function QrOrderSim() {
  const [phase, setPhase] = useState<QrPhase>('scan');
  const [scanOk, setScanOk] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [status, setStatus] = useState<OrderStatus>('new');
  const [cashierAck, setCashierAck] = useState(false);

  const totalQty = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const cartTotal = QR_MENU.reduce((sum, m) => sum + (cart[m.id] ?? 0) * m.price, 0);

  const phoneStep =
    phase === 'scan' || phase === 'scanning'
      ? 0
      : phase === 'menu'
      ? 1
      : STATUS_STEP[status];

  const handleScanTable = () => {
    if (phase !== 'scan') return;
    setPhase('scanning');
    setTimeout(() => setScanOk(true), 1800);
    setTimeout(() => {
      setPhase('menu');
      setCart({ fries: 1, burger: 1 });
    }, 2500);
  };

  const addItem = (id: string) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

  const removeItem = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      const q = (next[id] ?? 0) - 1;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  };

  const handlePlaceOrder = () => {
    if (totalQty === 0) return;
    const items = QR_MENU.filter((m) => cart[m.id]).map((m) => ({
      name: m.name,
      emoji: m.emoji,
      price: m.price,
      qty: cart[m.id],
    }));
    setOrder({ items, total: cartTotal });
    setStatus('new');
    setCashierAck(false);
    setPhase('status');
  };

  const handleReset = () => {
    setPhase('scan');
    setScanOk(false);
    setCart({});
    setOrder(null);
    setStatus('new');
    setCashierAck(false);
  };

  return (
    <div className="relative z-0 grid gap-6 text-left lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      {/* 1. Phone (Customer Mockup) */}
      <div className="mx-auto w-full max-w-[304px]">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/70 shadow-glass-lg backdrop-blur-2xl">
          {/* Notch / Dynamic Island */}
          <div className="absolute left-1/2 top-2 z-30 h-4 w-20 -translate-x-1/2 rounded-full bg-navy/85" />

          <div className="flex h-[500px] flex-col pt-7">
            {/* Phone Top Header */}
            <div className="border-b border-navy/[0.06] px-5 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-navy">Customer Phone</span>
                <span className="flex h-5 items-center gap-1 rounded-full bg-navy/[0.06] px-2 text-[9px] font-bold text-slate-soft">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      phase === 'status' ? 'animate-pulse bg-electric-cyan' : 'bg-emerald-500'
                    }`}
                  />
                  {phase === 'scan' || phase === 'scanning' ? 'KAMERA' : 'AKTIF'}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-slate-soft">
                {phase === 'scan' && 'Siap scan QR meja'}
                {phase === 'scanning' && 'Memindai kode meja…'}
                {phase === 'menu' && 'Pilih menu favorit Anda'}
                {phase === 'status' && 'Melacak status pesanan'}
              </p>
            </div>

            {/* Step rail */}
            <div className="flex items-center gap-1 border-b border-navy/[0.06] px-5 py-2.5">
              {QR_PHONE_STEPS.map((label, i) => (
                <div key={label} className="flex flex-1 items-center gap-1">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white transition-colors duration-300 ${
                      i <= phoneStep ? 'bg-electric-cyan' : 'bg-navy/15'
                    }`}
                  >
                    {i < phoneStep ? '✓' : i + 1}
                  </span>
                  {i < QR_PHONE_STEPS.length - 1 && (
                    <div className="h-0.5 flex-1 rounded-full bg-navy/10 overflow-hidden">
                      <div
                        className="h-full bg-electric-cyan transition-all duration-300"
                        style={{ width: i < phoneStep ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-5 py-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-soft">
                {QR_PHONE_STEPS[phoneStep]}
              </span>
              <span className="text-[9px] text-slate-soft">
                {phoneStep + 1}/{QR_PHONE_STEPS.length}
              </span>
            </div>

            {/* SCREEN VIEWPORT */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {/* Screen A: SCAN MEJA */}
              {(phase === 'scan' || phase === 'scanning') && (
                <div className="flex h-full flex-col px-5 py-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Camera className="h-3.5 w-3.5 text-slate-soft" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-soft">
                      Kamera · Scan QR Meja
                    </span>
                  </div>

                  <div className="relative mx-auto w-full max-w-[210px] overflow-hidden rounded-2xl border border-navy/[0.06] bg-navy/[0.03] p-6 text-center">
                    <div className="relative mx-auto flex h-[132px] w-[132px] items-center justify-center rounded-xl bg-white shadow-glass">
                      <div className="relative flex h-[104px] w-[104px] items-center justify-center rounded-lg bg-gradient-to-br from-white to-cyan-50">
                        <QrCode className="h-[92px] w-[92px] text-navy" />
                        <span className="absolute bottom-1 rounded bg-navy px-1.5 py-0.5 text-[7px] font-bold tracking-widest text-white">
                          TABLE 12
                        </span>
                      </div>

                      {/* Laser sweep animation */}
                      {phase === 'scanning' && (
                        <div
                          className="pointer-events-none absolute inset-x-2 h-0.5 rounded-full bg-electric-cyan shadow-[0_0_14px_3px_rgba(6,182,212,0.75)] animate-pulse"
                          style={{
                            top: '50%',
                            animation: 'scanLaserMove 1.1s ease-in-out infinite alternate',
                          }}
                        />
                      )}

                      {/* Success overlay */}
                      {scanOk && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-emerald-500/20 backdrop-blur-[1px] animate-in zoom-in-75 duration-200">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                            <Check className="h-5 w-5" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleScanTable}
                    disabled={phase === 'scanning'}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-navy/90 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    <ScanLine className="h-4 w-4" />
                    <span>{phase === 'scanning' ? 'Memindai…' : 'Scan QR Meja'}</span>
                  </button>
                </div>
              )}

              {/* Screen B: MENU LIST */}
              {phase === 'menu' && (
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-navy/[0.06] px-5 py-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-soft">
                      Menu · Meja 12
                    </span>
                    <div className="relative">
                      <ShoppingCart className="h-4 w-4 text-navy" />
                      {totalQty > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-hot-magenta text-[8px] font-bold text-white">
                          {totalQty}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-5 py-3">
                    {QR_MENU.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between rounded-xl border border-navy/[0.06] bg-white px-3 py-2 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/[0.04] text-lg">
                            {item.emoji}
                          </span>
                          <div>
                            <p className="text-[11px] font-bold text-navy">{item.name}</p>
                            <p className="text-[10px] font-semibold text-electric-cyan">
                              {formatRupiah(item.price)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-navy/10 bg-white text-navy transition-colors hover:border-hot-magenta/40 disabled:opacity-40 cursor-pointer"
                            disabled={(cart[item.id] ?? 0) === 0}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-navy font-mono">
                            {cart[item.id] ?? 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => addItem(item.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-md border border-navy/10 bg-white text-navy transition-colors hover:border-electric-cyan/40 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-navy/[0.06] px-5 py-3">
                    <div className="mb-2 flex justify-between text-xs font-bold text-navy">
                      <span>Total</span>
                      <span className="font-mono">{formatRupiah(cartTotal)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={totalQty === 0}
                      className="w-full rounded-xl bg-navy py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-navy/90 disabled:opacity-40 cursor-pointer"
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              )}

              {/* Screen C: STATUS TRACKING */}
              {phase === 'status' && (
                <div className="flex h-full flex-col items-center justify-center px-5 py-4 text-center">
                  {status === 'ready' ? (
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-electric-cyan shadow-[0_8px_30px_rgba(6,182,212,0.4)] text-white">
                      <QrCode className="h-7 w-7" />
                    </div>
                  ) : (
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-navy/10 border-t-navy animate-spin">
                      <QrCode className="h-6 w-6 text-navy/40" />
                    </div>
                  )}

                  <p className="text-sm font-bold text-navy">
                    {status === 'new' && 'Pesanan Terkirim'}
                    {status === 'accepted' && 'Pesanan Dikonfirmasi'}
                    {status === 'cooking' && 'Sedang Diproses Dapur'}
                    {status === 'ready' && 'Siap Disajikan! 🎉'}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-soft">
                    Total: {formatRupiah(cartTotal)} · Meja 12
                  </p>

                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-navy/[0.08]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        status === 'ready' ? 'bg-electric-cyan' : 'bg-navy'
                      }`}
                      style={{
                        width:
                          status === 'new'
                            ? '25%'
                            : status === 'accepted'
                            ? '50%'
                            : status === 'cooking'
                            ? '75%'
                            : '100%',
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-5 flex items-center gap-1.5 rounded-xl border border-navy/[0.08] bg-white/80 px-5 py-2 text-[10px] font-bold text-navy transition-all duration-200 hover:shadow-glass active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Ulangi Simulasi
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center pb-2 pt-1">
              <span className="h-1 w-24 rounded-full bg-navy/20" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Operational Panels: Kitchen Display (KDS) + Kasir */}
      <div className="grid gap-6 sm:grid-cols-2 lg:sticky lg:top-24">
        {/* KDS (Kitchen Display System) */}
        <div className="flex h-[336px] flex-col overflow-hidden rounded-2xl border border-navy/[0.08] bg-white shadow-glass-lg">
          <div className="flex items-center justify-between rounded-t-2xl bg-navy px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  order && status !== 'ready'
                    ? 'animate-pulse bg-amber-400'
                    : order
                    ? 'bg-emerald-500'
                    : 'bg-slate-500'
                }`}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                Kitchen Display
              </span>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white">
              {order ? (status === 'ready' ? 'DONE' : 'ACTIVE') : 'WAITING'}
            </span>
          </div>

          <div className="flex-1 space-y-2 overflow-hidden bg-slate-50 p-3">
            {!order ? (
              <div className="flex h-full flex-col items-center justify-center text-slate-soft">
                <Clock className="mb-2 h-8 w-8 opacity-30" />
                <p className="text-[11px]">Menunggu pesanan masuk...</p>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-300/40 bg-white p-3 shadow-sm animate-in fade-in duration-200">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-soft">
                    Order #0412 · Meja 12
                  </span>
                  {status === 'new' && (
                    <span className="rounded-full bg-luminous-pink px-2 py-0.5 text-[9px] font-bold uppercase text-white animate-pulse">
                      Baru
                    </span>
                  )}
                </div>

                <div className="mb-2 space-y-1">
                  {order.items.map((it) => (
                    <div key={it.name} className="flex items-center justify-between text-[11px]">
                      <span className="text-navy">
                        {it.emoji} {it.name} ×{it.qty}
                      </span>
                      <span className="font-semibold text-slate-soft font-mono">
                        {formatRupiah(it.price * it.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                {status !== 'ready' ? (
                  <button
                    type="button"
                    onClick={() =>
                      setStatus(
                        status === 'new'
                          ? 'accepted'
                          : status === 'accepted'
                          ? 'cooking'
                          : 'ready'
                      )
                    }
                    className="w-full rounded-lg bg-navy py-2 text-[11px] font-bold text-white hover:bg-navy/90 cursor-pointer"
                  >
                    {status === 'new'
                      ? 'Terima Order'
                      : status === 'accepted'
                      ? 'Mulai Masak'
                      : 'Selesai'}
                  </button>
                ) : (
                  <p className="rounded-lg bg-emerald-50 py-1.5 text-center text-[10px] font-bold text-emerald-700">
                    ✓ Pesanan siap diantar
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cashier / Dashboard */}
        <div className="flex h-[336px] flex-col rounded-2xl border border-navy/[0.08] bg-white shadow-glass-lg">
          <div className="mb-3 flex items-center justify-between border-b border-navy/[0.06] px-4 pb-3 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-soft">
              Kasir / Dashboard
            </p>
            <span
              className={`flex items-center gap-1.5 text-[10px] font-bold ${
                order ? 'text-electric-cyan' : 'text-slate-soft'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  order && status === 'ready'
                    ? 'animate-pulse bg-emerald-500'
                    : order
                    ? 'animate-pulse bg-electric-cyan'
                    : 'bg-slate-300'
                }`}
              />
              {order ? (status === 'ready' ? 'READY' : 'MONITORING') : 'WAITING'}
            </span>
          </div>

          <div className="min-h-0 flex-1 px-4 pt-3">
            {!order ? (
              <div className="flex h-full flex-col items-center justify-center text-slate-soft">
                <p className="text-[11px]">Belum ada transaksi baru...</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-200">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-navy">Order #0412 · Meja 12</span>
                  {!cashierAck && (
                    <span className="rounded-full bg-luminous-pink px-2 py-0.5 text-[9px] font-bold uppercase text-white animate-pulse">
                      Baru
                    </span>
                  )}
                </div>

                <div className="mb-2 space-y-1">
                  {order.items.map((it) => (
                    <div key={it.name} className="flex items-center justify-between text-[11px]">
                      <span className="text-navy">
                        {it.emoji} {it.name} ×{it.qty}
                      </span>
                      <span className="font-semibold text-navy font-mono">
                        {formatRupiah(it.price * it.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mb-3 flex items-center justify-between border-t border-navy/5 pt-2">
                  <span className="text-[11px] font-semibold text-slate-soft">Total</span>
                  <span className="text-sm font-bold text-navy font-mono">
                    {formatRupiah(order.total)}
                  </span>
                </div>

                {!cashierAck ? (
                  <button
                    type="button"
                    onClick={() => setCashierAck(true)}
                    className="w-full rounded-lg bg-navy py-2 text-[11px] font-bold text-white shadow-md hover:bg-navy/90 cursor-pointer"
                  >
                    ✓ Terima Order
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <p className="rounded-lg bg-electric-cyan/10 py-1.5 text-center text-[10px] font-bold text-electric-cyan">
                      Order diterima kasir ✓
                    </p>
                    {status !== 'ready' && (
                      <div
                        className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[10px] font-bold ${
                          status === 'new'
                            ? 'bg-amber-50 text-amber-700'
                            : status === 'accepted'
                            ? 'bg-electric-cyan/10 text-electric-cyan'
                            : 'bg-orange-50 text-orange-700'
                        }`}
                      >
                        {status === 'new' && 'Menunggu dapur menerima...'}
                        {status === 'accepted' && 'Dapur menerima pesanan'}
                        {status === 'cooking' && '🔥 Dapur sedang memasak...'}
                      </div>
                    )}
                  </div>
                )}

                {status === 'ready' && (
                  <div className="mt-2 rounded-lg bg-emerald-500 py-2.5 text-center text-white animate-in zoom-in-95 duration-200">
                    <p className="text-[11px] font-bold uppercase tracking-wide">🍽️ Pesanan Ready!</p>
                    <p className="text-[9px] text-emerald-100">Antar ke Meja 12 sekarang</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={handleReset}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-navy/[0.08] bg-white/80 py-2 text-[10px] font-bold text-navy transition-all duration-200 hover:shadow-glass active:scale-[0.98] cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
