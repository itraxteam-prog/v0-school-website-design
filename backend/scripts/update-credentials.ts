
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

// Manually load env vars
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

            const { error } = await supabase
                .from('users')
                .update({
                    password: hashedPassword,
                    failed_login_attempts: 0,
                    lock_until: null
                })
                .ilike('email', user.email);

            if (error) {
                console.error(`Failed to update password for ${user.email}:`, error.message);
            } else {
                console.log(`Updated password for ${user.email}`);
            }
        }
        console.log('All credentials updated successfully.');
    } catch (error) {
        console.error('Error updating credentials:', error);
    }
}

updateCredentials();
