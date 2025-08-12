// Global configuration constants

// Environment detection (Vite): prefer import.meta.env over process.env
const IS_PRODUCTION = import.meta.env?.PROD === true
const MODE = import.meta.env?.MODE || (IS_PRODUCTION ? 'production' : 'development')

// Optional overrides via Vite env
const ENV_NETWORK = (import.meta as any).env?.VITE_NETWORK as 'base' | 'baseSepolia' | undefined
const ENV_ESCROW_ADDRESS = (import.meta as any).env?.VITE_ESCROW_ADDRESS as `0x${string}` | undefined

// Pricing
export const CLASS_PRICE_USD = 5 // $5 for both testing and production
export const CLASS_PRICE_ETH = '0.002' // ~$5 in ETH for both environments
export const CLASS_PRICE_ETH_DISPLAY = '0.002 ETH'

// Legacy USDC values (keeping for balance display compatibility)
export const CLASS_PRICE_USDC = '5.00' 
export const CLASS_PRICE_USDC_RAW = '5000000' // 5 USDC with 6 decimals

// Network selection
export const NETWORK = (ENV_NETWORK === 'base' || ENV_NETWORK === 'baseSepolia')
  ? ENV_NETWORK
  : (IS_PRODUCTION ? 'base' as const : 'baseSepolia' as const)

// Contract addresses (allow override)
const DEFAULT_MAINNET_ADDR = '0xa691f1735FD69AacCcFdf57EBD41a3140228941d'
const DEFAULT_SEPOLIA_ADDR = '0xc7fefe90aa9f82536dbf6135db5e7280b898f5e6'
export const YOGA_ESCROW_CONTRACT_ADDRESS: `0x${string}` = ENV_ESCROW_ADDRESS
  || (NETWORK === 'base' ? DEFAULT_MAINNET_ADDR : DEFAULT_SEPOLIA_ADDR) as `0x${string}`

// Chain IDs  
export const BASE_MAINNET_CHAIN_ID = 8453
export const BASE_SEPOLIA_CHAIN_ID = 84532
export const CHAIN_ID = NETWORK === 'base' ? BASE_MAINNET_CHAIN_ID : BASE_SEPOLIA_CHAIN_ID

// Time
export const DEFAULT_CLASS_DURATION_MINUTES = 60 // 1 hour classes