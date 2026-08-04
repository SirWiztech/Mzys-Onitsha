import { ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
    <path
      className="opacity-90"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V1.5A10.5 10.5 0 001.5 12H4z"
    />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      'relative inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded-xl select-none transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none active:scale-[0.97]';

    const variants: Record<string, string> = {
      primary:
        'text-white gradient-primary shadow-md shadow-mzys-primary/25 hover:shadow-lg hover:shadow-mzys-primary/30 hover:-translate-y-0.5 focus-visible:ring-mzys-primary',
      secondary:
        'bg-mzys-gray-100 text-mzys-gray-700 hover:bg-mzys-gray-200 focus-visible:ring-mzys-gray-300',
      outline:
        'bg-white text-mzys-navy ring-1 ring-inset ring-mzys-gray-300 hover:ring-mzys-primary/50 hover:bg-mzys-primary/[0.04] focus-visible:ring-mzys-primary',
      danger:
        'bg-mzys-danger text-white shadow-sm shadow-red-600/20 hover:bg-red-700 hover:shadow-md hover:shadow-red-600/25 focus-visible:ring-mzys-danger',
      ghost:
        'bg-transparent text-mzys-gray-600 hover:bg-mzys-gray-100 hover:text-mzys-navy focus-visible:ring-mzys-gray-300',
    };

    const sizes: Record<string, string> = {
      sm: 'px-3.5 py-1.5 text-sm',
      md: 'px-[1.125rem] py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0 [&_svg]:h-4 [&_svg]:w-4">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;