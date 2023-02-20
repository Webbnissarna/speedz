import { prisma } from "~/db.server";

export async function getCategory(name: string, gameName: string) {
  return prisma.category.findFirst({
    where: { game: { is: { name: gameName } }, AND: { name: name } },
  });
}

export async function getCategoriesForGame(gameName: string) {
  return prisma.category.findMany({
    where: { game: { is: { name: gameName } } },
  });
}

export async function createCategory(categoryName: string, gameName: string) {
  const category = await getCategory(categoryName, gameName);
  if (!category) {
    return null;
  }
  prisma.category.create({
    data: {
      gameName: gameName,
      name: categoryName,
    },
  });
}
