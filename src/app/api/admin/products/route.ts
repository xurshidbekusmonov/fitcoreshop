import type { NextRequest } from "next/server";
import { adminJson, requireAdminDatabase } from "@/lib/adminDatabase";
import { isRecord, readStoreId } from "@/lib/storeInput";

const textFields = ["title", "brand", "category", "flavor", "weight_volume", "badge", "image_url", "goal"] as const;

function readProduct(value: unknown) {
  if (!isRecord(value) || typeof value.title !== "string" || !value.title.trim()) return null;
  const { price, old_price: oldPrice } = value;
  if (
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price <= 0 ||
    (oldPrice !== null && (typeof oldPrice !== "number" || !Number.isFinite(oldPrice) || oldPrice <= 0))
  ) return null;

  const product: Record<string, string | number | null> = { price, old_price: oldPrice };
  for (const field of textFields) {
    const text = value[field];
    if (text === undefined && field === "goal") continue;
    if (text === null && (field === "goal" || field === "badge")) {
      product[field] = null;
    } else if (typeof text === "string" && text.length <= (field === "image_url" ? 4096 : 255)) {
      product[field] = text.trim();
    } else {
      return null;
    }
  }
  return product;
}

export async function GET(request: NextRequest) {
  const access = requireAdminDatabase(request);
  if (access.error) return access.error;

  const [products, goal] = await Promise.all([
    access.database.from("products").select("*").order("id", { ascending: false }),
    access.database.from("products").select("goal").limit(1),
  ]);
  if (products.error) {
    console.error("Admin product read failed", products.error.code);
    return adminJson({ error: "Mahsulotlarni yuklab bo‘lmadi." }, 500);
  }
  return adminJson({ products: products.data, goalColumnAvailable: !goal.error });
}

export async function POST(request: NextRequest) {
  const access = requireAdminDatabase(request);
  if (access.error) return access.error;

  const body: unknown = await request.json().catch(() => null);
  const product = isRecord(body) ? readProduct(body.product) : null;
  if (!product || !isRecord(body)) {
    return adminJson({ error: "Mahsulot ma’lumotlarini tekshiring." }, 400);
  }

  const id = readStoreId(body.id);
  if (body.id !== null && !id) {
    return adminJson({ error: "Mahsulot raqami noto‘g‘ri." }, 400);
  }

  const products = access.database.from("products");
  const { data, error } = await (id ? products.update(product).eq("id", id) : products.insert(product))
    .select("id").maybeSingle();
  if (error) {
    console.error("Admin product save failed", error.code);
    return adminJson({ error: "Mahsulotni saqlab bo‘lmadi." }, 500);
  }
  if (!data) return adminJson({ error: "Mahsulot topilmadi." }, 404);
  return adminJson({ success: true });
}

export async function DELETE(request: NextRequest) {
  const access = requireAdminDatabase(request);
  if (access.error) return access.error;

  const id = readStoreId(request.nextUrl.searchParams.get("id"));
  if (!id) return adminJson({ error: "Mahsulot raqami noto‘g‘ri." }, 400);

  const { error } = await access.database.from("products").delete().eq("id", id);
  if (error) {
    console.error("Admin product delete failed", error.code);
    return adminJson({ error: "Mahsulotni o‘chirib bo‘lmadi." }, 500);
  }
  return adminJson({ success: true });
}
