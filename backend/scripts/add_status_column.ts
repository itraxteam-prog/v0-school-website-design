
import * as dotenv from 'dotenv';
import path from 'path';
import postgres from 'postgres';

async function addStatusColumn() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    dotenv.config({ path: envPath });

    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        console.error('DATABASE_URL is missing in .env.local');
        return;
    }

    const sql = postgres(DATABASE_URL, { ssl: 'require' });

    try {
        console.log('Checking if status column exists in users table...');
        const checkColumn = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'status'
        `;

        if (checkColumn.length === 0) {
            console.log('Adding status column to users table...');
            await sql`
                ALTER TABLE public.users 
                ADD COLUMN status TEXT DEFAULT 'Active'
            `;
            console.log('Status column added successfully.');
        } else {
            console.log('Status column already exists.');
        }

        // Ensure all users have status set to 'Active'
        console.log('Ensuring all users have Active status...');
        await sql`
            UPDATE public.users 
            SET status = 'Active' 
            WHERE status IS NULL
        `;
        console.log('Verified Active status for all users.');

    } catch (error) {
        console.error('Failed to add status column:', error);
    } finally {
        await sql.end();
    }
}

addStatusColumn();
