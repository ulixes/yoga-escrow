import { usePrivy } from '@privy-io/react-auth'

// USDC contract addresses for different networks
export const USDC_CONTRACTS = {
  base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  baseSepolia: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  polygon: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  ethereum: '0xA0b86a33E6417c3CA1b1F4B6C0b9fDD7bF3b1c2e'
} as const

export type SupportedNetwork = keyof typeof USDC_CONTRACTS

// USDC has 6 decimal places
export const USDC_DECIMALS = 6

// Convert USDC units to human readable format
export function formatUSDC(balance: string): string {
  const balanceNumber = parseInt(balance, 10)
  const formatted = (balanceNumber / Math.pow(10, USDC_DECIMALS)).toFixed(2)
  return formatted
}

// Convert human readable USDC to units
export function parseUSDC(amount: string): string {
  const amountNumber = parseFloat(amount)
  const units = Math.floor(amountNumber * Math.pow(10, USDC_DECIMALS))
  return units.toString()
}

// Check if balance is sufficient for amount
export function hasSufficientBalance(balance: string, requiredAmount: string): boolean {
  const balanceUnits = parseInt(balance, 10)
  const requiredUnits = parseInt(parseUSDC(requiredAmount), 10)
  return balanceUnits >= requiredUnits
}

// Calculate shortfall amount
export function calculateShortfall(balance: string, requiredAmount: string): string {
  const balanceUnits = parseInt(balance, 10)
  const requiredUnits = parseInt(parseUSDC(requiredAmount), 10)
  const shortfallUnits = Math.max(0, requiredUnits - balanceUnits)
  return formatUSDC(shortfallUnits.toString())
}

export interface WalletBalance {
  nativeBalance: string
  usdcBalance: string
  usdcBalanceFormatted: string
  hasPrivyWallet: boolean
  isLoading: boolean
  error: string | null
}

