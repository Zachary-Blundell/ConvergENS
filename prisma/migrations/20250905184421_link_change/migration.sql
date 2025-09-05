/*
  Warnings:

  - You are about to drop the column `handle` on the `SocialLink` table. All the data in the column will be lost.
  - You are about to drop the column `isPrimary` on the `SocialLink` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `SocialLink` table. All the data in the column will be lost.

*/
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
    CONSTRAINT "SocialLink_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "Association" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
