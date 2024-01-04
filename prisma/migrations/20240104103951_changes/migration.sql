/*
  Warnings:

  - You are about to drop the column `available_tables` on the `Restaurant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_restaurant_id_fkey";

-- DropIndex
DROP INDEX "MenuItem_name_key";

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "available_tables";

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
