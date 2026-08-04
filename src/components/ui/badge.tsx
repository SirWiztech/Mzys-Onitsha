interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger';
  children: React.ReactNode;
}

const variants: Record<string, string> = {
  default: 'bg-mzys-gray-100 text-mzys-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
};

export default function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
