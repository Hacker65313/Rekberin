import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import RegisterForm from './register-form';

export const metadata: Metadata = {
  title: 'Daftar Akun',
  description: 'Daftar akun Rekber Market untuk mulai berjualan dan berbelanja.',
};

export default async function RegisterPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50/40 to-white px-4 py-10">
      <RegisterForm />
    </div>
  );
}
