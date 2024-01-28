/*
  Warnings:

  - A unique constraint covering the columns `[fid]` on the table `FarcasterAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[farcasterFID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "GeneratedAnky" (
    "cid" TEXT NOT NULL,
    "ankyBio" TEXT,
    "imagePrompt" TEXT,
    "imagineApiID" TEXT,
    "imagineApiStatus" TEXT DEFAULT 'pending',
    "imageIPFSHash" TEXT,
    "metadataIPFSHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedAnky_pkey" PRIMARY KEY ("cid")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedAnky_cid_key" ON "GeneratedAnky"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "FarcasterAccount_fid_key" ON "FarcasterAccount"("fid");

-- CreateIndex
CREATE UNIQUE INDEX "User_farcasterFID_key" ON "User"("farcasterFID");
