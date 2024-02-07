/*
  Warnings:

  - You are about to drop the `ElectronicMusicRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Library` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Library" DROP CONSTRAINT "Library_raverFid_fkey";

-- DropForeignKey
ALTER TABLE "Library" DROP CONSTRAINT "Library_recommendationFid_fkey";

-- DropTable
DROP TABLE "ElectronicMusicRecommendation";

-- DropTable
DROP TABLE "Library";

-- CreateTable
CREATE TABLE "Electronicmusicrecommendation" (
    "castHash" TEXT NOT NULL,
    "fid" TEXT,
    "link" TEXT,
    "submittedByFid" TEXT NOT NULL,

    CONSTRAINT "Electronicmusicrecommendation_pkey" PRIMARY KEY ("castHash")
);

-- CreateTable
CREATE TABLE "_UserLikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserLikes_AB_unique" ON "_UserLikes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLikes_B_index" ON "_UserLikes"("B");

-- AddForeignKey
ALTER TABLE "Electronicmusicrecommendation" ADD CONSTRAINT "Electronicmusicrecommendation_submittedByFid_fkey" FOREIGN KEY ("submittedByFid") REFERENCES "Raver"("fid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikes" ADD CONSTRAINT "_UserLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Electronicmusicrecommendation"("castHash") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserLikes" ADD CONSTRAINT "_UserLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "Raver"("fid") ON DELETE CASCADE ON UPDATE CASCADE;
