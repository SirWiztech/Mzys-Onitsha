import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-mzys-navy mb-2">404</h1>
        <p className="text-mzys-gray-500 mb-6">Page not found</p>
        <Link
          href="/"
          className="px-4 py-2 bg-mzys-primary text-white rounded-lg text-sm font-medium hover:bg-mzys-blue transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
