# 🛒 Rekber Market — Marketplace Online Modern

Marketplace / rekber modern dengan **Next.js 14 + React + Tailwind CSS** dan **Supabase** (Auth + Database + Storage). Siap deploy ke **Vercel (Free)**.

Dibuat dengan tema **putih + aksen oranye**, card membulat, shadow lembut, animasi halus, loading skeleton, dan **mobile-first responsive**.

---

## ✨ Fitur Lengkap

### Pengguna & Auth
- Daftar dengan Email + Password (password di-hash otomatis oleh Supabase Auth, algoritma bcrypt-like)
- Validasi email
- Login / Logout
- **Login tetap aktif** setelah browser di-refresh atau ditutup (Supabase Auth + session cookies)

### Splash Screen
- Animasi **kurir naik motor** bergerak dari kiri ke kanan
- Logo marketplace muncul perlahan (fade-in + scale)
- Durasi ~3 detik, lalu otomatis ke halaman utama

### Dashboard Penjual
- Membuat & mengubah toko (nama, logo, banner, deskripsi, nomor WhatsApp, kota, alamat)
- Setiap toko punya **link unik** `/store/namatoko`
- Produk: upload banyak foto, nama, harga, stok, berat, kategori, deskripsi
- Edit & hapus produk
- Grid produk modern + skeleton loading

### Halaman Pembeli
- Banner toko, logo, nama, rating demo, jumlah produk, produk terbaru
- Detail produk: slider foto, harga besar, deskripsi, stok
- Tombol **Beli Sekarang** & **Chat Penjual** (WhatsApp demo)

### Checkout & Pembayaran (Demo)
- Form: nama penerima, nomor HP, alamat, kota, provinsi, kode pos
- Ringkasan pesanan
- Pilihan pembayaran: **Transfer Bank / QRIS / COD**
- Status otomatis: **Menunggu Pembayaran**
- Admin/penjual ubah status: **Lunas → Diproses → Dikirim → Selesai**

### Dashboard Admin
- Total pengguna, toko, produk, pesanan
- Ubah status pesanan
- Lihat pengguna terbaru

### Notifikasi Telegram
- Saat user baru mendaftar: kirim email + waktu
- Saat pesanan baru: nama toko, nama produk, nominal, status
- **Tidak pernah mengirim password / data sensitif**

### Lainnya
- SEO metadata (OG, Twitter card, sitemap-friendly)
- Lazy load gambar (`next/image`)
- Loading cepat, responsive 100%
- Error & not-found page
- Toast notifications
- Animasi `framer-motion`

---

## 📁 Struktur Folder

```
.
├── app/
│   ├── layout.tsx              # Root layout + SEO metadata
│   ├── page.tsx                # Home (server) → home-client
│   ├── home-client.tsx         # Home client (splash, hero, produk terbaru)
│   ├── globals.css             # Tailwind + komponen UI
│   ├── loading.tsx             # Global loading
│   ├── error.tsx               # Global error boundary
│   ├── not-found.tsx           # 404
│   ├── favicon.svg
│   ├── login/                  # Halaman login
│   ├── register/               # Halaman register
│   ├── stores/                 # Jelajah semua toko
│   ├── store/[slug]/           # Halaman toko publik
│   │   └── [productId]/        # Detail produk + checkout
│   ├── dashboard/              # Dashboard penjual
│   │   ├── store/              # Kelola toko
│   │   ├── products/           # List + new + edit produk
│   │   └── orders/             # Pesanan toko
│   ├── admin/                  # Dashboard admin
│   └── api/
│       ├── notify/register/    # Telegram: user baru
│       ├── notify/order/       # Telegram: pesanan baru
│       ├── admin/seed/         # Buat akun admin
│       └── auth/logout/
├── components/
│   ├── SplashScreen.tsx         # Animasi kurir + logo
│   ├── SplashProvider.tsx      # Logic tampilkan splash 3 detik
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── CheckoutModal.tsx       # Checkout + pembayaran demo
│   ├── ImageUploader.tsx       # Upload ke Supabase Storage
│   ├── Skeleton.tsx            # Loading skeleton
│   └── Toast.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client (cookies)
│   │   └── middleware.ts       # Refresh session
│   ├── auth.ts
│   ├── types.ts                # Tipe data
│   └── utils.ts                # cn(), formatRupiah, slugify, dll
├── supabase/
│   └── schema.sql              # Skema database lengkap
├── middleware.ts               # Proteksi route
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── vercel.json
└── README.md
```

---

## 🚀 Cara Setup (Lokal)

### 1. Install dependencies
```bash
npm install
```

### 2. Setup Supabase
1. Buat project baru di [supabase.com](https://supabase.com) (Free tier)
2. Buka **SQL Editor** di dashboard Supabase
3. Copy seluruh isi file `supabase/schema.sql` dan paste → **Run**
4. Buka **Storage** → pastikan bucket `products` & `stores` sudah ada (dibuat otomatis oleh SQL)
5. Di **Authentication → Providers → Email**, matikan "Confirm email" jika ingin registrasi langsung login (opsional)

### 3. Konfigurasi environment
Copy `.env.example` jadi `.env.local`, lalu isi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=SERVICE-ROLE-KEY   # dari Settings → API

TELEGRAM_BOT_TOKEN=BOT-TOKEN   # opsional
TELEGRAM_CHAT_ID=CHAT-ID       # opsional

ADMIN_SEED_EMAIL=admin@email.com
ADMIN_SEED_PASSWORD=PasswordAman123!
```

### 4. Jalankan
```bash
npm run dev
```
Buka http://localhost:3000

### 5. (Opsional) Buat akun admin
Setelah app berjalan, jalankan:
```bash
curl -X POST http://localhost:3000/api/admin/seed
```
Akun admin dengan email `ADMIN_SEED_EMAIL` akan dibuat & role diset jadi `admin`. Setelah itu login dan akses `/admin`.

---

## 🤖 Setup Notifikasi Telegram (Opsional)

1. Buat bot via [@BotFather](https://t.me/BotFather) → dapat **bot token**
2. Dapatkan **chat ID** Anda: kirim pesan ke bot, lalu akses `https://api.telegram.org/bot<TOKEN>/getUpdates` → ambil `chat.id`
3. Set `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_CHAT_ID` di `.env.local`
4. Jika tidak diisi, notifikasi di-skip (mode demo tetap jalan)

> Notifikasi yang dikirim: email + waktu pendaftaran (user baru), nama toko + produk + nominal + status (pesanan baru). **Tidak ada password/data sensitif.**

---

## ☁️ Deploy ke Vercel (Free)

1. Push kode ke GitHub/GitLab/Bitbucket
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repository
3. Vercel otomatis mendeteksi Next.js (lihat `vercel.json`)
4. Di **Settings → Environment Variables**, tambahkan semua env dari `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TELEGRAM_BOT_TOKEN` (opsional)
   - `TELEGRAM_CHAT_ID` (opsional)
   - `ADMIN_SEED_EMAIL`
   - `ADMIN_SEED_PASSWORD`
5. Klik **Deploy**. Vercel akan build & deploy ke URL `*.vercel.app`
6. Setelah deploy, jalankan sekali `/api/admin/seed` untuk membuat admin:
   ```bash
   curl -X POST https://NAMA-PROJECT.vercel.app/api/admin/seed
   ```

### Catatan RLS Supabase
- Schema sudah punya **Row Level Security** (RLS) policies
- Tabel `profiles` readable public, update hanya oleh pemilik
- Tabel `stores`/`products` readable public, modifikasi oleh owner
- Tabel `orders`: insertable oleh siapapun (guest checkout), update hanya seller/admin
- Storage bucket public untuk read, auth untuk upload

---

## 🛠️ Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18, Tailwind CSS 3 |
| Animasi | Framer Motion |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| Storage | Supabase Storage |
| Notifikasi | Telegram Bot API |
| Hosting | Vercel |
| Bahasa | TypeScript |

---

## 📝 Catatan

- Semua pembayaran adalah **simulasi demo** — tidak ada integrasi payment gateway sungguhan
- Rating toko adalah nilai **demo statis** (5.0)
- Splash screen muncul sekali per session browser (menggunakan `sessionStorage`)
- Gambar produk disimpan permanen di Supabase Storage

---

© Rekber Market — dibuat dengan Next.js + Supabase.
