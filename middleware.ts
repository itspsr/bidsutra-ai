import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getClientEnv } from "@/lib/env";

const DASH = [
  "/overview",
  "/tender-upload",
  "/risk-breakdown",
  "/compliance-center",
  "/gem-alerts",
  "/billing",
  "/settings"
];

const OWNER_ADMIN_ONLY = ["/billing", "/settings"]; // settings: org/user mgmt would live here

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const isDashboard = DASH.some((p) => pathname.startsWith(p));
  if (!isDashboard) return NextResponse.next();

  const next = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const env = getClientEnv();
  const res = NextResponse.next();

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, org_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.org_id) {
    const url = req.nextUrl.clone();
    url.pathname = "/overview";
    return NextResponse.redirect(url);
  }

  if (OWNER_ADMIN_ONLY.some((p) => pathname.startsWith(p))) {
    if (!(profile.role === "owner" || profile.role === "admin")) {
      const url = req.nextUrl.clone();
      url.pathname = "/overview";
      url.searchParams.set("forbidden", "1");
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/overview/:path*",
    "/tender-upload/:path*",
    "/risk-breakdown/:path*",
    "/compliance-center/:path*",
    "/gem-alerts/:path*",
    "/billing/:path*",
    "/settings/:path*"
  ]
};
