import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Rodando seed...");

  await prisma.tenant.createMany({
    data: [
      { name: "Empresa 1" },
      { name: "Empresa 2" },
      { name: "Empresa 3" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed finalizado!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });