import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function requireRole(role: 'seller' | 'admin') {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect('/login');
  }
  if (role === 'admin' && profile?.role !== 'admin') {
    redirect('/');
  }
  if (role === 'seller' && !['seller', 'admin'].includes(profile?.role as string)) {
    redirect('/dashboard');
  }
  return profile;
}

export { createClient };
