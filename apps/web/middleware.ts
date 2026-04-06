import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@bayou/supabase/middleware';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient(request, response);

  // getUser() validates with Supabase auth server (secure)
  // getSession() only reads from cookie (spoofable — do not use for auth checks)
  const { data: { user }, error } = await supabase.auth.getUser();

  // Unauthenticated → redirect to sign-in
  if (error || !user) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // /members/admin → require admin role
  if (request.nextUrl.pathname.startsWith('/members/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
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
