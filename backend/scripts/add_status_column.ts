
import * as dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

async function addStatusColumn() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    dotenv.config({ path: envPath });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        console.log('Checking if status column exists in users table...');

        // Use RPC to check column existence or just try to add it
        const { error: alterError } = await supabase.rpc('exec_sql', {
            sql_query: `
                DO $$ 
                BEGIN 
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'status') THEN
                        ALTER TABLE public.users ADD COLUMN status TEXT DEFAULT 'Active';
                    END IF;
                END $$;
            `
        });

        if (alterError) {
            console.error('Failed to add status column via RPC:', alterError.message);
            console.log('Ensure the exec_sql RPC function exists in your database.');
        } else {
            console.log('Status column check/addition successful.');
        }

        // Ensure all users have status set to 'Active'
        console.log('Ensuring all users have Active status...');
        const { error: updateError } = await supabase
            .from('users')
            .update({ status: 'Active' })
            .is('status', null);

        if (updateError) {
            console.error('Failed to update Active status:', updateError.message);
        } else {
            console.log('Verified Active status for all users.');
        }

    } catch (error) {
        console.error('Failed to add status column:', error);
    }
}

addStatusColumn();
