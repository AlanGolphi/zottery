'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { lockAbi } from '@/Helper/generated'

export function TestReadContract() {
  const owner = useReadContract({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: lockAbi,
    functionName: 'owner',
  })
  const unlockTime = useReadContract({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: lockAbi,
    functionName: 'unlockTime',
  })

  const { data: hash, error, isPending, writeContract } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleWithdraw = () => {
    writeContract({
      address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      abi: lockAbi,
      functionName: 'withdraw',
    })
  }

  console.log('contract result', owner, unlockTime)

  return (
    <div>
      <button onClick={handleWithdraw}>{isPending ? 'Pending' : 'TestWithDrawFromContract'}</button>
      {isLoading && <div>Loading...</div>}
      {isSuccess && <div>Success</div>}
      {error && <div>Error: {JSON.stringify(error)}</div>}
    </div>
  )
}
