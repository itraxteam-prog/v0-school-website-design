import postgres from 'postgres';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function initTables() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error('DATABASE_URL missing');
        return;
    }
    const sql = postgres(url, { ssl: 'require' });

    try {
        console.log('Creating academic tables...');

        // 1. Teachers
        await sql`
            CREATE TABLE IF NOT EXISTS public.teachers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                employee_id TEXT UNIQUE NOT NULL,
                department TEXT,
                class_ids TEXT[],
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        console.log('✅ Teachers table created or exists');

        // 2. Classes
        await sql`
            CREATE TABLE IF NOT EXISTS public.classes (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                class_teacher_id TEXT REFERENCES public.teachers(id) ON DELETE SET NULL,
                room_no TEXT,
                student_ids TEXT[],
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        console.log('✅ Classes table created or exists');

        // 3. Students
        await sql`
            CREATE TABLE IF NOT EXISTS public.students (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                roll_no TEXT UNIQUE NOT NULL,
                class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
                dob TEXT,
                guardian_phone TEXT,
                address TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        console.log('✅ Students table created or exists');

        // 4. Periods
        await sql`
            CREATE TABLE IF NOT EXISTS public.periods (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        console.log('✅ Periods table created or exists');

        console.log('All academic tables initialized successfully!');

    } catch (e) {
        console.error('Failed to initialize tables:', e);
    } finally {
        await sql.end();
    }
}

initTables();
