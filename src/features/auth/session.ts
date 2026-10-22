import { signal } from '@preact/signals';
import type { Session, Tenant } from '../../lib/api/types';

const STORAGE_KEY = 'snv.session';

function loadInitialSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const sessionSignal = signal<Session | null>(loadInitialSession());

export function setSession(session: Session) {
  sessionSignal.value = session;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
}

export function updateTenant(tenant: Tenant) {
  if (!sessionSignal.value) return;
  const updated: Session = {
    ...sessionSignal.value,
    tenant,
  };
  setSession(updated);
}

export function clearSession() {
  sessionSignal.value = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function useSession() {
  return {
    session: sessionSignal.value,
    user: sessionSignal.value?.user || null,
    tenant: sessionSignal.value?.tenant || null,
    isAuthenticated: !!sessionSignal.value,
    logout: clearSession,
  };
}
