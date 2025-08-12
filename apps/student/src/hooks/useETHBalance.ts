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

      console.log('[BALANCE DEBUG] Fetching ETH balance for:', privyWallet.address)
      console.log('[BALANCE DEBUG] Network:', NETWORK)
      console.log('[BALANCE DEBUG] Chain:', NETWORK === 'base' ? 'base mainnet' : 'base sepolia')
      console.log('[BALANCE DEBUG] RPC URL:', publicClient.transport.url || 'default')

      // Read ETH balance
      const balance = await publicClient.getBalance({
        address: privyWallet.address as `0x${string}`
      })

      const ethBalance = balance.toString()
      const ethBalanceFormatted = parseFloat(formatEther(balance)).toFixed(6)

      console.log('[BALANCE DEBUG] Raw balance (wei):', ethBalance)
      console.log('[BALANCE DEBUG] Formatted balance (ETH):', ethBalanceFormatted)
      console.log('[BALANCE DEBUG] Balance in hex:', `0x${balance.toString(16)}`)
      
      // Check if balance is actually 0 or there's a conversion issue
      if (balance === 0n) {
        console.log('[BALANCE DEBUG] ⚠️ Balance is actually 0 - wallet has no funds on this network')
      } else {
        console.log('[BALANCE DEBUG] ✅ Wallet has funds:', ethBalanceFormatted, 'ETH')
      }

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