'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

/**
 * Hook untuk mendapatkan user Supabase di client component.
 *
 * Menggunakan getSession() (dari cache lokal, bukan network) untuk state
 * awal, lalu onAuthStateChange untuk memperbarui saat login/logout. Ini
 * menghindari auth.getUser() yang selalu memukul network dan menjadi
 * penyebab utama rate limit Supabase.
 *
 * Guard dengan ref memastikan listener auth hanya didaftarkan sekali
 * meskipun React Strict Mode menjalankan effect dua kali.
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const listenerRef = useRef<{ subscription: { unsubscribe: () => void } } | null>(null);

  useEffect(() => {
    if (listenerRef.current) {
      // Listener sudah didaftarkan — jangan duplikat (Strict Mode safety)
      return;
    }

    const supabase = createClient();

    // getSession() membaca dari cache lokal (cookie) — TIDAK network call.
    // Cukup untuk menampilkan UI state awal secepat mungkin.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // onAuthStateChange memperbarui state saat login/logout/token refresh.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    listenerRef.current = sub;

    return () => {
      sub.subscription.unsubscribe();
      listenerRef.current = null;
    };
  }, []);

  return { user, loading };
}
