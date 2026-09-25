import { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectOptGroup {
  /** Heading rendered above the group's options (as an <optgroup> label). */
  label: string;
  options: SelectOption[];
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  /** Flat option list — mutually exclusive with `groups`. */
  options?: SelectOption[];
  /** District-grouped option list — mutually exclusive with `options`. */
  groups?: SelectOptGroup[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, id, options, groups, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-mzys-gray-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors bg-white
            focus:outline-none focus:ring-2 focus:ring-mzys-primary focus:border-mzys-primary
            ${error ? 'border-mzys-danger' : 'border-mzys-gray-300'}
            ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {groups
            ? groups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))
            : (options ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
        </select>
        {error && <p className="text-xs text-mzys-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
