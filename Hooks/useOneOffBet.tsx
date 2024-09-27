import { basicRaffleContract } from '@/Helper/constants'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'

export function useOneOffBet() {
  const { writeContract, isPending, isError, error } = useWriteContract()

  const oneOffBet = (amount: bigint) => {
    writeContract({
      ...basicRaffleContract,
      functionName: 'oneOffBet',
      value: amount,
    })
  }

  useEffect(() => {
    if (!isError) return
    toast.error(error.message?.split('.')[0] || 'Unknown error')
  }, [isError, error])

  return { oneOffBet, isPending }
}
