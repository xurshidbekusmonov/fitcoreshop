import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, address, items, totalAmount } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 1. Kalitlar borligini tekshiramiz
    if (!botToken || !chatId) {
      console.error('XATOLIK: .env.local ichida TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID topilmadi!');
      return NextResponse.json({ error: 'Telegram sozlamalari topilmadi' }, { status: 500 });
    }

    const itemsList = items
      .map(
        (it: any, idx: number) =>
          `${idx + 1}. <b>${it.title}</b>\n   └ ${it.quantity} x ${Number(it.price).toLocaleString('uz-UZ')} so'm = <b>${Number(it.price * it.quantity).toLocaleString('uz-UZ')} so'm</b>`
      )
      .join('\n');

    const message = `
🛍 <b>YANGI BUYURTMA #FITCORE</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${name}
📞 <b>Telefon:</b> ${phone}
📍 <b>Manzil:</b> ${address}
━━━━━━━━━━━━━━━━━━
🛒 <b>Xarid qilingan tovarlar:</b>
${itemsList}

💰 <b>Jami to'lov:</b> ${Number(totalAmount).toLocaleString('uz-UZ')} so'm
🕒 <b>Vaqti:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}
    `.trim();

    // 2. Telegramga so'rov yuborish
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const resData = await res.json();

    // Agar Telegram xato qaytarsa, terminalda aniq ko'rsatadi
    if (!res.ok) {
      console.error('TELEGRAM BERGAN XATOLIK:', resData);
      return NextResponse.json({ error: resData.description || 'Telegram xatosi' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('SERVER XATOLIGI:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}