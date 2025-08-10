import { useCallback } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'

export function useFundWallet() {
  const { ready, authenticated } = usePrivy()
  const { wallets } = useWallets()

  // Find Privy embedded wallet
  const privyWallet = wallets.find(wallet => wallet.walletClientType === 'privy')

  const fundWallet = useCallback(async () => {
    if (!ready || !authenticated || !privyWallet) {
      console.error('Wallet not ready for funding')
      return
    }

    try {
      // Use Privy's built-in funding flow
      if ('fund' in privyWallet && typeof privyWallet.fund === 'function') {
        await privyWallet.fund()
      } else {
        console.error('Privy wallet fund method not available')
      }
    } catch (error) {
      console.error('Error opening funding flow:', error)
    }
  }, [ready, authenticated, privyWallet])

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
    canFund: ready && authenticated && !!privyWallet
  }
}