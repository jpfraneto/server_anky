/*
  Warnings:

  - You are about to drop the column `kingdom` on the `Writing` table. All the data in the column will be lost.
  - You are about to drop the column `prompt` on the `Writing` table. All the data in the column will be lost.
  - You are about to drop the column `sojourn` on the `Writing` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Writing` table. All the data in the column will be lost.
  - You are about to drop the column `wink` on the `Writing` table. All the data in the column will be lost.
  - Added the required column `bundlrURL` to the `Writing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayId` to the `Writing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Writing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Writing" DROP COLUMN "kingdom",
DROP COLUMN "prompt",
DROP COLUMN "sojourn",
DROP COLUMN "text",
DROP COLUMN "wink",
ADD COLUMN     "bundlrURL" TEXT NOT NULL,
ADD COLUMN     "dayId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Day" (
    "id" SERIAL NOT NULL,
    "sojourn" INTEGER NOT NULL,
    "wink" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "kingdom" TEXT NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "subInfo" JSONB NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Day_sojourn_wink_key" ON "Day"("sojourn", "wink");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- AddForeignKey
ALTER TABLE "Writing" ADD CONSTRAINT "Writing_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Writing" ADD CONSTRAINT "Writing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
