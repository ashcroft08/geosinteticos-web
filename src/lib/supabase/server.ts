import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

/** Cliente con service_role — SOLO para uso en API Routes del servidor */
export function createSupabaseAdmin() {
    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

/** Cliente con anon key — para uso en Server Components (respeta RLS) */
export function createSupabaseServer() {
    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
