import { createClient } from '@/lib/supabase/server';
import StoreForm from './store-form';
import type { Store } from '@/lib/types';

export const revalidate = 0;

export default async function StorePage() {
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

  return <StoreForm store={(store as Store) || null} ownerId={user.id} />;
}
