import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) {
    console.warn('[supabaseClient] NEXT_PUBLIC_SUPABASE_URL is missing.');
}

// Server-side client: always uses service role key to bypass RLS
// This is used in API routes and backend services
const serverKey = supabaseServiceKey || supabaseAnonKey;
if (!serverKey) {
    console.warn('[supabaseClient] No Supabase key found. Check SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, serverKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
});

// Anon client for client-side use (respects RLS)
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
