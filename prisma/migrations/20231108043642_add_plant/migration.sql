/*
  Warnings:

  - Added the required column `plant` to the `Land` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Land" ADD COLUMN     "plant" TEXT NOT NULL;
