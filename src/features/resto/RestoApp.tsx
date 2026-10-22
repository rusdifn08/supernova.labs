import { useState } from 'preact/hooks';
import { AuthGate } from '../auth/AuthGate';
import { useSession } from '../auth/session';
import { AppShell } from '../../ui/organisms/AppShell';
import { StatCard } from '../../ui/molecules/StatCard';
import { PageHeader } from '../../ui/molecules/PageHeader';
import { Badge } from '../../ui/atoms/Badge';
import { useQuery } from '../../lib/hooks/useQuery';
import { api } from '../../lib/api/client';
import { toast } from '../../lib/hooks/useToast';
import type { KitchenTicket, RestoMenuItem, RestoTableItem, ServiceRequestItem } from '../../lib/api/types';

export function RestoApp() {
  return (
    <AuthGate
      product="resto"
      productTitle="QR Table Dine-in & Kitchen Display System (KDS)"
      tagline="Otomasi pesanan langsung dari meja tamu ke layar koki dapur tanpa antre, terintegrasi QRIS & pelayan."
    >
      <RestoDashboard />
    </AuthGate>
  );
}

function RestoDashboard() {
  const { tenant, logout } = useSession();
  const [activeTab, setActiveTab] = useState<'kds' | 'tables' | 'service' | 'menu'>('kds');

  // Kitchen Tickets Query
  const { data: tickets, loading: kdsLoading, refetch: refetchTickets } = useQuery<KitchenTicket[]>(() =>
    api.get<KitchenTicket[]>('/resto/kitchen')
  );

  // Tables Query
  const { data: tables, refetch: refetchTables } = useQuery<RestoTableItem[]>(() =>
    api.get<RestoTableItem[]>('/resto/tables')
  );

  // Service Requests Query
  const { data: serviceRequests, refetch: refetchService } = useQuery<ServiceRequestItem[]>(() =>
    api.get<ServiceRequestItem[]>('/resto/service-requests')
  );

  // Menu Query
  const { data: menuItems } = useQuery<RestoMenuItem[]>(() =>
    api.get<RestoMenuItem[]>('/resto/menu')
  );

  const handleUpdateTicket = async (id: string, status: string) => {
    try {
      await api.patch(`/resto/kitchen/${id}/status`, { status });
      toast.success(`Status tiket dapur: ${status}`);
      refetchTickets();
      refetchTables();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal memperbarui status');
    }
  };

  const handleResolveService = async (id: string) => {
    try {
      await api.post(`/resto/service-requests/${id}/resolve`);
      toast.success('Panggilan pelayan telah ditandai selesai');
      refetchService();
      refetchTables();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyelesaikan permintaan');
    }
  };

  const navItems = [
    {
      id: 'kds',
      label: 'Kitchen Display (KDS)',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      badge: tickets?.length || undefined,
    },
    {
      id: 'tables',
      label: 'Denah & Meja QR',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'service',
      label: 'Panggilan Pelayan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      badge: serviceRequests?.length || undefined,
    },
  ];

  return (
    <AppShell
      product="resto"
      productName="QR Resto & KDS"
      businessName={tenant?.name || 'Supernova Resto'}
      tenantCode={tenant?.code || '#SNV-RST'}
      city={tenant?.city || 'Jakarta'}
      slug={tenant?.slug || 'demo'}
      daysRemaining={tenant?.days_remaining || 30}
      navItems={navItems}
      activeNav={activeTab}
      onNavChange={(id) => setActiveTab(id as any)}
      onLogout={logout}
    >
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          variant="hero"
          title="Pesanan Dapur Aktif"
          value={`${tickets?.length || 0} Tiket`}
          subtitle="Sedang dimasak di dapur"
        />
        <StatCard
          title="Meja Terisi"
          value={`${tables?.filter((t) => t.status !== 'empty').length || 0} / ${tables?.length || 0}`}
          subtitle="Okupansi meja saat ini"
          trendTone="neutral"
        />
        <StatCard
          title="Panggilan Pelayan"
          value={`${serviceRequests?.length || 0} Menunggu`}
          subtitle="Panggilan dari tamu meja"
          trendTone={serviceRequests && serviceRequests.length > 0 ? 'down' : 'up'}
        />
        <StatCard
          title="Item Menu Tersedia"
          value={`${menuItems?.length || 0} Menu`}
          subtitle="Katalog makanan & minuman"
          trendTone="neutral"
        />
      </div>

      {activeTab === 'kds' ? (
        <div>
          <PageHeader
            title="Kitchen Display System (Layar Dapur Real-Time)"
            description="Tiket pesanan masuk secara instan saat tamu memesan dari meja masing-masing"
          />

          {kdsLoading ? (
            <div className="py-16 text-center text-xs text-[var(--muted-2)]">Memuat antrean koki...</div>
          ) : !tickets || tickets.length === 0 ? (
            <div className="p-8 text-center bg-[var(--surface)] border border-[var(--line)] rounded-2xl">
              <span className="text-3xl block mb-2">🍽️</span>
              <h3 className="text-sm font-bold text-[var(--ink)]">Dapur Bersih - Tidak Ada Antrean</h3>
              <p className="text-xs text-[var(--muted)] mt-1">Pesanan baru dari QR meja akan muncul di sini secara otomatis.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className={`bg-[var(--surface)] border rounded-2xl p-4 shadow-sm flex flex-col justify-between ${
                    t.status === 'cooking' ? 'border-amber-400 bg-amber-50/20' : 'border-[var(--line)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-[var(--bright)] font-mono">
                          {t.table_number}
                        </span>
                        <span className="text-[10px] text-[var(--muted-2)] font-mono">{t.order_code}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {t.time_elapsed}
                      </span>
                    </div>

                    <div className="py-3 flex flex-col gap-2">
                      {t.items.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between text-xs">
                          <div className="flex-1 mr-2">
                            <span className="font-bold text-[var(--ink)]">{item.quantity}x </span>
                            <span className="font-semibold text-slate-800">{item.name}</span>
                            {item.notes && <p className="text-[11px] text-amber-700 italic">Catatan: {item.notes}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--line)] flex gap-2">
                    {t.status === 'pending' ? (
                      <button
                        onClick={() => handleUpdateTicket(t.id, 'cooking')}
                        className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Mulai Masak
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateTicket(t.id, 'served')}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Selesai & Sajikan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'tables' ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
          <PageHeader
            title="Daftar Meja & QR Code Dine-in"
            description="Tamu scan QR token pada meja untuk membuka menu dan memesan mandiri"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {tables?.map((tbl) => (
              <div
                key={tbl.id}
                className="p-4 rounded-xl border border-[var(--line)] bg-[var(--paper)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-[var(--ink)]">{tbl.table_number}</span>
                    <Badge
                      tone={
                        tbl.status === 'empty'
                          ? 'neutral'
                          : tbl.status === 'calling_waiter'
                          ? 'danger'
                          : tbl.status === 'ordered'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {tbl.status.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-[var(--muted)] block">Area: {tbl.section_area} ({tbl.capacity} Kursi)</span>
                  <span className="text-[10px] font-mono text-[var(--muted-2)] block mt-1 truncate">Token: {tbl.qr_token}</span>
                </div>

                <div className="mt-4 pt-2 border-t border-[var(--line)]">
                  <a
                    href={`/layanan/qr-resto/${tenant?.slug || 'demo'}?table=${tbl.qr_token}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[var(--bright)] font-semibold hover:underline block text-center"
                  >
                    Buka QR Meja →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
          <PageHeader
            title="Permintaan Layanan Tamu (Panggil Pelayan / Minta Bill)"
            description="Lonceng meja digital langsung terkirim ke smartphone atau tablet staf"
          />

          {!serviceRequests || serviceRequests.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--muted-2)]">Tidak ada panggilan pelayan aktif saat ini</div>
          ) : (
            <div className="flex flex-col gap-3">
              {serviceRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-red-200 bg-red-50/40 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔔</span>
                    <div>
                      <h4 className="font-bold text-xs text-[var(--ink)]">
                        Meja {req.table_number} ({req.section_area})
                      </h4>
                      <p className="text-xs text-red-600 font-medium">Permintaan: {req.request_type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleResolveService(req.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                  >
                    Tandai Selesai
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
