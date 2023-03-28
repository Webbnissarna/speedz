import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

/** Update user without allowing to overwrite someone elses mail/name */
export async function updateUser(user: User) {
  const errors: { name: string | null } = {
    name: null,
  };
  const existingUsername = await prisma.user.findUnique({
    where: { name: user.name },
  });
  if (existingUsername && existingUsername.id !== user.id) {
    errors.name = "Name already in use";
  }

  const hasErrors = Object.values(errors).some((error) => error);

  if (!hasErrors) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        updatedAt: new Date(),
      },
    });
  }
  return errors;
}

export async function getUsersByName(names: Array<string>) {
  const userPromises = names.map(async (name) => {
    return await prisma.user.findFirst({
      where: {
        name: name,
      },
    });
  });

  try {
    const users = await Promise.all(userPromises);
    return users.filter((user): user is User => user !== null);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByName(name: User["name"]) {
  return prisma.user.findUnique({ where: { name } });
}

export async function createUser(name: User["name"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByName(name: User["name"]) {
  return prisma.user.delete({ where: { name } });
}

export async function verifyLogin(
  name: User["name"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { name },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
