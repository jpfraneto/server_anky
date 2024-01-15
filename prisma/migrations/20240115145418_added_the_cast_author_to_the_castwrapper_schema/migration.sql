/*
  Warnings:

  - Added the required column `castAuthor` to the `CastWrapper` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CastWrapper" ADD COLUMN     "castAuthor" TEXT NOT NULL;
