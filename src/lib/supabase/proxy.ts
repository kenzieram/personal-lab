import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig, isAdminUser, isAppConfigured } from "@/lib/supabase/env";

export async function updateProxySession(request: NextRequest) {
  const responseForRequest = () => NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;
  const isLogin = pathname === "/login";
  const isHome = pathname === "/";
  const isPublic = isLogin || isHome;
  const refreshedCookies: { name: string; value: string; options: CookieOptions }[] = [];
  const redirectTo = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url);
    refreshedCookies.forEach(({ name, value, options }) => redirectResponse.cookies.set(name, value, options));
    return redirectResponse;
  };

  if (!isAppConfigured()) {
    if (isPublic) return responseForRequest();
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "setup");
    return redirectTo(url);
  }

  const { url, anonKey } = getSupabaseConfig();
  let response = responseForRequest();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies: { name: string; value: string; options: CookieOptions }[]) {
        refreshedCookies.push(...cookies);
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = responseForRequest();
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    if (isPublic) return response;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return redirectTo(redirectUrl);
  }

  if (!isAdminUser(user.id)) {
    if (isPublic) return response;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("error", "unauthorized");
    return redirectTo(redirectUrl);
  }

  if (isLogin || isHome) return redirectTo(new URL("/dashboard", request.url));
  return response;
}
