import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

/**
 *
 * @param blockLastTimeStamp
 * @param interval
 * @description use blockLastTimeStamp to calculate the exact time of the game, then add interval to get the target time
 * @returns
 */
export const CountDown = ({ blockLastTimeStamp, interval }: CountDownProps) => {
  const ONE_DAY_SECONDS = 24 * 60 * 60
  // chainlink automation will call the contract at 12:00 am UTC time
  // it may miss if there's no players
  // so we need to calculate the exact time of the game
  const currentTimeStamp = Math.floor(Date.now() / 1000)
  const gapDay = Math.floor((currentTimeStamp - (blockLastTimeStamp || 0)) / ONE_DAY_SECONDS)
  const exactlastTimeStamp = (blockLastTimeStamp || 0) + gapDay * ONE_DAY_SECONDS
  const targetTime = exactlastTimeStamp + (interval || 0)
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

  if (!blockLastTimeStamp || !interval) return null

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
      unveil: {formatTime(countDown)}
    </div>
  )
}

type CountDownProps = {
  blockLastTimeStamp?: number
  interval?: number
}
