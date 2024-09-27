'use client'

import { basicRaffleContract } from '@/Helper/constants'
import { useReadContracts } from 'wagmi'

export const useMyRaffleBasicInfo = () => {
  const { data: basicInfo } = useReadContracts({
    contracts: [
      {
        ...basicRaffleContract,
        functionName: 'getEntranceFee',
      },
      {
        ...basicRaffleContract,
        functionName: 'getCurrentOrder',
      },
      {
        ...basicRaffleContract,
        functionName: 'getCurrentOrderPlayers',
      },
      {
        ...basicRaffleContract,
        functionName: 'getInterval',
      },
      {
        ...basicRaffleContract,
        functionName: 'getLastTimeStamp',
      },
      {
        ...basicRaffleContract,
        functionName: 'getRaffleState',
      },
      {
        ...basicRaffleContract,
        functionName: 'getRecentWinner',
      },
    ],
  })

  if (!basicInfo) {
    return {
      infoReady: false,
      entranceFee: undefined,
      currentOrder: undefined,
      currentOrderPlayers: undefined,
      interval: undefined,
      blockLastTimeStamp: undefined,
      raffleState: undefined,
      recentWinner: undefined,
    }
  }

  const { result: entranceFee } = basicInfo[0]
  const { result: currentOrder } = basicInfo[1]
  const { result: currentOrderPlayers } = basicInfo[2]
  const { result: interval } = basicInfo[3]
  const { result: blockLastTimeStamp } = basicInfo[4]
  const { result: raffleState } = basicInfo[5]
  const { result: recentWinner } = basicInfo[6]

  return {
    infoReady: true,
    entranceFee,
    currentOrder: currentOrder ? Number(currentOrder) : undefined,
    currentOrderPlayers,
    interval: interval ? Number(interval) : undefined,
    blockLastTimeStamp: blockLastTimeStamp ? Number(blockLastTimeStamp) : undefined,
    raffleState: typeof raffleState === 'bigint' ? Number(raffleState) : undefined,
    recentWinner,
  }
}
