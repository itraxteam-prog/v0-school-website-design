const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
    if (!fs.existsSync(dir)) return filelist;
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            filelist = walkSync(filePath, filelist);
        } else if (file === 'route.ts') {
            filelist.push(filePath);
        }
    });
    return filelist;
}

const apiDir = path.join(process.cwd(), 'app', 'api');
const files = walkSync(apiDir);
const header = "export const runtime = 'nodejs';\nexport const dynamic = 'force-dynamic';\n";

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');

        // Remove ALL occurrences of these exports regardless of formatting
        // This regex handles the mashed-together case and correctly formatted ones
        content = content.replace(/export\s+const\s+runtime\s*=\s*['"]nodejs['"]\s*;?/g, '');
        content = content.replace(/export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]\s*;?/g, '');

        // Remove leading whitespace
        content = content.trimStart();

        // Write back with clean header
        fs.writeFileSync(file, header + content);
        console.log(`✅ Fixed: ${file}`);
    } catch (err) {
        console.error(`❌ Failed: ${file}`, err.message);
    }
});
