import { createServerClient } from '@supabase/ssr';
import type { Database } from './types';

interface MiddlewareRequest {
  cookies: {
    getAll(): Array<{ name: string; value: string }>;
  };
}

interface MiddlewareResponse {
  cookies: {
    set(name: string, value: string, options?: Record<string, unknown>): void;
  };
}

export function createMiddlewareClient(
  request: MiddlewareRequest,
  response: MiddlewareResponse
) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}
