-- CreateTable
CREATE TABLE "Humanmusic" (
    "fid" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Humanmusic_fid_key" ON "Humanmusic"("fid");
