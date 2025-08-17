import React, { useState } from 'react'
import { AcceptedClass, ClassStudent } from './types'

export interface UpcomingClassCardProps {
  acceptedClass: AcceptedClass
  onCancel?: (escrowId: number) => void
  onViewStudentDetails?: (escrowId: number) => void
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
  if (address.includes(' student')) {
    return address // Already formatted for group display
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function getStatusDisplay(status: string): string {
  switch (status) {
    case 'accepted': return 'Accepted'
    case 'completed': return 'Paid'
    case 'cancelled': return 'Cancelled'
    case 'awaiting_release': return 'Awaiting Release'
    default: return status.charAt(0).toUpperCase() + status.slice(1)
  }
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'completed': return 'upcoming-class-card__student-status--completed'
    case 'cancelled': return 'upcoming-class-card__student-status--cancelled'
    case 'awaiting_release': return 'upcoming-class-card__student-status--awaiting'
    default: return 'upcoming-class-card__student-status--accepted'
  }
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
  onCancel,
  onViewStudentDetails,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat,
  className
}) => {
  const [isRosterExpanded, setIsRosterExpanded] = useState(false)
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
  
  const isGroup = acceptedClass.isGroup && acceptedClass.students && acceptedClass.students.length > 1
  const displayPayout = isGroup ? acceptedClass.totalPayout || acceptedClass.payout : acceptedClass.payout
  const displayStudentInfo = isGroup ? 
    `${acceptedClass.totalStudents || acceptedClass.students?.length || 0} Students` : 
    formatStudentAddress(acceptedClass.studentAddress)
  
  // Override status for future classes - show as PAID instead of COMPLETED if payment released early
  const displayStatus = acceptedClass.status === 'completed' && !isPastDue ? 'paid' : acceptedClass.status

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
          <span className={`upcoming-class-card__status-badge upcoming-class-card__status-badge--${displayStatus}`}>
            {displayStatus.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="upcoming-class-card__details">
        <div className="upcoming-class-card__detail-row">
          <span className="upcoming-class-card__detail-label">{isGroup ? 'Students:' : 'Student:'}</span>
          <span className="upcoming-class-card__detail-value">
            {displayStudentInfo}
          </span>
        </div>
        
        <div className="upcoming-class-card__detail-row">
          <span className="upcoming-class-card__detail-label">Location:</span>
          <span className="upcoming-class-card__detail-value">
            {acceptedClass.location}
          </span>
        </div>
        
        <div className="upcoming-class-card__detail-row">
          <span className="upcoming-class-card__detail-label">{isGroup ? 'Total Payout:' : 'Payout:'}</span>
          <span className="upcoming-class-card__detail-value upcoming-class-card__payout">
            {displayPayout} ETH
            {formatFiatAmount(parseFloat(displayPayout)) && (
              <span className="upcoming-class-card__fiat">
                ({formatFiatAmount(parseFloat(displayPayout))})
              </span>
            )}
          </span>
        </div>
        
        {!isGroup && (
          <div className="upcoming-class-card__detail-row">
            <span className="upcoming-class-card__detail-label">Escrow ID:</span>
            <span className="upcoming-class-card__detail-value upcoming-class-card__escrow-id">
              #{acceptedClass.escrowId}
            </span>
          </div>
        )}
        
        {isGroup && (
          <div className="upcoming-class-card__detail-row">
            <button 
              className="upcoming-class-card__roster-toggle"
              onClick={() => setIsRosterExpanded(!isRosterExpanded)}
            >
              {isRosterExpanded ? 'Hide Roster ▲' : 'View Roster ▼'}
            </button>
          </div>
        )}
      </div>

      {isGroup && isRosterExpanded && acceptedClass.students && (
        <div className="upcoming-class-card__roster">
          <div className="upcoming-class-card__roster-header">
            <h4>Roster</h4>
          </div>
          <div className="upcoming-class-card__roster-list">
            {acceptedClass.students.map((student, index) => (
              <div key={student.escrowId} className="upcoming-class-card__student-row">
                <div className="upcoming-class-card__student-info">
                  <span className="upcoming-class-card__student-label">
                    Student {String.fromCharCode(65 + index)} ({formatStudentAddress(student.studentAddress)})
                  </span>
                  <span className="upcoming-class-card__student-payout">
                    {student.payout} ETH
                  </span>
                </div>
                <div className="upcoming-class-card__student-actions">
                  <span className={`upcoming-class-card__student-status ${getStatusClass(student.status)}`}>
                    {getStatusDisplay(student.status)}
                  </span>
                  <button 
                    className="upcoming-class-card__student-details"
                    onClick={() => onViewStudentDetails?.(student.escrowId)}
                    title={`View details for Escrow #${student.escrowId}`}
                  >
                    #{student.escrowId}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {acceptedClass.status === 'accepted' && !isPastDue && (
        <div className="upcoming-class-card__actions">
          <button 
            className="upcoming-class-card__action upcoming-class-card__action--cancel"
            onClick={() => onCancel?.(acceptedClass.escrowId)}
          >
            Cancel Class
          </button>
        </div>
      )}
    </div>
  )
}