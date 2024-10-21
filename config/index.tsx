// config/index.tsx

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'

// Your WalletConnect Cloud project ID
export const projectId = process.env.NEXT_PUBLIC_WEB3_PROJECT_ID || ''

// Create a metadata object
const metadata = {
  name: 'zottery',
  description: 'A lottery app in ETH sepolia',
  url: 'https://zottery.wuds.run',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

// Create wagmiConfig
const chains = [sepolia] as const
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
  },
})
