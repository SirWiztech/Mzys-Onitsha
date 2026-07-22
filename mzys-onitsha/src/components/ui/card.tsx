import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export default function Card({ className = '', padding = true, children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-mzys-gray-200 shadow-sm ${padding ? 'p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
