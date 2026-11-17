import { NextResponse, type NextRequest } from "next/server"

export function proxy(_request: NextRequest) {
  // Session signatures are verified by server components and route handlers.
  // Do not trust an unsigned cookie in middleware.
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
