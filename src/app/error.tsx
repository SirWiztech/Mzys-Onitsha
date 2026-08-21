'use client';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('[root-error]', error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-xl font-bold text-red-600 mb-2">Application Error</h1>
        <p className="text-sm text-gray-500 mb-4">
          The application encountered an unexpected error.
        </p>
        {error.message && (
          <pre className="text-xs text-left bg-gray-50 rounded-lg p-3 mb-4 overflow-x-auto text-gray-600 border border-gray-200">
            {error.message}
          </pre>
        )}
        {error.digest && (
          <p className="text-xs text-gray-400 mb-4">Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
