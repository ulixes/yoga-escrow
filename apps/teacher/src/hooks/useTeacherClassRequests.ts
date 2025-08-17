import { useState, useCallback, useEffect, useRef } from 'react'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { YOGA_ESCROW_CONTRACT_ADDRESS, NETWORK } from '../config'
import type { GroupedOpportunity, ClassOpportunity, AcceptedClass, ClassStudent } from '@yoga/ui'

// Contract ABI for reading escrows
const ESCROW_READ_ABI = [
  {
    "inputs": [],
    "name": "getTotalEscrows",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "escrowId", "type": "uint256"}],
    "name": "getEscrow",
    "outputs": [{
      "components": [
        {"internalType": "address", "name": "student", "type": "address"},
        {"internalType": "address", "name": "teacher", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"},
        {"internalType": "enum YogaClassEscrow.ClassStatus", "name": "status", "type": "uint8"},
        {"internalType": "uint64", "name": "createdAt", "type": "uint64"},
        {"internalType": "uint64", "name": "classTime", "type": "uint64"},
        {"internalType": "string", "name": "description", "type": "string"},
        {"internalType": "string", "name": "location", "type": "string"},
        {"internalType": "string", "name": "studentEmail", "type": "string"},
        {"internalType": "string[]", "name": "teacherHandles", "type": "string[]"},
        {"internalType": "uint64[3]", "name": "timeSlots", "type": "uint64[3]"},
        {"internalType": "uint8", "name": "selectedTimeIndex", "type": "uint8"},
        {"internalType": "string", "name": "selectedHandle", "type": "string"}
      ],
      "internalType": "struct YogaClassEscrow.Escrow",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256[]", "name": "escrowIds", "type": "uint256[]"}],
    "name": "getMultipleEscrows",
    "outputs": [{
      "components": [
        {"internalType": "address", "name": "student", "type": "address"},
        {"internalType": "address", "name": "teacher", "type": "address"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"},
        {"internalType": "enum YogaClassEscrow.ClassStatus", "name": "status", "type": "uint8"},
        {"internalType": "uint64", "name": "createdAt", "type": "uint64"},
        {"internalType": "uint64", "name": "classTime", "type": "uint64"},
        {"internalType": "string", "name": "description", "type": "string"},
        {"internalType": "string", "name": "location", "type": "string"},
        {"internalType": "string", "name": "studentEmail", "type": "string"},
        {"internalType": "string[]", "name": "teacherHandles", "type": "string[]"},
        {"internalType": "uint64[3]", "name": "timeSlots", "type": "uint64[3]"},
        {"internalType": "uint8", "name": "selectedTimeIndex", "type": "uint8"},
        {"internalType": "string", "name": "selectedHandle", "type": "string"}
      ],
      "internalType": "struct YogaClassEscrow.Escrow[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract status enum mapping
enum ClassStatus {
  Pending = 0,
  Accepted = 1,
  Delivered = 2,
  Cancelled = 3
}

interface RawEscrow {
  student: string
  teacher: string
  amount: bigint
  status: number
  createdAt: bigint
  classTime: bigint
  description: string
  location: string
  studentEmail: string
  teacherHandles: string[]
  timeSlots: [bigint, bigint, bigint]
  selectedTimeIndex: number
  selectedHandle: string
}

// Step 2: Transform escrows into individual class opportunities
function createClassOpportunities(escrows: RawEscrow[], teacherHandle: string): ClassOpportunity[] {
  const opportunities: ClassOpportunity[] = []
  
  escrows.forEach((escrow, escrowIndex) => {
    // Only process pending escrows where this teacher is an option
    if (escrow.status !== ClassStatus.Pending) return
    if (!escrow.teacherHandles.includes(teacherHandle)) return
    
    // Filter to future time slots only
    const now = Math.floor(Date.now() / 1000)
    escrow.timeSlots.forEach((timeSlot, timeIndex) => {
      const timestamp = Number(timeSlot)
      if (timestamp <= now) return // Skip past time slots
      
      // Create opportunity for this teacher + time combination
      opportunities.push({
        opportunityId: `${escrowIndex}-${teacherHandle}-${timeIndex}`,
        escrowId: escrowIndex,
        studentAddress: escrow.student,
        location: escrow.location,
        proposedTime: timestamp,
        timeIndex,
        payout: (Number(escrow.amount) / 1e18).toString(),
        teacherHandle,
        createdAt: Number(escrow.createdAt)
      })
    })
  })
  
  return opportunities
}

// Step 3: Group opportunities by location + time
function groupOpportunities(opportunities: ClassOpportunity[]): GroupedOpportunity[] {
  const groups = new Map<string, ClassOpportunity[]>()
  
  // Group by location-timestamp
  opportunities.forEach(opp => {
    const groupKey = `${opp.location}-${opp.proposedTime}`
    if (!groups.has(groupKey)) {
      groups.set(groupKey, [])
    }
    groups.get(groupKey)!.push(opp)
  })
  
  // Convert groups to GroupedOpportunity objects
  const groupedOpportunities: GroupedOpportunity[] = []
  
  groups.forEach((opps, groupKey) => {
    const totalPayout = opps.reduce((sum, opp) => sum + parseFloat(opp.payout), 0).toString()
    
    groupedOpportunities.push({
      groupKey,
      location: opps[0].location,
      proposedTime: opps[0].proposedTime,
      opportunities: opps,
      totalPayout,
      studentCount: opps.length,
      isGroup: opps.length > 1
    })
  })
  
  return groupedOpportunities
}

// Transform grouped classes into AcceptedClass objects with group structure
function createVirtualAcceptedClasses(acceptedClasses: AcceptedClass[]): AcceptedClass[] {
  const groups = new Map<string, AcceptedClass[]>()
  
  console.log('=== GROUPING DEBUG ===')
  console.log('Input accepted classes:', acceptedClasses.map(cls => ({
    escrowId: cls.escrowId,
    location: cls.location,
    classTime: cls.classTime,
    payout: cls.payout,
    description: cls.description
  })))

  // Group by location-classTime
  acceptedClasses.forEach(cls => {
    const groupKey = `${cls.location}-${cls.classTime}`
    if (!groups.has(groupKey)) {
      groups.set(groupKey, [])
    }
    groups.get(groupKey)!.push(cls)
  })
  
  console.log('Groups after processing:', Array.from(groups.entries()).map(([key, classes]) => ({ 
    groupKey: key, 
    count: classes.length, 
    escrowIds: classes.map(c => c.escrowId),
    totalPayout: classes.reduce((sum, c) => sum + parseFloat(c.payout), 0)
  })))
  
  // Convert groups to AcceptedClass objects with group properties
  const virtualClasses: AcceptedClass[] = []
  
  groups.forEach((classes) => {
    if (classes.length === 1) {
      // Single class - use as-is but ensure it's not marked as group
      const singleClass = { 
        ...classes[0],
        isGroup: false
      }
      virtualClasses.push(singleClass)
    } else {
      // Group class - create class with students array
      const totalPayout = classes.reduce((sum, cls) => sum + parseFloat(cls.payout), 0).toFixed(6)
      
      // Create ClassStudent objects for each student
      const students: ClassStudent[] = classes.map(cls => ({
        escrowId: cls.escrowId,
        studentAddress: cls.studentAddress,
        payout: cls.payout,
        status: cls.status as 'accepted' | 'completed' | 'cancelled' | 'awaiting_release'
      }))
      
      const groupClass: AcceptedClass = {
        escrowId: classes[0].escrowId, // Primary escrow ID for main callbacks
        studentAddress: classes[0].studentAddress, // Keep original for compatibility
        classTime: classes[0].classTime,
        location: classes[0].location,
        description: `Group yoga class booking (${classes.length} students)`,
        payout: totalPayout, // Use total payout for compatibility and display
        acceptedAt: classes[0].acceptedAt,
        status: classes[0].status,
        // Group-specific properties - CRITICAL for UI
        isGroup: true,
        students: students,
        totalStudents: classes.length,
        totalPayout: totalPayout
      }
      
      console.log('Created group class:', groupClass)
      virtualClasses.push(groupClass)
    }
  })
  
  console.log('Final virtual classes:', virtualClasses)
  return virtualClasses
}

// Step 4: Extract all classes (accepted, completed, cancelled) for teacher dashboard
function extractAcceptedClasses(escrows: RawEscrow[], teacherHandle: string): AcceptedClass[] {
  const acceptedClasses: AcceptedClass[] = []
  
  escrows.forEach((escrow, escrowIndex) => {
    // Process accepted/delivered/cancelled escrows where this teacher was selected OR involved
    const isRelevant = 
      (escrow.status === ClassStatus.Accepted && escrow.selectedHandle === teacherHandle) ||
      (escrow.status === ClassStatus.Delivered && escrow.selectedHandle === teacherHandle) ||
      (escrow.status === ClassStatus.Cancelled && (
        escrow.selectedHandle === teacherHandle || // Was selected before cancellation
        escrow.teacherHandles.includes(teacherHandle) // Was in original options
      ))
    
    if (!isRelevant) return
    
    // Map status to AcceptedClass status
    const statusMap: Record<number, 'accepted' | 'completed' | 'cancelled'> = {
      [ClassStatus.Accepted]: 'accepted' as const,
      [ClassStatus.Delivered]: 'completed' as const,
      [ClassStatus.Cancelled]: 'cancelled' as const
    }
    
    // For cancelled classes, use the selected time or first available time
    const classTime = escrow.classTime && Number(escrow.classTime) > 0 
      ? Number(escrow.classTime)
      : Number(escrow.timeSlots[escrow.selectedTimeIndex] || escrow.timeSlots[0])
    
    acceptedClasses.push({
      escrowId: escrowIndex,
      studentAddress: escrow.student,
      classTime,
      location: escrow.location,
      description: escrow.description,
      payout: (Number(escrow.amount) / 1e18).toString(),
      acceptedAt: Number(escrow.createdAt), // Use creation time as approximation
      status: statusMap[escrow.status] || 'accepted'
    })
  })
  
  return acceptedClasses
}

export interface TeacherRequestsState {
  opportunities: GroupedOpportunity[]
  upcomingClasses: AcceptedClass[] // Only accepted classes (future), transformed for groups
  classHistory: AcceptedClass[] // Completed and cancelled classes (past)
  isLoading: boolean
  error: string | null
  lastUpdated: number | null
}

export function useTeacherClassRequests(teacherHandle: string) {
  const [state, setState] = useState<TeacherRequestsState>({
    opportunities: [],
    upcomingClasses: [],
    classHistory: [],
    isLoading: false,
    error: null,
    lastUpdated: null
  })
  const hasLoadedRef = useRef(false)

  const publicClient = createPublicClient({
    chain: NETWORK === 'base' ? base : baseSepolia,
    transport: http(),
    batch: { multicall: false }
  })

  const fetchRequests = useCallback(async () => {
    if (!teacherHandle || !teacherHandle.startsWith('@') || hasLoadedRef.current) return

    hasLoadedRef.current = true
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {

      // Get total number of escrows
      const totalEscrows = await publicClient.readContract({
        address: YOGA_ESCROW_CONTRACT_ADDRESS,
        abi: ESCROW_READ_ABI,
        functionName: 'getTotalEscrows'
      }) as bigint

      const totalCount = Number(totalEscrows)
      console.log('Total escrows:', totalCount)

      if (totalCount === 0) {
        setState({
          opportunities: [],
          upcomingClasses: [],
          classHistory: [],
          isLoading: false,
          error: null,
          lastUpdated: Date.now()
        })
        return
      }

      // Create array of escrow IDs to fetch
      const escrowIds = Array.from({ length: totalCount }, (_, i) => BigInt(i))

      // Batch fetch all escrows
      const escrows = await publicClient.readContract({
        address: YOGA_ESCROW_CONTRACT_ADDRESS,
        abi: ESCROW_READ_ABI,
        functionName: 'getMultipleEscrows',
        args: [escrowIds]
      }) as RawEscrow[]

      console.log('Fetched escrows:', escrows)

      // Apply the transformation formula:
      
      // Step 1: Already done - we have relevant escrows
      
      // Step 2: Transform escrows into individual class opportunities (pending only)
      const classOpportunities = createClassOpportunities(escrows, teacherHandle)
      console.log('Created class opportunities:', classOpportunities)
      
      // Step 3: Group opportunities by location + time
      const groupedOpportunities = groupOpportunities(classOpportunities)
      console.log('Grouped opportunities:', groupedOpportunities)
      
      // Step 4: Extract all classes and separate by status/time
      const allClasses = extractAcceptedClasses(escrows, teacherHandle)
      console.log('Extracted all classes:', allClasses)
      
      // Separate upcoming (future classes regardless of payment) from history (past classes)
      const now = Math.floor(Date.now() / 1000)
      const upcomingClassesList = allClasses.filter(cls => 
        cls.classTime > now && (cls.status === 'accepted' || cls.status === 'completed')
      )
      const classHistory = allClasses.filter(cls => 
        cls.classTime <= now || cls.status === 'cancelled'
      )
      
      // Transform upcoming classes into virtual classes for UI compatibility
      const upcomingClasses = createVirtualAcceptedClasses(upcomingClassesList)
      
      console.log('Upcoming classes (individual):', upcomingClassesList)
      console.log('Upcoming classes (virtual/grouped):', upcomingClasses)
      console.log('Class history:', classHistory)

      const timestamp = Date.now()
      setState({
        opportunities: groupedOpportunities,
        upcomingClasses,
        classHistory,
        isLoading: false,
        error: null,
        lastUpdated: timestamp
      })

    } catch (error) {
      console.error('Error fetching teacher requests:', error)
      let errorMessage = 'Failed to fetch class requests'
      
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
          errorMessage = 'Too many requests. Please wait and try again later.'
        } else {
          errorMessage = error.message
        }
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
    }
  }, [teacherHandle, publicClient])

  const refreshRequests = useCallback(() => {
    hasLoadedRef.current = false
    fetchRequests()
  }, [fetchRequests])

  useEffect(() => {
    fetchRequests()
  }, [teacherHandle])

  return {
    ...state,
    refreshRequests
  }
}