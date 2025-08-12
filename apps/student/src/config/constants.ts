// Global configuration constants

// Environment detection (Vite): prefer import.meta.env over process.env
const IS_PRODUCTION = import.meta.env?.PROD === true
const MODE = import.meta.env?.MODE || (IS_PRODUCTION ? 'production' : 'development')

// Optional overrides via Vite env
const ENV_NETWORK = (import.meta as any).env?.VITE_NETWORK as 'base' | 'baseSepolia' | undefined
const ENV_ESCROW_ADDRESS = (import.meta as any).env?.VITE_ESCROW_ADDRESS as `0x${string}` | undefined

// Pricing
export const CLASS_PRICE_USD = 15 // $15 USD target price
export const CLASS_PRICE_ETH = '0.003' // ~$13.50 in ETH at $4500/ETH
export const CLASS_PRICE_ETH_DISPLAY = '0.003 ETH'

// Legacy USDC values (keeping for balance display compatibility)
export const CLASS_PRICE_USDC = '5.00' 
export const CLASS_PRICE_USDC_RAW = '5000000' // 5 USDC with 6 decimals

// Network selection
export const NETWORK = (ENV_NETWORK === 'base' || ENV_NETWORK === 'baseSepolia')
  ? ENV_NETWORK
  : (IS_PRODUCTION ? 'base' as const : 'baseSepolia' as const)

// Contract addresses (allow override)
const DEFAULT_MAINNET_ADDR = '0x756cf904B2dFFe5008e82DFB34B9B7f081A5cF33' // Production mainnet contract
const DEFAULT_SEPOLIA_ADDR = '0x49e0e615583Be1F9457E119BC93e84B85aD63feD' // Testnet contract
export const YOGA_ESCROW_CONTRACT_ADDRESS: `0x${string}` = ENV_ESCROW_ADDRESS
  || (NETWORK === 'base' ? DEFAULT_MAINNET_ADDR : DEFAULT_SEPOLIA_ADDR) as `0x${string}`

// Chain IDs  
export const BASE_MAINNET_CHAIN_ID = 8453
export const BASE_SEPOLIA_CHAIN_ID = 84532
export const CHAIN_ID = NETWORK === 'base' ? BASE_MAINNET_CHAIN_ID : BASE_SEPOLIA_CHAIN_ID

// Time
export const DEFAULT_CLASS_DURATION_MINUTES = 60 // 1 hour classes