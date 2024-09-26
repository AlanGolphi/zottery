// config/index.tsx

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage, http } from 'wagmi'
import { sepolia, hardhat } from 'wagmi/chains'

// Your WalletConnect Cloud project ID
export const projectId = process.env.NEXT_PUBLIC_WEB3_PROJECT_ID || ''

// Create a metadata object
const metadata = {
  name: 'zottery',
  description: 'AppKit Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

// Create wagmiConfig
const chains = [sepolia, hardhat] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_RPC_URL),
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
})
