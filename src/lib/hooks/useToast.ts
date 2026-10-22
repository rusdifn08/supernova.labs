import { signal } from '@preact/signals';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export const toastsSignal = signal<ToastItem[]>([]);

export function showToast(message: string, type: ToastType = 'info', duration = 3500) {
  const id = Math.random().toString(36).substring(2, 9);
  toastsSignal.value = [...toastsSignal.value, { id, message, type, duration }];

  setTimeout(() => {
    toastsSignal.value = toastsSignal.value.filter((t) => t.id !== id);
  }, duration);
}

export function removeToast(id: string) {
  toastsSignal.value = toastsSignal.value.filter((t) => t.id !== id);
}

export const toast = {
  success: (msg: string) => showToast(msg, 'success'),
  error: (msg: string) => showToast(msg, 'error'),
  info: (msg: string) => showToast(msg, 'info'),
  warning: (msg: string) => showToast(msg, 'warning'),
};
