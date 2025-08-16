import { useState, useEffect } from 'react'

export function useETHPrice() {
  const [ethPrice, setEthPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrice = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        const data = await response.json()
        setEthPrice(data.ethereum.usd)
      } catch (err) {
        console.error('Failed to fetch ETH price:', err)
        setError('Failed to fetch ETH price')
        setEthPrice(3000) // Fallback price
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrice()
    
    // Update every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return { ethPrice, isLoading, error }
}