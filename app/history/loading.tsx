import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">History</h1>
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton key={index} className="mt-3 h-16 w-full rounded-xl" />
      ))}
    </div>
  )
}
