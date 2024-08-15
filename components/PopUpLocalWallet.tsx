'use client'

import { useAccount, useSendTransaction, useBalance } from 'wagmi'
import { parseEther } from 'viem'

export default function PopUpLocalWallet() {
  const { address, chainId } = useAccount()
  const balanceResult = useBalance({ address, chainId })
  console.log('balanceResult', balanceResult)
  const { sendTransaction } = useSendTransaction()

  const handleTransfer = async () => {
    await sendTransaction({
      to: '0xBFA9e8Bd514De6732C97AFf62219F9479406d014',
      value: parseEther('100'),
    })
  }

  return <button onClick={handleTransfer}>transfer</button>
}
