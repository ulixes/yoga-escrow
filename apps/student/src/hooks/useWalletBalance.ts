import { useState, useEffect, useCallback } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { createPublicClient, http, erc20Abi } from 'viem'
import { base, baseSepolia, polygon, mainnet } from 'viem/chains'
import type { WalletBalance, SupportedNetwork } from '../utils/walletUtils'
import { formatUSDC, USDC_CONTRACTS } from '../utils/walletUtils'

export function useWalletBalance(network: SupportedNetwork = 'baseSepolia') {
  const { ready, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  
  const [balance, setBalance] = useState<WalletBalance>({
    nativeBalance: '0',
    usdcBalance: '0',
    usdcBalanceFormatted: '0.00',
    hasPrivyWallet: false,
    isLoading: false,
    error: null
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
      // Map network to viem chain
      const chainMap = {
        'base': base,
        'baseSepolia': baseSepolia,
        'polygon': polygon,
        'ethereum': mainnet
      }

      const chain = chainMap[network]
      const usdcContract = USDC_CONTRACTS[network]

      // Create public client for the specific network
      const publicClient = createPublicClient({
        chain,
        transport: http()
      })

      console.log('Fetching USDC balance with viem:', {
        network,
        chain: chain.name,
        usdcContract,
        walletAddress: privyWallet.address
      })

      // Read USDC balance using viem
      const balance = await publicClient.readContract({
        address: usdcContract as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [privyWallet.address as `0x${string}`]
      })

      const usdcBalance = balance.toString()
      const usdcBalanceFormatted = formatUSDC(usdcBalance)

      console.log('USDC balance fetched successfully:', {
        raw: usdcBalance,
        formatted: usdcBalanceFormatted
      })

      setBalance({
        nativeBalance: '0', // We only fetch USDC for now
        usdcBalance,
        usdcBalanceFormatted,
        hasPrivyWallet: true,
        isLoading: false,
        error: null
      })

    } catch (error) {
      console.error('Error fetching wallet balance:', error)
      setBalance(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch balance',
        usdcBalance: '0',
        usdcBalanceFormatted: '0.00'
      }))
    }
  }, [ready, authenticated, privyWallet, network])

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