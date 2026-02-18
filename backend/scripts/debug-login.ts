import * as dotenv from 'dotenv';
import path from 'path';

// Load both .env and .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('=== ENV CHECK ===');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
console.log('ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '⚠️  Missing (using fallback)');

async function debugLogin() {
    // Test with SERVICE ROLE KEY (bypasses RLS)
    console.log('\n=== TEST 1: Service Role Key Query ===');
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    const { data: serviceData, error: serviceError } = await supabaseService
        .from('users')
        .select('id, email, role, password')
        .eq('email', 'admin@school.com')
        .single();

    if (serviceError) {
        console.error('❌ Service key query FAILED:', serviceError.message);
    } else {
        console.log('✅ Service key query SUCCESS');
        console.log('   User found:', serviceData?.email, '| Role:', serviceData?.role);
        const match = await bcrypt.compare('NewAdmin@2025!', serviceData?.password || '');
        console.log('   Password match:', match ? '✅ CORRECT' : '❌ WRONG HASH');
    }

    // Test with ANON KEY (subject to RLS)
    console.log('\n=== TEST 2: Anon Key Query (RLS check) ===');
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    const { data: anonData, error: anonError } = await supabaseAnon
        .from('users')
        .select('id, email, role, password')
        .eq('email', 'admin@school.com')
        .single();

    if (anonError) {
        console.error('❌ Anon key query FAILED:', anonError.message);
        console.log('   → This means RLS is blocking the login query!');
    } else {
        console.log('✅ Anon key query SUCCESS');
        console.log('   User found:', anonData?.email);
    }

    // Check which key the app is actually using
    console.log('\n=== TEST 3: Which key does supabaseClient.ts use? ===');
    // In Node.js (server), typeof window === 'undefined' is TRUE
    const usedKey = (typeof window === 'undefined' && supabaseServiceKey) ? 'SERVICE_ROLE' : 'ANON';
    console.log('   Key used in server context:', usedKey);
}

debugLogin().catch(console.error);
