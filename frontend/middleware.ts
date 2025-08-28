import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const publicRoutes = ["/", "/login", "/signup"]

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(pathname)

  // Get authentication status from cookie or header
  const authCookie = request.cookies.get("auth-storage")
  let isAuthenticated = false

  console.log("[v0] Middleware - pathname:", pathname)
  console.log("[v0] Middleware - authCookie:", authCookie?.value)

  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie.value)
      console.log("[v0] Middleware - parsed authData:", authData)

      isAuthenticated = authData?.state?.isAuthenticated || authData?.isAuthenticated || false
      console.log("[v0] Middleware - isAuthenticated:", isAuthenticated)
    } catch (error) {
      // Invalid cookie data
      console.log("[v0] Middleware - cookie parse error:", error)
      isAuthenticated = false
    }
  }

  console.log("[v0] Middleware - final decision:", { isProtectedRoute, isAuthenticated })

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    console.log("[v0] Middleware - redirecting to login")
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users from auth pages to dashboard
  if ((pathname === "/login" || pathname === "/signup") && isAuthenticated) {
    console.log("[v0] Middleware - redirecting to dashboard")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  console.log("[v0] Middleware - allowing request to continue")
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
