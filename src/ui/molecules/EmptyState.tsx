import type { ComponentChildren } from 'preact';

export interface EmptyStateProps {
  icon?: ComponentChildren;
  title: string;
  description?: string;
  action?: ComponentChildren;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[var(--line-2)] bg-[var(--paper)]">
      {icon && <div className="text-[var(--muted-2)] mb-3">{icon}</div>}
      <h3 className="text-sm font-semibold text-[var(--ink-2)]">{title}</h3>
      {description && <p className="text-xs text-[var(--muted)] max-w-sm mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
