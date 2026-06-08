import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  if (['POST', 'PATCH', 'DELETE', 'PUT'].includes(request.method)) {
    const csrfHeader = request.headers.get('x-csrf-token')
    if (csrfHeader !== '1') {
      return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
