import React from 'react'
import { IndividualRequest } from './TeacherClassesList'

export interface IndividualRequestCardProps {
  request: IndividualRequest
  onAccept?: (classId: number) => void
  onViewDetails?: (classId: number) => void
  fiatCurrency?: string
  ethToFiatRate?: number
  formatFiat?: (fiatAmount: number, currency: string) => string
  className?: string
}

function formatTimeFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  return `${dayName} ${time}`
}

function formatElapsedTime(createdAt: number): string {
  const now = Date.now()
  const created = createdAt * 1000
  const diffMs = now - created
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 0) {
    return `${diffDays}d ago`
  }
  return `${diffHours}h ago`
}

export const IndividualRequestCard: React.FC<IndividualRequestCardProps> = ({
  request,
  onAccept,
  onViewDetails,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat,
  className
}) => {
  const classes = ['individual-request-card', className].filter(Boolean).join(' ')
  
  const fiatAmount = ethToFiatRate ? parseFloat(request.amount) * ethToFiatRate : null
  const formattedFiat = fiatAmount && formatFiat 
    ? formatFiat(fiatAmount, fiatCurrency)
    : fiatAmount 
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency: fiatCurrency }).format(fiatAmount)
    : null

  // Get first name from email
  const firstName = request.studentEmail.split('@')[0].split('.')[0]
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  const timeOptions = request.availableTimes
    .map(time => formatTimeFromTimestamp(time))
    .join(', ')

  return (
    <div className={classes}>
      <div className="individual-request-card__header">
        <div className="individual-request-card__student">
          <span className="individual-request-card__name">{displayName}</span>
          <span className="individual-request-card__separator">•</span>
          <span className="individual-request-card__times-label">
            Multiple times available
          </span>
          <span className="individual-request-card__separator">•</span>
          <span className="individual-request-card__amount">
            {request.amount} ETH
            {formattedFiat && (
              <span className="individual-request-card__fiat"> ({formattedFiat})</span>
            )}
          </span>
        </div>
        <span className="individual-request-card__elapsed">
          {formatElapsedTime(request.createdAt)}
        </span>
      </div>

      <div className="individual-request-card__details">
        <div className="individual-request-card__times">
          <span className="individual-request-card__times-label">Times:</span>
          <span className="individual-request-card__times-list">{timeOptions}</span>
        </div>
        
        <div className="individual-request-card__location">
          <span className="individual-request-card__location-label">Location:</span>
          <span className="individual-request-card__location-value">{request.location}</span>
        </div>
      </div>

      <div className="individual-request-card__actions">
        <button 
          className="individual-request-card__action individual-request-card__action--details"
          onClick={() => onViewDetails?.(request.escrowId)}
        >
          View Details
        </button>
        <button 
          className="individual-request-card__action individual-request-card__action--accept"
          onClick={() => onAccept?.(request.escrowId)}
        >
          Accept Class
        </button>
      </div>
    </div>
  )
}