-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "metaTitle" TEXT NOT NULL DEFAULT 'Free Letterhead Generator',
    "metaDescription" TEXT NOT NULL DEFAULT 'Create professional letterheads for free. Easy to use, customizable, and download as PDF.',
    "robotsTxt" TEXT NOT NULL DEFAULT 'User-agent: *
Allow: /',
    "googleVerification" TEXT NOT NULL DEFAULT '',
    "showCounter" BOOLEAN NOT NULL DEFAULT true,
    "totalGenerated" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_SiteSettings" ("googleVerification", "id", "metaDescription", "metaTitle", "robotsTxt") SELECT "googleVerification", "id", "metaDescription", "metaTitle", "robotsTxt" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
