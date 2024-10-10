import { Alchemy, Network } from 'alchemy-sdk'

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
  connectionInfoOverrides: {
    skipFetchSetup: true,
  },
}

export const alchemy = new Alchemy(config)

export class AlchemyCallError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AlchemyCallError'
  }
}

export async function withAlchemyErrorHandling<T>(alchemyOperation: () => Promise<T>): Promise<T> {
  return alchemyOperation().catch((error) => {
    throw new AlchemyCallError(`alchemy call error: ${error.message}`)
  })
}
