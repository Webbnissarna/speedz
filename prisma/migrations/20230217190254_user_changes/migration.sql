/*
  Warnings:

  - You are about to drop the `HoNHeroes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HoNHeroesToRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `category` on the `Record` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryName` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_HoNHeroesToRecord_B_index";

-- DropIndex
DROP INDEX "_HoNHeroesToRecord_AB_unique";

-- AlterTable
ALTER TABLE "User" ADD COLUMN "name" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HoNHeroes";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Note";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_HoNHeroesToRecord";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "HoNHero" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "_HoNHeroToRecord" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_HoNHeroToRecord_A_fkey" FOREIGN KEY ("A") REFERENCES "HoNHero" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_HoNHeroToRecord_B_fkey" FOREIGN KEY ("B") REFERENCES "Record" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Record" (
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL PRIMARY KEY,
    "time" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    CONSTRAINT "Record_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Record" ("slug", "time", "title") SELECT "slug", "time", "title" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_HoNHeroToRecord_AB_unique" ON "_HoNHeroToRecord"("A", "B");

-- CreateIndex
CREATE INDEX "_HoNHeroToRecord_B_index" ON "_HoNHeroToRecord"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
