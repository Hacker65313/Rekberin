export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
          <svg className="h-7 w-7 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.2-8.5" />
          </svg>
        </div>
        <p className="mt-3 text-sm text-gray-400">Memuat…</p>
      </div>
    </div>
  );
}
