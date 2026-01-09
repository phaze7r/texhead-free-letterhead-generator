-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "metaTitle" TEXT NOT NULL DEFAULT 'Free Letterhead Generator',
    "metaDescription" TEXT NOT NULL DEFAULT 'Create professional letterheads for free. Easy to use, customizable, and download as PDF.',
    "robotsTxt" TEXT NOT NULL DEFAULT 'User-agent: *
Allow: /',
    "googleVerification" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_SiteSettings" ("id", "metaDescription", "metaTitle", "robotsTxt") SELECT "id", "metaDescription", "metaTitle", "robotsTxt" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
