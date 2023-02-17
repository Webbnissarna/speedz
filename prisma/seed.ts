import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@testson.mail";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("tester", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const categories = {
    "2pal": "2 player all lanes",
    "1pal": "1 player all lanes",
    "1pol": "1 player one lane",
  };

  for (const category of Object.values(categories)) {
    await prisma.category.upsert({
      where: { name: category },
      create: {
        name: category,
      },
      update: {
        name: category,
      },
    });
  }

  const records = [
    {
      title: "Flinty boi does it",
      category: { name: categories["1pal"] },
      heroes: [{ name: "Flint Beastwood" }],
      time: "1:33:07",
      slug: "hon-1",
      users: [user.id],
    },
    {
      title: "Flinty boi does it",
      category: { name: categories["1pol"] },
      heroes: [{ name: "Bombardier" }],
      time: "1:33:07",
      slug: "hon-2",
      user: [user.id],
    },
  ];

  for (const record of records) {
    await prisma.record.upsert({
      where: { slug: record.slug },
      update: {
        title: record.title,
        category: {
          connect: record.category,
        },
        slug: record.slug,
        time: record.time,
        users: {
          connect: { id: user.id },
        },
        heroes: {
          connectOrCreate: record.heroes.map((hero) => {
            return {
              create: { name: hero.name },
              where: { name: hero.name },
            };
          }),
        },
      },
      create: {
        title: record.title,
        category: {
          connect: record.category,
        },
        slug: record.slug,
        time: record.time,
        users: {
          connect: { id: user.id },
        },
        heroes: {
          connectOrCreate: record.heroes.map((hero) => {
            return {
              create: { name: hero.name },
              where: { name: hero.name },
            };
          }),
        },
      },
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
