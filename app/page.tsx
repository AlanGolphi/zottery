import ConnectButton from '@/components/ConnectButton'
import PopUpLocalWallet from '@/components/PopUpLocalWallet'
import { TestReadContract } from '@/components/TestReadContract'

export default function Home() {
  return (
    <>
      <ConnectButton />
      <PopUpLocalWallet />
      {/* <TestReadContract /> */}
    </>
  )
}
