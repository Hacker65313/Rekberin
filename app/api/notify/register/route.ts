import { NextRequest, NextResponse } from 'next/server';

/**
 * Notifikasi Telegram: Pengguna baru mendaftar.
 * Mengirim email + waktu pendaftaran. TIDAK mengirim password.
 */
export async function POST(req: NextRequest) {
  try {
    const { email, time } = await req.json();
    if (!email) return NextResponse.json({ ok: false }, { status: 400 });

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // Jika belum dikonfigurasi, tetap return sukses (mode demo)
    if (!token || !chatId) {
      console.log('[Telegram][Skipped] New user:', email);
      return NextResponse.json({ ok: true, skipped: true });
    }

    const text = [
      '🆕 *Pendaftar Baru*',
      '',
      `📧 Email: \`${email}\``,
      `🕐 Waktu: ${new Date(time || Date.now()).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`,
      '',
      '— Rekber Market Bot',
    ].join('\n');

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      },
    );

    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ ok: false, error: t }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
