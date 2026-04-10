import { createServerClient } from '@supabase/ssr'
import type { Database } from './types'

interface CookieStore {
  getAll(): { name: string; value: string }[]
  set(name: string, value: string, options?: Record<string, unknown>): void
}

export function createServerSupabaseClient(cookieStore: CookieStore) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as Record<string, unknown>)
            )
          } catch {}
        },
      },
    }
  )
}
