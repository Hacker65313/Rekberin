'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isValidEmail } from '@/lib/utils';
import { ToastProvider, useToast } from '@/components/Toast';

interface FormState {
  email: string;
  password: string;
  confirm: string;
}

const initial: FormState = { email: '', password: '', confirm: '' };

export default function RegisterForm() {
  return (
    <ToastProvider>
      <InnerForm />
    </ToastProvider>
  );
}

function InnerForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();
  const { push } = useToast();

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = (): string | null => {
    if (!isValidEmail(form.email)) return 'Format email tidak valid';
    if (form.password.length < 6) return 'Password minimal 6 karakter';
    if (form.password !== form.confirm) return 'Konfirmasi password tidak cocok';
    if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))
      return 'Password harus mengandung huruf dan angka';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
      });
      if (error) throw error;

      // Kirim notifikasi Telegram (route handler, tanpa data sensitif)
      try {
        await fetch('/api/notify/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email.trim(),
            time: new Date().toISOString(),
          }),
        });
      } catch {
        // opsional, jangan blokir registrasi
      }

      if (data.session) {
        push('Pendaftaran berhasil! Selamat datang 🎉', 'success');
        router.push('/dashboard');
        router.refresh();
      } else {
        push('Cek email Anda untuk konfirmasi (jika diperlukan).', 'info');
        router.push('/login');
      }
    } catch (error: any) {
      setErr(error?.message || 'Gagal mendaftar');
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
          <h1 className="mt-5 text-2xl font-bold text-gray-900">Buat Akun Baru</h1>
          <p className="mt-1 text-sm text-gray-500">Gratis, mudah, & aman</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="nama@email.com"
              value={form.email}
              onChange={update('email')}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Min. 6 karakter, huruf & angka"
              value={form.password}
              onChange={update('password')}
              autoComplete="new-password"
              required
            />
            <p className="mt-1 text-xs text-gray-400">
              Password di-hash menggunakan algoritma aman Supabase Auth.
            </p>
          </div>
          <div>
            <label className="label">Konfirmasi Password</label>
            <input
              type="password"
              className="input"
              placeholder="Ulangi password"
              value={form.confirm}
              onChange={update('confirm')}
              autoComplete="new-password"
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
              'Daftar Sekarang'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
