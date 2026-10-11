import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (request.nextUrl.pathname !== "/login") return NextResponse.redirect(new URL("/login", request.url));
    return response;
  }
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: { getAll: () => request.cookies.getAll(), setAll(cookies: { name: string; value: string; options: CookieOptions }[]) { cookies.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const isLogin = request.nextUrl.pathname === "/login";
  const isPublic = request.nextUrl.pathname === "/" || isLogin;
  if (!user && !isPublic) { const url = request.nextUrl.clone(); url.pathname = "/login"; url.searchParams.set("next", request.nextUrl.pathname); return NextResponse.redirect(url); }
  if (user && isLogin) return NextResponse.redirect(new URL("/dashboard", request.url));
  if (user && request.nextUrl.pathname !== "/" && user.id !== process.env.ADMIN_USER_ID) return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
  if (user && request.nextUrl.pathname === "/") return NextResponse.redirect(new URL("/dashboard", request.url));
  return response;
}
