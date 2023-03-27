import type { HoNHero } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getHeroes() {
  return prisma.hoNHero.findMany();
}

export async function getHeroesByName(names: Array<string>) {
  return prisma.hoNHero.findMany({ where: { name: { in: names } } });
}

export async function getHero(name: string) {
  return prisma.hoNHero.findUnique({ where: { name: name } });
}

export async function createHero(hero: HoNHero) {
  return prisma.hoNHero.upsert({
    create: { name: hero.name },
    update: {
      name: hero.name,
    },
    where: {
      name: hero.name,
    },
  });
}
