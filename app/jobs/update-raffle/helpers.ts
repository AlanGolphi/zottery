import {
  getCurrentOrder,
  getCurrentOrderPlayers,
  getPlayersByOrder,
  getRaffleState,
  getWinnerByOrder,
} from '@/app/_contractCalls/raffle'
import { RaffleCalculationgError } from '@/Helper/errors'
import { db } from '@/lib/db'
import { RaffleState, UpdateRaffleResponseType } from '@/types/zottery'
import { RaffleState as DbRaffleState, Raffle } from '@prisma/client'
import { hexToNumber } from 'viem'

export const generateResponse = (code: number, response: UpdateRaffleResponseType) => {
  return Response.json(
    {
      response,
    },
    { status: code },
  )
}

const getRaffleOrderByOrderId = async (orderId: number) => {
  const players = (await getPlayersByOrder(BigInt(orderId))) as string[]
  const winner = await getWinnerByOrder(BigInt(orderId))
  return {
    orderId,
    players,
    winner,
  }
}

export const updateRaffle = async () => {
  const raffleStateHex = await getRaffleState()
  const raffleState = hexToNumber(raffleStateHex as `0x${string}`)
  // if raffle is calculating, throw error
  if (raffleState === RaffleState.CALCULATING) {
    throw new RaffleCalculationgError('Raffle is calculating')
  }

  // get current order from blockchain
  const currentOrderHex = await getCurrentOrder()
  const currentOrder = hexToNumber(currentOrderHex as `0x${string}`)
  const currentOrderPlayers = (await getCurrentOrderPlayers()) as string[]

  // get latest order from db
  const dbLatestOrder = await db.raffle.findFirst({
    orderBy: {
      orderId: 'desc',
    },
  })
  const dbLatestOrderId = dbLatestOrder?.orderId
  const raffleOrderPromises = []

  // if there is no latest order in db, get all orders from 1 to current order
  if (!dbLatestOrderId) {
    for (let i = 1; i < currentOrder; i++) {
      raffleOrderPromises.push(getRaffleOrderByOrderId(i))
    }
  } else {
    // get all orders from latest order to current order
    for (let i = dbLatestOrderId; i < currentOrder; i++) {
      raffleOrderPromises.push(getRaffleOrderByOrderId(i))
    }
  }

  // get all orders from blockchain
  const endRaffleOrders = await Promise.all(raffleOrderPromises)
  // format all orders to db format
  const allRaffleOrders = [
    ...endRaffleOrders.map((it) => ({
      ...it,
      raffleState: DbRaffleState.END,
    })),
    {
      orderId: currentOrder,
      players: currentOrderPlayers,
      raffleState: DbRaffleState.OPEN,
    },
  ]

  // upsert all orders to db
  for (const raffleOrder of allRaffleOrders) {
    await db.raffle.upsert({
      where: { orderId: raffleOrder.orderId },
      update: raffleOrder,
      create: raffleOrder,
    })
  }

  return generateResponse(200, {
    success: true,
    message: 'Raffle data updated',
    data: {
      currentOrder,
      latestOrderId: dbLatestOrder?.orderId || 1,
      raffleState,
      currentOrderPlayers,
    },
  })
}
