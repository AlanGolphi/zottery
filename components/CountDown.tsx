import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export const CountDown = ({ lastTimeStamp, interval }: CountDownProps) => {
  const targetTime = (lastTimeStamp || 0) + (interval || 0)
  const currentTime = Math.floor(Date.now() / 1000)

  const [countDown, setCountDown] = useState(targetTime - currentTime)

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${seconds > 3600 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountDown(countDown - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countDown])

  if (!lastTimeStamp || !interval) return null

  return (
    <div
      className={cn(
        'absolute left-0 top-0 rounded-br-lg bg-green-500 px-1 py-0.5 text-sm font-normal text-white',
        {
          'bg-cyan-500': countDown <= 36000,
          'bg-orange-500': countDown <= 3600,
        },
      )}
    >
      next: {formatTime(countDown)}
    </div>
  )
}

type CountDownProps = {
  lastTimeStamp?: number
  interval?: number
}
