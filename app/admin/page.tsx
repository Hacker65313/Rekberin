import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminPanel from './admin-client';

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  const [
    { count: usersCount },
    { count: storesCount },
    { count: productsCount },
    { count: ordersCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('stores').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
  ]);

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('*, product:products(*), store:stores(name)')
    .order('created_at', { ascending: false })
    .limit(20);

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <AdminPanel
      stats={{
        users: usersCount || 0,
        stores: storesCount || 0,
        products: productsCount || 0,
        orders: ordersCount || 0,
      }}
      recentOrders={(recentOrders as any) || []}
      recentUsers={recentUsers || []}
      email={user.email || ''}
    />
  );
}
