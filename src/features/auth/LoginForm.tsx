import { useState } from 'preact/hooks';
import { Button } from '../../ui/atoms/Button';
import { Input } from '../../ui/atoms/Input';
import { FormField } from '../../ui/molecules/FormField';
import { authApi } from './api';
import { setSession } from './session';
import { toast } from '../../lib/hooks/useToast';

export interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Silakan isi email/username dan kata sandi.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const session = await authApi.login({ email, password });
      setSession(session);
      toast.success(`Selamat datang kembali, ${session.user.full_name}!`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      const session = await authApi.demo();
      setSession(session);
      toast.success('Masuk dengan Akun Demo All-in-One!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal mengakses akun demo');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/5">
      <div className="mb-6">
        <h3 className="text-xl font-bold tracking-tight text-slate-900">Masuk ke Sistem</h3>
        <p className="text-xs text-slate-500 mt-1">
          Akses dashboard manajemen operasional bisnis Anda
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Email atau Username" required>
          <Input
            type="text"
            placeholder="nama@bisnis.id atau username"
            value={email}
            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            disabled={loading || demoLoading}
            autoFocus
          />
        </FormField>

        <FormField label="Kata Sandi (Password)" required>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            disabled={loading || demoLoading}
          />
        </FormField>

        <div className="mt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={demoLoading}
          >
            Masuk Sekarang
          </Button>
        </div>

        {/* User Required Text: Belum punya akun? Daftar Disini */}
        <div className="text-center text-xs text-slate-600 mt-2">
          Belum punya akun?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToRegister();
            }}
            className="text-blue font-bold hover:underline"
          >
            Daftar Disini
          </a>
        </div>

        {/* Demo Fast Access */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
              Uji Coba Langsung
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          loading={demoLoading}
          disabled={loading}
          onClick={handleDemoLogin}
        >
          Masuk dengan Akun Demo (Instant)
        </Button>
      </form>
    </div>
  );
}
