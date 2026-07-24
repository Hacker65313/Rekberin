'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isValidEmail } from '@/lib/utils';
import { ToastProvider, useToast } from '@/components/Toast';

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  return (
    <ToastProvider>
      <InnerForm redirectTo={redirectTo} />
    </ToastProvider>
  );
}

function InnerForm({ redirectTo }: { redirectTo?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();
  const { push } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!isValidEmail(email)) {
      setErr('Format email tidak valid');
      return;
    }
    if (password.length < 6) {
      setErr('Password minimal 6 karakter');
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      push('Berhasil masuk!', 'success');
      router.push(redirectTo || '/dashboard');
      router.refresh();
    } catch (error: any) {
      setErr(error?.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="card p-6 sm:p-8">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
              <svg viewBox="0 0 100 100" className="h-6 w-6" fill="none">
                <path
                  d="M28 64 L28 38 Q28 30 36 30 L52 30 Q64 30 64 40 Q64 50 52 50 L40 50"
                  stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
                />
                <circle cx="68" cy="64" r="9" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-extrabold">
              Rekber<span className="text-brand-500">Market</span>
            </span>
          </Link>
          <h1 className="mt-5 text-2xl font-bold text-gray-900">Selamat Datang</h1>
          <p className="mt-1 text-sm text-gray-500">Masuk untuk lanjut berbelanja</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {err && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {err}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <svg className="h-5 w-5 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.2-8.5" />
              </svg>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
      <p className="mt-4 text-center text-xs text-gray-400">
        🔒 Password di-hash & disimpan aman oleh Supabase Auth.
      </p>
    </div>
  );
}
