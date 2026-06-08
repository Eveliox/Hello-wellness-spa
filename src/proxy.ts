import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PORTAL_PATHS = new Set([
  "/portal/login",
  "/portal/signup",
  "/portal/forgot-password",
  "/portal/reset-password",
]);

/**
 * Root proxy (Next.js 16+; replaces the old `middleware` convention):
 *   - Refreshes the Supabase Auth cookie on every request so sessions don't
 *     expire mid-visit.
 *   - Gates /portal/* (except the auth pages) behind a valid session.
 *     Unauthenticated visitors are bounced to /portal/login with `?next=` so
 *     we can send them back where they came from after sign-in.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPortalRoute = pathname.startsWith("/portal");
  const isPublicPortalPath = PUBLIC_PORTAL_PATHS.has(pathname);

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
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

  if (isPortalRoute && !isPublicPortalPath && !user) {
    const loginUrl = new URL("/portal/login", request.url);
    if (pathname !== "/portal") loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && (pathname === "/portal/login" || pathname === "/portal/signup")) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *   - _next/static, _next/image (static assets)
     *   - favicon, robots, sitemap, icon, opengraph-image
     *   - public files with extensions (.png, .jpg, .svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|icon|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
