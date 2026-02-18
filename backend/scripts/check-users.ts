import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkUsers() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL missing');
        return;
    }
    const sql = postgres(url, { ssl: 'require' });
    try {
        const users = await sql`SELECT id, email, role, status FROM users`;
        console.log('Users in DB JSON:');
        console.log(JSON.stringify(users, null, 2));
    } catch (e) {
        console.error('Failed to fetch users:', e);
    } finally {
        await sql.end();
    }
}

checkUsers();
