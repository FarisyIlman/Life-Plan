-- AlterTable
ALTER TABLE "content_blocks" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "eras" ADD COLUMN     "deletedAt" TIMESTAMP(3);
