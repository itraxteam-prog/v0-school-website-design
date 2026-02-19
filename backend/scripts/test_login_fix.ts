
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars FIRST
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

import { LoginService } from '../services/loginService';

async function testLogin() {
    const email = 'admin@school.com';
    const password = 'NewAdmin@2025!';

    console.log(`Attempting login for ${email}...`);
    try {
        const result = await LoginService.login(email, password);
        console.log('Login result:', JSON.stringify(result, null, 2));
        if (result.user && result.token) {
            console.log('SUCCESS: Login works and returns user data.');
        } else if (result.error) {
            console.error('FAILED: Login returned error:', result.error);
        }
    } catch (error: any) {
        console.error('CRITICAL: LoginService.login threw an error:');
        console.error('Error Message:', error.message);
        console.error('Stack Trace:', error.stack);
    }
}

testLogin().then(() => {
    setTimeout(() => process.exit(0), 1000);
});
