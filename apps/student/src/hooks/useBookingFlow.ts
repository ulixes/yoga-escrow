import { useState, useCallback, useMemo } from 'react'
import type { FullJourneyResult } from '@yoga/ui'
import { hasSufficientBalance, calculateShortfall } from '../utils/walletUtils'
import { useYogaEscrow, type ContractBookingPayload, type GasEstimate } from './useYogaEscrow'
import { YOGA_ESCROW_CONTRACT_ADDRESS } from '../config'
import { validateContractPayload, simulateContractCall } from '../utils/contractDebugger'

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
  // Clean contract payload
  teacherHandles: string[] // 1-3 teacher handles
  timeSlots: [number, number, number] // Unix timestamps only
  location: string // Single location string
  description: string
  priceUSD: number // Price in USD for display
  priceETH: string // Price in ETH for contract
  student: {
    email: string
    wallet: string
  }
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

export function useBookingFlow(userEmail?: string, userWalletAddress?: string, ethUsdPrice: number = 3000, teachers: any[] = []) {
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
  const convertToBookingPayload = useCallback((result: FullJourneyResult, teachers: any[]): BookingPayload => {
    // Debug logging
    console.log('DEBUG - Selected teacher IDs:', result.selectedTeacherIds)
    console.log('DEBUG - Available teachers:', teachers.map(t => ({ id: t.id, handle: t.handle })))
    
    // Get actual teacher handles from selected IDs - no padding needed!
    const selectedTeachers = teachers.filter(t => result.selectedTeacherIds.includes(t.id))
    console.log('DEBUG - Found selected teachers:', selectedTeachers.map(t => ({ id: t.id, handle: t.handle })))
    
    const teacherHandles = selectedTeachers.map(t => `@${t.handle}`)

    // Parse time selections to Unix timestamps
    const timeSlots = result.timeIds.slice(0, 3).map(timeId => {
      const parts = timeId.split(':')
      if (parts.length !== 3) {
        console.error('Invalid timeId format:', timeId)
        return Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
      }
      
      const dayId = parts[0]
      const hours = Number(parts[1])
      const minutes = Number(parts[2])
      
      if (isNaN(hours) || isNaN(minutes)) {
        console.error('Invalid time values:', { hours, minutes, timeId })
        return Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
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
      
      return Math.floor(targetDate.getTime() / 1000)
    })

    // Ensure we have exactly 3 timestamps
    while (timeSlots.length < 3) {
      timeSlots.push(timeSlots[0])
    }

    // Single location string
    const location = `${result.location.specificLocation}, ${result.location.city}`

    // Calculate ETH price from USD amount (rough conversion)
    const ethPrice = ethUsdPrice || 3000
    const priceETH = (result.pricing.customAmount / ethPrice).toFixed(6)

    const finalPayload = {
      teacherHandles,
      timeSlots: timeSlots.slice(0, 3) as [number, number, number],
      location,
      description: `${result.pricing.sessionType === '1on1' ? 'Private' : 'Group'} yoga class booking`,
      priceUSD: result.pricing.customAmount,
      priceETH,
      student: {
        email: result.student.email,
        wallet: userWalletAddress || result.student.wallet || ''
      }
    }

    console.log('DEBUG - convertToBookingPayload wallet assignment:', {
      userWalletAddress,
      resultStudentWallet: result.student.wallet,
      finalWallet: finalPayload.student.wallet
    })

    return finalPayload
  }, [ethUsdPrice, userWalletAddress])

  // Check payment eligibility
  const checkPaymentEligibility = useCallback((ethBalance: string, gasEstimate?: GasEstimate): PaymentState => {
    const requiredAmountETH = state.bookingPayload ? parseFloat(state.bookingPayload.priceETH) : 0
    const currentBalanceETH = parseFloat(ethBalance)
    
    // Calculate total cost including gas
    const gasFeeETH = gasEstimate ? parseFloat(gasEstimate.gasFeeETH) : 0
    const totalCostETH = requiredAmountETH + gasFeeETH
    const totalCostUSD = (state.bookingPayload?.priceUSD || 0) + (gasEstimate?.gasFeeUSD || 0)
    
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
      requiredAmount: state.bookingPayload?.priceETH || '0',
      currency: 'ETH',
      hasSufficientBalance: hasSufficient,
      shortfallAmount: shortfall,
      isCheckingBalance: false,
      balanceError: null,
      gasEstimate,
      totalCostETH: totalCostETH.toFixed(6),
      totalCostUSD
    }
  }, [state.bookingPayload])

  // Handle journey completion - now triggers payment check
  const handleJourneyComplete = useCallback((result: FullJourneyResult) => {
    // Use provided user email if journey result doesn't have one or if we want to override
    const finalResult = {
      ...result,
      student: {
        email: userEmail && userEmail.trim() ? userEmail.trim() : result.student.email
      }
    }
    
    const payload = convertToBookingPayload(finalResult, teachers)
    
    // Initialize payment state (balance will be checked separately)
    const initialPaymentState: PaymentState = {
      requiredAmount: payload.priceETH,
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
      paymentState: initialPaymentState
      // Don't change step - stay on journey to keep UI visible
    }))
    
    return payload
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
      const contractPayload: ContractBookingPayload = {
        teacherHandles: state.bookingPayload.teacherHandles,
        timeSlots: state.bookingPayload.timeSlots.map(timestamp => BigInt(timestamp)) as [bigint, bigint, bigint],
        location: state.bookingPayload.location,
        description: state.bookingPayload.description,
        amount: state.bookingPayload.priceETH,
        student: state.bookingPayload.student
      }

      // Validate all required fields
      console.log('Contract payload validation:', {
        teacherHandles: contractPayload.teacherHandles,
        timeSlots: contractPayload.timeSlots,
        location: contractPayload.location,
        description: contractPayload.description,
        amount: contractPayload.amount,
        student: contractPayload.student
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
  const confirmPayment = useCallback(async (payloadOverride?: BookingPayload) => {
    const payload = payloadOverride || state.bookingPayload
    if (!payload) {
      throw new Error('No booking payload available')
    }

    setState(prev => ({ ...prev, loading: true, error: null }))
    
    console.log('Booking payload before conversion:', payload)
    console.log('DEBUG - Student wallet in payload:', payload.student.wallet)
    console.log('DEBUG - userWalletAddress param:', userWalletAddress)
    
    try {
      // Convert booking payload to contract format
      const contractPayload: ContractBookingPayload = {
        teacherHandles: payload.teacherHandles,
        timeSlots: payload.timeSlots.map(timestamp => BigInt(timestamp)) as [bigint, bigint, bigint],
        location: payload.location,
        description: payload.description,
        amount: payload.priceETH,
        student: payload.student
      }

      console.log('Final contract payload for transaction:', contractPayload)

      // Validate payload before sending transaction
      const validation = validateContractPayload(contractPayload)
      console.log('Payload validation result:', validation)

      if (!validation.isValid) {
        const errorMessage = `Invalid contract parameters: ${validation.errors.join(', ')}`
        console.error(errorMessage)
        setState(prev => ({ ...prev, loading: false, error: errorMessage }))
        return
      }

      if (validation.warnings.length > 0) {
        console.warn('Payload validation warnings:', validation.warnings)
      }

      // Simulate the contract call before sending real transaction
      console.log('Simulating contract call with address:', YOGA_ESCROW_CONTRACT_ADDRESS)
      const simulation = await simulateContractCall(contractPayload, userWalletAddress as `0x${string}`)
      console.log('Contract simulation result:', simulation)

      if (!simulation.success) {
        const errorMessage = `Contract simulation failed: ${simulation.error}`
        console.error(errorMessage)
        setState(prev => ({ ...prev, loading: false, error: errorMessage }))
        return
      }

      console.log('Creating escrow with validated payload:', contractPayload)

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