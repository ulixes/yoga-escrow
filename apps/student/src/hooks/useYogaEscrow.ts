import { useState, useCallback } from 'react'
import { useSendTransaction } from '@privy-io/react-auth'
import { encodeFunctionData, parseEther, createPublicClient, http, formatEther } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { YOGA_ESCROW_CONTRACT_ADDRESS, CHAIN_ID, NETWORK } from '../config'

// Contract ABI for createEscrow function - clean version
const ESCROW_ABI = [
  {
    "inputs": [
      {"internalType": "string[]", "name": "teacherHandles", "type": "string[]"},
      {"internalType": "uint64[3]", "name": "timeSlots", "type": "uint64[3]"},
      {"internalType": "string", "name": "location", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "studentEmail", "type": "string"},
      {"internalType": "address", "name": "studentWallet", "type": "address"}
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
  teacherHandles: string[] // 1-3 teacher handles
  timeSlots: [bigint, bigint, bigint] // Unix timestamps
  location: string // Single location string
  description: string
  amount: string // ETH amount as string like "0.01"
  student: {
    email: string
    wallet: string
  }
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

  // Use environment-based chain configuration
  const publicClient = createPublicClient({
    chain: NETWORK === 'base' ? base : baseSepolia,
    transport: http(),
    batch: { multicall: false }
  })

  const estimateGas = useCallback(async (payload: ContractBookingPayload, fromAddress: string): Promise<GasEstimate> => {
    try {
      // Encode the contract call
      const data = encodeFunctionData({
        abi: ESCROW_ABI,
        functionName: 'createEscrow',
        args: [
          payload.teacherHandles,
          payload.timeSlots,
          payload.location,
          payload.description,
          payload.student.email,
          payload.student.wallet as `0x${string}`
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
      // Return higher fallback values for complex contract calls
      return {
        gasLimit: BigInt(500000), // Higher fallback for complex escrow creation
        gasPrice: BigInt(1000000000), // 1 gwei fallback
        gasFeeETH: '0.0005',
        gasFeeUSD: 1.5
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
          payload.timeSlots,
          payload.location,
          payload.description,
          payload.student.email,
          payload.student.wallet as `0x${string}`
        ]
      })

      // Send transaction and let the wallet/provider determine gas settings
      const wei = parseEther(payload.amount)
      const valueHex = `0x${wei.toString(16)}`

      const tx = await sendTransaction({
        to: YOGA_ESCROW_CONTRACT_ADDRESS as `0x${string}`,
        data,
        value: valueHex,
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

  // ---- History/Actions wiring ----
  const ESCROW_WRITE_ABI = [
    { name: 'assignPayee', type: 'function', stateMutability: 'nonpayable', inputs: [
      { name: 'escrowId', type: 'uint256' },
      { name: 'teacherAddress', type: 'address' },
      { name: 'teacherHandle', type: 'string' },
      { name: 'yogaIndex', type: 'uint8' },
      { name: 'timeIndex', type: 'uint8' },
      { name: 'locationIndex', type: 'uint8' },
    ], outputs: [] },
    { name: 'releasePayment', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'escrowId', type: 'uint256' }], outputs: [] },
    { name: 'cancelEscrow', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'escrowId', type: 'uint256' }], outputs: [] },
    { name: 'raiseDispute', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'escrowId', type: 'uint256' }], outputs: [] },
    { name: 'autoRelease', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'escrowId', type: 'uint256' }], outputs: [] },
  ] as const

  const assignPayee = useCallback(async (args: {
    escrowId: bigint,
    teacherAddress: `0x${string}`,
    teacherHandle: string,
    yogaIndex: 0|1|2,
    timeIndex: 0|1|2,
    locationIndex: 0|1|2,
  }) => {
    const data = encodeFunctionData({
      abi: ESCROW_WRITE_ABI,
      functionName: 'assignPayee',
      args: [args.escrowId, args.teacherAddress, args.teacherHandle, args.yogaIndex, args.timeIndex, args.locationIndex],
    })
    return sendTransaction({ to: YOGA_ESCROW_CONTRACT_ADDRESS as `0x${string}`, data, chainId: CHAIN_ID })
  }, [sendTransaction])

  const releasePayment = useCallback(async (escrowId: bigint) => {
    const data = encodeFunctionData({ abi: ESCROW_WRITE_ABI, functionName: 'releasePayment', args: [escrowId] })
    return sendTransaction({ to: YOGA_ESCROW_CONTRACT_ADDRESS as `0x${string}`, data, chainId: CHAIN_ID })
  }, [sendTransaction])

  const cancelEscrow = useCallback(async (escrowId: bigint) => {
    const data = encodeFunctionData({ abi: ESCROW_WRITE_ABI, functionName: 'cancelEscrow', args: [escrowId] })
    return sendTransaction({ to: YOGA_ESCROW_CONTRACT_ADDRESS as `0x${string}`, data, chainId: CHAIN_ID })
  }, [sendTransaction])

  const raiseDispute = useCallback(async (escrowId: bigint) => {
    const data = encodeFunctionData({ abi: ESCROW_WRITE_ABI, functionName: 'raiseDispute', args: [escrowId] })
    return sendTransaction({ to: YOGA_ESCROW_CONTRACT_ADDRESS as `0x${string}`, data, chainId: CHAIN_ID })
  }, [sendTransaction])

  const autoRelease = useCallback(async (escrowId: bigint) => {
    const data = encodeFunctionData({ abi: ESCROW_WRITE_ABI, functionName: 'autoRelease', args: [escrowId] })
    return sendTransaction({ to: YOGA_ESCROW_CONTRACT_ADDRESS as `0x${string}`, data, chainId: CHAIN_ID })
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
    resetContractState,
    assignPayee,
    releasePayment,
    cancelEscrow,
    raiseDispute,
    autoRelease,
  }
}