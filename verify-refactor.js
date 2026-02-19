const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

// --------- HELPERS ---------
function readFileSafe(filePath) {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function walkDir(dir, ext = '.ts') {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) files = files.concat(walkDir(fullPath, ext));
        else if (entry.isFile() && fullPath.endsWith(ext)) files.push(fullPath);
    }
    return files;
}

// --------- CHECKS ---------

let allOk = true;

// 1. No raw postgres client
function checkPostgresUsage() {
    const files = walkDir(projectRoot, '.ts').concat(walkDir(projectRoot, '.tsx'));
    const offenders = files.filter(file => {
        const content = readFileSafe(file);
        return content.includes("from 'postgres'") || content.includes('sql`');
    });
    if (offenders.length) {
        allOk = false;
        offenders.forEach(f => console.log(`❌ Raw postgres detected: ${f}`));
    }
}
checkPostgresUsage();

// 2. JWT middleware uses jose
function checkMiddleware() {
    const content = readFileSafe(path.join(projectRoot, 'middleware.ts'));
    if (!content.includes("import { jwtVerify } from 'jose'") ||
        !content.includes('jwtVerify(')) {
        allOk = false;
        console.log("❌ middleware.ts missing jose JWT verification");
    }
}
checkMiddleware();

// 3. API routes: runtime + dynamic
function checkRouteFiles() {
    const apiDir = path.join(projectRoot, 'app', 'api');
    const routeFiles = walkDir(apiDir, '.ts');
    routeFiles.forEach(file => {
        const content = readFileSafe(file);
        if (!content.includes("export const runtime = 'nodejs'")) {
            allOk = false;
            console.log(`❌ Missing runtime in ${file}`);
        }
        if (!content.includes("export const dynamic = 'force-dynamic'")) {
            allOk = false;
            console.log(`❌ Missing dynamic in ${file}`);
        }
    });
}
checkRouteFiles();

// 4. AuthProvider moved
function checkAuthProvider() {
    const rootLayout = readFileSafe(path.join(projectRoot, 'app', 'layout.tsx'));
    const portalLayout = readFileSafe(path.join(projectRoot, 'app', 'portal', 'layout.tsx'));
    if (rootLayout.includes('<AuthProvider>') || !portalLayout.includes('<AuthProvider>')) {
        allOk = false;
        console.log("❌ AuthProvider not correctly moved to portal layout");
    }
}
checkAuthProvider();

// 5. No plaintext refresh tokens
function checkRefreshTokens() {
    const files = walkDir(path.join(projectRoot, 'backend', 'services'), '.ts');
    files.forEach(file => {
        const content = readFileSafe(file);
        if (content.includes('refresh_token') && !content.includes('hash')) {
            allOk = false;
            console.log(`❌ Potential plaintext refresh_token in ${file}`);
        }
    });
}
checkRefreshTokens();

// 6. Vercel config exists
function checkVercelJson() {
    const vercelPath = path.join(projectRoot, 'vercel.json');
    if (!fs.existsSync(vercelPath)) {
        allOk = false;
        console.log("❌ vercel.json missing");
    } else {
        const content = readFileSafe(vercelPath);
        ['runtime', 'maxDuration', 'X-Frame-Options'].forEach(keyword => {
            if (!content.includes(keyword)) {
                allOk = false;
                console.log(`❌ vercel.json missing required property: ${keyword}`);
            }
        });
    }
}
checkVercelJson();

// 7. Migration files exist
function checkMigrations() {
    const migDir = path.join(projectRoot, 'supabase', 'migrations');
    if (!fs.existsSync(migDir)) {
        allOk = false;
        console.log("❌ Migration directory missing");
    } else {
        const expected = ['0001_create_users.sql', '0002_create_user_sessions.sql', '0003_create_rls.sql'];
        expected.forEach(f => {
            if (!fs.existsSync(path.join(migDir, f))) {
                allOk = false;
                console.log(`❌ Migration missing: ${f}`);
            }
        });
    }
}
checkMigrations();

// 8. Package.json: no postgres package
function checkPackageJson() {
    const pkg = JSON.parse(readFileSafe(path.join(projectRoot, 'package.json')));
    if (pkg.dependencies?.postgres) {
        allOk = false;
        console.log('❌ postgres package still in package.json');
    }
}
checkPackageJson();

// 9. Confirm deleted files
['backend/utils/db.ts', 'backend/services/authService.ts'].forEach(f => {
    if (fs.existsSync(path.join(projectRoot, f))) {
        allOk = false;
        console.log(`❌ File should be deleted: ${f}`);
    }
});

// 10. Final status
if (allOk) {
    console.log("\n✅ Full refactor verification passed. Safe to commit.");
    process.exit(0);
} else {
    console.log("\n⚠️ Refactor verification failed. Fix flagged issues before commit.");
    process.exit(1);
}
