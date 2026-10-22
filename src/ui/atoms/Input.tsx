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
    ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
    : 'border-slate-300 focus:ring-blue-100 focus:border-[#2563eb]';

  const paddingLeft = leftIcon ? 'pl-10' : 'pl-3.5';
  const paddingRight = rightIcon ? 'pr-10' : 'pr-3.5';

  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
          {leftIcon}
        </div>
      )}
      <input
        {...props}
        disabled={disabled}
        className={`w-full bg-white text-slate-900 placeholder-slate-400 text-sm rounded-xl border py-2.5 min-h-[44px] ${paddingLeft} ${paddingRight} transition-all focus:outline-none focus:ring-4 disabled:bg-slate-50 disabled:text-slate-400 ${borderClass} ${className}`}
      />
      {rightIcon && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
          {rightIcon}
        </div>
      )}
    </div>
  );
}
