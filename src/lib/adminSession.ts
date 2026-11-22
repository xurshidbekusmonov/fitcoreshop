import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const adminCookie = "fitcore_admin_session";
export const adminSessionSeconds = 8 * 60 * 60;

export function secretsEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function signAdminSession(expiry: string, password: string) {
  return createHmac("sha256", password).update(expiry).digest("hex");
}

export function hasAdminSession(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  const token = request.cookies.get(adminCookie)?.value;
  if (!password || !token) return false;

  const [expiry, signature, extra] = token.split(".");
  return (
    extra === undefined &&
    /^\d{13}$/.test(expiry) &&
    Number(expiry) > Date.now() &&
    typeof signature === "string" &&
    secretsEqual(signature, signAdminSession(expiry, password))
  );
}
