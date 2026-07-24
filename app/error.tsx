'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="text-7xl">⚠️</div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Terjadi Kesalahan</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">
        {error.message || 'Maaf, terjadi kesalahan tak terduga.'}
      </p>
      <button onClick={reset} className="btn-primary mt-6">
        Coba Lagi
      </button>
    </div>
  );
}
