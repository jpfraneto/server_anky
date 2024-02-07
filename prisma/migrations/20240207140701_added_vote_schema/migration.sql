-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "ankyCid" TEXT NOT NULL,
    "userFid" INTEGER NOT NULL,
    "voteIndex" INTEGER NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_ankyCid_userFid_key" ON "Vote"("ankyCid", "userFid");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_ankyCid_fkey" FOREIGN KEY ("ankyCid") REFERENCES "GeneratedAnky"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;
