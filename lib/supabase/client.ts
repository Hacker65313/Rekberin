import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client untuk digunakan di sisi Browser (Client Components).
 * Membaca URL & anon key dari environment variable.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
