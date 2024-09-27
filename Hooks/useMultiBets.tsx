import { basicRaffleContract } from '@/Helper/constants'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'

export function useMultiBets() {
  const { writeContract, isPending, isError, error } = useWriteContract()

  const multiBets = (amount: bigint, betCounts: bigint) => {
    writeContract({
      ...basicRaffleContract,
      functionName: 'multiBets',
      args: [betCounts],
      value: amount,
    })
  }

  useEffect(() => {
    if (!isError) return
    toast.error(error.message?.split('.')[0] || 'Unknown error')
  }, [isError, error])

  return { multiBets, isPending }
}
