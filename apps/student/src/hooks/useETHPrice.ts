import { useState, useEffect, useCallback } from 'react'

export interface ETHPrice {
  usdPrice: number
  isLoading: boolean
  error: string | null
  lastUpdated: number
}

export function useETHPrice() {
  const [priceData, setPriceData] = useState<ETHPrice>({
    usdPrice: 3000, // Fallback price
    isLoading: true,
    error: null,
    lastUpdated: 0
  })

  const fetchPrice = useCallback(async () => {
    try {
      setPriceData(prev => ({ ...prev, isLoading: true, error: null }))

      // Using CoinGecko's free API (no API key required)
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const usdPrice = data.ethereum?.usd

      if (!usdPrice || typeof usdPrice !== 'number') {
        throw new Error('Invalid price data received')
      }

      console.log('ETH/USD price fetched:', usdPrice)

      setPriceData({
        usdPrice,
        isLoading: false,
        error: null,
        lastUpdated: Date.now()
      })

    } catch (error) {
      console.error('Error fetching ETH price:', error)
      setPriceData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch ETH price'
      }))
    }
  }, [])

  // Fetch price on mount and every 5 minutes
  useEffect(() => {
    fetchPrice()
    
    const interval = setInterval(fetchPrice, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [fetchPrice])

  // Convert ETH amount to USD
  const ethToUSD = useCallback((ethAmount: string | number): number => {
    const eth = typeof ethAmount === 'string' ? parseFloat(ethAmount) : ethAmount
    return eth * priceData.usdPrice
  }, [priceData.usdPrice])

  // Convert USD amount to ETH
  const usdToETH = useCallback((usdAmount: number): string => {
    const eth = usdAmount / priceData.usdPrice
    return eth.toFixed(6)
  }, [priceData.usdPrice])

  return {
    ...priceData,
    ethToUSD,
    usdToETH,
    refreshPrice: fetchPrice
  }
}