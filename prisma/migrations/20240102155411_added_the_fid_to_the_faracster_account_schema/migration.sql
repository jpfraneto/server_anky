-- AlterTable
ALTER TABLE "FarcasterAccount" ALTER COLUMN "fid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ManaTransaction" ADD COLUMN     "cid" TEXT;
