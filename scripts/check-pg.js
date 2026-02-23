// Raw PostgreSQL connection test using the pg driver
// Usage: node scripts/check-pg.js
'use strict';

const fs = require('fs');
const path = require('path');

// Load .env manually
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
let DATABASE_URL = '';
for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=')) {
        DATABASE_URL = trimmed.slice('DATABASE_URL='.length).replace(/^["']|["']$/g, '');
        break;
    }
}

if (!DATABASE_URL) {
    console.error('ERROR: DATABASE_URL not found in .env');
    process.exit(1);
}

const masked = DATABASE_URL.replace(/:([^@]+)@/, ':****@');
console.log('Testing pg connection to:', masked);

let Client;
try {
    // Try to load pg from node_modules
    Client = require('./node_modules/.pnpm/pg@8.13.1/node_modules/pg').Client;
} catch (e) {
    try {
        Client = require('./node_modules/pg').Client;
    } catch (e2) {
        console.error('Cannot find pg module. Trying @neondatabase/serverless...');
        process.exit(1);
    }
}

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
});

client.connect()
    .then(() => {
        console.log('SUCCESS: PostgreSQL connection established!');
        return client.query('SELECT version(), current_database(), current_user');
    })
    .then((res) => {
        const row = res.rows[0];
        console.log('DB Version :', row.version.split(',')[0]);
        console.log('Database   :', row.current_database);
        console.log('User       :', row.current_user);
        return client.end();
    })
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('FAILURE:', err.message);
        if (err.code) console.error('Error code :', err.code);
        process.exit(1);
    });
