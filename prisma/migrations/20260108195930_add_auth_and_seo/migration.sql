-- CreateTable
CREATE TABLE "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "metaTitle" TEXT NOT NULL DEFAULT 'Free Letterhead Generator',
    "metaDescription" TEXT NOT NULL DEFAULT 'Create professional letterheads for free. Easy to use, customizable, and download as PDF.',
    "robotsTxt" TEXT NOT NULL DEFAULT 'User-agent: *
Allow: /'
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");
