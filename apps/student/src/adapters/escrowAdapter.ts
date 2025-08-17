import { formatEther } from 'viem'
import { ClassStatus } from '@yoga/ui'
import type { Escrow } from '../types'

const NOT_SELECTED = 255
const statusMap: ClassStatus[] = [0, 1, 2, 3] // Pending, Accepted, Delivered, Cancelled

export function adaptEscrow(raw: any, id: bigint, nowSec: number): Escrow {
  const status = statusMap[Number(raw.status)]
  const amountWei = BigInt(raw.amount)
  const amount = formatEther(amountWei)
  
  // Convert time slots from bigint to number (Unix timestamps)
  const timeSlots = raw.timeSlots ? raw.timeSlots.map((slot: bigint) => Number(slot)) : []
  
  // Get selected options (only available when status is Accepted/Delivered)
  const selectedTimeIndex = raw.selectedTimeIndex !== NOT_SELECTED ? raw.selectedTimeIndex : undefined
  const selectedHandle = raw.selectedHandle?.length ? raw.selectedHandle : undefined
  const teacher = raw.teacher !== '0x0000000000000000000000000000000000000000' ? raw.teacher : undefined

  return {
    id: Number(id),
    student: raw.student,
    teacher,
    amount,
    status,
    createdAt: Number(raw.createdAt),
    classTime: raw.classTime > 0 ? Number(raw.classTime) : undefined,
    description: raw.description,
    location: raw.location,
    studentEmail: raw.studentEmail,
    teacherHandles: raw.teacherHandles || [],
    timeSlots,
    selectedTimeIndex,
    selectedHandle
  }
}
