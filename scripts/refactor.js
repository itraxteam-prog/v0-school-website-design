// === REMOVE FRONTEND MOCK USERS ===
const fs = require('fs');
const path = require('path');

const usersPagePath = path.join(__dirname, 'app', 'portal', 'admin', 'users', 'page.tsx');

if (fs.existsSync(usersPagePath)) {
    let content = fs.readFileSync(usersPagePath, 'utf-8');

    // Remove MOCK_USERS declaration entirely
    content = content.replace(
        /const MOCK_USERS:.*?=\s*\[[\s\S]*?\];\s*/m,
        ''
    );

    // Remove setUsers mapping that uses MOCK_USERS
    content = content.replace(
        /setUsers\([\s\S]*?\)\s*;?/m,
        ''
    );

    fs.writeFileSync(usersPagePath, content, 'utf-8');
    console.log('✅ Mock users and setUsers mapping removed');
} else {
    console.log('⚠️ users/page.tsx not found, skipping frontend cleanup');
}
