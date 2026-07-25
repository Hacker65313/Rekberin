export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-gray-50/60">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                <svg viewBox="0 0 100 100" className="h-5 w-5" fill="none">
                  <path
                    d="M28 64 L28 38 Q28 30 36 30 L52 30 Q64 30 64 40 Q64 50 52 50 L40 50"
                    stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
                  />
                  <circle cx="68" cy="64" r="9" fill="white" />
                </svg>
              </div>
              <span className="text-base font-extrabold">
                Rekber<span className="text-brand-500">Market</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-gray-500">
              Marketplace online modern dengan sistem rekber (rekening bersama)
              yang aman, cepat, dan terpercaya untuk pembeli maupun penjual.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-800">Fitur</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Buat Toko Online</li>
              <li>Kelola Produk</li>
              <li>Checkout Mudah</li>
              <li>Pembayaran Aman</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-800">Bantuan</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Cara Berjualan</li>
              <li>Cara Berbelanja</li>
              <li>Kebijakan Privasi</li>
              <li>Syarat & Ketentuan</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Rekber Market. Dibuat dengan Next.js + Supabase.
        </div>
      </div>
    </footer>
  );
}
