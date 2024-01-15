-- CreateTable
CREATE TABLE "CastWrapper" (
    "cid" TEXT NOT NULL,
    "castHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "manaEarned" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "CastWrapper_cid_key" ON "CastWrapper"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "CastWrapper_castHash_key" ON "CastWrapper"("castHash");
