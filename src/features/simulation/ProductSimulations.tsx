import { useState } from 'preact/hooks';
import { Clock, ScanLine, Smartphone } from 'lucide-preact';
import { PRODUCT_TABS } from './constants';
import { BookingSim } from './BookingSim';
import { PosSim } from './PosSim';
import { QrOrderSim } from './QrOrderSim';

export function ProductSimulations() {
  const [activeTab, setActiveTab] = useState(0);

  const getTabIcon = (iconName: string) => {
    if (iconName === 'clock') return <Clock className="h-4 w-4" />;
    if (iconName === 'scan') return <ScanLine className="h-4 w-4" />;
    return <Smartphone className="h-4 w-4" />;
  };

  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Section Header — Exactly mirrored from reference */}
      <div className="text-center mb-10">
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-electric-cyan">
          Lihat Langsung
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl md:text-5xl">
          Simulasi Produk{' '}
          <span className="bg-clip-text text-transparent bg-[linear-gradient(110deg,#0F172A_35%,#06B6D4_50%,#0F172A_65%)] bg-[length:250%_100%] animate-shimmer">
            Real-Time
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-soft text-sm sm:text-base">
          Bukan mockup. Ini simulasi fungsional dari sistem yang akan Anda miliki — klik, scan, dan rasakan alurnya.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {PRODUCT_TABS.map((tab, i) => {
          const isActive = activeTab === i;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`group relative rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-navy text-white shadow-lg shadow-navy/20 scale-105'
                  : 'text-slate-soft hover:text-navy hover:bg-slate-100/80'
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {getTabIcon(tab.icon)}
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Simulation Viewport */}
      <div className="transition-all duration-300">
        {activeTab === 0 && <BookingSim />}
        {activeTab === 1 && <PosSim />}
        {activeTab === 2 && <QrOrderSim />}
      </div>

      {/* Footer Direct CTA to Full App */}
      <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500">
        <span>Ingin menggunakan database &amp; branding nama bisnis Anda sendiri?</span>
        <a
          href={
            activeTab === 0
              ? '/layanan/booking'
              : activeTab === 1
              ? '/layanan/pos-erp'
              : '/layanan/qr-resto'
          }
          className="inline-flex items-center gap-1.5 font-bold text-electric-cyan hover:underline hover:text-navy transition-colors"
        >
          <span>🚀 Buka Layanan Sistem (Aktif 30 Hari Penuh)</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
