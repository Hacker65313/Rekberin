import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import InfoForm from './info-form';
import type { Store } from '@/lib/types';

export const revalidate = 0;

export default async function EditInfoPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!store) {
    redirect('/dashboard/store');
  }

  return <InfoForm store={store as Store} />;
}
