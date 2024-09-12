'use client'

import { myRaffleAbi } from '@/Helper/generated'
import { useReadContracts } from 'wagmi'
import { PieChartCard } from '@/components/PieChartCard'

export default function Home() {
  return (
    <>
      <PieChartCard />
    </>
  )
}
