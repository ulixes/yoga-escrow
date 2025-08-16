// Single source of truth - all config from environment
export const NETWORK = (import.meta as any).env?.VITE_NETWORK as 'base' | 'baseSepolia'
export const YOGA_ESCROW_CONTRACT_ADDRESS = (import.meta as any).env?.VITE_ESCROW_ADDRESS as `0x${string}`
export const CHAIN_ID = Number((import.meta as any).env?.VITE_CHAIN_ID)

// Validation
if (!NETWORK) throw new Error('VITE_NETWORK is required in .env')
if (!YOGA_ESCROW_CONTRACT_ADDRESS) throw new Error('VITE_ESCROW_ADDRESS is required in .env')
if (!CHAIN_ID) throw new Error('VITE_CHAIN_ID is required in .env')