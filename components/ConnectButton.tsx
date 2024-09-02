'use client'

import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'

export default function ConnectButton() {
  const { address, chainId } = useAccount()
  const { data: balance } = useBalance({ address, chainId })

  return (
    <div>
      {address ? (
        <w3m-account-button />
      ) : (
        <w3m-button
          size="md"
          label="Connect"
          loadingLabel="Connecting..."
          disabled={false}
          balance="show"
        />
      )}

      <div>
        {balance ? (
          <div>
            Balance: {formatEther(balance.value)}&nbsp;{balance.symbol}
          </div>
        ) : (
          <div>000</div>
        )}
      </div>
    </div>
  )
}
