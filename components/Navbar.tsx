'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    window.location.href = '/';
  };

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      onClick={() => setMenuOpen(false)}
      className={cn(
        'rounded-xl px-3 py-2 text-sm font-medium transition-colors',
        pathname === href
          ? 'bg-brand-50 text-brand-600'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <svg viewBox="0 0 100 100" className="h-5 w-5" fill="none">
              <path
                d="M28 64 L28 38 Q28 30 36 30 L52 30 Q64 30 64 40 Q64 50 52 50 L40 50"
                stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
              />
              <circle cx="68" cy="64" r="9" fill="white" />
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            Rekber<span className="text-brand-500">Market</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLink('/', 'Beranda')}
          {navLink('/stores', 'Jelajah Toko')}
          {user && navLink('/dashboard', 'Dashboard')}
          {user && navLink('/dashboard/products', 'Produk Saya')}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard" className="hidden btn-ghost sm:inline-flex">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-primary px-4 py-2 text-xs">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline px-4 py-2 text-xs">
                Masuk
              </Link>
              <Link href="/register" className="btn-primary px-4 py-2 text-xs">
                Daftar
              </Link>
            </>
          )}
          <button
            className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
            )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLink('/', 'Beranda')}
            {navLink('/stores', 'Jelajah Toko')}
            {user && navLink('/dashboard', 'Dashboard')}
            {user && navLink('/dashboard/products', 'Produk Saya')}
            {user && navLink('/dashboard/orders', 'Pesanan Toko')}
          </div>
        </div>
      )}
    </header>
  );
}
