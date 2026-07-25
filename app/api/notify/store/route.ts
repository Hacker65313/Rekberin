import { NextRequest, NextResponse } from 'next/server';

/**
 * Notifikasi Telegram: Pendaftaran toko baru.
 * Mengirim: nama toko, nama pemilik, email, WhatsApp, kategori,
 * bank, nomor rekening, E-Wallet, nomor E-Wallet, waktu.
 * TIDAK mengirim data sensitif (password dll).
 * Semua via backend — token tidak pernah ke client.
 */
export async function POST(req: NextRequest) {
  try {
    const {
      storeName,
      ownerName,
      email,
      whatsapp,
      category,
      bankName,
      bankAccountNumber,
      ewalletName,
      ewalletNumber,
      time,
    } = await req.json();

    if (!storeName) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.log('[Telegram][Skipped] Store registration:', storeName);
      return NextResponse.json({ ok: true, skipped: true });
    }

    const esc = (v: unknown) => (v || '-').toString().replace(/[\\*_`]/g, ' ');

    const text = [
      '🏪 *Pendaftaran Toko Baru*',
      '',
      `🏷️ Nama Toko: ${esc(storeName)}`,
      `👤 Pemilik: ${esc(ownerName)}`,
      `📧 Email: ${esc(email)}`,
      `💬 WhatsApp: ${esc(whatsapp)}`,
      `📂 Kategori: ${esc(category)}`,
      `🏦 Bank: ${esc(bankName)} (${esc(bankAccountNumber)})`,
      `📱 E-Wallet: ${esc(ewalletName)} (${esc(ewalletNumber)})`,
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
