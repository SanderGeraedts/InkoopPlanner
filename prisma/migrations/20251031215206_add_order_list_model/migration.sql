/*
  Warnings:

  - You are about to drop the column `orderId` on the `OrderRow` table. All the data in the column will be lost.
  - Added the required column `orderListId` to the `OrderRow` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "OrderList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderList_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderRow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderListId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "OrderRow_orderListId_fkey" FOREIGN KEY ("orderListId") REFERENCES "OrderList" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderRow_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrderRow" ("id", "productId", "quantity") SELECT "id", "productId", "quantity" FROM "OrderRow";
DROP TABLE "OrderRow";
ALTER TABLE "new_OrderRow" RENAME TO "OrderRow";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
