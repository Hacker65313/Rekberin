'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { ToastProvider } from '@/components/Toast';
import type { Profile } from '@/lib/types';

interface ShellProps {
  profile: Profile;
  email: string;
  children: ReactNode;
}

export default function DashboardShell({ profile, email, children }: ShellProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const links = [
    { href: '/dashboard', label: 'Overview', icon: '🏠' },
    { href: '/dashboard/store', label: 'Toko Saya', icon: '🏬' },
    { href: '/dashboard/products', label: 'Produk', icon: '📦' },
    { href: '/dashboard/products/new', label: 'Tambah Produk', icon: '➕' },
    { href: '/dashboard/orders', label: 'Pesanan', icon: '🧾' },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Admin Panel', icon: '🛡️' },
  ];

  const isActive = (href: string) =>
    href === '/dashboard' ? path === href : path.startsWith(href);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50/60">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen((v) => !v)}
                className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                aria-label="Menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                  <svg viewBox="0 0 100 100" className="h-5 w-5" fill="none">
                    <path
                      d="M28 64 L28 38 Q28 30 36 30 L52 30 Q64 30 64 40 Q64 50 52 50 L40 50"
                      stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <circle cx="68" cy="64" r="9" fill="white" />
                  </svg>
                </div>
                <span className="hidden font-extrabold sm:inline">
                  Rekber<span className="text-brand-500">Market</span>
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium text-gray-800">{email}</div>
                <div className="text-xs capitalize text-gray-400">{profile.role}</div>
              </div>
              <button onClick={logout} className="btn-outline px-4 py-2 text-xs">
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-7xl">
          {/* Sidebar */}
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-30 w-64 transform border-r border-gray-100 bg-white p-4 pt-20 transition-transform md:relative md:translate-x-0 md:pt-4',
              open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            )}
          >
            <nav className="space-y-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive(l.href)
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-gray-600 hover:bg-gray-100',
                  )}
                >
                  <span className="text-base">{l.icon}</span>
                  {l.label}
                </Link>
              ))}

              {profile.role === 'admin' && (
                <>
                  <div className="my-3 border-t border-gray-100" />
                  {adminLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors',
                        path.startsWith(l.href)
                          ? 'bg-brand-50 text-brand-600'
                          : 'text-gray-600 hover:bg-gray-100',
                      )}
                    >
                      <span className="text-base">{l.icon}</span>
                      {l.label}
                    </Link>
                  ))}
                </>
              )}
            </nav>

            {/* Overlay close on mobile */}
            {open && (
              <div
                onClick={() => setOpen(false)}
                className="fixed inset-0 -left-0 -z-10 h-screen md:hidden"
              />
            )}
          </aside>

          {open && (
            <div
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-0 z-20 bg-black/20 md:hidden"
            />
          )}

          {/* Main */}
          <main className="min-h-screen flex-1 px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
