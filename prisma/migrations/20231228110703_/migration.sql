/*
  Warnings:

  - A unique constraint covering the columns `[farcasterFID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "longestStreak" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "User_farcasterFID_key" ON "User"("farcasterFID");
