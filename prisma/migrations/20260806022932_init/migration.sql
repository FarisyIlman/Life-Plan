-- CreateEnum
CREATE TYPE "ThemeType" AS ENUM ('GALAXY', 'MONTHLY', 'RACING', 'VOYAGE', 'TREE');

-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('SALARY', 'SAVING');

-- CreateEnum
CREATE TYPE "AchievementStatus" AS ENUM ('PENDING', 'UNDER_ACHIEVED', 'ACHIEVED', 'OVER_ACHIEVED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('DEADLINE_7D', 'DEADLINE_3D', 'DEADLINE_1D', 'COMPLETED');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eras" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "theme" "ThemeType" NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER NOT NULL,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_blocks" (
    "id" TEXT NOT NULL,
    "eraId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "data" JSONB NOT NULL,
    "deadline" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement_goals" (
    "id" TEXT NOT NULL,
    "eraId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "category" "AchievementCategory" NOT NULL,
    "targetMin" DOUBLE PRECISION NOT NULL,
    "targetIdeal" DOUBLE PRECISION NOT NULL,
    "actualValue" DOUBLE PRECISION,
    "status" "AchievementStatus" NOT NULL DEFAULT 'PENDING',
    "imageUrl" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievement_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "contentBlockId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "detail" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_degree_nodes" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_degree_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "eras_slug_key" ON "eras"("slug");

-- CreateIndex
CREATE INDEX "content_blocks_eraId_idx" ON "content_blocks"("eraId");

-- CreateIndex
CREATE INDEX "content_blocks_deadline_idx" ON "content_blocks"("deadline");

-- CreateIndex
CREATE UNIQUE INDEX "achievement_goals_eraId_year_category_key" ON "achievement_goals"("eraId", "year", "category");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "activity_logs_adminId_idx" ON "activity_logs"("adminId");

-- AddForeignKey
ALTER TABLE "content_blocks" ADD CONSTRAINT "content_blocks_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "eras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement_goals" ADD CONSTRAINT "achievement_goals_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "eras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_contentBlockId_fkey" FOREIGN KEY ("contentBlockId") REFERENCES "content_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "master_degree_nodes" ADD CONSTRAINT "master_degree_nodes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "master_degree_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
