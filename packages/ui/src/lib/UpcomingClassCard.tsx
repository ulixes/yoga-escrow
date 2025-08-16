import React from 'react'
import { AcceptedClass } from './types'

export interface UpcomingClassCardProps {
  acceptedClass: AcceptedClass
  onViewDetails?: (escrowId: number) => void
  onCancel?: (escrowId: number) => void
  fiatCurrency?: string
  ethToFiatRate?: number
  formatFiat?: (fiatAmount: number, currency: string) => string
  className?: string
}

function formatTimeFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${dayName}, ${dateStr} at ${time}`
}

function formatStudentAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function getTimeUntilClass(classTime: number): string {
  const now = Date.now() / 1000
  const timeDiff = classTime - now
  
  if (timeDiff < 0) return 'Past due'
  
  const days = Math.floor(timeDiff / 86400)
  const hours = Math.floor((timeDiff % 86400) / 3600)
  const minutes = Math.floor((timeDiff % 3600) / 60)
  
  if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`
  if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`
  if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`
  return 'very soon'
}

export const UpcomingClassCard: React.FC<UpcomingClassCardProps> = ({
  acceptedClass,
  onViewDetails,
  onCancel,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat,
  className
}) => {
  const classes = ['upcoming-class-card', className].filter(Boolean).join(' ')
  
  const formatFiatAmount = (ethAmount: number) => {
    if (!ethToFiatRate) return null
    const fiatAmount = ethAmount * ethToFiatRate
    return formatFiat 
      ? formatFiat(fiatAmount, fiatCurrency)
      : new Intl.NumberFormat(undefined, { style: 'currency', currency: fiatCurrency }).format(fiatAmount)
  }

  const timeUntil = getTimeUntilClass(acceptedClass.classTime)
  const isPastDue = timeUntil === 'Past due'

  return (
    <div className={`${classes} ${isPastDue ? 'upcoming-class-card--past-due' : ''}`}>
      <div className="upcoming-class-card__header">
        <div className="upcoming-class-card__title-section">
          <h3 className="upcoming-class-card__title">
            {acceptedClass.description}
          </h3>
          <div className="upcoming-class-card__time-info">
            <span className="upcoming-class-card__datetime">
              {formatTimeFromTimestamp(acceptedClass.classTime)}
            </span>
            <span className={`upcoming-class-card__countdown ${isPastDue ? 'upcoming-class-card__countdown--past-due' : ''}`}>
              {timeUntil}
            </span>
          </div>
        </div>
        
        <div className="upcoming-class-card__status">
          <span className={`upcoming-class-card__status-badge upcoming-class-card__status-badge--${acceptedClass.status}`}>
            {acceptedClass.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="upcoming-class-card__details">
        <div className="upcoming-class-card__detail-row">
          <span className="upcoming-class-card__detail-label">Student:</span>
          <span className="upcoming-class-card__detail-value">
            {formatStudentAddress(acceptedClass.studentAddress)}
          </span>
        </div>
        
        <div className="upcoming-class-card__detail-row">
          <span className="upcoming-class-card__detail-label">Location:</span>
          <span className="upcoming-class-card__detail-value">
            {acceptedClass.location}
          </span>
        </div>
        
        <div className="upcoming-class-card__detail-row">
          <span className="upcoming-class-card__detail-label">Payout:</span>
          <span className="upcoming-class-card__detail-value upcoming-class-card__payout">
            {acceptedClass.payout} ETH
            {formatFiatAmount(parseFloat(acceptedClass.payout)) && (
              <span className="upcoming-class-card__fiat">
                ({formatFiatAmount(parseFloat(acceptedClass.payout))})
              </span>
            )}
          </span>
        </div>
        
        <div className="upcoming-class-card__detail-row">
          <span className="upcoming-class-card__detail-label">Escrow ID:</span>
          <span className="upcoming-class-card__detail-value upcoming-class-card__escrow-id">
            #{acceptedClass.escrowId}
          </span>
        </div>
      </div>

      <div className="upcoming-class-card__actions">
        <button 
          className="upcoming-class-card__action upcoming-class-card__action--details"
          onClick={() => onViewDetails?.(acceptedClass.escrowId)}
        >
          View Details
        </button>
        
        {acceptedClass.status === 'accepted' && !isPastDue && (
          <button 
            className="upcoming-class-card__action upcoming-class-card__action--cancel"
            onClick={() => onCancel?.(acceptedClass.escrowId)}
          >
            Cancel Class
          </button>
        )}
      </div>
    </div>
  )
}