/**
 * Phase 2 exit criterion: "Tenant isolation is proven by automated tests."
 *
 * Requires a real Postgres (schema migrated):
 *   npm run infra:up
 *   npm run db:migrate --workspace @brandcraft/backend
 *   npm run test:e2e   --workspace @brandcraft/backend
 *
 * Seeds two businesses (A, B) with one member each plus a super admin, then
 * asserts that a member of A can neither read nor write anything belonging to B,
 * through the HTTP layer and through the tenant-bound Prisma client.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { TenantPrismaService } from '../src/tenancy/tenant-prisma.service';

describe('Tenant isolation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let tenantPrisma: TenantPrismaService;

  const ids = { catId: '', bizA: '', bizB: '', alice: '', bob: '', root: '' };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    tenantPrisma = app.get(TenantPrismaService);

    // Clean slate (order matters for FKs).
    await prisma.businessUser.deleteMany();
    await prisma.businessSetting.deleteMany();
    await prisma.featureFlag.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.business.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.category.deleteMany();

    const category = await prisma.category.create({
      data: { key: 'jewellery', label: 'Jewellery', rateModuleEnabled: true },
    });
    const superRole = await prisma.role.create({ data: { name: 'SUPER_ADMIN' } });
    ids.catId = category.id;

    const [a, b] = await Promise.all([
      prisma.business.create({
        data: { name: 'Alpha Jewels', slug: 'alpha-jewels', categoryId: category.id },
      }),
      prisma.business.create({
        data: { name: 'Beta Gold', slug: 'beta-gold', categoryId: category.id },
      }),
    ]);
    ids.bizA = a.id;
    ids.bizB = b.id;

    const [alice, bob, root] = await Promise.all([
      prisma.user.create({ data: { email: 'alice@ex.com', name: 'Alice', passwordHash: 'x' } }),
      prisma.user.create({ data: { email: 'bob@ex.com', name: 'Bob', passwordHash: 'x' } }),
      prisma.user.create({ data: { email: 'root@ex.com', name: 'Root', passwordHash: 'x' } }),
    ]);
    ids.alice = alice.id;
    ids.bob = bob.id;
    ids.root = root.id;

    await prisma.businessUser.createMany({
      data: [
        { businessId: a.id, userId: alice.id, role: 'BUSINESS_OWNER' },
        { businessId: b.id, userId: bob.id, role: 'BUSINESS_OWNER' },
      ],
    });
    await prisma.userRole.create({ data: { userId: root.id, roleId: superRole.id } });
    await prisma.businessSetting.createMany({
      data: [
        { businessId: a.id, brandTone: 'A-original' },
        { businessId: b.id, brandTone: 'B-original' },
      ],
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('list is self-scoped: Alice sees only business A', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/businesses')
      .set('x-dev-user-id', ids.alice)
      .expect(200);
    expect(res.body.map((b: { id: string }) => b.id)).toEqual([ids.bizA]);
  });

  it('super admin sees every business', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/businesses')
      .set('x-dev-user-id', ids.root)
      .expect(200);
    expect(res.body.map((b: { id: string }) => b.id).sort()).toEqual([ids.bizA, ids.bizB].sort());
  });

  it('Alice can read business A but is 403 on business B', async () => {
    await request(app.getHttpServer())
      .get(`/api/businesses/${ids.bizA}`)
      .set('x-dev-user-id', ids.alice)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/api/businesses/${ids.bizB}`)
      .set('x-dev-user-id', ids.alice)
      .expect(403);
  });

  it('member listing never crosses tenants', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/businesses/${ids.bizA}/members`)
      .set('x-dev-user-id', ids.alice)
      .expect(200);
    const emails = res.body.map((m: { user: { email: string } }) => m.user.email);
    expect(emails).toEqual(['alice@ex.com']);

    await request(app.getHttpServer())
      .get(`/api/businesses/${ids.bizB}/members`)
      .set('x-dev-user-id', ids.alice)
      .expect(403);
  });

  it('Alice cannot write business B settings, and B stays untouched', async () => {
    await request(app.getHttpServer())
      .patch(`/api/businesses/${ids.bizB}/settings`)
      .set('x-dev-user-id', ids.alice)
      .send({ brandTone: 'hacked-by-A' })
      .expect(403);

    const bSettings = await prisma.businessSetting.findUnique({ where: { businessId: ids.bizB } });
    expect(bSettings?.brandTone).toBe('B-original');
  });

  it('Alice can write her own business settings', async () => {
    await request(app.getHttpServer())
      .patch(`/api/businesses/${ids.bizA}/settings`)
      .set('x-dev-user-id', ids.alice)
      .send({ brandTone: 'A-updated', locale: 'en-IN' })
      .expect(200);
    const aSettings = await prisma.businessSetting.findUnique({ where: { businessId: ids.bizA } });
    expect(aSettings?.brandTone).toBe('A-updated');
  });

  it('unauthenticated request is rejected', async () => {
    await request(app.getHttpServer()).get('/api/businesses').expect(401);
  });

  it('tenant-bound Prisma client only returns rows for its business', async () => {
    const aRows = await tenantPrisma.forBusiness(ids.bizA).businessUser.findMany();
    const bRows = await tenantPrisma.forBusiness(ids.bizB).businessUser.findMany();
    expect(aRows.every((r) => r.businessId === ids.bizA)).toBe(true);
    expect(bRows.every((r) => r.businessId === ids.bizB)).toBe(true);

    // Explicitly asking for the other tenant's id is overridden by the bound
    // business, so it can never surface business B's rows.
    const spoofed = await tenantPrisma
      .forBusiness(ids.bizA)
      .businessUser.findMany({ where: { businessId: ids.bizB } });
    expect(spoofed.some((r) => r.businessId === ids.bizB)).toBe(false);
    expect(spoofed.every((r) => r.businessId === ids.bizA)).toBe(true);
  });

  it('findUnique is refused on tenant models via the scoped client', async () => {
    // Allowed by the types, blocked at runtime so it can never run unscoped.
    await expect(
      tenantPrisma
        .forBusiness(ids.bizA)
        .businessSetting.findUnique({ where: { businessId: ids.bizA } }),
    ).rejects.toThrow(/not allowed/);
  });

  it('sanity: seed ids are populated', () => {
    expect(Object.values(ids).every(Boolean)).toBe(true);
  });
});
