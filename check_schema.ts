
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL is missing');
        process.exit(1);
    }
    const sql = postgres(url, { ssl: 'require' });
    try {
        const tables = ['students', 'academic_records', 'users', 'classes', 'teachers', 'periods'];
        const schema = {};
        for (const table of tables) {
            const result = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ${table} AND table_schema = 'public'`;
            schema[table] = result;
        }
        fs.writeFileSync('db_schema_debug.json', JSON.stringify(schema, null, 2));
        console.log('Successfully wrote to db_schema_debug.json');
    } catch (err) {
        console.error(err);
    } finally {
        await sql.end();
        process.exit(0);
    }
}
check();
