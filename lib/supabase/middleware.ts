import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware untuk me-refresh session Supabase & proteksi route.
 * Memastikan login tetap aktif setelah browser di-refresh / ditutup.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Jangan pernah jalankan logic di antara createServerClient dan
  // supabase.auth.getUser(). Kesalahan kecil dapat membuat susah
  // untuk debug masalah autentikasi dengan pengguna yang login.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proteksi route seller & admin (hanya redirect, biarkan halaman
  // yang menangani validasi role lebih detail).
  const protectedPaths = ['/dashboard', '/admin'];
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Jangan izinkan user yang sudah login mengakses /login /register
  const authPaths = ['/login', '/register'];
  const isAuthPath = authPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );
  if (isAuthPath && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
