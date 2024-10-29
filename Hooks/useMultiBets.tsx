import { basicRaffleContract } from '@/Helper/constants'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

export function useMultiBets() {
  const { writeContractAsync, data: hash, isPending, isError, error } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash })

  const multiBets = async (amount: bigint, betCounts: bigint) => {
    await writeContractAsync({
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

  return { multiBets, isPending, isSuccess }
}
