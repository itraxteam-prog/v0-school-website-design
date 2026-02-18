
import * as dotenv from 'dotenv';
import path from 'path';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

async function verifyLoginQuery() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    dotenv.config({ path: envPath });

    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        console.error('DATABASE_URL is missing in .env.local');
        return;
    }

    const sql = postgres(DATABASE_URL, { ssl: 'require' });

    const email = 'admin@school.com';
    const password = 'NewAdmin@2025!';

    try {
        console.log(`Checking database for user ${email}...`);

        // This is exactly what AuthService.login does: SELECT * FROM public.users
        const result = await sql`
            SELECT * FROM public.users 
            WHERE LOWER(email) = LOWER(${email}) 
            LIMIT 1
        `;

        const user = result?.[0] as any;

        if (!user) {
            console.error('FAILED: User not found in database.');
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
    } finally {
        await sql.end();
    }
}

verifyLoginQuery();
