-- AlterTable
ALTER TABLE "GeneratedAnky" ADD COLUMN     "mintOpen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "votingOpen" BOOLEAN NOT NULL DEFAULT true;
