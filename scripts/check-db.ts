import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

async function checkDatabase() {
  const dbUrl = process.env.DATABASE_URL || '';
  const directUrl = process.env.DIRECT_URL || '';

  console.log('\n🚀 --- Neon/Prisma Environment Check ---');

  // 1. Check DATABASE_URL (Pooler)
  console.log('\n📡 Checking DATABASE_URL (Next.js Pooler):');
  if (!dbUrl) {
    console.error('❌ FAILED: DATABASE_URL is missing.');
  } else {
    console.log(`✅ FOUND: ${dbUrl.replace(/:[^@]+@/, ':****@')}`);
    if (!dbUrl.includes('-pooler')) {
      console.warn('⚠️  WARNING: DATABASE_URL should typically include "-pooler" for Neon connection pooling.');
    }
    if (!dbUrl.includes('sslmode=require')) {
      console.error('❌ ERROR: Missing "?sslmode=require". Neon requires SSL.');
    }
  }

  // 2. Check DIRECT_URL (Migrations)
  console.log('\n🏗️  Checking DIRECT_URL (Prisma Migrations):');
  if (!directUrl) {
    console.error('❌ FAILED: DIRECT_URL is missing. Migrations will fail on Neon!');
  } else {
    console.log(`✅ FOUND: ${directUrl.replace(/:[^@]+@/, ':****@')}`);
    if (directUrl.includes('-pooler')) {
      console.error('❌ ERROR: DIRECT_URL should NOT include "-pooler". Use the non-pooling address.');
    }
    if (!directUrl.includes('sslmode=require')) {
      console.error('❌ ERROR: Missing "?sslmode=require".');
    }
  }

  // 3. Connectivity Test
  console.log('\n🔌 Testing Connectivity to DIRECT_URL...');
  const prisma = new PrismaClient({
    datasources: {
      db: { url: directUrl },
    },
  });

  try {
    await prisma.$connect();
    console.log('✅ SUCCESS: Connected to Direct Database Server!');
    const result = await prisma.$queryRaw`SELECT current_database(), current_user`;
    console.log('📊 DB INFO:', result);
  } catch (error: any) {
    console.error('❌ FAILED: Cannot reach database server.');
    console.error(`Error Code: ${error.code}`);
    console.error(`Message: ${error.message}`);

    if (error.message.includes('P1001')) {
      console.log('\n💡 TROUBLESHOOTING P1001:');
      console.log('- Check if your Neon project is active (not paused).');
      console.log('- Ensure your local IP is allowed in Neon (Settings > IP Allowlist).');
      console.log('- Double check the hostname/port in your URL.');
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n✅ Check Complete.\n');
}

checkDatabase().catch(console.error);
