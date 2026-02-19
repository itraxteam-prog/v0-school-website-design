// === REMOVE FRONTEND MOCK USERS ===
const fs = require('fs');
const path = require('path');

const usersPagePath = path.join(__dirname, 'app', 'portal', 'admin', 'users', 'page.tsx');

if (fs.existsSync(usersPagePath)) {
    let content = fs.readFileSync(usersPagePath, 'utf-8');

    // Remove MOCK_USERS declaration
    content = content.replace(
        /const MOCK_USERS:.*?=\s*\[[\s\S]*?\];/m,
        ''
    );

    // Remove setUsers mapping related to MOCK_USERS
    content = content.replace(
        /setUsers\([\s\S]*?MOCK_USERS[\s\S]*?\)/m,
        ''
    );

    fs.writeFileSync(usersPagePath, content, 'utf-8');
    console.log('✅ Mock users removed to fix build');
} else {
    console.log('⚠️ users/page.tsx not found, skipping removal');
}
