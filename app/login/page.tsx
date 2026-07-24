import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke akun Rekber Market Anda untuk mulai berjualan dan berbelanja.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50/40 to-white px-4 py-10">
      <LoginForm redirectTo={searchParams.redirect} />
    </div>
  );
}
