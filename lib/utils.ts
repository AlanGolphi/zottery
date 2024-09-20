import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toOrdinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const remainder = n % 100

  if (remainder >= 11 && remainder <= 13) {
    return `${n}th`
  }

  const suffix = suffixes[remainder % 10] || suffixes[0]
  return `${n}${suffix}`
}
