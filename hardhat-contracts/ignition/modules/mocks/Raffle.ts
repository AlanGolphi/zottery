import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const subscriptionId =
  BigInt(16482029518313506514743381956563164346584418307554059978032807030038861435391)
const gasLane = '0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae'
const callbackGasLimit = BigInt(40000)
const interval = 10
const entranceFee = BigInt(1_000_000_000)
const vrfCordinatorV2 = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

const RaffleModule = buildModule('RaffleModule', (m) => {
  const raffle = m.contract(
    'Raffle',
    [subscriptionId, gasLane, callbackGasLimit, interval, entranceFee, vrfCordinatorV2],
    {}
  )

  return { raffle }
})

export default RaffleModule
