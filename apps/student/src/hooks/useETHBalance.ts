import { useState, useEffect, useCallback } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { createPublicClient, http, formatEther } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { NETWORK } from '../config/constants'

export interface ETHBalance {
  ethBalance: string // Raw balance in wei
  ethBalanceFormatted: string // Formatted balance in ETH
  isLoading: boolean
  error: string | null
  hasPrivyWallet: boolean
}

export function useETHBalance() {
  const { ready, authenticated } = usePrivy()
  const { wallets } = useWallets()
  
  const [balance, setBalance] = useState<ETHBalance>({
    ethBalance: '0',
    ethBalanceFormatted: '0.000000',
    isLoading: false,
    error: null,
    hasPrivyWallet: false
  })

  // Find Privy embedded wallet
  const privyWallet = wallets.find(wallet => wallet.walletClientType === 'privy')

  const fetchBalance = useCallback(async () => {
    if (!ready || !authenticated || !privyWallet) {
      setBalance(prev => ({
        ...prev,
        hasPrivyWallet: false,
        isLoading: false
      }))
      return
    }

    setBalance(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Create public client for appropriate network
      const publicClient = createPublicClient({
        chain: NETWORK === 'base' ? base : baseSepolia,
        transport: http()
      })

      console.log('Fetching ETH balance for:', privyWallet.address)

      // Read ETH balance
      const balance = await publicClient.getBalance({
        address: privyWallet.address as `0x${string}`
      })

      const ethBalance = balance.toString()
      const ethBalanceFormatted = parseFloat(formatEther(balance)).toFixed(6)

      console.log('ETH balance fetched successfully:', {
        raw: ethBalance,
        formatted: ethBalanceFormatted
      })

      setBalance({
        ethBalance,
        ethBalanceFormatted,
        isLoading: false,
        error: null,
        hasPrivyWallet: true
      })

    } catch (error) {
      console.error('Error fetching ETH balance:', error)
      setBalance(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch ETH balance',
        ethBalance: '0',
        ethBalanceFormatted: '0.000000'
      }))
    }
  }, [ready, authenticated, privyWallet])

  // Auto-fetch balance when conditions are met
  useEffect(() => {
    if (ready && authenticated && privyWallet) {
      fetchBalance()
    }
  }, [ready, authenticated, privyWallet, fetchBalance])

  // Manual refresh function
  const refreshBalance = useCallback(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    ...balance,
    refreshBalance,
    walletAddress: privyWallet?.address
  }
}