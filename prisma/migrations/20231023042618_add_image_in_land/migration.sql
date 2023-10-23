/*
  Warnings:

  - Added the required column `image` to the `Land` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Land" ADD COLUMN     "image" TEXT NOT NULL;
