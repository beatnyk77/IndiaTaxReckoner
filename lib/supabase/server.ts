import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Client for Server Components & Actions
 * Uses the Service Role Key - BYPASSES RLS
 * CRITICAL: Never export this to client-side code.
 */
export const createServerClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseServiceKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing in env.local')
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
