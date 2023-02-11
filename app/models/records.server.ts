import { prisma } from "~/db.server";
import type { Record, HoNHeroes, User } from "@prisma/client";

export async function getRecords() {
  return prisma.record.findMany();
}

export async function getRecord(slug: string) {
  return prisma.record.findUnique({
    where: { slug },
    include: { heroes: true, users: true },
  });
}

export async function createRecord(
  record: Record,
  heroes: Array<HoNHeroes>,
  users: Array<Pick<User, "email">>
) {
  return prisma.record.create({
    data: {
      ...record,
      users: {
        connect: users.map((user) => ({ email: user.email })),
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
  });
}

export async function getCategoriesForGame() {
  const records = await prisma.record.findMany();
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
