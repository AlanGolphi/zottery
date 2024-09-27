'use client'

import { CircleDollarSign, Coins, TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useMultiBets } from '@/Hooks/useMultiBets'
import { useMyRaffleBasicInfo } from '@/Hooks/useMyRaffleBasicInfo'
import { useOneOffBet } from '@/Hooks/useOneOffBet'
import { cn, toOrdinal } from '@/lib/utils'
import { BetType, RaffleState } from '@/types/zottery'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { formatEther, parseEther } from 'viem'
import { useAccount } from 'wagmi'
import ConnectButton from './ConnectButton'
import { CountDown } from './CountDown'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Slider } from './ui/slider'

export function DashBoard() {
  const {
    infoReady,
    entranceFee,
    currentOrder,
    currentOrderPlayers,
    interval,
    blockLastTimeStamp,
    raffleState,
    recentWinner,
  } = useMyRaffleBasicInfo()
  console.log({
    infoReady,
    entranceFee,
    currentOrder,
    currentOrderPlayers,
    interval,
    blockLastTimeStamp,
    raffleState,
    recentWinner,
  })

  const { address: userAddress } = useAccount()
  const { oneOffBet, isPending: oneOffBetPending } = useOneOffBet()
  const { multiBets, isPending: multiBetsPending } = useMultiBets()

  const raffleNotOpen = raffleState !== RaffleState.OPEN
  const betPending = oneOffBetPending || multiBetsPending

  const chartData = useMemo(() => {
    if (!currentOrderPlayers || currentOrderPlayers.length === 0) {
      return [{ address: 'NO_PLAYER', betAmount: 0.000000001 }]
    }
    const formatedChartData: { address: string; betAmount: number; fill: string }[] = []
    currentOrderPlayers.forEach((player) => {
      const playerData = formatedChartData.find((item) => item.address === player)
      if (playerData) {
        playerData.betAmount += 0.02
      } else {
        formatedChartData.push({
          address: player,
          betAmount: 0.02,
          fill: `var(--color-${player.slice(0, 6)})`,
        })
      }
    })
    return formatedChartData
  }, [currentOrderPlayers])

  const chartConfig = useMemo(() => {
    const baseConfig: Record<string, { label: string; color: string }> = {}
    if (!currentOrderPlayers || currentOrderPlayers.length === 0) {
      return baseConfig
    }

    chartData.forEach((item, idx) => {
      const sliceAddress = item.address.slice(0, 6)
      baseConfig[sliceAddress] = {
        label: sliceAddress,
        color: `hsl(var(--chart-${idx + 1}))`,
      }
    })

    return baseConfig
  }, [currentOrderPlayers, chartData])

  const activeIndex = useMemo(() => {
    const userIndex = chartData.findIndex((it) => it.address === userAddress)
    if (!userAddress || userIndex === -1) {
      return undefined
    }
    return userIndex
  }, [chartData, userAddress])

  const ENTRANCE_FEE = infoReady ? (entranceFee ? Number(formatEther(entranceFee)) : 0) : 0
  const [betType, setBetType] = useState<BetType>(BetType.MultiBets)
  const [betCounts, setBetCounts] = useState(10)
  const totalBetAmount = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.betAmount, 0)
  }, [chartData])

  const multiBetCost = useMemo(
    () => (betCounts * (ENTRANCE_FEE * 100)) / 100,
    [ENTRANCE_FEE, betCounts],
  )

  const hasPlayers = useMemo(() => {
    return currentOrderPlayers && currentOrderPlayers.length > 0
  }, [currentOrderPlayers])

  const handleBet = useCallback(() => {
    if (betPending) {
      return
    }
    if (raffleNotOpen) {
      toast.info('Current raffle is calculating, try next one.')
      return
    }
    if (!userAddress) {
      toast(
        <div className="flex w-full items-center justify-between">
          <p>Please connect your wallet first.</p>
          <ConnectButton />
        </div>,
      )
      return
    }
    if (!entranceFee) {
      toast.error('Some error occurred, try again later.')
      return
    }
    if (betType === BetType.OneOffBet) {
      oneOffBet(entranceFee)
    } else {
      multiBets(parseEther(multiBetCost.toString()), BigInt(betCounts))
    }
  }, [
    raffleNotOpen,
    userAddress,
    betType,
    betCounts,
    entranceFee,
    multiBetCost,
    betPending,
    oneOffBet,
    multiBets,
  ])

  return (
    <Card className="relative flex flex-col overflow-hidden">
      {hasPlayers && <CountDown blockLastTimeStamp={blockLastTimeStamp} interval={interval} />}

      <CardHeader className="items-center pb-0">
        <CardTitle>{currentOrder ? `NO. ${toOrdinal(currentOrder)}` : '--'}</CardTitle>
        <div className="flex flex-nowrap items-center">
          <div>
            Entrance Fee:{' '}
            <span
              className="cursor-pointer font-bold hover:underline"
              onClick={(e) => {
                e.stopPropagation()
                setBetType(BetType.OneOffBet)
              }}
            >
              {ENTRANCE_FEE}ETH
            </span>
          </div>
          <Separator className="mx-1.5 h-3" orientation="vertical" />
          <div>
            Jackpot:&nbsp;
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text font-bold text-transparent">
              {currentOrderPlayers ? currentOrderPlayers.length * ENTRANCE_FEE : 0}ETH
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex w-full flex-1 flex-col items-center justify-between pb-0 sm:flex-row">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] w-full sm:w-1/2"
        >
          <PieChart>
            {hasPlayers && (
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            )}
            <Pie
              data={chartData}
              dataKey="betAmount"
              nameKey="address"
              innerRadius={60}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (!hasPlayers && viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <foreignObject
                        x={viewBox.cx ? viewBox.cx - 80 : 0}
                        y={viewBox.cy ? viewBox.cy - 20 : 0}
                        width={160}
                        height={40}
                      >
                        <div
                          {...({ xmlns: 'http://www.w3.org/1999/xhtml' } as any)}
                          className="flex h-full w-full items-center justify-center"
                        >
                          <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-xl font-bold italic text-transparent">
                            Try the first BET!
                          </span>
                        </div>
                      </foreignObject>
                    )
                  }
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalBetAmount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          ETH
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="relative flex w-full flex-col items-center justify-center space-y-2 sm:w-1/2">
          {!userAddress && (
            <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center rounded-xl backdrop-blur-xl">
              <ConnectButton />
            </div>
          )}
          <div
            className={cn(
              'group flex w-full cursor-pointer items-center justify-between rounded-xl border border-solid border-gray-400 p-3 hover:border-blue-500',
              { 'border-blue-500': betType === BetType.OneOffBet },
            )}
            onClick={(e) => {
              e.stopPropagation()
              if (betPending) return
              setBetType(BetType.OneOffBet)
            }}
          >
            <div className="flex flex-col items-start justify-center">
              <div className="text-sm text-gray-400">One-Off Bet</div>
              <div
                className={cn(
                  'bg-clip-text text-lg font-bold group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-500 group-hover:text-transparent',
                  `${
                    betType === BetType.OneOffBet
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent'
                      : 'text-gray-500 dark:text-gray-400'
                  }`,
                )}
              >
                {ENTRANCE_FEE}ETH
              </div>
            </div>
            <CircleDollarSign
              className={cn('h-8 w-8 group-hover:text-blue-500', {
                'text-blue-500': betType === BetType.OneOffBet,
                'text-gray-500': betType !== BetType.OneOffBet,
              })}
            />
          </div>
          <div
            className={cn(
              'group flex w-full cursor-pointer flex-col items-start justify-center space-y-1 rounded-xl border border-solid border-gray-400 p-3 hover:border-violet-500',
              { 'border-violet-500': betType === BetType.MultiBets },
            )}
            onClick={(e) => {
              e.stopPropagation()
              if (betPending) return
              setBetType(BetType.MultiBets)
            }}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col items-start justify-center">
                <div className="text-sm text-gray-400">Multi Bet</div>
                <div
                  className={cn(
                    'bg-clip-text text-lg font-bold group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-violet-500 group-hover:text-transparent',
                    `${
                      betType === BetType.MultiBets
                        ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-transparent'
                        : 'text-gray-500'
                    }`,
                  )}
                >
                  {multiBetCost}ETH
                </div>
              </div>
              <Coins
                className={cn('h-8 w-8 group-hover:text-violet-600', {
                  'text-violet-600': betType === BetType.MultiBets,
                  'text-gray-500': betType !== BetType.MultiBets,
                })}
              />
            </div>
            <Slider
              className="w-full"
              rangeClassName={cn(
                'group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-violet-500',
                `${
                  betType === BetType.MultiBets
                    ? 'bg-gradient-to-r from-pink-500 to-violet-500'
                    : 'bg-gray-500'
                }`,
              )}
              min={1}
              max={100}
              value={[betCounts]}
              onValueChange={(value) => {
                setBetCounts(value[0])
                setBetType(BetType.MultiBets)
              }}
            />
          </div>
          <Button
            disabled={raffleNotOpen || betPending}
            onClick={handleBet}
            className={cn(
              'w-full rounded-full bg-gradient-to-r hover:opacity-80',
              `${
                betType === BetType.OneOffBet
                  ? 'from-cyan-500 to-blue-500'
                  : 'from-pink-500 to-violet-500'
              }`,
              {
                'animate-pulse': oneOffBetPending,
              },
            )}
          >
            {infoReady ? (raffleState === RaffleState.OPEN ? 'Bet' : 'Calculating...') : '...'}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="mt-2 flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Choose multi bet to save more gas <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}
