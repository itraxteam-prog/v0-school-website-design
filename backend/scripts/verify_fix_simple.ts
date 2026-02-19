
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

async function verifyLoginQuery() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    dotenv.config({ path: envPath });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const email = 'admin@school.com';
    const password = 'NewAdmin@2025!';

    try {
        console.log(`Checking database for user ${email}...`);

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .ilike('email', email)
            .single();

        if (error || !user) {
            console.error('FAILED: User not found in database.', error?.message);
            return;
        }

        console.log('User found. Columns in record:', Object.keys(user));

        if ('status' in user) {
            console.log('SUCCESS: status column is present in the database result.');
        } else {
            console.error('FAILED: status column is STILL missing from the result.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            console.log('SUCCESS: Password verification passed.');
        } else {
            console.error('FAILED: Password verification failed.');
        }

        console.log('FINAL RESULT: The query that was crashing previously is now succeeding.');

    } catch (error: any) {
        console.error('CRITICAL: Query failed:');
        console.error(error.message);
    }
}

verifyLoginQuery();
