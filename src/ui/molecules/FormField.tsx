import type { ComponentChildren } from 'preact';

export interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ComponentChildren;
  className?: string;
}

export function FormField({
  label,
  hint,
  error,
  required = false,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label className="text-xs font-semibold text-[var(--ink-2)] flex items-center justify-between">
        <span>
          {label}
          {required && <span className="text-[var(--danger)] ml-1">*</span>}
        </span>
        {hint && <span className="text-[11px] font-normal text-[var(--muted-2)]">{hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[var(--danger)] mt-0.5">{error}</p>}
    </div>
  );
}
