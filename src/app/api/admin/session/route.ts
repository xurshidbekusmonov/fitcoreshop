import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
const cookieName = "fitcore_admin_session";
const password = () =>
  process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const signature = (value: string) =>
  createHmac("sha256", password() || "unconfigured")
    .update(value)
    .digest("hex");
const equal = (a: string, b: string) => {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};
function authenticated(req: NextRequest) {
  const token = req.cookies.get(cookieName)?.value;
  if (!token || !password()) return false;
  const [expiry, hash] = token.split(".");
  return (
    Number(expiry) > Date.now() && !!hash && equal(signature(expiry), hash)
  );
}
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { authenticated: authenticated(req) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin)
    return NextResponse.json({ error: "Ruxsat berilmadi" }, { status: 403 });
  const { login, password: input } = await req.json();
  const expectedLogin =
    process.env.ADMIN_LOGIN || process.env.NEXT_PUBLIC_ADMIN_LOGIN;
  if (!expectedLogin || !password())
    return NextResponse.json(
      { error: "Admin kirish sozlamalari topilmadi" },
      { status: 503 },
    );
  if (
    typeof login !== "string" ||
    typeof input !== "string" ||
    !equal(login, expectedLogin) ||
    !equal(input, password()!)
  )
    return NextResponse.json(
      { error: "Login yoki parol noto‘g‘ri" },
      { status: 401 },
    );
  const expiry = String(Date.now() + 8 * 60 * 60 * 1000);
  const res = NextResponse.json({ authenticated: true });
  res.cookies.set(cookieName, `${expiry}.${signature(expiry)}`, {
    httpOnly: true,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return res;
}
export async function DELETE(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin)
    return NextResponse.json({ error: "Ruxsat berilmadi" }, { status: 403 });
  const res = NextResponse.json({ authenticated: false });
  res.cookies.set(cookieName, "", { path: "/", maxAge: 0 });
  return res;
}
