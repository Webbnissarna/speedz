/*
  Warnings:

  - Added the required column `title` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Record" (
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "slug" TEXT NOT NULL PRIMARY KEY,
    "time" TEXT NOT NULL
);
INSERT INTO "new_Record" ("category", "slug", "time") SELECT "category", "slug", "time" FROM "Record";
DROP TABLE "Record";
ALTER TABLE "new_Record" RENAME TO "Record";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
