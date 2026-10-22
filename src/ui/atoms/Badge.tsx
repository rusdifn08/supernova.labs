import type { ComponentChildren } from 'preact';

export interface BadgeProps {
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'accent';
  size?: 'sm' | 'md';
  children: ComponentChildren;
  className?: string;
}

export function Badge({ tone = 'neutral', size = 'sm', children, className = '' }: BadgeProps) {
  const toneClasses = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    info: 'bg-[var(--blue-light)] text-[var(--bright)] border-blue-200',
    success: 'bg-[var(--success-bg)] text-[var(--success)] border-emerald-200',
    warning: 'bg-[var(--warning-bg)] text-[var(--warning)] border-amber-200',
    danger: 'bg-[var(--danger-bg)] text-[var(--danger)] border-red-200',
    accent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }[tone];

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${toneClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
}
