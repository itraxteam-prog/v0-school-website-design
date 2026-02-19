import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function applyMigration() {
    console.log('🔄 Loading migration script...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const migrationPath = path.join(process.cwd(), 'backend', 'scripts', 'migration_fix.sql');

    if (!fs.existsSync(migrationPath)) {
        console.error('❌ Migration file not found at:', migrationPath);
        process.exit(1);
    }

    const sqlContent = fs.readFileSync(migrationPath, 'utf8');

    console.log('🚀 Applying migration to Supabase via RPC...');
    try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: sqlContent });

        if (error) {
            throw error;
        }

        console.log('✅ Migration applied successfully!');
    } catch (error: any) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

applyMigration();
