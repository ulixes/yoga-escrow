import { useCallback } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'

export function useFundWallet() {
  const privy = usePrivy()
  const { ready, authenticated } = privy
  // Some versions of the SDK expose `createWallet`; access safely
  const createWallet = (privy as unknown as { createWallet?: () => Promise<void> }).createWallet
  const { wallets } = useWallets()

  // Try to find a Privy embedded wallet first; otherwise any wallet supporting `fund()`
  const privyWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
  const fundableWallet = wallets.find(wallet => typeof (wallet as any).fund === 'function') as (typeof wallets[number] & { fund?: () => Promise<void> }) | undefined

  const fundWallet = useCallback(async () => {
    if (!ready || !authenticated) {
      console.error('Wallet not ready for funding (auth/state)')
      alert('Please sign in first, then try Add funds again.')
      return
    }

    try {
      // Prefer a wallet that exposes the built-in funding flow
      const walletForFunding = fundableWallet || privyWallet

      if (walletForFunding && typeof (walletForFunding as any).fund === 'function') {
        await (walletForFunding as any).fund()
        return
      }

      // If no embedded/fundable wallet is present, attempt to create one on the fly
      if (!privyWallet && typeof createWallet === 'function') {
        try {
          await createWallet()
        } catch (e) {
          console.error('Failed to create embedded wallet:', e)
        }
      }

      // As a graceful fallback, show manual funding instructions if we at least have an address
      const fallbackAddress = privyWallet?.address || wallets[0]?.address
      if (fallbackAddress) {
        const instructions = `
No built-in funding flow is available on this device.

You can still add funds by sending USDC/ETH to your wallet address:
${fallbackAddress}

Tip: Tap and hold to copy the address, or use the Copy button if available.
        `.trim()
        alert(instructions)
      } else {
        alert('Wallet is initializing. Please retry Add funds in a moment.')
      }
    } catch (error) {
      console.error('Error opening funding flow:', error)
      alert('Unable to open the funding flow. Please try again.')
    }
  }, [ready, authenticated, fundableWallet, privyWallet, createWallet, wallets])

  const showFundingInstructions = useCallback(() => {
    if (!privyWallet) return

    const walletAddress = privyWallet.address
    const instructions = `
To add USDC to your wallet:

1. **Buy with Card**: Use a service like:
   - Coinbase
   - Binance
   - MoonPay

2. **Transfer from Exchange**: 
   Send USDC to your wallet address:
   ${walletAddress}

3. **Bridge from Other Networks**:
   Use bridges like Hop or Stargate

⚠️ Make sure to send USDC on the correct network (Base/Ethereum)
    `.trim()

    // Show in alert for now (could be replaced with a nice modal)
    alert(instructions)
  }, [privyWallet])

  const copyWalletAddress = useCallback(() => {
    if (!privyWallet) return

    navigator.clipboard.writeText(privyWallet.address).then(() => {
      alert('Wallet address copied to clipboard!')
    }).catch(() => {
      console.error('Failed to copy wallet address')
    })
  }, [privyWallet])

  return {
    fundWallet,
    showFundingInstructions,
    copyWalletAddress,
    walletAddress: privyWallet?.address,
    canFund: ready && authenticated && (!!fundableWallet || !!privyWallet)
  }
}