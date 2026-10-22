import { useState } from 'preact/hooks';
import { AuthGate } from '../auth/AuthGate';
import { useSession } from '../auth/session';
import { AppShell } from '../../ui/organisms/AppShell';
import { StatCard } from '../../ui/molecules/StatCard';
import { PageHeader } from '../../ui/molecules/PageHeader';
import { Button } from '../../ui/atoms/Button';
import { Badge } from '../../ui/atoms/Badge';
import { Modal } from '../../ui/molecules/Modal';
import { FormField } from '../../ui/molecules/FormField';
import { Input } from '../../ui/atoms/Input';
import { Select } from '../../ui/atoms/Select';
import { EmptyState } from '../../ui/molecules/EmptyState';
import { useQuery } from '../../lib/hooks/useQuery';
import { api } from '../../lib/api/client';
import { formatRupiah } from '../../lib/format/currency';
import { formatDateTime } from '../../lib/format/date';
import { toast } from '../../lib/hooks/useToast';
import type { BookingStats, ReservationItem, ResourceItem } from '../../lib/api/types';

export function BookingApp() {
  return (
    <AuthGate
      product="booking"
      productTitle="Sistem Reservasi & Booking Terpadu"
      tagline="Kelola slot jadwal lapangan, studio, atau ruangan tanpa bentrok dengan otomasi booking WhatsApp."
    >
      <BookingDashboard />
    </AuthGate>
  );
}

function BookingDashboard() {
  const { tenant, logout } = useSession();
  const [activeTab, setActiveTab] = useState<'reservations' | 'resources'>('reservations');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Data fetching
  const { data: stats, loading: statsLoading } = useQuery<BookingStats>(() =>
    api.get<BookingStats>('/booking/stats')
  );

  const { data: reservations, loading: resLoading, refetch: refetchRes } = useQuery<ReservationItem[]>(() =>
    api.get<ReservationItem[]>('/booking/reservations')
  );

  const { data: resources, loading: resrcLoading } = useQuery<ResourceItem[]>(() =>
    api.get<ResourceItem[]>('/booking/resources')
  );

  // New reservation form state
  const [selectedResource, setSelectedResource] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [startTime, setStartTime] = useState('');
  const [durationHours, setDurationHours] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleCreateReservation = async (e: Event) => {
    e.preventDefault();
    if (!selectedResource || !customerName || !customerPhone || !startTime) {
      toast.error('Mohon lengkapi data booking');
      return;
    }

    setSaving(true);
    try {
      const start = new Date(startTime);
      const end = new Date(start.getTime() + durationHours * 3600 * 1000);

      await api.post('/booking/reservations', {
        resource_id: selectedResource,
        customer_name: customerName,
        customer_phone: customerPhone,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        down_payment: 0,
        payment_method: 'cash',
      });

      toast.success('Reservasi berhasil dijadwalkan!');
      setIsModalOpen(false);
      setCustomerName('');
      setCustomerPhone('');
      refetchRes();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal membuat reservasi');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/booking/reservations/${id}`, { status });
      toast.success(`Status reservasi diperbarui: ${status}`);
      refetchRes();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengubah status');
    }
  };

  const navItems = [
    {
      id: 'reservations',
      label: 'Jadwal & Reservasi',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'resources',
      label: 'Sarana & Fasilitas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <AppShell
      product="booking"
      productName="Sistem Booking"
      businessName={tenant?.name || 'Supernova Booking'}
      tenantCode={tenant?.code || '#SNV-BKG'}
      city={tenant?.city || 'Jakarta'}
      slug={tenant?.slug || 'demo'}
      daysRemaining={tenant?.days_remaining || 30}
      navItems={navItems}
      activeNav={activeTab}
      onNavChange={(id) => setActiveTab(id as 'reservations' | 'resources')}
      onLogout={logout}
      actions={
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          + Buat Booking Baru
        </Button>
      }
    >
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          variant="hero"
          title="Pendapatan Hari Ini"
          value={formatRupiah(stats?.revenue_today || 0)}
          subtitle="Total omset booking terkonfirmasi"
          loading={statsLoading}
        />
        <StatCard
          title="Booking Hari Ini"
          value={`${stats?.reservations_today || 0} Sesi`}
          subtitle="Jadwal main terjadwal"
          trend="+12%"
          trendTone="up"
          loading={statsLoading}
        />
        <StatCard
          title="Tingkat Okupansi"
          value={`${stats?.occupancy_pct || 0}%`}
          subtitle="Slot jam terisi penuh"
          trendTone="neutral"
          loading={statsLoading}
        />
        <StatCard
          title="Booking Mendatang"
          value={`${stats?.upcoming_count || 0} Antrean`}
          subtitle="Menunggu jadwal mulai"
          trendTone="neutral"
          loading={statsLoading}
        />
      </div>

      {activeTab === 'reservations' ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
          <PageHeader
            title="Daftar Jadwal & Reservasi"
            description="Pantau jadwal booking aktif dan status pembayaran pelanggan"
          />

          {resLoading ? (
            <div className="py-12 text-center text-xs text-[var(--muted-2)]">Memuat data jadwal...</div>
          ) : !reservations || reservations.length === 0 ? (
            <EmptyState
              title="Belum Ada Jadwal Reservasi"
              description="Buat booking pertama Anda atau bagikan link publik agar pelanggan dapat memesan mandiri."
              action={
                <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                  + Buat Booking Manual
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--line)] text-[var(--muted)] font-semibold">
                    <th className="py-3 px-3">KODE</th>
                    <th className="py-3 px-3">PELANGGAN</th>
                    <th className="py-3 px-3">SARANA / LAPANGAN</th>
                    <th className="py-3 px-3">JADWAL</th>
                    <th className="py-3 px-3">TOTAL</th>
                    <th className="py-3 px-3">STATUS</th>
                    <th className="py-3 px-3 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {reservations.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-[var(--bright)]">{r.code}</td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[var(--ink)]">{r.customer_name}</div>
                        <div className="text-[11px] text-[var(--muted-2)]">{r.customer_phone}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{r.resource_name}</td>
                      <td className="py-3 px-3 text-[var(--ink-2)]">
                        <div>{formatDateTime(r.start_time)}</div>
                        <div className="text-[11px] text-[var(--muted-2)]">{r.duration_hours} Jam</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[var(--ink)]">{formatRupiah(r.total_amount)}</td>
                      <td className="py-3 px-3">
                        <Badge
                          tone={
                            r.status === 'confirmed'
                              ? 'success'
                              : r.status === 'completed'
                              ? 'neutral'
                              : r.status === 'cancelled'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {r.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {r.status === 'confirmed' && (
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'completed')}
                              className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium cursor-pointer"
                            >
                              Selesai
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'cancelled')}
                              className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 font-medium cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
          <PageHeader
            title="Daftar Sarana & Fasilitas"
            description="Kelola sarana olahraga, studio foto, atau bilik ruangan yang disewakan"
          />

          {resrcLoading ? (
            <div className="py-12 text-center text-xs text-[var(--muted-2)]">Memuat fasilitas...</div>
          ) : !resources || resources.length === 0 ? (
            <EmptyState
              title="Belum Ada Sarana Terdaftar"
              description="Tambahkan sarana atau lapangan untuk mulai menerima pemesanan jadwal."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-[var(--line)] bg-[var(--paper)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-medium text-[var(--bright)] bg-[var(--blue-light)] px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <Badge tone={item.is_active ? 'success' : 'neutral'}>
                        {item.is_active ? 'AKTIF' : 'NONAKTIF'}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-sm text-[var(--ink)]">{item.name}</h4>
                    <p className="text-xs text-[var(--muted)] mt-1">{item.description || 'Kapasitas s/d ' + item.capacity + ' orang'}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between">
                    <span className="text-xs text-[var(--muted-2)]">Tarif Sewa:</span>
                    <span className="font-bold text-sm text-[var(--bright)]">{formatRupiah(item.hourly_rate)} / jam</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Buat Booking */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Booking Jadwal Baru">
        <form onSubmit={handleCreateReservation} className="flex flex-col gap-4">
          <FormField label="Pilih Sarana / Fasilitas" required>
            <Select
              value={selectedResource}
              onChange={(e) => setSelectedResource((e.target as HTMLSelectElement).value)}
            >
              <option value="">-- Pilih Fasilitas --</option>
              {resources?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({formatRupiah(r.hourly_rate)}/jam)
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Nama Pelanggan" required>
            <Input
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={customerName}
              onInput={(e) => setCustomerName((e.target as HTMLInputElement).value)}
            />
          </FormField>

          <FormField label="Nomor WhatsApp Pelanggan" required>
            <Input
              type="tel"
              placeholder="081234567890"
              value={customerPhone}
              onInput={(e) => setCustomerPhone((e.target as HTMLInputElement).value)}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Waktu Mulai" required>
              <Input
                type="datetime-local"
                value={startTime}
                onInput={(e) => setStartTime((e.target as HTMLInputElement).value)}
              />
            </FormField>

            <FormField label="Durasi Sewa" required>
              <Select
                value={durationHours}
                onChange={(e) => setDurationHours(Number((e.target as HTMLSelectElement).value))}
              >
                <option value={1}>1 Jam</option>
                <option value={2}>2 Jam</option>
                <option value={3}>3 Jam</option>
                <option value={4}>4 Jam</option>
              </Select>
            </FormField>
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-[var(--line)]">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Simpan & Kunci Jadwal
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
