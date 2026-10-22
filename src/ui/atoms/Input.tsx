import type { ComponentChildren, JSX } from 'preact';

export type InputProps = JSX.IntrinsicElements['input'] & {
  error?: boolean;
  leftIcon?: ComponentChildren;
  rightIcon?: ComponentChildren;
};

export function Input({
  error = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: InputProps) {
  const borderClass = error
    ? 'border-[var(--danger)] focus:ring-red-200 focus:border-[var(--danger)]'
    : 'border-[var(--line)] focus:ring-[var(--color-focus)] focus:border-[var(--bright)]';

  const paddingLeft = leftIcon ? 'pl-9' : 'pl-3.5';
  const paddingRight = rightIcon ? 'pr-9' : 'pr-3.5';

  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)] pointer-events-none flex items-center">
          {leftIcon}
        </div>
      )}
      <input
        {...props}
        disabled={disabled}
        className={`w-full bg-[var(--surface)] text-[var(--ink)] placeholder-[var(--muted-2)] text-sm rounded-lg border py-2 ${paddingLeft} ${paddingRight} transition-colors focus:outline-none focus:ring-2 disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--muted)] ${borderClass} ${className}`}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-2)] flex items-center">
          {rightIcon}
        </div>
      )}
    </div>
  );
}
