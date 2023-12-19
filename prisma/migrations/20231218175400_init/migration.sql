-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "privyId" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),
    "streak" INTEGER NOT NULL DEFAULT 0,
    "manaBalance" INTEGER NOT NULL DEFAULT 0,
    "totalManaEarned" INTEGER NOT NULL DEFAULT 0,
    "farcasterFID" INTEGER,
    "ANKYBalance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "chainType" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingSession" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "manaEarned" DOUBLE PRECISION NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "writingCID" TEXT,
    "uploadedToFarcaster" BOOLEAN NOT NULL DEFAULT false,
    "farcasterHash" TEXT,

    CONSTRAINT "WritingSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_privyId_key" ON "User"("privyId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingSession" ADD CONSTRAINT "WritingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
