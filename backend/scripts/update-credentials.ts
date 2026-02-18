
import * as dotenv from 'dotenv';
import path from 'path';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

// Manually load env vars
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('Error: DATABASE_URL is not defined in .env.local');
    process.exit(1);
}

// Connect directly using postgres.js to avoid issues with importing db.ts before env vars are loaded
const sql = postgres(DATABASE_URL, {
    ssl: 'require',
});

async function updateCredentials() {
    console.log('Starting credential update...');

    const updates = [
        { email: 'admin@school.com', password: 'NewAdmin@2025!' },
        { email: 'teacher@school.com', password: 'NewTeacher@2025!' },
        { email: 'student@school.com', password: 'NewStudent@2025!' }
    ];

    try {
        for (const user of updates) {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            await sql`
                UPDATE users 
                SET 
                    password = ${hashedPassword},
                    failed_login_attempts = 0,
                    lock_until = NULL
                WHERE email = ${user.email}
            `;

            console.log(`Updated password for ${user.email}`);
        }
        console.log('All credentials updated successfully.');
    } catch (error) {
        console.error('Error updating credentials:', error);
    } finally {
        await sql.end();
    }
}

updateCredentials();
