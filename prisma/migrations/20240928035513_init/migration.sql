-- CreateEnum
CREATE TYPE "RaffleState" AS ENUM ('OPEN', 'CALCULATING');

-- CreateTable
CREATE TABLE "Raffle" (
    "orderId" TEXT NOT NULL,
    "raffleState" "RaffleState" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "winner" TEXT,
    "players" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "Raffle_orderId_key" ON "Raffle"("orderId");
