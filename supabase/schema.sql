-- ============================================================
--  REKBER MARKETPLACE - SUPABASE SCHEMA (v2)
--  Jalankan seluruh SQL ini di SQL Editor Supabase Anda.
--  Jika sudah punya schema v1, jalankan bagian ALTER untuk
--  menambah kolom baru.
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
-- 2. STORES TABLE (dengan kategori & data pembayaran)
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
  category text not null default 'Lainnya',
  bank_name text,
  bank_account_name text,
  bank_account_number text,
  ewallet_name text,
  ewallet_number text,
  rating numeric(2,1) not null default 5.0,
  created_at timestamptz not null default now()
);

-- ALTER: tambah kolom baru jika tabel sudah ada (untuk upgrade dari v1)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='stores' and column_name='category') then
    alter table public.stores add column category text not null default 'Lainnya';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='stores' and column_name='bank_name') then
    alter table public.stores add column bank_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='stores' and column_name='bank_account_name') then
    alter table public.stores add column bank_account_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='stores' and column_name='bank_account_number') then
    alter table public.stores add column bank_account_number text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='stores' and column_name='ewallet_name') then
    alter table public.stores add column ewallet_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='stores' and column_name='ewallet_number') then
    alter table public.stores add column ewallet_number text;
  end if;
end$$;

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

create policy "Admin can manage all products"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- ============================================================
-- 4. ORDERS TABLE (dengan jasa pengiriman, ongkir, biaya admin)
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  buyer_id uuid references auth.users(id) on delete set null,
  quantity int not null default 1,
  total_amount bigint not null default 0,
  payment_method text not null default 'transfer_bank' check (payment_method in ('transfer_bank','qris','cod')),
  shipping_courier text,
  shipping_cost bigint not null default 0,
  admin_fee bigint not null default 0,
  status text not null default 'menunggu_pembayaran' check (status in ('menunggu_pembayaran','pembayaran_dikonfirmasi','menunggu_konfirmasi_seller','diproses','dikirim','selesai')),
  shipping_address jsonb not null,
  created_at timestamptz not null default now()
);

-- ALTER: tambah kolom baru jika tabel sudah ada (untuk upgrade dari v1)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='orders' and column_name='shipping_courier') then
    alter table public.orders add column shipping_courier text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='orders' and column_name='shipping_cost') then
    alter table public.orders add column shipping_cost bigint not null default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='orders' and column_name='admin_fee') then
    alter table public.orders add column admin_fee bigint not null default 0;
  end if;
end$$;

-- ALTER: perbarui CHECK constraint status agar menerima status baru
-- (menunggu_konfirmasi_seller untuk COD, pembayaran_dikonfirmasi untuk Transfer/QRIS)
do $$
begin
  -- Drop constraint lama jika ada, lalu buat ulang dengan daftar status baru
  if exists (
    select 1 from pg_constraint
    where conname = 'orders_status_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders drop constraint orders_status_check;
  end if;
  alter table public.orders
    add constraint orders_status_check
    check (status in ('menunggu_pembayaran','pembayaran_dikonfirmasi','menunggu_konfirmasi_seller','diproses','dikirim','selesai'));
exception when others then
  -- Jika constraint sudah sesuai / tabel belum ada, abaikan
  null;
end$$;

alter table public.orders enable row level security;

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

create policy "Anyone can create order"
  on public.orders for insert
  with check (true);

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
insert into storage.buckets (id, name, public) values ('products','products',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('stores','stores',true) on conflict (id) do nothing;

create policy "Public read storage" on storage.objects for select
  using ( bucket_id in ('products','stores') );

create policy "Auth users can upload" on storage.objects for insert
  with check ( auth.role() = 'authenticated' );

create policy "Auth users can update own" on storage.objects for update
  using ( auth.uid() = owner );

create policy "Auth users can delete own" on storage.objects for delete
  using ( auth.uid() = owner );

-- ============================================================
-- 6. SEED ADMIN (opsional, jalankan manual dengan email Anda)
-- ============================================================
-- Catatan: Admin dibuat melalui endpoint /api/admin/seed di Next.js
-- (menggunakan env ADMIN_SEED_EMAIL & ADMIN_SEED_PASSWORD)
-- agar password di-hash oleh Supabase Auth.
