import type { ComponentChildren, JSX } from 'preact';

export type ButtonProps = JSX.IntrinsicElements['button'] & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: ComponentChildren;
  rightIcon?: ComponentChildren;
  fullWidth?: boolean;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all rounded-lg focus:outline-none focus:ring-2 select-none';
  
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }[size];

  const variantClasses = {
    primary: 'bg-[var(--bright)] hover:bg-[var(--bright-hover)] text-white shadow-sm focus:ring-[var(--color-focus)]',
    secondary: 'bg-[var(--surface)] hover:bg-[var(--color-surface-muted)] text-[var(--ink-2)] border border-[var(--line)] shadow-sm focus:ring-[var(--line-2)]',
    ghost: 'bg-transparent hover:bg-[var(--color-surface-muted)] text-[var(--muted)] hover:text-[var(--ink)] focus:ring-[var(--line-2)]',
    danger: 'bg-[var(--danger)] hover:opacity-90 text-white shadow-sm focus:ring-red-300',
    whatsapp: 'bg-[var(--wa)] hover:bg-[var(--wa-hover)] text-white shadow-sm focus:ring-emerald-300 font-semibold',
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';
  const stateClass = (disabled || loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer active:scale-[0.98]';

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${stateClass} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!loading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
}
