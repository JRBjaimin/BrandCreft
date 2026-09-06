/**
 * Minimal dev seed: RBAC roles, two contrasting categories (jewellery enables
 * the rate module, restaurant does not), and a super admin user.
 *
 * Run: npm run db:seed --workspace @brandcraft/backend
 */
import { PrismaClient } from '@prisma/client';
import { createHash } from 'node:crypto';

const prisma = new PrismaClient();

// Placeholder hash only for local dev. Phase 3 replaces this with argon2/bcrypt.
const devHash = (pw: string) => createHash('sha256').update(pw).digest('hex');

async function main() {
  const roles = ['SUPER_ADMIN', 'BUSINESS_OWNER', 'BUSINESS_ADMIN', 'BUSINESS_STAFF'];
  for (const name of roles) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  await prisma.category.upsert({
    where: { key: 'jewellery' },
    update: { rateModuleEnabled: true },
    create: { key: 'jewellery', label: 'Jewellery', rateModuleEnabled: true },
  });
  await prisma.category.upsert({
    where: { key: 'restaurant' },
    update: { rateModuleEnabled: false },
    create: { key: 'restaurant', label: 'Restaurant', rateModuleEnabled: false },
  });

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'SUPER_ADMIN' } });
  const admin = await prisma.user.upsert({
    where: { email: 'admin@brandcraft.local' },
    update: {},
    create: {
      email: 'admin@brandcraft.local',
      name: 'Platform Admin',
      passwordHash: devHash('changeme-in-dev'),
    },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: superAdminRole.id },
  });

  console.log('Seed complete. Super admin: admin@brandcraft.local / changeme-in-dev');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
