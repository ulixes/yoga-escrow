import React, { useEffect, useRef } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'

export function AutoWalletCreator() {
  const { authenticated, ready, createWallet } = usePrivy()
  const { wallets } = useWallets()
  const hasTriedCreation = useRef(false)

  useEffect(() => {
    if (!ready || !authenticated || hasTriedCreation.current) {
      return
    }

    // Check if user has any embedded wallet
    const hasPrivyWallet = wallets.some(wallet => 
      wallet.walletClientType === 'privy' || 
      (wallet as any).connectorType === 'embedded'
    )

    if (!hasPrivyWallet) {
      console.log('No embedded wallet found, creating one automatically...')
      hasTriedCreation.current = true
      
      createWallet()
        .then(() => {
          console.log('Embedded wallet created successfully')
        })
        .catch((error) => {
          console.error('Failed to create embedded wallet:', error)
          // Reset flag to allow retry
          hasTriedCreation.current = false
        })
    }
  }, [authenticated, ready, wallets, createWallet])

  // This component doesn't render anything
  return null
}