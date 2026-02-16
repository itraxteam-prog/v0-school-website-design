// This is a simple verification script to test the database connection
// Run with: npx ts-node --project tsconfig.json -r dotenv/config backend/scripts/verify-db.ts
// Or use a simple route to verify.

import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local manually if running as a script
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyConnection() {
    const url = process.env.DATABASE_URL;

    if (!url) {
        console.error('❌ Error: DATABASE_URL is not defined in .env.local');
        return;
    }

    console.log('🔄 Attempting to connect to Supabase...');

    const sql = postgres(url, { ssl: 'require' });

    try {
        // Simple query to verify connection
        const result = await sql`SELECT version(), now();`;
        console.log('✅ Successfully connected to Supabase!');
        console.log('📊 Database Version:', result[0].version);
        console.log('⏰ Current Time:', result[0].now);
    } catch (error) {
        console.error('❌ Connection Failed:', error);
    } finally {
        await sql.end();
    }
}

verifyConnection();
