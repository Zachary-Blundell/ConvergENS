/*
  Warnings:

  - You are about to drop the column `blurb` on the `Association` table. All the data in the column will be lost.
  - You are about to drop the column `imagePath` on the `Association` table. All the data in the column will be lost.
  - You are about to drop the column `socials` on the `Association` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "associationId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "handle" TEXT,
    "label" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SocialLink_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Association" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#111827',
    "description" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT,
    "contactEmail" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Association" ("color", "createdAt", "id", "name", "slug", "updatedAt") SELECT "color", "createdAt", "id", "name", "slug", "updatedAt" FROM "Association";
DROP TABLE "Association";
ALTER TABLE "new_Association" RENAME TO "Association";
CREATE UNIQUE INDEX "Association_name_key" ON "Association"("name");
CREATE UNIQUE INDEX "Association_slug_key" ON "Association"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "SocialLink_associationId_idx" ON "SocialLink"("associationId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_associationId_url_key" ON "SocialLink"("associationId", "url");
