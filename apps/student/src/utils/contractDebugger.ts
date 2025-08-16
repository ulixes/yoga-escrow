import { createPublicClient, http, encodeFunctionData, type Address } from 'viem'
import { baseSepolia } from 'viem/chains'
import { YOGA_ESCROW_CONTRACT_ADDRESS } from '../config'
import type { ContractBookingPayload } from '../hooks/useYogaEscrow'

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

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateContractPayload(payload: ContractBookingPayload): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate teacher handles
  if (!payload.teacherHandles || payload.teacherHandles.length < 1 || payload.teacherHandles.length > 3) {
    errors.push('teacherHandles must be an array of 1-3 strings')
  } else {
    // Check for empty handles
    payload.teacherHandles.forEach((handle, index) => {
      if (!handle || handle.trim().length === 0) {
        errors.push(`teacherHandles[${index}] is empty`)
      }
    })

    // Check for duplicates
    const uniqueHandles = new Set(payload.teacherHandles)
    if (uniqueHandles.size !== payload.teacherHandles.length) {
      errors.push('teacherHandles must be unique')
    }
  }

  // Yoga types validation removed - no longer used

  // Validate time slots (now just timestamps)
  if (!payload.timeSlots || payload.timeSlots.length !== 3) {
    errors.push('timeSlots must be an array of exactly 3 timestamps')
  } else {
    payload.timeSlots.forEach((timestamp, index) => {
      const time = Number(timestamp)
      if (isNaN(time) || time <= 0) {
        errors.push(`timeSlots[${index}] must be a valid timestamp, got: ${timestamp}`)
      }
      if (time < Date.now() / 1000) {
        warnings.push(`timeSlots[${index}] is in the past`)
      }
    })
  }

  // Validate location (now single string)
  if (!payload.location || payload.location.trim().length === 0) {
    errors.push('location string is required')
  }

  // Validate student data
  if (!payload.student) {
    errors.push('student data is required')
  } else {
    if (!payload.student.email || payload.student.email.trim().length === 0) {
      errors.push('student email is required')
    }
    if (!payload.student.wallet || payload.student.wallet.trim().length === 0) {
      errors.push('student wallet address is required')
    }
  }

  // Validate description
  if (!payload.description) {
    warnings.push('description is empty')
  }

  // Validate amount
  if (!payload.amount || Number(payload.amount) <= 0) {
    errors.push('amount must be a positive number')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export async function simulateContractCall(
  payload: ContractBookingPayload, 
  fromAddress: Address
): Promise<{ success: boolean; error?: string; gasEstimate?: bigint }> {
  try {
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http()
    })

    // Encode the function call
    const data = encodeFunctionData({
      abi: ESCROW_ABI,
      functionName: 'createEscrow',
      args: [
        payload.teacherHandles,
        payload.timeSlots,
        payload.location,
        payload.description,
        payload.student.email,
        payload.student.wallet as Address
      ]
    })

    console.log('Simulating contract call with data:', {
      to: YOGA_ESCROW_CONTRACT_ADDRESS,
      contractAddress: YOGA_ESCROW_CONTRACT_ADDRESS,
      expectedAddress: '0xc7fefe90aa9f82536dbf6135db5e7280b898f5e6',
      data,
      value: payload.amount
    })

    // Try to simulate the call
    const result = await publicClient.call({
      account: fromAddress,
      to: YOGA_ESCROW_CONTRACT_ADDRESS as Address,
      data,
      value: BigInt(Math.floor(Number(payload.amount) * 1e18))
    })

    console.log('Simulation successful:', result)

    // If simulation succeeds, estimate gas
    const gasEstimate = await publicClient.estimateGas({
      account: fromAddress,
      to: YOGA_ESCROW_CONTRACT_ADDRESS as Address,
      data,
      value: BigInt(Math.floor(Number(payload.amount) * 1e18))
    })

    return {
      success: true,
      gasEstimate
    }

  } catch (error: any) {
    console.error('Contract simulation failed:', error)
    
    let errorMessage = 'Unknown error'
    if (error.message) {
      errorMessage = error.message
    }
    if (error.data) {
      errorMessage += ` (data: ${error.data})`
    }

    return {
      success: false,
      error: errorMessage
    }
  }
}

export function createMinimalValidPayload(): ContractBookingPayload {
  const futureTime = Math.floor(Date.now() / 1000) + 86400 // 24 hours from now

  return {
    teacherHandles: ['@teacher1', '@teacher2', '@teacher3'],
    timeSlots: [
      BigInt(futureTime),
      BigInt(futureTime + 3600),
      BigInt(futureTime + 7200)
    ],
    location: 'Central Park, New York',
    description: 'Test yoga class booking',
    amount: '0.002',
    student: {
      email: 'test@example.com',
      wallet: '0x0000000000000000000000000000000000000001'
    }
  }
}