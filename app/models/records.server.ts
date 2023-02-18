import { prisma } from "~/db.server";
import type { Record, HoNHero, User } from "@prisma/client";

export async function getRecords() {
  return prisma.record.findMany({ include: { category: true } });
}

export async function getRecord(slug: string) {
  return prisma.record.findUnique({
    where: { slug },
    include: { heroes: true, users: true, category: true },
  });
}

export async function createRecord(
  record: Record,
  heroes: Array<HoNHero>,
  users: Array<User>
) {
  return prisma.record.create({
    data: {
      slug: record.slug,
      time: record.time,
      title: record.title,
      category: {
        connectOrCreate: {
          create: {
            name: record.categoryName,
          },
          where: {
            name: record.categoryName,
          },
        },
      },
      users: {
        connect: users.map((user) => {
          return {
            id: user.id,
          };
        }),
      },
      heroes: {
        connectOrCreate: heroes.map((hero) => {
          return {
            create: {
              name: hero.name,
            },
            where: {
              name: hero.name,
            },
          };
        }),
      },
    },

    include: {
      category: true,
    },
  });
}

export async function getCategoriesForGame() {
  const records = await prisma.record.findMany({ include: { category: true } });
  const categories = Array.from(
    new Set(records.map((record) => record.category))
  );

  return categories;
}

export async function getHeroes() {
  const records = await prisma.record.findMany({ include: { heroes: true } });
  const heroes = Array.from(
    new Set(records.flatMap((record) => record.heroes.map((hero) => hero.name)))
  );

  return heroes;
}

export async function getNumberOfEntries() {
  return (await prisma.record.findMany()).length;
}
