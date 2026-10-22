import { useState } from 'preact/hooks';
import { Button } from '../../ui/atoms/Button';
import { Input } from '../../ui/atoms/Input';
import { Select } from '../../ui/atoms/Select';
import { FormField } from '../../ui/molecules/FormField';
import { authApi } from './api';
import { setSession } from './session';
import { toast } from '../../lib/hooks/useToast';

export interface RegisterFormProps {
  product: 'booking' | 'pos' | 'resto';
  onSwitchToLogin: () => void;
}

export function RegisterForm({ product, onSwitchToLogin }: RegisterFormProps) {
  const defaultType =
    product === 'booking'
      ? 'Sarana Olahraga & Lapangan'
      : product === 'pos'
      ? 'Retail & Minimarket'
      : 'Resto & Cafe';

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState(defaultType);
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!fullName || !businessName || !phone || !email || !password) {
      setError('Mohon lengkapi semua kolom yang wajib diisi (*).');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const session = await authApi.register({
        full_name: fullName,
        business_name: businessName,
        business_type: businessType,
        city: city || 'Jakarta',
        phone,
        email,
        password,
      });

      setSession(session);
      toast.success('Pendaftaran berhasil! Lisensi 30 hari Anda telah aktif.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/5">
      <div className="mb-5">
        <h3 className="text-xl font-bold tracking-tight text-slate-900">Daftar Akun Baru</h3>
        <p className="text-xs text-slate-500 mt-1">
          Aktifkan sistem operasional penuh untuk bisnis Anda (Bebas Biaya 30 Hari)
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <FormField label="Nama Lengkap Pemilik / Pengelola" required>
          <Input
            type="text"
            placeholder="Contoh: Hendra Pratama"
            value={fullName}
            onInput={(e) => setFullName((e.target as HTMLInputElement).value)}
            disabled={loading}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Nama Bisnis / Usaha" required>
            <Input
              type="text"
              placeholder="Contoh: Supernova Arena"
              value={businessName}
              onInput={(e) => setBusinessName((e.target as HTMLInputElement).value)}
              disabled={loading}
            />
          </FormField>

          <FormField label="Jenis Usaha" required>
            <Select
              value={businessType}
              onChange={(e) => setBusinessType((e.target as HTMLSelectElement).value)}
              disabled={loading}
            >
              <option value="Sarana Olahraga & Lapangan">Sarana Olahraga & Lapangan</option>
              <option value="Studio Foto & Kreatif">Studio Foto & Kreatif</option>
              <option value="Barbershop & Salon">Barbershop & Salon</option>
              <option value="Rental PS & Game Center">Rental PS & Game Center</option>
              <option value="Retail & Toko Kelontong">Retail & Toko Kelontong</option>
              <option value="Resto & Cafe">Resto & Cafe</option>
              <option value="Klinik & Layanan Jasa">Klinik & Layanan Jasa</option>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Kota Domisili Bisnis">
            <Input
              type="text"
              placeholder="Contoh: Jakarta Selatan"
              value={city}
              onInput={(e) => setCity((e.target as HTMLInputElement).value)}
              disabled={loading}
            />
          </FormField>

          <FormField label="Nomor WhatsApp" required hint="Untuk notifikasi">
            <Input
              type="tel"
              placeholder="081234567890"
              value={phone}
              onInput={(e) => setPhone((e.target as HTMLInputElement).value)}
              disabled={loading}
            />
          </FormField>
        </div>

        <FormField label="Alamat Email" required>
          <Input
            type="email"
            placeholder="admin@bisnisanda.com"
            value={email}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            disabled={loading}
          />
        </FormField>

        <FormField label="Kata Sandi (Minimal 6 karakter)" required>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            disabled={loading}
          />
        </FormField>

        <div className="mt-2">
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Daftar & Aktifkan 30 Hari Bebas Biaya
          </Button>
        </div>

        <div className="text-center text-xs text-[var(--muted)] mt-2">
          Sudah memiliki akun?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}
            className="text-blue font-bold text-[var(--bright)] hover:underline"
          >
            Masuk Disini
          </a>
        </div>
      </form>
    </div>
  );
}
