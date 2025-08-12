import { useState, useCallback, useMemo } from 'react'
import type { FullJourneyResult } from '@yoga/ui'
import { hasSufficientBalance, calculateShortfall } from '../utils/walletUtils'
import { useYogaEscrow, type ContractBookingPayload, type GasEstimate } from './useYogaEscrow'
import { CLASS_PRICE_USD, CLASS_PRICE_ETH, CLASS_PRICE_ETH_DISPLAY } from '../config/constants'

// Contract enums matching Solidity
export enum YogaType {
  Vinyasa = 0,
  Yin = 1,
  Hatha = 2,
  Ashtanga = 3,
  Restorative = 4,
  Iyengar = 5,
  Kundalini = 6,
  Power = 7
}

export enum EscrowStatus {
  Created = 0,
  Assigned = 1,
  Completed = 2,
  Cancelled = 3,
  Disputed = 4
}

export interface TimeSlot {
  startTime: number // Unix timestamp
  durationMinutes: number
  timezoneOffset: number // Minutes from UTC
}

export interface Location {
  country: string
  city: string
  specificLocation: string
}

export interface BookingPayload {
  // For createEscrow function
  teacherHandles: [string, string, string] // Will be removed in future
  yogaTypes: [YogaType, YogaType, YogaType]
  timeSlots: [TimeSlot, TimeSlot, TimeSlot]
  locations: [Location, Location, Location]
  description: string
  priceUSD: number // Price in USD for display
  priceETH: string // Price in ETH for contract
}

export interface Escrow {
  id: number
  payer: string
  payee?: string
  amount: string
  status: EscrowStatus
  createdAt: number
  expiresAt: number
  description: string
  teacherHandles: [string, string, string]
  yogaTypes: [YogaType, YogaType, YogaType]
  timeSlots: [TimeSlot, TimeSlot, TimeSlot]
  locations: [Location, Location, Location]
  selectedPayeeIndex?: number
  selectedYogaIndex?: number
  selectedTimeIndex?: number
  selectedLocationIndex?: number
  selectedHandle?: string
}

export interface PaymentState {
  requiredAmount: string // "0.002"
  currency: 'ETH'
  hasSufficientBalance: boolean
  shortfallAmount: string
  isCheckingBalance: boolean
  balanceError: string | null
  gasEstimate?: GasEstimate
  totalCostETH?: string
  totalCostUSD?: number
}

interface BookingFlowState {
  step: 'journey' | 'payment' | 'confirmation'
  journeyResult: FullJourneyResult | null
  bookingPayload: BookingPayload | null
  paymentState: PaymentState | null
  escrowId: number | null
  transactionHash: string | null
  error: string | null
  loading: boolean
}

// Helper to map UI yoga types to contract enums
const yogaTypeMap: Record<string, YogaType> = {
  'vinyasa': YogaType.Vinyasa,
  'yin': YogaType.Yin,
  'hatha': YogaType.Hatha,
  'ashtanga': YogaType.Ashtanga,
  'restorative': YogaType.Restorative,
  'iyengar': YogaType.Iyengar,
  'kundalini': YogaType.Kundalini,
  'power': YogaType.Power
}

export function useBookingFlow(userEmail?: string, userWalletAddress?: string, ethUsdPrice: number = 3000) {
  const { createEscrow, estimateGas, contractState } = useYogaEscrow(ethUsdPrice)
  
  const [state, setState] = useState<BookingFlowState>({
    step: 'journey',
    journeyResult: null,
    bookingPayload: null,
    paymentState: null,
    escrowId: null,
    transactionHash: null,
    error: null,
    loading: false
  })

  // Convert journey result to contract payload
  const convertToBookingPayload = useCallback((result: FullJourneyResult): BookingPayload => {
    // Parse time selections (format: "dayId:HH:mm")
    const timeSlots = result.timeIds.slice(0, 3).map(timeId => {
      // timeId format is "dayId:HH:mm" e.g., "mon:09:00"
      const parts = timeId.split(':')
      if (parts.length !== 3) {
        console.error('Invalid timeId format:', timeId)
        // Return a default slot
        return {
          startTime: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
          durationMinutes: 60,
          timezoneOffset: 0
        }
      }
      
      const dayId = parts[0]
      const hours = Number(parts[1])
      const minutes = Number(parts[2])
      
      // Validate parsed numbers
      if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid time values:', { hours, minutes, timeId })
        return {
          startTime: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60),
          durationMinutes: 60,
          timezoneOffset: 0
        }
      }
      
      // Calculate next occurrence of this day/time
      const now = new Date()
      const dayMap: Record<string, number> = {
        'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6, 'sun': 0
      }
      
      const targetDay = dayMap[dayId]
      const daysUntilTarget = (targetDay - now.getDay() + 7) % 7 || 7
      const targetDate = new Date(now)
      targetDate.setDate(now.getDate() + daysUntilTarget)
      targetDate.setHours(hours, minutes, 0, 0)
      
      return {
        startTime: Math.floor(targetDate.getTime() / 1000),
        durationMinutes: 60, // Default 60 min classes
        timezoneOffset: -targetDate.getTimezoneOffset()
      }
    })

    // Ensure we have exactly 3 slots
    while (timeSlots.length < 3) {
      timeSlots.push(timeSlots[0]) // Duplicate first slot if needed
    }

    // Map yoga type
    const yogaType = yogaTypeMap[result.yogaTypeId] || YogaType.Vinyasa
    
    // Create 3 variations of yoga types (main choice + alternatives)
    const yogaTypes: [YogaType, YogaType, YogaType] = [
      yogaType,
      yogaType === YogaType.Vinyasa ? YogaType.Hatha : YogaType.Vinyasa,
      yogaType === YogaType.Yin ? YogaType.Restorative : YogaType.Yin
    ]

    // Create 3 location options (selected + alternatives)
    const locations: [Location, Location, Location] = [
      result.location,
      { ...result.location, specificLocation: 'Alternative Studio' },
      { ...result.location, specificLocation: 'Online Session' }
    ]

    // Teacher handles (placeholder for now, will be removed)
    const teacherHandles: [string, string, string] = [
      '@yogateacher1',
      '@yogateacher2', 
      '@yogateacher3'
    ]

    return {
      teacherHandles,
      yogaTypes,
      timeSlots: timeSlots as [TimeSlot, TimeSlot, TimeSlot],
      locations,
      description: `Yoga class booking - ${result.persona} seeking ${result.goal}`,
      priceUSD: CLASS_PRICE_USD,
      priceETH: CLASS_PRICE_ETH
    }
  }, [])

  // Check payment eligibility (now using ETH instead of USDC)
  const checkPaymentEligibility = useCallback((ethBalance: string, gasEstimate?: GasEstimate): PaymentState => {
    const requiredAmountETH = parseFloat(CLASS_PRICE_ETH)
    const currentBalanceETH = parseFloat(ethBalance)
    
    // Calculate total cost including gas
    const gasFeeETH = gasEstimate ? parseFloat(gasEstimate.gasFeeETH) : 0
    const totalCostETH = requiredAmountETH + gasFeeETH
    const totalCostUSD = CLASS_PRICE_USD + (gasEstimate?.gasFeeUSD || 0)
    
    const hasSufficient = currentBalanceETH >= totalCostETH
    const shortfall = hasSufficient ? "0.000000" : (totalCostETH - currentBalanceETH).toFixed(6)
    
    console.log('checkPaymentEligibility called:', {
      ethBalance,
      requiredAmountETH,
      gasFeeETH,
      totalCostETH,
      hasSufficient,
      shortfall
    })
    
    return {
      requiredAmount: CLASS_PRICE_ETH, // Use ETH amount for display
      currency: 'ETH',
      hasSufficientBalance: hasSufficient,
      shortfallAmount: shortfall,
      isCheckingBalance: false,
      balanceError: null,
      gasEstimate,
      totalCostETH: totalCostETH.toFixed(6),
      totalCostUSD
    }
  }, [])

  // Handle journey completion - now triggers payment check
  const handleJourneyComplete = useCallback((result: FullJourneyResult) => {
    // Use provided user email if journey result doesn't have one or if we want to override
    const finalResult = {
      ...result,
      student: {
        email: userEmail && userEmail.trim() ? userEmail.trim() : result.student.email
      }
    }
    
    const payload = convertToBookingPayload(finalResult)
    
    // Initialize payment state (balance will be checked separately)
    const initialPaymentState: PaymentState = {
      requiredAmount: CLASS_PRICE_ETH,
      currency: 'ETH',
      hasSufficientBalance: false,
      shortfallAmount: "0.000000",
      isCheckingBalance: true,
      balanceError: null
    }
    
    setState(prev => ({
      ...prev,
      journeyResult: finalResult,
      bookingPayload: payload,
      paymentState: initialPaymentState,
      step: 'payment'
    }))
  }, [convertToBookingPayload, userEmail])

  // Update payment state with balance info and gas estimation
  const updatePaymentState = useCallback((ethBalance: string, error?: string, gasEstimate?: GasEstimate) => {
    console.log('updatePaymentState called:', { ethBalance, error, gasEstimate })
    
    setState(prev => {
      if (!prev.paymentState) {
        console.log('No paymentState, skipping update')
        return prev
      }
      
      if (error) {
        console.log('Error case in updatePaymentState')
        return {
          ...prev,
          paymentState: {
            ...prev.paymentState,
            isCheckingBalance: false,
            balanceError: error
          }
        }
      }
      
      console.log('Calling checkPaymentEligibility...')
      const updatedPaymentState = checkPaymentEligibility(ethBalance, gasEstimate)
      return {
        ...prev,
        paymentState: updatedPaymentState
      }
    })
  }, [checkPaymentEligibility])

  // Estimate gas for the current booking payload
  const estimateGasForBooking = useCallback(async (currentBalance?: string) => {
    if (!state.bookingPayload || !userWalletAddress) {
      console.log('No booking payload or wallet address for gas estimation')
      return
    }

    try {
      // Convert booking payload to contract format for gas estimation
      // Validate and prepare contract payload
      const contractPayload: ContractBookingPayload = {
        teacherHandles: state.bookingPayload.teacherHandles,
        yogaTypes: state.bookingPayload.yogaTypes.map(type => {
          const numericType = typeof type === 'number' ? type : Number(type)
          console.log('Converting yoga type:', type, '->', numericType)
          return numericType
        }) as [number, number, number],
        timeSlots: state.bookingPayload.timeSlots.map(slot => {
          const timeSlot = {
            startTime: BigInt(Math.floor(slot.startTime)),
            durationMinutes: Number(slot.durationMinutes) || 60,
            timezoneOffset: Number(slot.timezoneOffset) || 0
          }
          console.log('Converting time slot:', slot, '->', timeSlot)
          return timeSlot
        }) as any,
        locations: state.bookingPayload.locations.map(loc => ({
          country: loc.country || 'Unknown',
          city: loc.city || 'Unknown', 
          specificLocation: loc.specificLocation || 'Unknown'
        })) as any,
        description: state.bookingPayload.description || 'Yoga class booking',
        amount: state.bookingPayload.priceETH
      }

      // Validate all required fields
      console.log('Contract payload validation:', {
        teacherHandles: contractPayload.teacherHandles,
        yogaTypes: contractPayload.yogaTypes,
        timeSlots: contractPayload.timeSlots,
        locations: contractPayload.locations,
        description: contractPayload.description,
        amount: contractPayload.amount
      })

      console.log('Estimating gas for booking...')
      const gasEstimate = await estimateGas(contractPayload, userWalletAddress)
      
      // Update payment state with gas estimate using the actual current balance
      if (currentBalance) {
        setState(prev => {
          if (!prev.paymentState) return prev
          
          const updatedPaymentState = checkPaymentEligibility(currentBalance, gasEstimate)
          return {
            ...prev,
            paymentState: updatedPaymentState
          }
        })
      }

      return gasEstimate
    } catch (error) {
      console.error('Gas estimation failed:', error)
    }
  }, [state.bookingPayload, userWalletAddress, estimateGas, checkPaymentEligibility])

  // Confirm payment and create escrow on blockchain
  const confirmPayment = useCallback(async () => {
    if (!state.bookingPayload) {
      throw new Error('No booking payload available')
    }

    setState(prev => ({ ...prev, loading: true, error: null }))
    
    console.log('Booking payload before conversion:', state.bookingPayload)
    
    try {
      // Convert booking payload to contract format
      const contractPayload: ContractBookingPayload = {
        teacherHandles: state.bookingPayload.teacherHandles,
        yogaTypes: state.bookingPayload.yogaTypes.map(type => {
          const numericType = typeof type === 'number' ? type : Number(type)
          console.log('Converting yoga type:', type, '->', numericType)
          return numericType
        }) as [number, number, number],
        timeSlots: state.bookingPayload.timeSlots.map(slot => {
          // Ensure we have valid numbers before converting to BigInt
          const startTime = Number(slot.startTime)
          if (isNaN(startTime)) {
            throw new Error('Invalid start time in time slot')
          }
          const timeSlot = {
            startTime: BigInt(Math.floor(startTime)),
            durationMinutes: Number(slot.durationMinutes) || 60,
            timezoneOffset: Number(slot.timezoneOffset) || 0
          }
          console.log('Converting time slot for transaction:', slot, '->', timeSlot)
          return timeSlot
        }) as any,
        locations: state.bookingPayload.locations.map(loc => ({
          country: loc.country || 'Unknown',
          city: loc.city || 'Unknown', 
          specificLocation: loc.specificLocation || 'Unknown'
        })) as any,
        description: state.bookingPayload.description || 'Yoga class booking',
        amount: state.bookingPayload.priceETH // Use ETH amount from payload
      }

      console.log('Final contract payload for transaction:', contractPayload)

      console.log('Creating escrow with contract payload:', contractPayload)

      // Call the smart contract
      const tx = await createEscrow(contractPayload)
      
      console.log('Transaction successful, updating state to confirmation:', tx.hash)
      
      setState(prev => ({
        ...prev,
        loading: false,
        transactionHash: tx.hash,
        step: 'confirmation'
      }))
      
      console.log('State updated successfully')
      
      return { txHash: tx.hash }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Escrow creation failed'
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))
      throw error
    }
  }, [state.bookingPayload, createEscrow])

  // Validate payment before escrow creation
  const validatePaymentAndProceed = useCallback(async (payload: BookingPayload) => {
    const paymentState = state.paymentState
    
    if (!paymentState) {
      throw new Error('Payment state not initialized')
    }
    
    if (!paymentState.hasSufficientBalance) {
      throw new Error(`Insufficient USDC balance. Need $${paymentState.shortfallAmount} more.`)
    }
    
    if (paymentState.isCheckingBalance) {
      throw new Error('Still checking balance. Please wait.')
    }
    
    if (paymentState.balanceError) {
      throw new Error(`Balance check failed: ${paymentState.balanceError}`)
    }
    
    // Proceed with escrow creation
    return confirmPayment()
  }, [state.paymentState, confirmPayment])

  // Reset flow
  const reset = useCallback(() => {
    setState({
      step: 'journey',
      journeyResult: null,
      bookingPayload: null,
      paymentState: null,
      escrowId: null,
      transactionHash: null,
      error: null,
      loading: false
    })
  }, [])

  // Navigation
  const goToStep = useCallback((step: BookingFlowState['step']) => {
    setState(prev => ({ ...prev, step }))
  }, [])

  return {
    ...state,
    handleJourneyComplete,
    updatePaymentState,
    estimateGasForBooking,
    validatePaymentAndProceed,
    confirmPayment,
    reset,
    goToStep,
    convertToBookingPayload,
    contractState
  }
}