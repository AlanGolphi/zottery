'use client'

import { CircleDollarSign, Coins, TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { cn, toOrdinal } from '@/lib/utils'
import { BetType } from '@/types/zottery'
import { useMemo, useState } from 'react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Slider } from './ui/slider'

const chartData = [
  { browser: 'chrome', visitors: 275034.35, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200000.35, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 187000.35, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 10000.35, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 90000.35, fill: 'var(--color-other)' },
]

const chartConfig = {
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

export function DashBoard() {
  const ENTRANCE_FEE = 0.02
  const [betType, setBetType] = useState<BetType>(BetType.MultiBets)
  const [betCounts, setBetCounts] = useState(10)
  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  const multiBetCost = useMemo(
    () => (betCounts * (ENTRANCE_FEE * 100)) / 100,
    [ENTRANCE_FEE, betCounts],
  )

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>NO. {toOrdinal(1)}</CardTitle>
        <div className="flex flex-nowrap items-center">
          <div>
            Entrance: <span className="font-bold">{ENTRANCE_FEE}ETH</span>
          </div>
          <Separator className="mx-1.5 h-3" orientation="vertical" />
          <div>
            Pool:&nbsp;
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text font-bold text-transparent">
              0.88ETH
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              activeIndex={0}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            >
              <Label
                content={({ viewBox }) => {
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
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex w-full flex-col items-center justify-center space-y-2 sm:w-1/2">
          <div
            className={cn(
              'group flex w-full cursor-pointer items-center justify-between rounded-xl border border-solid border-gray-400 p-3 hover:border-blue-500',
              { 'border-blue-500': betType === BetType.OneOffBet },
            )}
            onClick={(e) => {
              e.stopPropagation()
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
            className={cn(
              'w-full rounded-full bg-gradient-to-r hover:opacity-80',
              `${
                betType === BetType.OneOffBet
                  ? 'from-cyan-500 to-blue-500'
                  : 'from-pink-500 to-violet-500'
              }`,
            )}
          >
            Bet
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
