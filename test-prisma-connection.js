// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 Testing Prisma connection to Supabase...');

    // 간단한 쿼리로 연결 테스트
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    console.log('Test result:', result);

    // 테이블 확인
    const playerCount = await prisma.player.count();
    console.log(`📊 Found ${playerCount} players in the database`);

    const teamCount = await prisma.team.count();
    console.log(`📊 Found ${teamCount} teams in the database`);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
