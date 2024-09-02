'use client'

import {
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { myRaffleAbi } from '@/Helper/generated'
import { formatEther, parseEther } from 'viem'
import React from 'react'
import type { WriteContractReturnType } from 'wagmi/actions'
import { hexToBigInt } from 'viem'

export default function MyRaffle() {
  const { data: entranceFee } = useReadContract({
    abi: myRaffleAbi,
    address: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    functionName: 'getEntranceFee',
  })

  const { data: interval } = useReadContract({
    abi: myRaffleAbi,
    address: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    functionName: 'getInterval',
  })

  const { data: lastTimeStamp } = useReadContract({
    abi: myRaffleAbi,
    address: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    functionName: 'getLastTimeStamp',
  })

  const { data: currentOrder } = useReadContract({
    abi: myRaffleAbi,
    address: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    functionName: 'getCurrentOrder',
  })

  const { data: raffleState } = useReadContract({
    abi: myRaffleAbi,
    address: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    functionName: 'getRaffleState',
  })

  const { data: currentOrderPlayers } = useReadContract({
    abi: myRaffleAbi,
    address: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    functionName: 'getPlayersByOrder',
    args: typeof currentOrder === 'bigint' ? [currentOrder] : [hexToBigInt('0x0')],
  })

  console.log(`order ${currentOrder} players: `, currentOrderPlayers)

  const {
    writeContract,
    data: enterRaffleData,
    isError: enterRaffleIsError,
    error: enterRaffleFailureReason,
  } = useWriteContract()

  const handleEnterRaffle = () => {
    writeContract({
      abi: myRaffleAbi,
      address: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
      functionName: 'enterRaffle',
      value: parseEther('0.001'),
    })
  }

  useWatchContractEvent({
    abi: myRaffleAbi,
    address: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
    eventName: 'EnterRaffle',
    onLogs: (logs) => {
      console.log('New logs!', logs)
    },
  })

  const result = useWaitForTransactionReceipt({
    hash: enterRaffleData as WriteContractReturnType,
  })

  // console.log('enter hash result', result)

  return (
    <div>
      <button onClick={handleEnterRaffle}>enter raffle</button>
      {enterRaffleIsError && enterRaffleFailureReason ? (
        <div>Enter raffle failed: {JSON.stringify(enterRaffleFailureReason)}</div>
      ) : null}
    </div>
  )
}
