-- CreateTable
CREATE TABLE "ElectronicMusicRecommendation" (
    "fid" TEXT NOT NULL,
    "link" TEXT,

    CONSTRAINT "ElectronicMusicRecommendation_pkey" PRIMARY KEY ("fid")
);

-- CreateTable
CREATE TABLE "Raver" (
    "fid" TEXT NOT NULL,

    CONSTRAINT "Raver_pkey" PRIMARY KEY ("fid")
);

-- CreateTable
CREATE TABLE "Library" (
    "id" SERIAL NOT NULL,
    "raverFid" TEXT NOT NULL,
    "recommendationFid" TEXT NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Library_raverFid_recommendationFid_key" ON "Library"("raverFid", "recommendationFid");

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_raverFid_fkey" FOREIGN KEY ("raverFid") REFERENCES "Raver"("fid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_recommendationFid_fkey" FOREIGN KEY ("recommendationFid") REFERENCES "ElectronicMusicRecommendation"("fid") ON DELETE RESTRICT ON UPDATE CASCADE;
