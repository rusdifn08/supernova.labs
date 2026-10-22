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
    <div className="sim-root relative mx-auto max-w-6xl">
      {/* Section Header with Supernova Vibrant Shimmer */}
      <div className="text-center mb-10">
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#06B6D4] bg-[#ECFEFF] px-3 py-1 rounded-full border border-[#CFFAFE]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] animate-ping" />
          Lihat Langsung
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl md:text-5xl">
          Simulasi Produk{' '}
          <span className="sim-text-shimmer">
            Real-Time
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[#64748B] text-sm sm:text-base leading-relaxed">
          Bukan mockup. Ini simulasi fungsional dari sistem yang akan Anda miliki — klik, scan, dan rasakan alurnya.
        </p>
      </div>

      {/* Tab Switcher Pills Container */}
      <div className="mb-10 flex justify-center">
        <div className="sim-tabs-container">
          {PRODUCT_TABS.map((tab, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`sim-tab-btn ${isActive ? 'is-active' : ''}`}
              >
                <span className="sim-tab-icon">{getTabIcon(tab.icon)}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Simulation Viewport */}
      <div className="transition-all duration-300">
        {activeTab === 0 && <BookingSim />}
        {activeTab === 1 && <PosSim />}
        {activeTab === 2 && <QrOrderSim />}
      </div>

      {/* Footer Direct CTA to Full App */}
      <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-[#64748B]">
        <span>Ingin menggunakan database &amp; branding nama bisnis Anda sendiri?</span>
        <a
          href={
            activeTab === 0
              ? '/layanan/booking'
              : activeTab === 1
              ? '/layanan/pos-erp'
              : '/layanan/qr-resto'
          }
          className="inline-flex items-center gap-1.5 font-bold text-[#2563EB] hover:text-[#06B6D4] transition-colors bg-[#EFF6FF] px-3.5 py-1.5 rounded-full border border-[#DBEAFE] hover:border-[#93C5FD]"
        >
          <span>🚀 Buka Layanan Sistem (Aktif 30 Hari Penuh)</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
