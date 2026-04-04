import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@bayou/supabase/middleware';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createMiddlewareClient(request, response);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Unauthenticated → redirect to sign-in
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // /members/admin → require admin role
  if (request.nextUrl.pathname.startsWith('/members/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/members/feed', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/members/:path*'],
};
