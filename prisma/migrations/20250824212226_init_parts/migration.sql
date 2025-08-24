/*
  Warnings:

  - Added the required column `slug` to the `Association` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Association" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#111827',
    "blurb" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL,
    "imagePath" TEXT,
    "socials" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Association" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Association";
DROP TABLE "Association";
ALTER TABLE "new_Association" RENAME TO "Association";
CREATE UNIQUE INDEX "Association_name_key" ON "Association"("name");
CREATE UNIQUE INDEX "Association_slug_key" ON "Association"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
