import { after, NextRequest, NextResponse } from "next/server";
import { getStoreDatabase } from "@/lib/storeDatabase";
import { isRecord, readStoreId, uuidPattern } from "@/lib/storeInput";
import { isSameOrigin } from "@/lib/sameOrigin";

function readOrder(body: unknown) {
  if (!isRecord(body)) return null;
  const { name, phone, address, requestId, expectedTotal, items } = body;

  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 120 ||
    typeof phone !== "string" ||
    !/^\+?[\d ()-]{9,30}$/.test(phone.trim()) ||
    !/^\d{9,15}$/.test(phone.replace(/\D/g, "")) ||
    typeof address !== "string" ||
    address.length > 500 ||
    typeof requestId !== "string" ||
    !uuidPattern.test(requestId) ||
    typeof expectedTotal !== "number" ||
    !Number.isFinite(expectedTotal) ||
    expectedTotal < 0 ||
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 100
  ) return null;

  const quantities = new Map<string, number>();
  for (const item of items) {
    if (!isRecord(item)) return null;
    const id = readStoreId(item.id);
    const { quantity } = item;
    if (!id || quantities.has(id) || typeof quantity !== "number" || !Number.isSafeInteger(quantity) || quantity <= 0) {
      return null;
    }
    quantities.set(id, quantity);
  }

  return { name: name.trim(), phone: phone.trim(), address: address.trim(), requestId, expectedTotal, quantities };
}

async function notifyTelegram(orderId: string, message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.error("Telegram notification is not configured", orderId);
    return;
  }

  try {
    const response = await fetch("https://api.telegram.org/bot" + botToken + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) console.error("Telegram notification rejected", orderId, response.status);
  } catch {
    console.error("Telegram notification request failed", orderId);
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Ruxsat berilmadi." }, { status: 403 });
  }

  const body: unknown = await request.json().catch(() => null);
  const order = readOrder(body);
  if (!order) {
    return NextResponse.json({ error: "Buyurtma ma’lumotlari noto‘g‘ri." }, { status: 400 });
  }

  const database = getStoreDatabase();
  if (!database) {
    return NextResponse.json({ error: "Buyurtma xizmati sozlanmagan." }, { status: 503 });
  }

  const previous = await database.from("orders").select("id").eq("request_id", order.requestId).maybeSingle();
  if (previous.error) {
    console.error("Order request lookup failed", previous.error.code);
    return NextResponse.json({ error: "Buyurtmani saqlab bo‘lmadi." }, { status: 500 });
  }
  if (previous.data) return NextResponse.json({ success: true });

  const ids = [...order.quantities.keys()];
  const { data: products, error: productError } = await database.from("products").select("*").in("id", ids);
  if (productError) {
    console.error("Order product lookup failed", productError.code);
    return NextResponse.json({ error: "Mahsulot narxini tekshirib bo‘lmadi." }, { status: 500 });
  }

  const productsById = new Map(products.map((product) => [String(product.id), product]));
  const items = [];
  let totalAmount = 0;
  for (const [id, quantity] of order.quantities) {
    const product = productsById.get(id);
    const price = Number(product?.price);
    if (
      !product ||
      typeof product.title !== "string" ||
      product.stock === 0 ||
      product.in_stock === false ||
      (typeof product.stock === "number" && quantity > product.stock) ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return NextResponse.json({ code: "PRODUCT_UNAVAILABLE" }, { status: 409 });
    }

    totalAmount += price * quantity;
    items.push({ id: product.id, title: product.title, price, quantity, flavor: product.flavor });
  }

  if (!Number.isFinite(totalAmount) || Math.abs(totalAmount - order.expectedTotal) > 0.005) {
    return NextResponse.json({ code: "PRICE_CHANGED" }, { status: 409 });
  }

  const createdAt = new Date();
  const { data: saved, error: saveError } = await database
    .from("orders")
    .upsert({
      request_id: order.requestId,
      customer_name: order.name,
      customer_phone: order.phone,
      shipping_address: order.address,
      items,
      total_amount: totalAmount,
      created_at: createdAt.toISOString(),
    }, { onConflict: "request_id", ignoreDuplicates: true })
    .select("id")
    .maybeSingle();

  if (saveError) {
    console.error("Order save failed", saveError.code);
    return NextResponse.json({ error: "Buyurtmani saqlab bo‘lmadi." }, { status: 500 });
  }
  if (!saved) return NextResponse.json({ success: true });

  const orderId = String(saved.id);
  const amount = totalAmount.toLocaleString("uz-UZ");
  const itemSummary = items.map(({ title, quantity, price }) =>
    title + " · " + quantity + " × " + price.toLocaleString("uz-UZ") + " so‘m"
  ).join("\n");
  const message = [
    "Yangi FitCoreShop buyurtmasi #" + orderId,
    "Mijoz: " + order.name,
    "Telefon: " + order.phone,
    "Manzil: " + (order.address || "Ko‘rsatilmagan"),
    "Jami: " + amount + " so‘m",
    "Vaqt: " + createdAt.toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" }),
    "",
    itemSummary.length <= 2600 ? itemSummary : itemSummary.slice(0, 2500) + "\nTo‘liq ro‘yxat admin panelda.",
  ].join("\n");

  after(() => notifyTelegram(orderId, message));
  return NextResponse.json({ success: true }, { status: 201 });
}
