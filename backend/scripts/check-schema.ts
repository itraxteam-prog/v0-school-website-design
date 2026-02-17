import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkSchema() {
    const url = process.env.DATABASE_URL;
    if (!url) return;
    const sql = postgres(url, { ssl: 'require' });

    try {
        const tableResult = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        const tables = tableResult.map(t => t.table_name);
        for (const table of tables) {
            const result = await sql`
                SELECT table_schema, column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = ${table}
                ORDER BY table_schema, ordinal_position;
            `;
            console.log(`\n--- Schema for ${table} ---`);
            if (result.length === 0) {
                console.log('TABLE DOES NOT EXIST');
            } else {
                result.forEach(col => {
                    console.log(`${col.table_schema}.${col.column_name}: ${col.data_type} (${col.is_nullable})`);
                });
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await sql.end();
    }
}

checkSchema();
