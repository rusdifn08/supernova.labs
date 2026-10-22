import type { JSX } from 'preact';

export type SelectProps = JSX.IntrinsicElements['select'] & {
  error?: boolean;
};

export function Select({ error = false, className = '', children, ...props }: SelectProps) {
  const borderClass = error
    ? 'border-[var(--danger)] focus:ring-red-200'
    : 'border-[var(--line)] focus:ring-[var(--color-focus)] focus:border-[var(--bright)]';

  return (
    <div className="relative w-full">
      <select
        {...props}
        className={`w-full bg-[var(--surface)] text-[var(--ink)] text-sm rounded-lg border py-2 px-3.5 pr-8 appearance-none transition-colors focus:outline-none focus:ring-2 disabled:bg-[var(--color-surface-muted)] cursor-pointer ${borderClass} ${className}`}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--muted)]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
