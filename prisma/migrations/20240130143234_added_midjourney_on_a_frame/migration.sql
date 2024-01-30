-- CreateTable
CREATE TABLE "MidjourneyOnAFrame" (
    "userFid" INTEGER NOT NULL,
    "alreadyMinted" BOOLEAN NOT NULL DEFAULT false,
    "imagePrompt" TEXT,
    "imagineApiID" TEXT,
    "imagineApiStatus" TEXT DEFAULT 'pending',
    "imageIPFSHash" TEXT,
    "metadataIPFSHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "castHash" TEXT,

    CONSTRAINT "MidjourneyOnAFrame_pkey" PRIMARY KEY ("userFid")
);

-- CreateIndex
CREATE UNIQUE INDEX "MidjourneyOnAFrame_userFid_key" ON "MidjourneyOnAFrame"("userFid");
