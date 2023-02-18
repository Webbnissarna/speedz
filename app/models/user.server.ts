import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

/** Update user without allowing to overwrite someone elses mail/name */
export async function updateUser(user: User) {
  const errors: { email: string | null; name: string | null } = {
    email: null,
    name: null,
  };
  const existingUserEmail = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (existingUserEmail && existingUserEmail.id !== user.id) {
    errors.email = "Email already in use";
  }
  if (user.name) {
    const existingUserName = await prisma.user.findUnique({
      where: { name: user.name },
    });
    if (existingUserName && existingUserName.id !== user.id) {
      errors.name = "Name already in use";
      console.log("errors", errors);
    }
  }

  const hasErrors = Object.values(errors).some((error) => error);

  if (!hasErrors) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        name: user.name,
        updatedAt: new Date(),
      },
    });
  }
  return errors;
}

export async function getUsersByEmail(emails: Array<string>) {
  const userPromises = emails.map(async (email) => {
    return await prisma.user.findUnique({ where: { email: email } });
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

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
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
