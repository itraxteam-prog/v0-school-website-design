
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function list() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL is missing');
        process.exit(1);
    }
    const sql = postgres(url, { ssl: 'require' });
    try {
        const res = await sql`SELECT id, email, role, name, status FROM users`;
        fs.writeFileSync('users_list_debug.json', JSON.stringify(res, null, 2));
        console.log('Successfully wrote to users_list_debug.json');
    } catch (err) {
        console.error(err);
    } finally {
        await sql.end();
        process.exit(0);
    }
}
list();
