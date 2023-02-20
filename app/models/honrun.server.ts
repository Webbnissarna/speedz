import type { HoNHero, Run, User } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getHoNRuns() {
  return prisma.hoNRun.findMany();
}

export async function getHoNRunsByHero(heroName: string) {
  return prisma.hoNRun.findMany({
    where: {
      HoNHero: {
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
  run: Omit<Run, "id">,
  heroes: Array<HoNHero>,
  users: Array<User>
) {
  return prisma.hoNRun.create({
    data: {
      run: {
        connectOrCreate: {
          create: {
            slug: run.slug,
            time: run.time,
            title: run.title,
            gameName: run.gameName,
            note: run.note,
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
      HoNHero: {
        connect: heroes.map((hero) => ({ name: hero.name })),
      },
    },
  });
}
