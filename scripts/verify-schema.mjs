import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRaw`SELECT client_id FROM trips LIMIT 0`;
  await prisma.$queryRaw`SELECT id FROM clients LIMIT 0`;
  await prisma.$queryRaw`SELECT id FROM ai_interaction_log LIMIT 0`;
  await prisma.$queryRaw`SELECT dedupe_key FROM notifications LIMIT 0`;
  await prisma.$queryRaw`SELECT notification_prefs FROM profiles LIMIT 0`;
  console.log('v1.4 schema OK: clients, trip FKs, ai_interaction_log, notifications');
}

main()
  .catch((error) => {
    console.error('Schema check failed:', error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
