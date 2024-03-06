-- CreateTable
CREATE TABLE "AnkyWriter" (
    "id" SERIAL NOT NULL,
    "writer" TEXT NOT NULL,
    "book" TEXT NOT NULL,
    "deity" TEXT NOT NULL,
    "painter" TEXT NOT NULL,
    "name" TEXT,
    "imagePrompt" TEXT,
    "index" INTEGER NOT NULL,
    "story" TEXT,
    "kingdom" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "imagineApiStatus" TEXT,
    "imagineApiID" TEXT,
    "frameImageUrl" TEXT,
    "imageOneUrl" TEXT,
    "imageTwoUrl" TEXT,
    "imageThreeUrl" TEXT,
    "imageFourUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnkyWriter_pkey" PRIMARY KEY ("id")
);
