import { myRaffleAbi } from '@/Helper/generated'

export enum BetType {
  OneOffBet,
  MultiBets,
}

export enum RaffleState {
  OPEN,
  CALCULATING,
}

export enum ErrorType {
  RaffleIsCalculating = 'RaffleIsCalculating',
  AlchemyCallError = 'AlchemyCallError',
  DatabaseError = 'DatabaseError',
}

type MyRaffleFunctionAbi = Extract<(typeof myRaffleAbi)[number], { type: 'function' }>

export type FuntionNames = MyRaffleFunctionAbi['name']

export type UpdateRaffleResponseType = {
  success: boolean
  message: string
  data: any
}
