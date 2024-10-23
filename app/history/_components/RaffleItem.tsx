'use client'

import { formatAddress } from '@/lib/ethUtils'
import { cn, toOrdinal } from '@/lib/utils'
import { Raffle, RaffleState } from '@prisma/client'
import { ArrowRightFromLine, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

interface RaffleItemProps {
  raffle: Raffle
}

export default function RaffleItem({ raffle }: RaffleItemProps) {
  const ENTRANCE_FEE = 0.02
  const { orderId, raffleState, winner, players } = raffle
  const ordinal = toOrdinal(orderId)
  const isOpen = raffleState === RaffleState.OPEN
  const [collapsed, setCollapsed] = useState(true)
  const router = useRouter()
  const curAmount = useMemo(() => players.length * ENTRANCE_FEE, [players])

  const formatPlayers = useMemo(() => {
    const basicPlayers: { address: string; amount: number }[] = []
    players.forEach((player) => {
      const existingPlayer = basicPlayers.find((p) => p.address === player)
      if (existingPlayer) {
        existingPlayer.amount += ENTRANCE_FEE
      } else {
        basicPlayers.push({ address: player, amount: ENTRANCE_FEE })
      }
    })
    return basicPlayers
  }, [players])

  return (
    <div
      className={cn(
        'relative mb-3 flex max-h-16 w-full select-none flex-col overflow-hidden rounded-xl bg-slate-50 transition-all',
        {
          'bg-green-50': isOpen,
          'max-h-[1000px]': !collapsed,
          'overflow-visible': isOpen,
        },
      )}
      onClick={() => (isOpen ? router.push('/') : setCollapsed(!collapsed))}
    >
      {isOpen && <span className="absolute right-[-6px] top-[-16px] text-2xl">🔥</span>}
      <div className="group flex h-16 cursor-pointer items-center justify-between p-4">
        <div className="flex flex-row items-center justify-center gap-3">
          <div className="text-xl font-bold">{ordinal}</div>
          <div className="text-sm text-gray-500">Jackpot: {curAmount} ETH</div>
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          {isOpen ? (
            <p className="hidden text-sm text-gray-500 group-hover:block">Click to try it!</p>
          ) : collapsed ? (
            <p className="hidden text-sm text-gray-500 group-hover:block">Click to see players</p>
          ) : null}
          {isOpen ? (
            <ArrowRightFromLine className="h-4 w-4" />
          ) : (
            <ChevronDown
              className={cn('h-4 w-4 transition-all', {
                'rotate-[-90deg]': collapsed,
              })}
            />
          )}
        </div>
      </div>
      {!isOpen && (
        <div
          className={cn('flex flex-col gap-2', {
            '-z-1': collapsed,
          })}
        >
          {formatPlayers.map((player, index) => (
            <div
              key={index}
              className="relative flex flex-row items-center justify-start gap-2 pl-7 last:mb-4"
            >
              {winner === player.address ? <div className="absolute left-0 text-sm">🎉</div> : null}
              <div className="text-sm text-gray-500">{formatAddress(player.address)}</div>
              <div className="text-sm text-gray-500">{player.amount} ETH</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
