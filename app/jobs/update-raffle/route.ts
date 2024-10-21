import { RaffleCalculationgError } from '@/Helper/errors'
import { AlchemyCallError } from '@/lib/alchemy'
import { DatabaseError } from '@/lib/db'
import retry from 'retry'
import { generateResponse, updateRaffle } from './helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await retryOperation()
    return generateResponse(200, {
      success: true,
      message: 'Raffle updated',
      data,
    })
  } catch (error) {
    if (
      error instanceof DatabaseError ||
      error instanceof AlchemyCallError ||
      error instanceof RaffleCalculationgError
    ) {
      generateResponse(501, {
        success: false,
        message: `${error.name}: ${error.message}`,
        data: null,
      })
    } else {
      generateResponse(500, { success: false, message: 'unknown error', data: null })
    }
  }
}

function retryOperation() {
  const operation = retry.operation({
    retries: 5,
    factor: 2,
    minTimeout: 30000,
    maxTimeout: 300000,
    randomize: true,
  })

  return new Promise((resolve, reject) => {
    operation.attempt(async (currentAttempt: number) => {
      try {
        const result = await updateRaffle()
        resolve(result)
      } catch (error) {
        if (operation.retry(error as Error)) {
          const errorName = (error as Error).name
          const errorMessage = (error as Error).message
          console.log(`Retrying operation: ${currentAttempt}, ${errorName}: ${errorMessage}`)
          return
        }
        reject(operation.mainError())
      }
    })
  })
}
