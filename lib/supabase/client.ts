import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente Supabase para uso no browser (Client Components).
 * Reutilize esta instância — não crie múltiplas por render.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
