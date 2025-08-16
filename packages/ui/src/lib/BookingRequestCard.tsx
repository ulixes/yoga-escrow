import React from 'react'

export enum ClassStatus {
  Pending = 0,
  Accepted = 1,
  Delivered = 2,
  Cancelled = 3
}

export interface Escrow {
  id: number
  student: string
  teacher?: string
  amount: string
  status: ClassStatus
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

export interface BookingRequestCardProps {
  escrow: Escrow
  onCancel?: (escrowId: number) => void
  onReleasePayment?: (escrowId: number) => void
  onViewDetails?: (escrowId: number) => void
  fiatCurrency?: string
  ethToFiatRate?: number
  formatFiat?: (fiatAmount: number, currency: string) => string
  className?: string
}

function formatTimeFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function formatElapsedTime(createdAt: number): string {
  const now = Date.now()
  const created = createdAt * 1000
  const diffMs = now - created
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 0) {
    return `Posted ${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }
  return `Posted ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
}

function formatCountdownToClass(classTime: number): string {
  const now = Date.now()
  const classMs = classTime * 1000
  const diffMs = classMs - now
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (diffMs <= 0) return 'Class time passed'
  if (diffDays > 0) {
    return `Class in ${diffDays} day${diffDays > 1 ? 's' : ''}`
  }
  if (diffHours > 0) {
    return `Class in ${diffHours} hour${diffHours > 1 ? 's' : ''}`
  }
  return 'Class starting soon'
}

function StatusBadge({ status }: { status: ClassStatus }) {
  const statusMap = {
    [ClassStatus.Pending]: { label: 'Waiting for Teacher', color: 'orange' },
    [ClassStatus.Accepted]: { label: 'Class Confirmed', color: 'green' },
    [ClassStatus.Delivered]: { label: 'Completed', color: 'blue' },
    [ClassStatus.Cancelled]: { label: 'Cancelled', color: 'gray' }
  }
  
  const statusInfo = statusMap[status]
  
  return (
    <span className={`booking-status-badge booking-status-badge--${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  )
}

export const BookingRequestCard: React.FC<BookingRequestCardProps> = ({
  escrow,
  onCancel,
  onReleasePayment,
  onViewDetails,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat,
  className
}) => {
  const classes = ['booking-request-card', className].filter(Boolean).join(' ')
  
  const fiatAmount = ethToFiatRate ? parseFloat(escrow.amount) * ethToFiatRate : null
  const formattedFiat = fiatAmount && formatFiat 
    ? formatFiat(fiatAmount, fiatCurrency)
    : fiatAmount 
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency: fiatCurrency }).format(fiatAmount)
    : null

  return (
    <div className={classes}>
      <div className="booking-request-card__header">
        <StatusBadge status={escrow.status} />
        <div className="booking-request-card__amount">
          {escrow.amount} ETH
          {formattedFiat && <span className="booking-request-card__fiat">({formattedFiat})</span>}
        </div>
      </div>

      <div className="booking-request-card__content">
        <div className="booking-request-card__title">{escrow.description}</div>
        <div className="booking-request-card__location">{escrow.location}</div>

        {escrow.status === ClassStatus.Pending && (
          <div className="booking-request-card__pending">
            <div className="booking-request-card__teachers">
              <span className="booking-request-card__label">Teachers:</span>
              <div className="booking-request-card__teacher-chips">
                {(escrow.teacherHandles || []).map((handle, index) => (
                  <span key={index} className="booking-request-card__teacher-chip">
                    {handle}
                  </span>
                ))}
              </div>
            </div>
            <div className="booking-request-card__times">
              <span className="booking-request-card__label">Time options:</span>
              <div className="booking-request-card__time-list">
                {(escrow.timeSlots || []).map((timestamp, index) => (
                  <div key={index} className="booking-request-card__time-option">
                    {formatTimeFromTimestamp(timestamp)}
                  </div>
                ))}
              </div>
            </div>
            <div className="booking-request-card__elapsed">
              {formatElapsedTime(escrow.createdAt)}
            </div>
          </div>
        )}

        {escrow.status === ClassStatus.Accepted && (
          <div className="booking-request-card__accepted">
            <div className="booking-request-card__confirmed-teacher">
              <span className="booking-request-card__label">Teacher:</span>
              <span className="booking-request-card__teacher-name">{escrow.selectedHandle}</span>
            </div>
            <div className="booking-request-card__confirmed-time">
              <span className="booking-request-card__label">Time:</span>
              <span className="booking-request-card__time">
                {escrow.classTime && formatTimeFromTimestamp(escrow.classTime)}
              </span>
            </div>
            {escrow.classTime && (
              <div className="booking-request-card__countdown">
                {formatCountdownToClass(escrow.classTime)}
              </div>
            )}
          </div>
        )}

        {escrow.status === ClassStatus.Delivered && (
          <div className="booking-request-card__delivered">
            <div className="booking-request-card__payment-info">
              Payment released to {escrow.selectedHandle}
            </div>
            <div className="booking-request-card__completed-info">
              Class completed on {escrow.classTime && formatTimeFromTimestamp(escrow.classTime)}
            </div>
          </div>
        )}

        {escrow.status === ClassStatus.Cancelled && (
          <div className="booking-request-card__cancelled">
            <div className="booking-request-card__refund-info">
              Refund processed: {escrow.amount} ETH
            </div>
          </div>
        )}
      </div>

      <div className="booking-request-card__actions">
        {escrow.status === ClassStatus.Pending && (
          <button 
            className="booking-request-card__action booking-request-card__action--cancel"
            onClick={() => onCancel?.(escrow.id)}
          >
            Cancel Request
          </button>
        )}

        {escrow.status === ClassStatus.Accepted && (
          <>
            <button 
              className="booking-request-card__action booking-request-card__action--release"
              onClick={() => onReleasePayment?.(escrow.id)}
            >
              Release Payment
            </button>
            <button 
              className="booking-request-card__action booking-request-card__action--cancel"
              onClick={() => onCancel?.(escrow.id)}
            >
              Cancel
            </button>
          </>
        )}


        <button 
          className="booking-request-card__action booking-request-card__action--details"
          onClick={() => onViewDetails?.(escrow.id)}
        >
          View Details
        </button>
      </div>
    </div>
  )
}