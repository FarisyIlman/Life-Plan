-- AlterTable
ALTER TABLE "content_blocks" ADD COLUMN     "achievementGoalId" TEXT;

-- CreateIndex
CREATE INDEX "content_blocks_achievementGoalId_idx" ON "content_blocks"("achievementGoalId");

-- AddForeignKey
ALTER TABLE "content_blocks" ADD CONSTRAINT "content_blocks_achievementGoalId_fkey" FOREIGN KEY ("achievementGoalId") REFERENCES "achievement_goals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
