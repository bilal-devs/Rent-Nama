import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/verify", "/auth/callback"];
  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith("/auth/")
  );

  // If not authenticated and trying to access protected route
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If authenticated and trying to access auth pages
  if (user && (pathname === "/login" || pathname === "/signup")) {
    // Get user role from database
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    if (userData?.role === "landlord") {
      url.pathname = "/landlord";
    } else if (userData?.role === "tenant") {
      url.pathname = "/tenant";
    } else {
      url.pathname = "/";
    }
    return NextResponse.redirect(url);
  }

  // Role-based route protection
  if (user && (pathname.startsWith("/landlord") || pathname.startsWith("/tenant"))) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (pathname.startsWith("/landlord") && userData?.role !== "landlord") {
      const url = request.nextUrl.clone();
      url.pathname = "/tenant";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/tenant") && userData?.role !== "tenant") {
      const url = request.nextUrl.clone();
      url.pathname = "/landlord";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
