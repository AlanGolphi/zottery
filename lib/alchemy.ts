import { Alchemy, Network } from 'alchemy-sdk'

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
  connectionInfoOverrides: {
    skipFetchSetup: true,
  },
}

export const alchemy = new Alchemy(config)
