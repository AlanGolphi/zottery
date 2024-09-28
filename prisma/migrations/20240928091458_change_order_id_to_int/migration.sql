/*
  Warnings:

  - Changed the type of `orderId` on the `Raffle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Raffle" DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER NOT NULL,
ADD CONSTRAINT "Raffle_pkey" PRIMARY KEY ("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Raffle_orderId_key" ON "Raffle"("orderId");
