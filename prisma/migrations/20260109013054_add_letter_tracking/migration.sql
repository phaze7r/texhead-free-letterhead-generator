-- CreateTable
CREATE TABLE "GeneratedLetter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyName" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeeEmail" TEXT NOT NULL,
    "employeeWebsite" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT
);
