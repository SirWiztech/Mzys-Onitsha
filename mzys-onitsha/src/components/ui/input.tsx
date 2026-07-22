import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-mzys-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors
            focus:outline-none focus:ring-2 focus:ring-mzys-primary focus:border-mzys-primary
            ${error ? 'border-mzys-danger' : 'border-mzys-gray-300'}
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-mzys-danger">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
