-- CreateEnum
CREATE TYPE "EraPageVariant" AS ENUM ('STANDARD', 'BEYOND');

-- AlterTable
ALTER TABLE "eras"
ADD COLUMN "pageVariant" "EraPageVariant" NOT NULL DEFAULT 'STANDARD';

-- Preserve the existing Tree view selection for already-created Beyond eras.
UPDATE "eras"
SET "pageVariant" = 'BEYOND'
WHERE "theme" = 'TREE' AND LOWER("slug") LIKE '%beyond%';