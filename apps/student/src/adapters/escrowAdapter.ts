import { formatEther } from 'viem'
import type { StudentEscrow } from '@yoga/ui'

const NOT_SELECTED = 255
const statusMap = ['Created', 'Assigned', 'Completed', 'Cancelled', 'Disputed'] as const

export function adaptEscrow(raw: any, id: bigint, nowSec: number): StudentEscrow {
  const status = statusMap[Number(raw.status)]
  const selected = {
    payeeIndex: raw.selectedPayeeIndex !== NOT_SELECTED ? (raw.selectedPayeeIndex as 0 | 1 | 2) : undefined,
    yogaIndex: raw.selectedYogaIndex !== NOT_SELECTED ? (raw.selectedYogaIndex as 0 | 1 | 2) : undefined,
    timeIndex: raw.selectedTimeIndex !== NOT_SELECTED ? (raw.selectedTimeIndex as 0 | 1 | 2) : undefined,
    locationIndex: raw.selectedLocationIndex !== NOT_SELECTED ? (raw.selectedLocationIndex as 0 | 1 | 2) : undefined,
    handle: raw.selectedHandle?.length ? raw.selectedHandle : undefined,
  }

  const expiresAt = Number(raw.expiresAt)
  const isExpired = expiresAt <= nowSec
  const amountWei = BigInt(raw.amount)

  // Map yoga type enum indices to names if names not returned
  let yogaTypes = (raw as any).yogaTypesNames
  if (!yogaTypes || yogaTypes.length !== 3) {
    const yogaNames = ['Vinyasa', 'Yin', 'Hatha', 'Ashtanga', 'Restorative', 'Iyengar', 'Kundalini', 'Power'] as const
    yogaTypes = ((raw.yogaTypes as number[]) || []).map((i) => yogaNames[i]) as any
  }

  return {
    id,
    payer: raw.payer,
    payee: raw.payee !== '0x0000000000000000000000000000000000000000' ? raw.payee : undefined,
    amountWei,
    amountEth: formatEther(amountWei),
    status,
    createdAt: Number(raw.createdAt),
    expiresAt,
    description: raw.description,
    teacherHandles: raw.teacherHandles as [string, string, string],
    yogaTypes: yogaTypes as any,
    timeSlots: raw.timeSlots,
    locations: raw.locations,
    selected,
    isExpired,
    timeToExpireMs: Math.max(0, (expiresAt - nowSec) * 1000),
    canAssign: status === 'Created',
    canCancel: status === 'Created',
    canRelease: status === 'Assigned',
    canDispute: status === 'Assigned',
    canTriggerAutoRelease: status === 'Assigned' && isExpired,
  }
}
