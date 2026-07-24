import { NextRequest, NextResponse } from 'next/server';

/**
 * Notifikasi Telegram: Pesanan baru.
 * Mengirim nama toko, nama produk, nominal, status.
 * TIDAK mengirim data sensitif.
 */
export async function POST(req: NextRequest) {
  try {
    const { storeName, productName, amount, status } = await req.json();

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.log('[Telegram][Skipped] New order:', storeName, productName, amount);
      return NextResponse.json({ ok: true, skipped: true });
    }

    const text = [
      '🛒 *Pesanan Baru*',
      '',
      `🏬 Toko: ${storeName}`,
      `📦 Produk: ${productName}`,
      `💰 Nominal: Rp ${Number(amount || 0).toLocaleString('id-ID')}`,
      `📌 Status: ${status}`,
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
