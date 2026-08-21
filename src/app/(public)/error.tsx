'use client';

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('[public-error]', error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-mzys-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-xl border border-mzys-gray-200 shadow-sm p-8">
          <h1 className="text-xl font-bold text-mzys-danger mb-2">Something went wrong</h1>
          <p className="text-sm text-mzys-gray-500 mb-4">
            An unexpected error occurred. The details have been logged.
          </p>
          {error.message && (
            <pre className="text-xs text-left bg-mzys-gray-50 rounded-lg p-3 mb-4 overflow-x-auto text-mzys-gray-600 border border-mzys-gray-200">
              {error.message}
            </pre>
          )}
          {error.digest && (
            <p className="text-xs text-mzys-gray-400 mb-4">Error ID: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="px-4 py-2 bg-mzys-primary text-white rounded-lg text-sm font-medium hover:bg-mzys-blue transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
