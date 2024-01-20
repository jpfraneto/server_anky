-- AlterTable
ALTER TABLE "User" ADD COLUMN     "farcasterNotificationsEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastNotified" TIMESTAMP(3);
