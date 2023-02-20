import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createCategory } from "~/models/category.server";
import { createGame } from "~/models/game.server";
import { createHero } from "~/models/honhero.server";
import { createHoNRun } from "~/models/honrun.server";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@testson.mail";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("tester1234", 10);

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

  await createGame("Heroes of Newerth");

  const categories = {
    "2pal": "2 player all lanes",
    "1pal": "1 player all lanes",
    "1pol": "1 player one lane",
  };

  for (const category of Object.values(categories)) {
    await createCategory(category, "Heroes of Newerth");
  }

  const heroes = [
    { name: "Flint Beastwood" },
    { name: "Bombardier" },
    { name: "Balphagore" },
    { name: "Keeper of the forest" },
  ];

  for (const hero of heroes) {
    await createHero(hero);
  }

  const runs = [
    {
      title: "Flinty boi does it",
      category: { name: categories["1pal"] },
      heroes: [heroes[0]],
      time: "1:33:07",
      slug: "hon-1",
      users: [user.id],
    },
    {
      title: "Flinty boi does it",
      category: { name: categories["1pol"] },
      heroes: [heroes[2]],
      time: "1:33:07",
      slug: "hon-2",
      user: [user.id],
    },
  ];

  for (const run of runs) {
    await createHoNRun(
      {
        gameName: "Heroes of Newerth",
        slug: run.slug,
        time: run.time,
        title: run.title,
        note: null,
      },
      run.heroes,
      [user]
    );
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
