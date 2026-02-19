
import * as dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function initTables() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env.local');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        console.log('Creating academic tables via RPC...');

        const sql = `
            -- 1. Teachers
            CREATE TABLE IF NOT EXISTS public.teachers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                employee_id TEXT UNIQUE NOT NULL,
                department TEXT,
                class_ids TEXT[],
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- 2. Classes
            CREATE TABLE IF NOT EXISTS public.classes (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                class_teacher_id TEXT REFERENCES public.teachers(id) ON DELETE SET NULL,
                room_no TEXT,
                student_ids TEXT[],
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- 3. Students
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

            -- 4. Periods
            CREATE TABLE IF NOT EXISTS public.periods (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;

        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error('Failed to initialize tables via RPC:', error.message);
            console.log('Ensure the exec_sql RPC function exists in your database.');
        } else {
            console.log('All academic tables initialized successfully!');
        }

    } catch (e) {
        console.error('Failed to initialize tables:', e);
    }
}

initTables();
