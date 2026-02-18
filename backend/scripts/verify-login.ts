
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

// Connect directly using postgres.js
const sql = postgres(DATABASE_URL, {
    ssl: 'require',
});

async function verifyLogin() {
    console.log('Verifying login credentials...');

    const tests = [
        { role: 'Admin', email: 'admin@school.com', password: 'NewAdmin@2025!' },
        { role: 'Teacher', email: 'teacher@school.com', password: 'NewTeacher@2025!' },
        { role: 'Student', email: 'student@school.com', password: 'NewStudent@2025!' },
        // Negative test
        { role: 'Old Admin', email: 'admin@school.com', password: 'Admin@2024!', shouldFail: true }
    ];

    try {
        for (const test of tests) {
            const users = await sql`
                SELECT password FROM users WHERE email = ${test.email}
            `;

            if (users.length === 0) {
                console.error(`❌ ${test.role}: User not found`);
                continue;
            }

            const user = users[0];
            const isMatch = await bcrypt.compare(test.password, user.password);

            if (test.shouldFail) {
                if (!isMatch) {
                    console.log(`✅ ${test.role}: Old password rejected as expected.`);
                } else {
                    console.error(`❌ ${test.role}: Old password STILL WORKS!`);
                }
            } else {
                if (isMatch) {
                    console.log(`✅ ${test.role}: Login successful.`);
                } else {
                    console.error(`❌ ${test.role}: Login failed.`);
                }
            }
        }
    } catch (error) {
        console.error('Error verifying login:', error);
    } finally {
        await sql.end();
    }
}

verifyLogin();
