import { prisma } from "~/db.server";

export async function getCategory(name: string, gameName: string) {
  return prisma.category.findFirst({
    where: {
      game: { is: { name: gameName.toLowerCase() } },
      AND: { name: name },
    },
  });
}

export async function getCategoriesForGame(gameName: string) {
  return prisma.category.findMany({
    where: { game: { is: { name: gameName.toLowerCase() } } },
  });
}

export async function createCategory(categoryName: string, gameName: string) {
  const category = await getCategory(categoryName, gameName.toLowerCase());
  if (category) {
    return null;
  }
  return prisma.category.create({
    data: {
      gameName: gameName.toLowerCase(),
      name: categoryName,
    },
  });
}
