import { toastsSignal, removeToast } from '../../lib/hooks/useToast';

export function ToastContainer() {
  const toasts = toastsSignal.value;

  if (toasts.length === 0) return null;

  const toneClasses = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    warning: 'bg-amber-600 text-white',
    info: 'bg-[var(--bright)] text-white',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toneClasses[toast.type]}`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-3 text-white/80 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
