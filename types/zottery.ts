import { myRaffleAbi } from '@/Helper/generated'

export enum BetType {
  OneOffBet,
  MultiBets,
}

export enum RaffleState {
  OPEN,
  CALCULATING,
}

type MyRaffleFunctionAbi = Extract<(typeof myRaffleAbi)[number], { type: 'function' }>

export type FuntionNames = MyRaffleFunctionAbi['name']
