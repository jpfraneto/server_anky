-- CreateTable
CREATE TABLE "FarcasterAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "signerUuid" TEXT NOT NULL,
    "signerStatus" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "fid" INTEGER NOT NULL,
    "approvalUrl" TEXT NOT NULL,

    CONSTRAINT "FarcasterAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FarcasterAccount_userId_key" ON "FarcasterAccount"("userId");

-- AddForeignKey
ALTER TABLE "FarcasterAccount" ADD CONSTRAINT "FarcasterAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("privyId") ON DELETE RESTRICT ON UPDATE CASCADE;
