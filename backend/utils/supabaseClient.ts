import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)) {
    console.warn('Supabase credentials are missing. Please check your .env file.');
}

// Prefer Service Role Key on server for full access, fallback to Anon Key
// This is critical for backend services to function if RLS is enabled
const supabaseKey = (typeof window === 'undefined' && supabaseServiceKey)
    ? supabaseServiceKey
    : supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
