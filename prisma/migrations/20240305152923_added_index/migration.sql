/*
  Warnings:

  - Added the required column `chakra` to the `AnkyWriter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnkyWriter" ADD COLUMN     "chakra" INTEGER NOT NULL;
