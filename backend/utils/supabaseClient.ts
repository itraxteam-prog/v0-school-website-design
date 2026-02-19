import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
    console.warn('[supabaseClient] NEXT_PUBLIC_SUPABASE_URL is missing.');
}

if (!supabaseServiceKey) {
    console.warn('[supabaseClient] SUPABASE_SERVICE_ROLE_KEY is missing. Server-side queries will fail.');
}

// Server-side client: always uses service role key to bypass RLS.
// NEVER expose this on the client side; it is imported only from API routes and backend services.
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});

// Anon client — for client-side use only (respects RLS).
// Import this only in browser-side code.
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});
