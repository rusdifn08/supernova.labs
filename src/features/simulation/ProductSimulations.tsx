import { useState } from 'preact/hooks';
import { Clock, ScanLine, Smartphone } from 'lucide-preact';
import { BookingSim } from './BookingSim';
import { PosSim } from './PosSim';
import { QrOrderSim } from './QrOrderSim';

export function ProductSimulations() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 'booking', label: 'Booking System', icon: Clock },
    { id: 'pos', label: 'Cashier & Inventory', icon: ScanLine },
    { id: 'qr', label: 'QR Table Ordering', icon: Smartphone },
  ];

  return (
    <div className="sim-root relative mx-auto max-w-6xl">
      {/* Section Header with Supernova Vibrant Shimmer */}
      <div className="text-center mb-8 sm:mb-10">
        <span className="mb-3 inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#06B6D4] bg-[#ECFEFF] px-3.5 py-1.5 rounded-full border border-[#CFFAFE]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#06B6D4] animate-ping" />
          Lihat Langsung
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl md:text-5xl">
          Simulasi Produk{' '}
          <span className="sim-text-shimmer">
            Real-Time
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[#64748B] text-sm sm:text-base leading-relaxed px-4">
          Bukan mockup statis. Ini simulasi fungsional dari arsitektur sistem yang akan Anda miliki — klik, uji alur, dan rasakan alurnya.
        </p>
      </div>

      {/* Minimalist, Clean 3-Button Switcher with Generous Horizontal Margins */}
      <div className="sim-tabs-minimal-wrapper">
        <div className="sim-tabs-minimal-grid">
          {tabs.map((tab, i) => {
            const isActive = activeTab === i;
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`sim-btn-minimal ${isActive ? 'is-active' : ''}`}
              >
                <IconComponent className="sim-icon" />
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
      <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-[#64748B]">
        <span>Ingin menggunakan database &amp; branding nama bisnis Anda sendiri?</span>
        <a
          href={
            activeTab === 0
              ? '/layanan/booking'
              : activeTab === 1
              ? '/layanan/pos-erp'
              : '/layanan/qr-resto'
          }
          className="inline-flex items-center gap-1.5 font-bold text-[#2563EB] hover:text-[#06B6D4] transition-colors bg-[#EFF6FF] px-4 py-2 rounded-full border border-[#DBEAFE] hover:border-[#93C5FD] shadow-xs"
        >
          <span>🚀 Buka Layanan Sistem (Aktif 30 Hari Penuh)</span>
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
