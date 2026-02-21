import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/profile", "/cart"]
const authRoutes = ["/login", "/register"]

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const { pathname } = req.nextUrl

  if (protectedRoutes.includes(pathname)) {
    if (!token) {
      const redirectURL = new URL("/login", req.url)
      redirectURL.searchParams.set("url", pathname)
      return NextResponse.redirect(redirectURL)
    }
  }

  if (authRoutes.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}