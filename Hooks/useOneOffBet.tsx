import { basicRaffleContract } from '@/Helper/constants'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

export function useOneOffBet() {
  const { writeContractAsync, data: hash, isPending, isError, error } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash })

  const oneOffBet = async (amount: bigint) => {
    await writeContractAsync({
      ...basicRaffleContract,
      functionName: 'oneOffBet',
      value: amount,
    })
  }

  useEffect(() => {
    if (!isError) return
    toast.error(error.message?.split('.')[0] || 'Unknown error')
  }, [isError, error])

  return { oneOffBet, isPending, isSuccess }
}
