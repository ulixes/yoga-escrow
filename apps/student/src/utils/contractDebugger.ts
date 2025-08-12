import { createPublicClient, http, encodeFunctionData, type Address } from 'viem'
import { baseSepolia } from 'viem/chains'
import { YOGA_ESCROW_CONTRACT_ADDRESS } from '../config/constants'
import type { ContractBookingPayload } from '../hooks/useYogaEscrow'

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
      {"internalType": "string", "name": "description", "type": "string"}
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
  if (!payload.teacherHandles || payload.teacherHandles.length !== 3) {
    errors.push('teacherHandles must be an array of exactly 3 strings')
  } else {
    // Check for empty handles
    payload.teacherHandles.forEach((handle, index) => {
      if (!handle || handle.trim().length === 0) {
        errors.push(`teacherHandles[${index}] is empty`)
      }
    })

    // Check for duplicates
    const uniqueHandles = new Set(payload.teacherHandles)
    if (uniqueHandles.size !== 3) {
      errors.push('teacherHandles must be unique')
    }
  }

  // Validate yoga types
  if (!payload.yogaTypes || payload.yogaTypes.length !== 3) {
    errors.push('yogaTypes must be an array of exactly 3 numbers')
  } else {
    payload.yogaTypes.forEach((type, index) => {
      const numType = Number(type)
      if (isNaN(numType) || numType < 0 || numType > 7) {
        errors.push(`yogaTypes[${index}] must be a number between 0-7, got: ${type}`)
      }
    })
  }

  // Validate time slots
  if (!payload.timeSlots || payload.timeSlots.length !== 3) {
    errors.push('timeSlots must be an array of exactly 3 time slot objects')
  } else {
    payload.timeSlots.forEach((slot, index) => {
      if (!slot.startTime) {
        errors.push(`timeSlots[${index}].startTime is required`)
      } else {
        const startTime = Number(slot.startTime)
        if (isNaN(startTime) || startTime <= 0) {
          errors.push(`timeSlots[${index}].startTime must be a valid timestamp, got: ${slot.startTime}`)
        }
        if (startTime < Date.now() / 1000) {
          warnings.push(`timeSlots[${index}].startTime is in the past`)
        }
      }

      if (!slot.durationMinutes || Number(slot.durationMinutes) <= 0) {
        errors.push(`timeSlots[${index}].durationMinutes must be a positive number`)
      }

      if (slot.timezoneOffset === undefined || slot.timezoneOffset === null) {
        warnings.push(`timeSlots[${index}].timezoneOffset not set, using 0`)
      }
    })
  }

  // Validate locations
  if (!payload.locations || payload.locations.length !== 3) {
    errors.push('locations must be an array of exactly 3 location objects')
  } else {
    payload.locations.forEach((location, index) => {
      if (!location.country || location.country.trim().length === 0) {
        errors.push(`locations[${index}].country is empty`)
      }
      if (!location.city || location.city.trim().length === 0) {
        errors.push(`locations[${index}].city is empty`)
      }
      if (!location.specificLocation || location.specificLocation.trim().length === 0) {
        errors.push(`locations[${index}].specificLocation is empty`)
      }
    })
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
        payload.yogaTypes,
        payload.timeSlots,
        payload.locations,
        payload.description
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
    yogaTypes: [0, 1, 2], // Vinyasa, Yin, Hatha
    timeSlots: [
      {
        startTime: BigInt(futureTime),
        durationMinutes: 60,
        timezoneOffset: 0
      },
      {
        startTime: BigInt(futureTime + 3600),
        durationMinutes: 90, 
        timezoneOffset: 0
      },
      {
        startTime: BigInt(futureTime + 7200),
        durationMinutes: 75,
        timezoneOffset: 0
      }
    ],
    locations: [
      {
        country: 'USA',
        city: 'New York',
        specificLocation: 'Central Park'
      },
      {
        country: 'USA', 
        city: 'New York',
        specificLocation: 'Brooklyn Bridge'
      },
      {
        country: 'USA',
        city: 'New York', 
        specificLocation: 'Times Square'
      }
    ],
    description: 'Test yoga class booking',
    amount: '0.002'
  }
}