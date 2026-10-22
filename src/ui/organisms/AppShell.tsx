import type { ComponentChildren } from 'preact';
import { ToastContainer } from '../molecules/ToastContainer';
import { toast } from '../../lib/hooks/useToast';
import { formatDate } from '../../lib/format/date';

export interface NavItem {
  id: string;
  label: string;
  icon: ComponentChildren;
  badge?: string | number;
}

export interface AppShellProps {
  product: 'booking' | 'pos' | 'resto';
  productName: string;
  businessName: string;
  tenantCode: string;
  city?: string;
  slug: string;
  daysRemaining?: number;
  navItems: NavItem[];
  activeNav: string;
  onNavChange: (id: string) => void;
  onLogout: () => void;
  actions?: ComponentChildren;
  children: ComponentChildren;
}

export function AppShell({
  product,
  productName,
  businessName,
  tenantCode,
  city = 'Indonesia',
  slug,
  daysRemaining = 30,
  navItems,
  activeNav,
  onNavChange,
  onLogout,
  actions,
  children,
}: AppShellProps) {
  const publicPath = `/layanan/${product === 'pos' ? 'pos-erp' : product === 'resto' ? 'qr-resto' : 'booking'}/${slug}`;

  const copyPublicLink = () => {
    const fullUrl = `${window.location.origin}${publicPath}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link halaman publik pelanggan disalin!');
  };

  return (
    <div className="flex h-screen w-full bg-[var(--paper)] text-[var(--ink)] overflow-hidden font-sans">
      {/* 1. Left Icon Dock (76px desktop) */}
      <aside className="hidden md:flex flex-col items-center justify-between w-[76px] bg-[var(--surface)] border-r border-[var(--line)] py-5 z-20 shrink-0">
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Logo mark */}
          <a href="/" className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--blue)] to-[var(--bright)] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </a>

          {/* Navigation icons */}
          <nav className="flex flex-col items-center gap-2 w-full px-2">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavChange(item.id)}
                  title={item.label}
                  className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--blue-light)] text-[var(--bright)] font-semibold shadow-xs'
                      : 'text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)]'
                  }`}
                >
                  {/* Active Indicator Pill */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--bright)] rounded-r-full" />
                  )}
                  {item.icon}
                  {item.badge !== undefined && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[var(--danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Dock (Back to site + Logout) */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          <a
            href="/"
            title="Kembali ke Landing Page"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--muted-2)] hover:text-[var(--ink)] hover:bg-[var(--paper)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </a>
          <button
            onClick={onLogout}
            title="Keluar / Logout"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Shelf */}
        <header className="h-16 bg-[var(--surface)] border-b border-[var(--line)] px-6 flex items-center justify-between shrink-0 z-10">
          {/* Left Business Identity */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--ink)]">{businessName}</span>
              <span className="text-[11px] font-medium text-[var(--bright)] bg-[var(--blue-light)] px-2 py-0.5 rounded-full">
                {productName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[var(--muted-2)]">
              <span>{formatDate(new Date())}</span>
              <span>·</span>
              <span className="font-mono text-slate-500">{tenantCode}</span>
              <span>·</span>
              <span>{city}</span>
            </div>
          </div>

          {/* Right Public Link & Controls */}
          <div className="flex items-center gap-3">
            {/* Storefront Link Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[var(--paper)] border border-[var(--line)] rounded-lg py-1 px-2.5 text-xs">
              <span className="text-[var(--muted-2)]">Publik:</span>
              <a
                href={publicPath}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[var(--bright)] hover:underline truncate max-w-[140px]"
              >
                /{slug}
              </a>
              <button
                onClick={copyPublicLink}
                title="Salin link publik"
                className="text-[var(--muted-2)] hover:text-[var(--ink)] ml-1 p-0.5 rounded hover:bg-slate-200 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            {/* Trial badge */}
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {daysRemaining} Hari Bebas Biaya
            </span>

            {/* Actions Slot */}
            {actions}
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* 3. Mobile Bottom Tab Bar (<768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[var(--surface)] border-t border-[var(--line)] flex items-center justify-around px-2 z-30">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 ${
                isActive ? 'text-[var(--bright)] font-semibold' : 'text-[var(--muted)]'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">{item.icon}</div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-red-500"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-[10px]">Keluar</span>
        </button>
      </nav>

      {/* Global Toast Container */}
      <ToastContainer />
    </div>
  );
}
