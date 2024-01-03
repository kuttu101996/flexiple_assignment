/*
  Warnings:

  - A unique constraint covering the columns `[table_number]` on the table `Table` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `table_number` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "table_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Table_table_number_key" ON "Table"("table_number");
