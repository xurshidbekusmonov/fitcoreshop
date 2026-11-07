import { NextResponse, type NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  if (
    request.headers.get("host")?.split(":")[0] === "admin.fitcoreshop.uz" &&
    request.nextUrl.pathname === "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/"] };
