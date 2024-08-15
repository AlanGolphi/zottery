import { defineConfig } from '@wagmi/cli'
import { hardhat } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'Helper/generated.ts',
  contracts: [],
  plugins: [
    hardhat({
      commands: {
        clean: 'yarn hardhat clean',
        build: 'yarn hardhat compile',
        rebuild: 'yarn hardhat compile',
      },
      project: 'hardhat-contracts',
    }),
  ],
})
