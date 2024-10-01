import { db } from '@/lib/db'
import Link from 'next/link'
import RaffleItem from './_components/RaffleItem'

export default async function HistoryPage() {
  const raffles = await db.raffle.findMany({
    orderBy: {
      orderId: 'desc',
    },
  })

  if (raffles.length === 0)
    return (
      <div className="text-center text-xl">
        No raffles yet.
        <Link href="/">
          <span className="ml-2 text-center text-xl underline">Try it now!</span>
        </Link>
      </div>
    )
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">History</h1>
      <div className="mt-4">
        {raffles.map((raffle) => (
          <RaffleItem key={raffle.orderId} raffle={raffle} />
        ))}
      </div>
    </div>
  )
}
