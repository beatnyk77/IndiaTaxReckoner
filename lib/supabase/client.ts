import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Client for Client Components
 * Uses the Anon Key (Public) - Limited by RLS
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
