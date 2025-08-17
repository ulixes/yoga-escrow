// Re-export Escrow type from BookingRequestCard for student app
export interface Escrow {
  id: number
  student: string
  teacher?: string
  amount: string
  status: number // ClassStatus enum value
  createdAt: number
  classTime?: number
  description: string
  location: string
  studentEmail: string
  teacherHandles: string[]
  timeSlots: number[]
  selectedTimeIndex?: number
  selectedHandle?: string
}