
import bcrypt from 'bcryptjs';

const tests = [
    { label: 'Admin', password: 'NewAdmin@2025!', hash: '$2b$10$EkHUhS9ZKceTJedSteTYeOAwOliIy9mH7vPxsWU6e92OeURkPZPzy' },
    { label: 'Teacher', password: 'NewTeacher@2025!', hash: '$2b$10$0d8uO0zcMsG3NT2Q3bkkEetR0033HCJ2VlfBOarIiBVChVEQM2pv6' },
    { label: 'Student', password: 'NewStudent@2025!', hash: '$2b$10$/kcXRpCMzgThHIqyIsc5seYWYp8PdkPnK3lEbbZ4byx26wxGiWLCq' }
];

async function verifyAll() {
    for (const test of tests) {
        const isMatch = await bcrypt.compare(test.password, test.hash);
        console.log(`${test.label}: Match = ${isMatch}`);
    }
}
verifyAll();
