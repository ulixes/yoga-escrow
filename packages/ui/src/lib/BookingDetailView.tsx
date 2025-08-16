import React from 'react'
import { Escrow, ClassStatus } from './BookingRequestCard'

export interface BookingDetailViewProps {
  escrow: Escrow
  onCancel?: (escrowId: number) => void
  onReleasePayment?: (escrowId: number) => void
  onClose?: () => void
  fiatCurrency?: string
  ethToFiatRate?: number
  formatFiat?: (fiatAmount: number, currency: string) => string
  transactionHash?: string
  blockExplorerUrl?: string
  className?: string
}

function formatTimeFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function getTimelineEvents(escrow: Escrow) {
  const events = [
    {
      type: 'created',
      label: 'Request created',
      timestamp: escrow.createdAt,
      description: `Booking request submitted with ${escrow.amount} ETH`
    }
  ]

  if (escrow.status === ClassStatus.Accepted && escrow.classTime) {
    events.push({
      type: 'accepted',
      label: `Teacher ${escrow.selectedHandle} accepted`,
      timestamp: escrow.classTime - (24 * 60 * 60), // Assume accepted 1 day before class
      description: `Class scheduled for ${formatTimeFromTimestamp(escrow.classTime)}`
    })
  }

  if (escrow.status === ClassStatus.Delivered && escrow.classTime) {
    events.push({
      type: 'completed',
      label: 'Class completed',
      timestamp: escrow.classTime,
      description: `Payment released to ${escrow.selectedHandle}`
    })
  }

  if (escrow.status === ClassStatus.Cancelled) {
    events.push({
      type: 'cancelled',
      label: 'Booking cancelled',
      timestamp: escrow.createdAt + (60 * 60), // Assume cancelled 1 hour after creation
      description: `Refund processed: ${escrow.amount} ETH`
    })
  }

  return events.sort((a, b) => a.timestamp - b.timestamp)
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
    <span className={`booking-detail-status-badge booking-detail-status-badge--${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  )
}

export const BookingDetailView: React.FC<BookingDetailViewProps> = ({
  escrow,
  onCancel,
  onReleasePayment,
  onClose,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat,
  transactionHash,
  blockExplorerUrl,
  className
}) => {
  const classes = ['booking-detail-view', className].filter(Boolean).join(' ')
  
  const fiatAmount = ethToFiatRate ? parseFloat(escrow.amount) * ethToFiatRate : null
  const formattedFiat = fiatAmount && formatFiat 
    ? formatFiat(fiatAmount, fiatCurrency)
    : fiatAmount 
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency: fiatCurrency }).format(fiatAmount)
    : null

  const timelineEvents = getTimelineEvents(escrow)

  return (
    <div className={classes}>
      <div className="booking-detail-view__header">
        <div className="booking-detail-view__header-content">
          <h2 className="booking-detail-view__title">{escrow.description}</h2>
          <StatusBadge status={escrow.status} />
        </div>
        {onClose && (
          <button 
            className="booking-detail-view__close"
            onClick={onClose}
            aria-label="Close details"
          >
            ×
          </button>
        )}
      </div>

      <div className="booking-detail-view__content">
        <div className="booking-detail-view__main">
          <section className="booking-detail-view__section">
            <h3 className="booking-detail-view__section-title">Payment Details</h3>
            <div className="booking-detail-view__payment">
              <div className="booking-detail-view__amount">
                <span className="booking-detail-view__amount-eth">{escrow.amount} ETH</span>
                {formattedFiat && (
                  <span className="booking-detail-view__amount-fiat">({formattedFiat})</span>
                )}
              </div>
              {transactionHash && blockExplorerUrl && (
                <a 
                  href={`${blockExplorerUrl}/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="booking-detail-view__tx-link"
                >
                  View transaction ↗
                </a>
              )}
            </div>
          </section>

          <section className="booking-detail-view__section">
            <h3 className="booking-detail-view__section-title">Class Details</h3>
            <div className="booking-detail-view__details">
              <div className="booking-detail-view__detail-row">
                <span className="booking-detail-view__detail-label">Location:</span>
                <span className="booking-detail-view__detail-value">{escrow.location}</span>
              </div>
              <div className="booking-detail-view__detail-row">
                <span className="booking-detail-view__detail-label">Student email:</span>
                <span className="booking-detail-view__detail-value">{escrow.studentEmail}</span>
              </div>
            </div>
          </section>

          <section className="booking-detail-view__section">
            <h3 className="booking-detail-view__section-title">Teacher Options</h3>
            <div className="booking-detail-view__teacher-options">
              {escrow.teacherHandles.map((handle, index) => (
                <div 
                  key={index} 
                  className={`booking-detail-view__teacher-option ${
                    escrow.selectedHandle === handle ? 'booking-detail-view__teacher-option--selected' : 
                    escrow.selectedHandle && escrow.selectedHandle !== handle ? 'booking-detail-view__teacher-option--not-selected' : ''
                  }`}
                >
                  <span className="booking-detail-view__teacher-handle">{handle}</span>
                  {escrow.selectedHandle === handle && (
                    <span className="booking-detail-view__teacher-badge">Selected</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="booking-detail-view__section">
            <h3 className="booking-detail-view__section-title">Time Options</h3>
            <div className="booking-detail-view__time-options">
              {escrow.timeSlots.map((timestamp, index) => (
                <div 
                  key={index} 
                  className={`booking-detail-view__time-option ${
                    escrow.selectedTimeIndex === index ? 'booking-detail-view__time-option--selected' : 
                    escrow.selectedTimeIndex !== undefined && escrow.selectedTimeIndex !== index ? 'booking-detail-view__time-option--not-selected' : ''
                  }`}
                >
                  <span className="booking-detail-view__time-text">
                    {formatTimeFromTimestamp(timestamp)}
                  </span>
                  {escrow.selectedTimeIndex === index && (
                    <span className="booking-detail-view__time-badge">Selected</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="booking-detail-view__section">
            <h3 className="booking-detail-view__section-title">Timeline</h3>
            <div className="booking-detail-view__timeline">
              {timelineEvents.map((event, index) => (
                <div key={index} className="booking-detail-view__timeline-item">
                  <div className="booking-detail-view__timeline-marker"></div>
                  <div className="booking-detail-view__timeline-content">
                    <div className="booking-detail-view__timeline-title">{event.label}</div>
                    <div className="booking-detail-view__timeline-time">
                      {formatTimeFromTimestamp(event.timestamp)}
                    </div>
                    <div className="booking-detail-view__timeline-description">
                      {event.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="booking-detail-view__actions">
          {escrow.status === ClassStatus.Pending && (
            <button 
              className="booking-detail-view__action booking-detail-view__action--cancel"
              onClick={() => onCancel?.(escrow.id)}
            >
              Cancel Request
            </button>
          )}

          {escrow.status === ClassStatus.Accepted && (
            <>
              <button 
                className="booking-detail-view__action booking-detail-view__action--release"
                onClick={() => onReleasePayment?.(escrow.id)}
              >
                Release Payment
              </button>
              <button 
                className="booking-detail-view__action booking-detail-view__action--cancel"
                onClick={() => onCancel?.(escrow.id)}
              >
                Cancel Booking
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}