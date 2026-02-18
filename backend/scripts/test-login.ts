
import * as dotenv from 'dotenv';
import path from 'path';

// 1. Load env vars immediately
const envPathLocal = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

console.log('Loading .env.local from:', envPathLocal);
dotenv.config({ path: envPathLocal });

console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// 2. NOW import the service which depends on env vars
// We use require or dynamic import to ensure it happens after config
async function run() {
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Loaded' : 'Missing');
    console.log('SERVICE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Loaded' : 'Missing');

    const { AuthService } = await import('../services/authService');

    console.log('Testing login for admin@school.com / Admin@2024!');
    try {
        const result = await AuthService.login('admin@school.com', 'Admin@2024!');
        console.log('Login Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Login threw an error:', error);
    }
}

run();
