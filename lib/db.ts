import { PrismaClient } from '@prisma/client'
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library'

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export async function withDbErrorHandling<T>(dbOperation: () => Promise<T>): Promise<T> {
  return dbOperation().catch((error) => {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new DatabaseError(`database request error: ${error.message}`)
    } else if (error instanceof PrismaClientValidationError) {
      throw new DatabaseError(`database validation error: ${error.message}`)
    } else {
      throw new DatabaseError(`unknown database error: ${(error as Error).message}`)
    }
  })
}
