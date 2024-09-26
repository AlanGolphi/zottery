import { myRaffleAbi } from '@/Helper/generated'
const MyRaffleAddress = process.env.NEXT_PUBLIC_MY_RAFFLE_ADDRESS as `0x${string}`

export const basicRaffleContract = {
  abi: myRaffleAbi,
  address: MyRaffleAddress,
}
