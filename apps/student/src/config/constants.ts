// Global configuration constants

// Environment detection
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Pricing
export const CLASS_PRICE_USD = 5 // $5 for both testing and production
export const CLASS_PRICE_ETH = '0.002' // ~$5 in ETH for both environments
export const CLASS_PRICE_ETH_DISPLAY = '0.002 ETH'

// Legacy USDC values (keeping for balance display compatibility)
export const CLASS_PRICE_USDC = '5.00' 
export const CLASS_PRICE_USDC_RAW = '5000000' // 5 USDC with 6 decimals

// Contract addresses
export const YOGA_ESCROW_CONTRACT_ADDRESS = IS_PRODUCTION 
  ? '0xa691f1735FD69AacCcFdf57EBD41a3140228941d' // Base mainnet
  : '0x3F99B8Bd87e24Fd9728EE20A9184D285d74090Ec' // Base Sepolia testnet

// Chain IDs  
export const BASE_MAINNET_CHAIN_ID = 8453
export const BASE_SEPOLIA_CHAIN_ID = 84532
export const CHAIN_ID = IS_PRODUCTION ? BASE_MAINNET_CHAIN_ID : BASE_SEPOLIA_CHAIN_ID

// Network
export const NETWORK = IS_PRODUCTION ? 'base' as const : 'baseSepolia' as const

// Time
export const DEFAULT_EXPIRATION_DAYS = 7 // Escrow expires after 7 days
export const DEFAULT_CLASS_DURATION_MINUTES = 60 // 1 hour classes