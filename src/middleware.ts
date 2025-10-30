import { NextResponse } from "next/server";

export function middleware(req: any) {
  const url = req.nextUrl;
  const isAdminPage = url.pathname.startsWith("/admin");
  const isAdminLogin = url.pathname === "/admin/login";

  const adminAuth = req.cookies.get("admin-auth")?.value;

  // ✅ If user tries to access admin dashboard without admin-auth → send to admin login
  if (isAdminPage && !isAdminLogin && !adminAuth) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // ✅ If already logged in as admin and visits /admin/login → send to /admin/dashboard
  if (isAdminLogin && adminAuth) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
