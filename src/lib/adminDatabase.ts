import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { hasAdminSession } from "@/lib/adminSession";
import { getStoreDatabase } from "@/lib/storeDatabase";
import { isSameOrigin } from "@/lib/sameOrigin";

export function adminJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function requireAdminDatabase(request: NextRequest) {
  if (!hasAdminSession(request)) {
    return { error: adminJson({ error: "Admin hisobiga kiring." }, 401) };
  }
  if (request.method !== "GET" && !isSameOrigin(request)) {
    return { error: adminJson({ error: "Ruxsat berilmadi." }, 403) };
  }

  const database = getStoreDatabase();
  if (!database) {
    return { error: adminJson({ error: "Baza sozlamalari topilmadi." }, 503) };
  }
  return { database };
}
