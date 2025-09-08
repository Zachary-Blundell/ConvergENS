/*
  Warnings:

  - You are about to drop the `Association` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Association_slug_key";

-- DropIndex
DROP INDEX "Association_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Association";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ORGANIZER" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'organizer',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ASSOCIATION" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#ffffff',
    "description" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT,
    "contactEmail" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ASSOCIATION_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "ORGANIZER" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SocialLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "associationId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SocialLink_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "ASSOCIATION" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SocialLink" ("associationId", "createdAt", "id", "platform", "updatedAt", "url") SELECT "associationId", "createdAt", "id", "platform", "updatedAt", "url" FROM "SocialLink";
DROP TABLE "SocialLink";
ALTER TABLE "new_SocialLink" RENAME TO "SocialLink";
CREATE UNIQUE INDEX "SocialLink_url_key" ON "SocialLink"("url");
CREATE INDEX "SocialLink_associationId_idx" ON "SocialLink"("associationId");
CREATE INDEX "SocialLink_platform_idx" ON "SocialLink"("platform");
CREATE UNIQUE INDEX "SocialLink_associationId_platform_key" ON "SocialLink"("associationId", "platform");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ORGANIZER_email_key" ON "ORGANIZER"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ASSOCIATION_organizerId_key" ON "ASSOCIATION"("organizerId");

-- CreateIndex
CREATE UNIQUE INDEX "ASSOCIATION_name_key" ON "ASSOCIATION"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ASSOCIATION_slug_key" ON "ASSOCIATION"("slug");
