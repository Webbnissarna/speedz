/*
  Warnings:

  - Added the required column `nbrOfPlayers` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gameName" TEXT NOT NULL,
    "nbrOfPlayers" INTEGER NOT NULL,
    CONSTRAINT "Category_gameName_fkey" FOREIGN KEY ("gameName") REFERENCES "Game" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("gameName", "id", "name") SELECT "gameName", "id", "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
