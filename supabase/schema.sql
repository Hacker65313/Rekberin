-- ============================================================
--  REKBER MARKETPLACE - SUPABASE SCHEMA
--  Jalankan seluruh SQL ini di SQL Editor Supabase Anda.
-- ============================================================

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'buyer' check (role in ('buyer','seller','admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Policy: user bisa baca profile sendiri
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Trigger: auto-create profile saat user baru signup via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'buyer');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. STORES TABLE
-- ============================================================
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  banner_url text,
  whatsapp text,
  city text,
  address text,
  rating numeric(2,1) not null default 5.0,
  created_at timestamptz not null default now()
);

alter table public.stores enable row level security;

create policy "Stores are viewable by everyone"
  on public.stores for select using (true);

create policy "Owner can manage own store"
  on public.stores for all
  using ( auth.uid() = owner_id );

-- ============================================================
-- 3. PRODUCTS TABLE
-- ============================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  description text,
  price bigint not null default 0,
  stock int not null default 0,
  weight int not null default 0,
  category text not null default 'Lainnya',
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone"
  on public.products for select using (true);

create policy "Owner can manage own products"
  on public.products for all
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
      and stores.owner_id = auth.uid()
    )
  );

-- Admin bisa manage semua produk
create policy "Admin can manage all products"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ============================================================
-- 4. ORDERS TABLE
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  buyer_id uuid references auth.users(id) on delete set null,
  quantity int not null default 1,
  total_amount bigint not null default 0,
  payment_method text not null default 'transfer_bank' check (payment_method in ('transfer_bank','qris','cod')),
  status text not null default 'menunggu_pembayaran' check (status in ('menunggu_pembayaran','lunas','diproses','dikirim','selesai')),
  shipping_address jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Buyer bisa lihat order sendiri, seller bisa lihat order tokonya, admin lihat semua
create policy "Buyers can view own orders"
  on public.orders for select
  using ( auth.uid() = buyer_id );

create policy "Sellers can view own store orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.stores
      where stores.id = orders.store_id
      and stores.owner_id = auth.uid()
    )
  );

create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Anyone (termasuk guest checkout) bisa insert order
create policy "Anyone can create order"
  on public.orders for insert
  with check (true);

-- Admin & seller bisa update status
create policy "Sellers can update own store orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.stores
      where stores.id = orders.store_id
      and stores.owner_id = auth.uid()
    )
  );

create policy "Admins can update all orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ============================================================
-- 5. STORAGE BUCKET
-- ============================================================
-- Bucket 'products' untuk gambar produk & 'stores' untuk logo/banner toko
insert into storage.buckets (id, name, public) values ('products','products',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('stores','stores',true) on conflict (id) do nothing;

-- Policy storage: public read
create policy "Public read storage" on storage.objects for select
  using ( bucket_id in ('products','stores') );

-- Policy storage: hanya user ter-auth yang upload
create policy "Auth users can upload" on storage.objects for insert
  with check ( auth.role() = 'authenticated' );

create policy "Auth users can update own" on storage.objects for update
  using ( auth.uid() = owner );

create policy "Auth users can delete own" on storage.objects for delete
  using ( auth.uid() = owner );

-- ============================================================
-- 6. SEED ADMIN (opsional, jalankan manual dengan email Anda)
-- ============================================================
-- Catatan: Admin dibuat melalui endpoint /admin/seed di Next.js
-- (menggunakan env ADMIN_SEED_EMAIL & ADMIN_SEED_PASSWORD)
-- agar password di-hash oleh Supabase Auth.
