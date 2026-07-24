import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Jalankan endpoint ini SEKALI untuk membuat akun admin.
 * Gunakan env ADMIN_SEED_EMAIL & ADMIN_SEED_PASSWORD.
 * Akses: /api/admin/seed  (GET untuk cek, POST untuk eksekusi)
 *
 * Password akan di-hash otomatis oleh Supabase Auth (bcrypt-like).
 */

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'POST ke endpoint ini dengan body kosong untuk membuat admin dari env.',
    configured: Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
        process.env.ADMIN_SEED_EMAIL &&
        process.env.ADMIN_SEED_PASSWORD,
    ),
  });
}

export async function POST() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const email = process.env.ADMIN_SEED_EMAIL!;
    const password = process.env.ADMIN_SEED_PASSWORD!;

    if (!serviceKey || !email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Env tidak lengkap (SUPABASE_SERVICE_ROLE_KEY, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD)' },
        { status: 400 },
      );
    }

    const supabase = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Cek apakah user sudah ada
    const { data: existing } = await supabase.auth.admin.listUsers();
    const found = existing.users.find((u) => u.email === email);

    let userId: string;
    if (found) {
      userId = found.id;
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) throw error;
      userId = data.user.id;
    }

    // Update role jadi admin
    const { error: upErr } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId);
    if (upErr) throw upErr;

    return NextResponse.json({
      ok: true,
      message: `Admin berhasil dibuat/diperbarui: ${email}`,
      userId,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
