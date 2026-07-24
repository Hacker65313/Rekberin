import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="text-7xl">🔍</div>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-gray-500">
        Halaman yang Anda cari tidak ditemukan.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
