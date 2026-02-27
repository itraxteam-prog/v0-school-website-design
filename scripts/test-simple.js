const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function check() {
    const directUrl = process.env.DIRECT_URL;
    console.log('Testing DIRECT_URL:', directUrl ? directUrl.split('@')[1] : 'MISSING');

    const prisma = new PrismaClient({
        datasources: {
            db: { url: directUrl }
        }
    });

    try {
        await prisma.$connect();
        console.log('SUCCESS: Connected to DIRECT_URL');
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
