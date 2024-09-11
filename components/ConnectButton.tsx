'use client'

import { formatAddress } from '@/lib/ethUtils'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { CircleDollarSign, Wallet } from 'lucide-react'
import { formatEther } from 'viem'
import { useAccount, useBalance } from 'wagmi'
import { Button } from './ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'

export default function ConnectButton() {
  const { open } = useWeb3Modal()
  const { address, chainId } = useAccount()
  const { data: balance } = useBalance({ address, chainId })

  return (
    <div className="flex items-center justify-center">
      {address ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <div
              className="flex cursor-pointer items-center space-x-2 rounded-lg p-2 hover:bg-slate-50"
              onClick={() => open({ view: 'Account' })}
            >
              <Wallet />
              <span>{formatAddress(address)}</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="flex w-full flex-col items-start justify-start">
            <div className="flex items-center space-x-2">
              <Wallet />
              <span>{address}</span>
            </div>
            {balance?.value && (
              <div className="flex items-center space-x-2">
                <CircleDollarSign />
                <span>
                  {formatEther(balance.value)}&nbsp;{balance?.symbol}
                </span>
              </div>
            )}
          </HoverCardContent>
        </HoverCard>
      ) : (
        <Button className="rounded-full" onClick={() => open({ view: 'Connect' })}>
          Connect
        </Button>
      )}
    </div>
  )
}
