import React, { useMemo } from 'react'

export type EscrowStatus = 'Created' | 'Assigned' | 'Completed' | 'Cancelled' | 'Disputed'

export interface TimeSlot {
  startTime: number
  durationMinutes: number
  timezoneOffset: number
}

export interface Location {
  country: string
  city: string
  specificLocation: string
}

export interface StudentEscrow {
  id: bigint
  payer: `0x${string}`
  payee?: `0x${string}`
  amountWei: bigint
  status: EscrowStatus
  createdAt: number
  expiresAt: number
  description?: string

  teacherHandles: [string, string, string]
  yogaTypes: [
    'Vinyasa' | 'Yin' | 'Hatha' | 'Ashtanga' | 'Restorative' | 'Iyengar' | 'Kundalini' | 'Power',
    'Vinyasa' | 'Yin' | 'Hatha' | 'Ashtanga' | 'Restorative' | 'Iyengar' | 'Kundalini' | 'Power',
    'Vinyasa' | 'Yin' | 'Hatha' | 'Ashtanga' | 'Restorative' | 'Iyengar' | 'Kundalini' | 'Power'
  ]
  timeSlots: [TimeSlot, TimeSlot, TimeSlot]
  locations: [Location, Location, Location]

  selected: {
    payeeIndex?: 0 | 1 | 2
    yogaIndex?: 0 | 1 | 2
    timeIndex?: 0 | 1 | 2
    locationIndex?: 0 | 1 | 2
    handle?: string
  }

  amountEth: string
  isExpired: boolean
  timeToExpireMs: number
  canAssign: boolean
  canCancel: boolean
  canRelease: boolean
  canDispute: boolean
  canTriggerAutoRelease: boolean
}

export interface ClassItemProps {
  escrow: StudentEscrow
  onAssign?: (escrowId: bigint) => void
  onCancel?: (escrowId: bigint) => void
  onRelease?: (escrowId: bigint) => void
  onDispute?: (escrowId: bigint) => void
  onAutoRelease?: (escrowId: bigint) => void
  onViewDetails?: (escrowId: bigint) => void
  skin?: 'ulyxes' | 'default'
  showActions?: boolean
  fiatCurrency?: string
  ethToFiatRate?: number
  formatFiat?: (fiatAmount: number, currency: string) => string
}

function formatUtcOffset(minutes: number): string {
  const sign = minutes >= 0 ? '+' : '-'
  const abs = Math.abs(minutes)
  const hh = Math.floor(abs / 60).toString().padStart(2, '0')
  const mm = (abs % 60).toString().padStart(2, '0')
  return `UTC${sign}${hh}:${mm}`
}

function formatTimeSlot(slot: TimeSlot): string {
  // Convert BigInt to number if needed
  const timestamp = typeof slot.startTime === 'bigint' 
    ? Number(slot.startTime) 
    : slot.startTime
  const d = new Date(timestamp * 1000)
  const datePart = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })
  const timePart = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  const tz = formatUtcOffset(slot.timezoneOffset)
  return `${datePart} · ${timePart} (${tz})`
}

function formatLocation(loc: Location): string {
  const pieces = [loc.city, loc.specificLocation].filter(Boolean)
  return pieces.join(' · ')
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Expired'
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function StatusBadge({ status }: { status: EscrowStatus }) {
  return <span className={`yui-badge yui-badge--${status.toLowerCase()}`}>{status}</span>
}

export function ClassItem({ escrow, onAssign, onCancel, onRelease, onDispute, onAutoRelease, onViewDetails, skin = 'ulyxes', showActions = true, fiatCurrency = 'USD', ethToFiatRate, formatFiat }: ClassItemProps) {
  const title = useMemo(() => {
    if (escrow.status === 'Assigned' && escrow.selected.yogaIndex !== undefined) {
      const idx = escrow.selected.yogaIndex
      return escrow.yogaTypes[idx]
    }
    return escrow.description?.trim() || 'Yoga class'
  }, [escrow])

  const teacherLine = useMemo(() => {
    if (escrow.status === 'Assigned' || escrow.status === 'Completed' || escrow.status === 'Disputed') {
      const handle = escrow.selected.handle || escrow.teacherHandles[escrow.selected.payeeIndex ?? 0]
      return handle ? `Teacher: ${handle}` : undefined
    }
    return `Pick from: ${escrow.teacherHandles.join(', ')}`
  }, [escrow])

  const timeLine = useMemo(() => {
    if (escrow.selected.timeIndex !== undefined) {
      return formatTimeSlot(escrow.timeSlots[escrow.selected.timeIndex])
    }
    return escrow.timeSlots.map(formatTimeSlot).join(' • ')
  }, [escrow])

  const locationLine = useMemo(() => {
    if (escrow.selected.locationIndex !== undefined) {
      return formatLocation(escrow.locations[escrow.selected.locationIndex])
    }
    return escrow.locations.map(formatLocation).join(' • ')
  }, [escrow])

  const expiresLine = useMemo(() => {
    const label = escrow.isExpired ? 'Expired' : `Expires in ${formatCountdown(escrow.timeToExpireMs)}`
    return label
  }, [escrow])

  const rootDataSkin = skin

  return (
    <div className="yui-class-item" data-skin={rootDataSkin}>
      <div className="yui-class-item__left">
        <div className="yui-class-item__status"><StatusBadge status={escrow.status} /></div>
        <div className="yui-class-item__meta">
          <div className="yui-class-item__title">{title}</div>
          <div className="yui-class-item__sub">
            <span className="yui-class-item__amount">{escrow.amountEth} ETH</span>
            {typeof ethToFiatRate === 'number' && !Number.isNaN(ethToFiatRate) ? (
              <>
                <span className="yui-dot-sep" />
                <span className="yui-class-item__fiat">
                  {(() => {
                    const eth = Number.parseFloat(escrow.amountEth)
                    const fiat = eth * ethToFiatRate
                    if (formatFiat) return formatFiat(fiat, fiatCurrency)
                    try {
                      return new Intl.NumberFormat(undefined, { style: 'currency', currency: fiatCurrency }).format(fiat)
                    } catch {
                      return `${fiatCurrency} ${fiat.toFixed(2)}`
                    }
                  })()}
                </span>
              </>
            ) : null}
            {teacherLine && <span className="yui-dot-sep" />}
            {teacherLine && <span>{teacherLine}</span>}
          </div>
          <div className="yui-class-item__details">
            <span className="yui-class-item__time">{timeLine}</span>
          </div>
          <div className="yui-class-item__details">
            <span className="yui-class-item__location">{locationLine}</span>
          </div>
          {(escrow.status === 'Assigned' || escrow.status === 'Created') && (
            <div className={`yui-class-item__expires ${escrow.isExpired ? 'is-expired' : ''}`}>{expiresLine}</div>
          )}
        </div>
      </div>

      {showActions && (
        <div className="yui-class-item__actions">
          {escrow.status === 'Created' && (
            <>
              <button className="yui-btn yui-btn--primary" onClick={() => onAssign?.(escrow.id)}>Assign teacher</button>
              <button className="yui-btn yui-btn--ghost" onClick={() => onCancel?.(escrow.id)}>Cancel</button>
            </>
          )}

          {escrow.status === 'Assigned' && (
            <>
              <button className="yui-btn yui-btn--primary" onClick={() => onRelease?.(escrow.id)}>Release</button>
              <button className="yui-btn yui-btn--ghost" onClick={() => onDispute?.(escrow.id)}>Dispute</button>
              {escrow.canTriggerAutoRelease && (
                <button className="yui-btn yui-btn--link" onClick={() => onAutoRelease?.(escrow.id)}>Auto-release</button>
              )}
            </>
          )}

          {(escrow.status === 'Completed' || escrow.status === 'Cancelled' || escrow.status === 'Disputed') && (
            <button className="yui-btn yui-btn--link" onClick={() => onViewDetails?.(escrow.id)}>View details</button>
          )}
        </div>
      )}
    </div>
  )
}
