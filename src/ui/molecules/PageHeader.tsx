import type { ComponentChildren } from 'preact';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ComponentChildren;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">{title}</h1>
        {description && <p className="text-xs text-[var(--muted)] mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
