import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { cleanEnvValue } from "@/lib/env";

const CHANGE_PASSWORD_PATH = "/admin/change-password";
const LOGIN_PATH = "/admin/login";

/**
 * Refreshes the Supabase auth session for /admin routes and guards them.
 * When Supabase is not configured, requests pass through so admin pages can
 * render a "configure Supabase" message instead of crashing.
 */
export async function updateSession(request: NextRequest) {
  const url = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const key = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");

  let response = NextResponse.next({ request });

  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isLogin = path === LOGIN_PATH;
  const isChangePassword = path === CHANGE_PASSWORD_PATH;
  const isPublicAdmin = isLogin;

  if (!user && !isPublicAdmin && !isChangePassword) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_PATH;
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isLogin) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    return NextResponse.redirect(redirectUrl);
  }

  if (!user && isChangePassword) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_PATH;
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
