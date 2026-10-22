import type { ComponentChildren } from 'preact';
import { Skeleton } from '../atoms/Skeleton';

export interface StatCardProps {
  variant?: 'default' | 'hero';
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ComponentChildren;
  trend?: string;
  trendTone?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export function StatCard({
  variant = 'default',
  title,
  value,
  subtitle,
  icon,
  trend,
  trendTone = 'up',
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 flex flex-col gap-3 shadow-xs">
        <Skeleton width="40%" height="14px" />
        <Skeleton width="70%" height="28px" />
        <Skeleton width="50%" height="12px" />
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="bg-gradient-to-br from-[#0a1120] to-[#1e293b] text-white border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
          {icon && <div className="text-[var(--cyan)]">{icon}</div>}
        </div>
        <div className="mt-4 z-10">
          <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    );
  }

  const trendColors = {
    up: 'text-[var(--success)] bg-[var(--success-bg)]',
    down: 'text-[var(--danger)] bg-[var(--danger-bg)]',
    neutral: 'text-slate-600 bg-slate-100',
  }[trendTone];

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 flex flex-col justify-between shadow-xs hover:border-[var(--line-2)] transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--muted)]">{title}</span>
        {icon && <div className="text-[var(--bright)] p-1.5 bg-[var(--blue-light)] rounded-lg">{icon}</div>}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-[var(--ink)]">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${trendColors}`}>
              {trend}
            </span>
          )}
          {subtitle && <span className="text-xs text-[var(--muted)]">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}
