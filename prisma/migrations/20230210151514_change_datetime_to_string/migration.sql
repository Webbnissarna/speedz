/*
  Warnings:

  - You are about to drop the column `game` on the `Record` table. All the data in the column will be lost.
  - Added the required column `time` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "HoNHeroes" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "_RecordToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_RecordToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Record" ("slug") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_RecordToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_HoNHeroesToRecord" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_HoNHeroesToRecord_A_fkey" FOREIGN KEY ("A") REFERENCES "HoNHeroes" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_HoNHeroesToRecord_B_fkey" FOREIGN KEY ("B") REFERENCES "Record" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Record" (
    "category" TEXT NOT NULL,
    "slug" TEXT NOT NULL PRIMARY KEY,
    "time" TEXT NOT NULL
);
INSERT INTO "new_Record" ("category", "slug") SELECT "category", "slug" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_RecordToUser_AB_unique" ON "_RecordToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RecordToUser_B_index" ON "_RecordToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HoNHeroesToRecord_AB_unique" ON "_HoNHeroesToRecord"("A", "B");

-- CreateIndex
CREATE INDEX "_HoNHeroesToRecord_B_index" ON "_HoNHeroesToRecord"("B");
