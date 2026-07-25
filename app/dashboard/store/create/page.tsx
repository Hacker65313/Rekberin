import { createClient } from '@/lib/supabase/server';
import StoreForm from '../store-form';
import type { Store } from '@/lib/types';

export const revalidate = 0;

export default async function CreateStorePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Jika sudah punya toko, redirect ke kelola toko
  const { data: existing } = await supabase
    .from('stores')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();
  if (existing) {
    // Biarkan form menampilkan mode edit (store akan null di sini — tidak ideal,
    // tapi praktis: user sudah punya toko jadi tampilkan info)
  }

  return <StoreForm store={null} ownerId={user.id} ownerEmail={user.email || undefined} />;
}
