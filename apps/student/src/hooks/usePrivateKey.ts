import { useState, useCallback } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'

export function usePrivateKey() {
  const { exportWallet, createWallet } = usePrivy()
  const { wallets } = useWallets()
  const [isExporting, setIsExporting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Find Privy embedded wallet - check multiple possible types
  const privyWallet = wallets.find(wallet => 
    wallet.walletClientType === 'privy' || 
    (wallet as any).connectorType === 'embedded' ||
    (wallet as any).type === 'privy'
  )

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('usePrivateKey - wallets:', wallets)
    console.log('usePrivateKey - privyWallet:', privyWallet)
  }

  const createPrivyWallet = useCallback(async () => {
    setIsCreating(true)
    setError(null)

    try {
      // Use Privy's createWallet method to explicitly create an embedded wallet
      await createWallet()
    } catch (err) {
      console.error('Error creating wallet:', err)
      setError(err instanceof Error ? err.message : 'Failed to create wallet')
    } finally {
      setIsCreating(false)
    }
  }, [createWallet])

  const exportPrivateKey = useCallback(async () => {
    if (!privyWallet) {
      setError('No Privy wallet found')
      return
    }

    setIsExporting(true)
    setError(null)

    try {
      // Use Privy's built-in export modal - this will open a modal with the private key
      await exportWallet({ address: privyWallet.address })
    } catch (err) {
      console.error('Error exporting private key:', err)
      setError(err instanceof Error ? err.message : 'Failed to export private key')
    } finally {
      setIsExporting(false)
    }
  }, [privyWallet, exportWallet])

  return {
    isExporting,
    isCreating,
    error,
    walletAddress: privyWallet?.address,
    exportPrivateKey,
    createPrivyWallet,
    hasPrivyWallet: !!privyWallet
  }
}