import { PrismaClient, AuthProvider } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  if (process.env.NODE_ENV === "test" || process.env.SEED_DISABLE === "1") {
    console.log("Seeding disabled for test/CI."); return;
  }
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: null,
      profile: { create: { fullName: "Admin One" } },
      accounts: { create: { provider: AuthProvider.GOOGLE, providerAccountId: "sample" } },
    },
  });
  console.log("Seeded:", admin.email);
}
main().finally(() => prisma.$disconnect());
