import { NextRequest, NextResponse } from "next/server";
import {
  adminCookie,
  adminSessionSeconds,
  hasAdminSession,
  secretsEqual,
  signAdminSession,
} from "@/lib/adminSession";
import { isRecord } from "@/lib/storeInput";
import { isSameOrigin } from "@/lib/sameOrigin";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { authenticated: hasAdminSession(req) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Ruxsat berilmadi" }, { status: 403 });
  }

  const body: unknown = await req.json().catch(() => null);
  if (!isRecord(body)) {
    return NextResponse.json({ error: "Kirish ma’lumotlari noto‘g‘ri" }, { status: 400 });
  }

  const { login, password: input } = body;
  const expectedLogin = process.env.ADMIN_LOGIN;
  const password = process.env.ADMIN_PASSWORD;
  if (!expectedLogin || !password) {
    return NextResponse.json(
      { error: "Admin kirish sozlamalari topilmadi" },
      { status: 503 },
    );
  }

  if (
    typeof login !== "string" ||
    typeof input !== "string" ||
    !secretsEqual(login, expectedLogin) ||
    !secretsEqual(input, password)
  ) {
    return NextResponse.json(
      { error: "Login yoki parol noto‘g‘ri" },
      { status: 401 },
    );
  }

  const expiry = String(Date.now() + adminSessionSeconds * 1000);
  const res = NextResponse.json({ authenticated: true });
  res.cookies.set(adminCookie, expiry + "." + signAdminSession(expiry, password), {
    httpOnly: true,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "strict",
    path: "/",
    maxAge: adminSessionSeconds,
  });
  return res;
}

export async function DELETE(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Ruxsat berilmadi" }, { status: 403 });
  }

  const res = NextResponse.json({ authenticated: false });
  res.cookies.set(adminCookie, "", { path: "/", maxAge: 0 });
  return res;
}
