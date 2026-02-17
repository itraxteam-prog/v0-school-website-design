import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkSchema() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL not found');
        return;
    }
    const sql = postgres(url, { ssl: 'require' });
    try {
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'notifications';
        `;
        if (tables.length > 0) {
            console.log('✅ notifications table exists');
        } else {
            console.log('❌ notifications table does NOT exist');
        }
    } catch (error) {
        console.error('Error checking schema:', error);
    } finally {
        await sql.end();
    }
}

checkSchema();
