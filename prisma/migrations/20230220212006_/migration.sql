/*
  Warnings:

  - You are about to drop the `Record` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HoNHeroToRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecordToUser` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `gameName` to the `Category` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Category` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "_HoNHeroToRecord_B_index";

-- DropIndex
DROP INDEX "_HoNHeroToRecord_AB_unique";

-- DropIndex
DROP INDEX "_RecordToUser_B_index";

-- DropIndex
DROP INDEX "_RecordToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Record";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_HoNHeroToRecord";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_RecordToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Game" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "note" TEXT,
    "gameName" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "Run_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Run_gameName_fkey" FOREIGN KEY ("gameName") REFERENCES "Game" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HoNRun" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "runId" TEXT NOT NULL,
    CONSTRAINT "HoNRun_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_RunToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RunToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Run" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RunToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_HoNHeroToHoNRun" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_HoNHeroToHoNRun_A_fkey" FOREIGN KEY ("A") REFERENCES "HoNHero" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_HoNHeroToHoNRun_B_fkey" FOREIGN KEY ("B") REFERENCES "HoNRun" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    CONSTRAINT "Category_gameName_fkey" FOREIGN KEY ("gameName") REFERENCES "Game" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("name") SELECT "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Run_id_key" ON "Run"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Run_slug_key" ON "Run"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HoNRun_runId_key" ON "HoNRun"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "_RunToUser_AB_unique" ON "_RunToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RunToUser_B_index" ON "_RunToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HoNHeroToHoNRun_AB_unique" ON "_HoNHeroToHoNRun"("A", "B");

-- CreateIndex
CREATE INDEX "_HoNHeroToHoNRun_B_index" ON "_HoNHeroToHoNRun"("B");
