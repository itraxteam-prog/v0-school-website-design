import { sql } from '../utils/db';
import fs from 'fs';
import path from 'path';

async function applyMigration() {
    console.log('🔄 Loading migration script...');
    const migrationPath = path.join(process.cwd(), 'backend', 'scripts', 'migration_fix.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');

    console.log('🚀 Applying migration to Supabase...');
    try {
        // Execute the multi-line SQL
        await sql.unsafe(sqlContent);
        console.log('✅ Migration applied successfully!');
    } catch (error: any) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

applyMigration();
