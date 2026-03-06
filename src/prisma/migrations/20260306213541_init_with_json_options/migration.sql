/*
  Warnings:

  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[question]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `correctIndex` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `options` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
ADD COLUMN     "correctIndex" INTEGER NOT NULL,
ADD COLUMN     "options" JSONB NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Option";

-- CreateIndex
CREATE UNIQUE INDEX "Question_question_key" ON "Question"("question");
