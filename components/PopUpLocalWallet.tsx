'use client'

import { useAccount, useSendTransaction, useBalance, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function PopUpLocalWallet() {
  const router = useRouter()
  const { address, chainId } = useAccount()
  const { data, refetch } = useBalance({ address, chainId })
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)
  console.log('balanceResult', data)
  const { sendTransactionAsync, isPending } = useSendTransaction()

  const receiptRes = useWaitForTransactionReceipt({ hash: txHash, chainId })
  console.log('receiptRes', receiptRes)

  const handleTransfer = async () => {
    const transactRes = await sendTransactionAsync({
      to: '0xBFA9e8Bd514De6732C97AFf62219F9479406d014',
      value: parseEther('1.5'),
    })
    setTxHash(transactRes)
    console.log('transactRes', transactRes)
  }

  useEffect(() => {
    if (receiptRes && receiptRes.status === 'success') {
      refetch()
    }
  }, [receiptRes, refetch])

  return (
    <div>
      <button onClick={handleTransfer}>transfer</button>
      {isPending ? <div>transferring</div> : null}
    </div>
  )
}
