
import bcrypt from 'bcryptjs';

const password = 'NewAdmin@2025!';
const hash = '$2b$10$EkHUhS9ZKceTJedSteTYeOAwOliIy9mH7vPxsWU6e92OeURkPZPzy';

async function verify() {
    const isMatch = await bcrypt.compare(password, hash);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log(`Match: ${isMatch}`);
}
verify();
