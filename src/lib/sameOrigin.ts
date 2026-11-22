import type { NextRequest } from "next/server";

export function isSameOrigin(request: NextRequest) {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  return Boolean(host && origin === request.nextUrl.protocol + "//" + host);
}
