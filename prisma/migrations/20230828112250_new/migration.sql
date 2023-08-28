-- CreateTable
CREATE TABLE "Writing" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "sojourn" INTEGER NOT NULL,
    "wink" INTEGER NOT NULL,
    "kingdom" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "Writing_pkey" PRIMARY KEY ("id")
);
