import type { NextRequest } from "next/server";
import { adminJson, requireAdminDatabase } from "@/lib/adminDatabase";
import { isRecord } from "@/lib/storeInput";

export async function GET(request: NextRequest) {
  const access = requireAdminDatabase(request);
  if (access.error) return access.error;

  const { data, error } = await access.database
    .from("orders")
    .select("id, customer_name, customer_phone, shipping_address, total_amount, items, created_at")
    .order("created_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false });

  if (error) {
    console.error("Admin order read failed", error.code);
    return adminJson({ error: "Buyurtmalarni yuklab bo‘lmadi." }, 500);
  }
  const orders = data.map((order) => ({
    ...order,
    items: Array.isArray(order.items)
      ? order.items.filter((item: unknown) =>
          isRecord(item) &&
          typeof item.title === "string" &&
          (typeof item.quantity === "number" || typeof item.quantity === "string") &&
          (typeof item.price === "number" || typeof item.price === "string") &&
          Number.isFinite(Number(item.quantity)) &&
          Number.isFinite(Number(item.price)),
        )
      : [],
  }));
  return adminJson({ orders });
}
