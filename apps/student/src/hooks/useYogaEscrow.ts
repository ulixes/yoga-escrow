import { useState, useCallback } from 'react'
import { useSendTransaction } from '@privy-io/react-auth'
import { encodeFunctionData, parseEther, createPublicClient, http, formatEther } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { YOGA_ESCROW_CONTRACT_ADDRESS, CHAIN_ID, NETWORK } from '../config/constants'

// Contract ABI for createEscrow function
const ESCROW_ABI = [
  {
    "inputs": [
      {"internalType": "string[3]", "name": "teacherHandles", "type": "string[3]"},
      {"internalType": "enum YogaClassEscrow.YogaType[3]", "name": "yogaTypes", "type": "uint8[3]"},
      {
        "components": [
          {"internalType": "uint64", "name": "startTime", "type": "uint64"},
          {"internalType": "uint32", "name": "durationMinutes", "type": "uint32"},
          {"internalType": "int16", "name": "timezoneOffset", "type": "int16"}
        ],
        "internalType": "struct YogaClassEscrow.TimeSlot[3]",
        "name": "timeSlots",
        "type": "tuple[3]"
      },
      {
        "components": [
          {"internalType": "string", "name": "country", "type": "string"},
          {"internalType": "string", "name": "city", "type": "string"},
          {"internalType": "string", "name": "specificLocation", "type": "string"}
        ],
        "internalType": "struct YogaClassEscrow.Location[3]",
        "name": "locations",
        "type": "tuple[3]"
      },
      {"internalType": "uint64", "name": "expirationTime", "type": "uint64"},
      {"internalType": "string", "name": "description", "type": "string"}
    ],
    "name": "createEscrow",
    "outputs": [{"internalType": "uint256", "name": "escrowId", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  }
] as const

// Yoga type enum mapping
export const YogaTypeEnum = {
  'Vinyasa': 0,
  'Yin': 1, 
  'Hatha': 2,
  'Ashtanga': 3,
  'Restorative': 4,
  'Iyengar': 5,
  'Kundalini': 6,
  'Power': 7
} as const

export interface ContractBookingPayload {
  teacherHandles: [string, string, string]
  yogaTypes: [number, number, number]
  timeSlots: [
    {
      startTime: bigint
      durationMinutes: number
      timezoneOffset: number
    },
    {
      startTime: bigint
      durationMinutes: number
      timezoneOffset: number
    },
    {
      startTime: bigint
      durationMinutes: number
      timezoneOffset: number
    }
  ]
  locations: [
    {
      country: string
      city: string
      specificLocation: string
    },
    {
      country: string
      city: string
      specificLocation: string
    },
    {
      country: string
      city: string
      specificLocation: string
    }
  ]
  expirationTime: bigint
  description: string
  amount: string // ETH amount as string like "0.01"
}

export interface ContractState {
  isLoading: boolean
  error: string | null
  txHash: string | null
  escrowId: string | null
}

export interface GasEstimate {
  gasLimit: bigint
  gasPrice: bigint
  gasFeeETH: string
  gasFeeUSD: number
}

export function useYogaEscrow(ethUsdPrice: number = 3000) {
  const { sendTransaction } = useSendTransaction()
  
  const [contractState, setContractState] = useState<ContractState>({
    isLoading: false,
    error: null,
    txHash: null,
    escrowId: null
  })

  // Create public client for gas estimation
  const publicClient = createPublicClient({
    chain: NETWORK === 'base' ? base : baseSepolia,
    transport: http()
  })

  const estimateGas = useCallback(async (payload: ContractBookingPayload, fromAddress: string): Promise<GasEstimate> => {
    try {
      // Encode the contract call
      const data = encodeFunctionData({
        abi: ESCROW_ABI,
        functionName: 'createEscrow',
        args: [
          payload.teacherHandles,
          payload.yogaTypes,
          payload.timeSlots,
          payload.locations,
          payload.expirationTime,
          payload.description
        ]
      })

      // Estimate gas limit
      const gasLimit = await publicClient.estimateGas({
        account: fromAddress as `0x${string}`,
        to: YOGA_ESCROW_CONTRACT_ADDRESS as `0x${string}`,
        data,
        value: parseEther(payload.amount)
      })

      // Get current gas price
      const gasPrice = await publicClient.getGasPrice()

      // Calculate total gas fee in ETH
      const gasFeeWei = gasLimit * gasPrice
      const gasFeeETH = formatEther(gasFeeWei)
      
      // Convert to USD using real market price
      const gasFeeUSD = parseFloat(gasFeeETH) * ethUsdPrice

      console.log('Gas estimation:', {
        gasLimit: gasLimit.toString(),
        gasPrice: gasPrice.toString(),
        gasFeeETH,
        gasFeeUSD
      })

      return {
        gasLimit,
        gasPrice,
        gasFeeETH,
        gasFeeUSD
      }

    } catch (error) {
      console.error('Gas estimation failed:', error)
      // Return fallback values if estimation fails
      return {
        gasLimit: BigInt(100000), // Fallback gas limit
        gasPrice: BigInt(1000000000), // 1 gwei fallback
        gasFeeETH: '0.0001',
        gasFeeUSD: 0.25
      }
    }
  }, [publicClient])

  const createEscrow = useCallback(async (payload: ContractBookingPayload) => {
    try {
      setContractState({
        isLoading: true,
        error: null,
        txHash: null,
        escrowId: null
      })

      console.log('Creating escrow with payload:', payload)

      // Encode the contract call
      const data = encodeFunctionData({
        abi: ESCROW_ABI,
        functionName: 'createEscrow',
        args: [
          payload.teacherHandles,
          payload.yogaTypes,
          payload.timeSlots,
          payload.locations,
          payload.expirationTime,
          payload.description
        ]
      })

      // Send transaction
      const tx = await sendTransaction({
        to: YOGA_ESCROW_CONTRACT_ADDRESS as `0x${string}`,
        data,
        value: parseEther(payload.amount),
        chainId: CHAIN_ID
      })

      console.log('Escrow transaction sent:', tx)

      setContractState({
        isLoading: false,
        error: null,
        txHash: tx.hash,
        escrowId: null // Will be populated when we parse the receipt
      })

      return tx

    } catch (error) {
      console.error('Error creating escrow:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create escrow'
      
      setContractState({
        isLoading: false,
        error: errorMessage,
        txHash: null,
        escrowId: null
      })
      
      throw error
    }
  }, [sendTransaction])

  const resetContractState = useCallback(() => {
    setContractState({
      isLoading: false,
      error: null,
      txHash: null,
      escrowId: null
    })
  }, [])

  return {
    createEscrow,
    estimateGas,
    contractState,
    resetContractState
  }
}