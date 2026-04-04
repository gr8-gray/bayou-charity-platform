import { createServerClient } from '@supabase/ssr'
import type { Database } from './types'

interface CookieStore {
  get(name: string): { value: string } | undefined
}

export function createServerSupabaseClient(cookieStore: CookieStore) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set() {},
        remove() {},
      },
    }
  )
}
