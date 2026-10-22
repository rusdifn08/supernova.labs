import { useState } from 'preact/hooks';
import { Button } from '../../ui/atoms/Button';
import { Badge } from '../../ui/atoms/Badge';
import { Input } from '../../ui/atoms/Input';
import { Select } from '../../ui/atoms/Select';
import { FormField } from '../../ui/molecules/FormField';
import { useQuery } from '../../lib/hooks/useQuery';
import { api } from '../../lib/api/client';
import { formatRupiah } from '../../lib/format/currency';
import { getStorefrontSlug } from '../../lib/storefront';

interface PublicTenant {
  slug: string;
  code: string;
  name: string;
  business_type: string;
  city?: string;
  phone?: string;
}

interface PublicResourceAvailability {
  resource: {
    id: string;
    name: string;
    category: string;
    hourly_price: number;
    capacity: number;
  };
  booked_slots: string[];
}

export function BookingStorefront() {
  const slug = getStorefrontSlug('demo');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: tenant } = useQuery<PublicTenant>(() =>
    api.get<PublicTenant>(`/public/tenants/${slug}`)
  );

  const { data: availability, loading: loadingAvail, refetch } = useQuery<PublicResourceAvailability[]>(() =>
    api.get<PublicResourceAvailability[]>(`/public/booking/${slug}/availability?date=${selectedDate}`),
    [selectedDate]
  );

  const handleReserve = async (e: Event) => {
    e.preventDefault();
    if (!selectedResourceId || !customerName || !customerPhone) {
      setErrorMsg('Mohon isi nama, WhatsApp, dan pilih fasilitas.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await api.post(`/public/booking/${slug}/reserve`, {
        customer_name: customerName,
        customer_phone: customerPhone,
        resource_id: selectedResourceId,
        booking_date: selectedDate,
        start_time: `${startTime}:00`,
        duration_hours: duration,
        payment_method: 'qris',
        notes: notes || undefined,
      });

      setBookingSuccess(res);
      refetch();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Jadwal bentrok atau gagal dipesan');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedResource = availability?.find((a) => a.resource.id === selectedResourceId)?.resource;
  const totalPrice = selectedResource ? selectedResource.hourly_price * duration : 0;
  const dpAmount = totalPrice * 0.5;

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-sans pb-16">
      {/* Brand Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--line)] py-4 px-4 sm:px-8 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--blue)] to-[var(--bright)] flex items-center justify-center text-white font-bold">
              S
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--ink)]">{tenant?.name || 'Supernova Booking'}</h1>
              <p className="text-[11px] text-[var(--muted-2)]">
                {tenant?.business_type || 'Sarana Olahraga & Fasilitas'} · {tenant?.city || 'Indonesia'}
              </p>
            </div>
          </div>
          <Badge tone="info">{tenant?.code || '#SNV-BKG'}</Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 mt-4">
        {bookingSuccess ? (
          /* Confirmation Success Voucher */
          <div className="max-w-lg mx-auto bg-[var(--surface)] border border-emerald-200 rounded-2xl p-6 sm:p-8 shadow-md text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-xl font-bold text-[var(--ink)]">Booking Berhasil Dikonfirmasi!</h2>
            <p className="text-xs text-[var(--muted)] mt-1">Jadwal Anda telah terkunci secara otomatis.</p>

            <div className="my-6 p-4 rounded-xl bg-slate-50 border border-[var(--line)] text-left text-xs flex flex-col gap-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-[var(--muted)]">Kode Booking:</span>
                <span className="font-mono font-bold text-[var(--bright)]">{bookingSuccess.booking_code}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-[var(--muted)]">Fasilitas:</span>
                <span className="font-medium text-[var(--ink)]">{bookingSuccess.resource_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-[var(--muted)]">Tanggal & Jam:</span>
                <span className="font-medium text-[var(--ink)]">{bookingSuccess.booking_date} ({bookingSuccess.start_time} - {bookingSuccess.end_time})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-[var(--muted)]">Total Tarif:</span>
                <span className="font-bold text-[var(--ink)]">{formatRupiah(bookingSuccess.total_amount)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted)]">Down Payment (50%):</span>
                <span className="font-bold text-emerald-600">{formatRupiah(bookingSuccess.down_payment)}</span>
              </div>
            </div>

            <Button
              variant="whatsapp"
              fullWidth
              onClick={() => {
                const phone = tenant?.phone || '628123456789';
                const cleanPhone = phone.replace(/\D/g, '');
                const msg = encodeURIComponent(
                  `Halo ${tenant?.name}, saya sudah booking dengan kode ${bookingSuccess.booking_code} untuk jadwal ${bookingSuccess.booking_date} jam ${bookingSuccess.start_time}. Mohon konfirmasi down payment. Terima kasih.`
                );
                window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
              }}
            >
              Konfirmasi WhatsApp ke Pengelola
            </Button>

            <button
              onClick={() => setBookingSuccess(null)}
              className="mt-4 text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
            >
              ← Pesan Jadwal Lain
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Facilities List */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[var(--ink)]">Pilih Fasilitas & Tanggal</h3>
                    <p className="text-xs text-[var(--muted)]">Periksa ketersediaan jadwal kosong</p>
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate((e.target as HTMLInputElement).value)}
                    className="border border-[var(--line)] rounded-lg px-3 py-1.5 text-xs text-[var(--ink)] bg-slate-50 cursor-pointer"
                  />
                </div>

                {loadingAvail ? (
                  <div className="py-8 text-center text-xs text-[var(--muted-2)]">Mengecek jadwal ketersediaan...</div>
                ) : !availability || availability.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[var(--muted-2)]">Belum ada sarana tersedia</div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {availability.map((item) => {
                      const isSelected = selectedResourceId === item.resource.id;
                      return (
                        <div
                          key={item.resource.id}
                          onClick={() => setSelectedResourceId(item.resource.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[var(--bright)] bg-[var(--blue-light)] shadow-xs'
                              : 'border-[var(--line)] bg-[var(--surface)] hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-[var(--bright)] uppercase tracking-wider">
                                {item.resource.category}
                              </span>
                              <h4 className="text-sm font-bold text-[var(--ink)]">{item.resource.name}</h4>
                              <p className="text-xs text-[var(--muted)]">Kapasitas {item.resource.capacity} orang</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-[var(--bright)]">
                                {formatRupiah(item.resource.hourly_price)}
                              </span>
                              <span className="text-[11px] text-[var(--muted-2)] block">/ jam</span>
                            </div>
                          </div>

                          {/* Booked Slots Preview */}
                          {item.booked_slots.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-[var(--danger)] font-medium">Terisi:</span>
                              {item.booked_slots.map((s, idx) => (
                                <span key={idx} className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-mono">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Reservation Form */}
            <div className="lg:col-span-5">
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 shadow-xs sticky top-20">
                <h3 className="text-base font-bold text-[var(--ink)] mb-1">Rincian Reservasi</h3>
                <p className="text-xs text-[var(--muted)] mb-4">Lengkapi data untuk mengunci jadwal</p>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleReserve} className="flex flex-col gap-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Jam Mulai" required>
                      <Select value={startTime} onChange={(e) => setStartTime((e.target as HTMLSelectElement).value)}>
                        {['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Select>
                    </FormField>

                    <FormField label="Durasi Sewa" required>
                      <Select value={duration} onChange={(e) => setDuration(Number((e.target as HTMLSelectElement).value))}>
                        <option value={1}>1 Jam</option>
                        <option value={2}>2 Jam</option>
                        <option value={3}>3 Jam</option>
                        <option value={4}>4 Jam</option>
                      </Select>
                    </FormField>
                  </div>

                  <FormField label="Nama Lengkap" required>
                    <Input
                      type="text"
                      placeholder="Nama pemesan"
                      value={customerName}
                      onInput={(e) => setCustomerName((e.target as HTMLInputElement).value)}
                    />
                  </FormField>

                  <FormField label="Nomor WhatsApp" required hint="Tiket dikirim kesini">
                    <Input
                      type="tel"
                      placeholder="081234567890"
                      value={customerPhone}
                      onInput={(e) => setCustomerPhone((e.target as HTMLInputElement).value)}
                    />
                  </FormField>

                  {/* Summary Pricing Box */}
                  <div className="p-3.5 rounded-xl bg-[var(--paper)] border border-[var(--line)] text-xs flex flex-col gap-1.5 my-1">
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Fasilitas:</span>
                      <span className="font-semibold text-[var(--ink)]">{selectedResource?.name || 'Belum dipilih'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Total Biaya:</span>
                      <span className="font-bold text-[var(--ink)]">{formatRupiah(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[var(--line)]">
                      <span className="text-[var(--muted)]">Wajib DP (50%):</span>
                      <span className="font-bold text-emerald-600">{formatRupiah(dpAmount)}</span>
                    </div>
                  </div>

                  <Button type="submit" variant="primary" fullWidth loading={submitting} disabled={!selectedResourceId}>
                    Kunci Jadwal & Pesan Sekarang
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
