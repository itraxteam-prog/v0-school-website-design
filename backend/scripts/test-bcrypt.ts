import bcrypt from 'bcryptjs';

const password = 'Admin@2024!';
// Hash from seed_users.sql
const hash = '$2b$10$EkHUhS9ZKceTJedSteTYeOAwOliIy9mH7vPxsWU6e92OeURkPZPzy';

async function test() {
    console.log(`Testing password: "${password}" against hash from DB.`);
    try {
        const match = await bcrypt.compare(password, hash);
        console.log(`MATCH RESULT: ${match ? 'TRUE' : 'FALSE'}`);

        if (!match) {
            console.log('Generating new valid hash...');
            const newHash = await bcrypt.hash(password, 10);
            console.log(`NEW HASH: ${newHash}`);
        }
    } catch (error) {
        console.error('Error during comparison:', error);
    }
}

test();
