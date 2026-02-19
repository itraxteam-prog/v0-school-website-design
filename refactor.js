// === FRONTEND MOCK USER FIX ===
const fs = require('fs');
const path = require('path');

const usersPagePath = path.join(__dirname, 'app', 'portal', 'admin', 'users', 'page.tsx');

if (fs.existsSync(usersPagePath)) {
    let content = fs.readFileSync(usersPagePath, 'utf-8');

    // Replace existing MOCK_USERS declaration with strict type
    content = content.replace(
        /const MOCK_USERS:.*?=\s*\[[\s\S]*?\];/m,
        `const MOCK_USERS: User[] = [
  { id: "1", name: "Alice", email: "alice@test.com", role: "Admin", status: "Active" as const, last_login: "2026-02-19" },
  { id: "2", name: "Bob", email: "bob@test.com", role: "Teacher", status: "Suspended" as const, last_login: "2026-02-18" },
  { id: "3", name: "Charlie", email: "charlie@test.com", role: "Student", status: "Active" as const, last_login: "2026-02-17" },
  // Add other users as needed
];`
    );

    // Replace setUsers mapping to enforce strict status type
    content = content.replace(
        /setUsers\([\s\S]*?\)/m,
        `setUsers(MOCK_USERS.map(u => ({
  ...u,
  role: (u.role.charAt(0).toUpperCase() + u.role.slice(1)) as any,
  status: u.status === "Active" ? "Active" : "Suspended"
})))`
    );

    fs.writeFileSync(usersPagePath, content, 'utf-8');
    console.log('✅ Frontend mock users patched with strict types');
} else {
    console.log('⚠️ users/page.tsx not found, skipping frontend patch');
}
