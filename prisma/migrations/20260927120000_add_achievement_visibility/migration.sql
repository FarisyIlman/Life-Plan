-- CreateEnum
CREATE TYPE "AchievementVisibility" AS ENUM ('PRIVATE', 'SUMMARY', 'PUBLIC');

-- AlterTable
ALTER TABLE "achievement_goals"
ADD COLUMN "visibility" "AchievementVisibility" NOT NULL DEFAULT 'PRIVATE',
ADD COLUMN "showValues" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "showEvidence" BOOLEAN NOT NULL DEFAULT false;