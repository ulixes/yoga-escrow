// Core escrow data structure from the blockchain
export interface Escrow {
  escrowId: number
  student: string // Student address
  teacherHandles: string[]
  timeSlots: number[] // Unix timestamps
  location: string
  amount: string // ETH amount as string
  status?: 'active' | 'accepted' | 'completed' | 'cancelled'
  createdAt: number
}

// Individual class opportunity generated from an escrow
export interface ClassOpportunity {
  opportunityId: string // Format: "escrowId-teacherHandle-timeIndex"
  escrowId: number
  studentAddress: string
  location: string
  proposedTime: number // Unix timestamp
  timeIndex: number // Index needed for acceptClass function
  payout: string // ETH amount as string
  teacherHandle: string
  createdAt: number
}

// Grouped opportunities by location and time
export interface GroupedOpportunity {
  groupKey: string // Format: "location-timestamp"
  location: string
  proposedTime: number
  opportunities: ClassOpportunity[]
  totalPayout: string
  studentCount: number
  isGroup: boolean // true if more than one student
}

// Accepted/confirmed class for teacher's schedule
export interface AcceptedClass {
  escrowId: number
  studentAddress: string
  classTime: number // Confirmed timestamp
  location: string
  description: string
  payout: string // ETH amount
  acceptedAt: number // When teacher accepted
  status: 'accepted' | 'completed' | 'cancelled'
}

// UI display models
export interface TeacherDashboardData {
  upcomingClasses: AcceptedClass[] // Teacher's confirmed schedule
  opportunities: GroupedOpportunity[] // Pending opportunities
  totalOpportunities: number
  totalPotentialPayout: string
}