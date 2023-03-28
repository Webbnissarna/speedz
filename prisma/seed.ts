import type { Category } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createCategory } from "~/models/category.server";
import { createGame } from "~/models/game.server";
import { createHero } from "~/models/honhero.server";
import { createHoNRun } from "~/models/honrun.server";

const prisma = new PrismaClient();

async function seed() {
  const username = "tester";

  // cleanup the existing database
  await prisma.user.delete({ where: { name: username } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("tester1234", 10);

  const user = await prisma.user.upsert({
    where: { name: username },
    create: {
      name: username,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
    update: {
      name: username,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await createGame("Heroes of Newerth");

  const categoryNames = [
    { numberOfPlayers: 2, name: "2 player all lanes" },
    { numberOfPlayers: 1, name: "1 player all lanes" },
    { numberOfPlayers: 1, name: "1 player one lane" },
  ];

  let categories: Array<Category> = [];
  for (const categoryName of categoryNames) {
    const category = await createCategory(
      categoryName.name,
      "Heroes of Newerth",
      categoryName.numberOfPlayers
    );
    if (category) {
      categories.push(category);
    }
  }

  const heroes = [{ name: "Accursed" }, { name: "Aluna" }];

  for (const hero of heroes) {
    await createHero(hero);
  }

  const runs = [
    {
      title: "He does it",
      category: categories[1],
      heroes: [heroes[0]],
      time: "1:33:07",
      slug: "hon-1",
      users: [user.id],
    },
    {
      title: "Hei does it again",
      category: categories[2],
      heroes: [heroes[1]],
      time: "1:33:07",
      slug: "hon-2",
      user: [user.id],
    },
  ];

  for (const run of runs) {
    await createHoNRun(
      {
        gameName: "Heroes of Newerth".toLowerCase(),
        slug: run.slug,
        time: run.time,
        title: run.title,
        note: null,
      },
      run.heroes,
      [user],
      run.category.id
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
