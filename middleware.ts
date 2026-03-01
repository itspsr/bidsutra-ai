import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Allow build/dev even if env isn't set.
  if (!supabaseUrl || !supabaseAnonKey) return res;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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

  const isDashboard = req.nextUrl.pathname.startsWith("/overview") || req.nextUrl.pathname.startsWith("/tender-") || req.nextUrl.pathname.startsWith("/risk-") || req.nextUrl.pathname.startsWith("/compliance-") || req.nextUrl.pathname.startsWith("/gem-") || req.nextUrl.pathname.startsWith("/billing") || req.nextUrl.pathname.startsWith("/settings");

  if (isDashboard && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/signup
  if ((req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup") && user) {
    const url = req.nextUrl.clone();
    url.pathname = "/overview";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
