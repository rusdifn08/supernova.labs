import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { AuthScreen } from '../../ui/organisms/AuthScreen';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useSession } from './session';

export interface AuthGateProps {
  product: 'booking' | 'pos' | 'resto';
  productTitle: string;
  tagline: string;
  children: ComponentChildren;
}

export function AuthGate({
  product,
  productTitle,
  tagline,
  children,
}: AuthGateProps) {
  const { isAuthenticated } = useSession();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <AuthScreen product={product} productTitle={productTitle} tagline={tagline}>
      {mode === 'login' ? (
        <LoginForm onSwitchToRegister={() => setMode('register')} />
      ) : (
        <RegisterForm product={product} onSwitchToLogin={() => setMode('login')} />
      )}
    </AuthScreen>
  );
}
