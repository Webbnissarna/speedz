import type { HoNHero, Run, User } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getHoNRunBySlug(slug: string) {
  return prisma.hoNRun.findFirst({
    where: { run: { slug: slug } },
    include: {
      HoNHeroes: true,
      run: { include: { users: true, category: true } },
    },
  });
}

export async function getHoNRuns() {
  return prisma.hoNRun.findMany();
}

export async function getHoNRunsByHero(heroName: string) {
  return prisma.hoNRun.findMany({
    where: {
      HoNHeroes: {
        some: {
          name: heroName,
        },
      },
    },
  });
}

export async function getHoNRunsByPlayerID(playerId: string) {
  return prisma.hoNRun.findMany({
    where: {
      run: { users: { some: { id: playerId } } },
    },
  });
}
export async function getHoNRunsByPlayerName(playerName: string) {
  return prisma.hoNRun.findMany({
    where: {
      run: { users: { some: { name: playerName } } },
    },
  });
}

export async function createHoNRun(
  run: Omit<Run, "id" | "categoryId">,
  heroes: Array<HoNHero>,
  users: Array<User>,
  categoryId: string
) {
  return prisma.hoNRun.create({
    data: {
      run: {
        connectOrCreate: {
          create: {
            slug: run.slug,
            time: run.time,
            title: run.title,
            gameName: run.gameName.toLowerCase(),
            note: run.note,
            categoryId: categoryId,
            users: {
              connect: users.map((user) => {
                return {
                  id: user.id,
                };
              }),
            },
          },
          where: {
            slug: run.slug,
          },
        },
      },
      HoNHeroes: {
        connect: heroes.map((hero) => ({ name: hero.name })),
      },
    },
  });
}
