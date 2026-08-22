/*
  Warnings:

  - A unique constraint covering the columns `[contentBlockId,type]` on the table `notifications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "notifications_contentBlockId_type_key" ON "notifications"("contentBlockId", "type");
