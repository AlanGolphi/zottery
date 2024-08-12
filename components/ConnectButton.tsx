'use client'

import { useAccount } from 'wagmi'

export default function ConnectButton() {
  const { address } = useAccount()

  return address ? (
    <w3m-account-button />
  ) : (
    <w3m-button
      size="md"
      label="Connect"
      loadingLabel="Connecting..."
      disabled={false}
      balance="show"
    />
  )
}
