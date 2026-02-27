const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function check() {
    const dbUrl = process.env.DATABASE_URL;
    console.log('Testing DATABASE_URL (Pooler):', dbUrl ? dbUrl.split('@')[1] : 'MISSING');

    const prisma = new PrismaClient({
        datasources: {
            db: { url: dbUrl }
        }
    });

    try {
        await prisma.$connect();
        console.log('SUCCESS: Connected to DATABASE_URL');
        const b = await prisma.$queryRaw`SELECT 1 as result`;
        console.log('QUERY SUCCESS:', b);
    } catch (e) {
        console.error('FAILURE:', e.message);
        console.error('ERROR CODE:', e.code);
    } finally {
        await prisma.$disconnect();
    }
}

check();
