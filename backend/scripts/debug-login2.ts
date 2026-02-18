import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const results: any = {
    env: {
        supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
        serviceKey: supabaseServiceKey ? 'SET' : 'MISSING',
        anonKey: supabaseAnonKey ? 'SET' : 'MISSING',
        jwtSecret: process.env.JWT_SECRET ? 'SET' : 'MISSING (fallback used)',
    },
    tests: {}
};

async function run() {
    // Test 1: Service Role Key
    try {
        const sb = createClient(supabaseUrl, supabaseServiceKey);
        const { data, error } = await sb.from('users').select('id, email, role, password').eq('email', 'admin@school.com').single();
        if (error) {
            results.tests.serviceKey = { success: false, error: error.message };
        } else {
            const match = await bcrypt.compare('NewAdmin@2025!', data?.password || '');
            results.tests.serviceKey = { success: true, email: data?.email, role: data?.role, passwordMatch: match };
        }
    } catch (e: any) {
        results.tests.serviceKey = { success: false, error: e.message };
    }

    // Test 2: Anon Key
    try {
        const sb = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await sb.from('users').select('id, email, role, password').eq('email', 'admin@school.com').single();
        if (error) {
            results.tests.anonKey = { success: false, error: error.message };
        } else {
            results.tests.anonKey = { success: true, email: data?.email };
        }
    } catch (e: any) {
        results.tests.anonKey = { success: false, error: e.message };
    }

    results.serverContext = typeof window === 'undefined' ? 'SERVER (uses service key)' : 'CLIENT (uses anon key)';

    fs.writeFileSync('debug-results.json', JSON.stringify(results, null, 2));
    process.stdout.write('DONE: Check debug-results.json\n');
}

run().catch(e => {
    fs.writeFileSync('debug-results.json', JSON.stringify({ fatal: e.message }, null, 2));
});
