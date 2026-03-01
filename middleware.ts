import { NextResponse, type NextRequest } from "next/server";
import { securityHeaders } from "@/lib/security";

export async function middleware(_req: NextRequest) {
  const res = NextResponse.next();
  const sec = securityHeaders();
  Object.entries(sec).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export const config = {
  matcher: ["/:path*"]
};
