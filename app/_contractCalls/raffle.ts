import { basicRaffleContract } from '@/Helper/constants'
import { alchemy, withAlchemyErrorHandling } from '@/lib/alchemy'
import { FuntionNames } from '@/types/zottery'
import { decodeAbiParameters, encodeFunctionData, getAbiItem } from 'viem'

const { abi, address } = basicRaffleContract
const currentOrderPlayersAbiOutput = getAbiItem({
  abi,
  name: 'getCurrentOrderPlayers',
}).outputs
const getPlayersByOrderAbiOutput = getAbiItem({
  abi,
  name: 'getPlayersByOrder',
}).outputs
const getWinnerByOrderAbiOutput = getAbiItem({
  abi,
  name: 'getWinnerByOrder',
}).outputs

async function callContract(functionName: FuntionNames, args?: any) {
  const encodedData = encodeFunctionData({
    abi,
    functionName,
    args,
  })

  return await withAlchemyErrorHandling(() =>
    alchemy.core.call({
      to: address,
      data: encodedData,
    }),
  )
}

export const getCurrentOrder = async () => await callContract('getCurrentOrder')

export const getRaffleState = async () => await callContract('getRaffleState')

export const getCurrentOrderPlayers = async () => {
  const data = await callContract('getCurrentOrderPlayers')
  return decodeAbiParameters(currentOrderPlayersAbiOutput, data as `0x${string}`)?.[0]
}

export const getPlayersByOrder = async (order: bigint) => {
  const data = await callContract('getPlayersByOrder', [order])
  return decodeAbiParameters(getPlayersByOrderAbiOutput, data as `0x${string}`)?.[0]
}

export const getWinnerByOrder = async (order: bigint) => {
  const data = await callContract('getWinnerByOrder', [order])
  return decodeAbiParameters(getWinnerByOrderAbiOutput, data as `0x${string}`)?.[0]
}
