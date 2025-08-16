import React from 'react'

export type TeacherClassStatus = 'pending' | 'accepted' | 'completed' | 'cancelled'

export interface TeacherClassRequest {
  id: number
  teacherHandle: string
  studentCount: number
  totalAmount: string
  location: string
  time: number // Single timestamp
  description: string
  createdAt: number
  status: TeacherClassStatus
  acceptedAt?: number // When teacher accepted
  studentEmail?: string // Student contact
}

export interface TeacherClassCardProps {
  classRequest: TeacherClassRequest
  onAccept?: (classId: number) => void
  onIgnore?: (classId: number) => void
  fiatCurrency?: string
  ethToFiatRate?: number
  formatFiat?: (fiatAmount: number, currency: string) => string
  className?: string
}

function formatTimeFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
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
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }
  return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
}

export const TeacherClassCard: React.FC<TeacherClassCardProps> = ({
  classRequest,
  onAccept,
  onIgnore,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat,
  className
}) => {
  const classes = ['teacher-class-card', className].filter(Boolean).join(' ')
  
  const fiatAmount = ethToFiatRate ? parseFloat(classRequest.totalAmount) * ethToFiatRate : null
  const formattedFiat = fiatAmount && formatFiat 
    ? formatFiat(fiatAmount, fiatCurrency)
    : fiatAmount 
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency: fiatCurrency }).format(fiatAmount)
    : null

  return (
    <div className={classes}>
      <div className="teacher-class-card__header">
        <h3 className="teacher-class-card__title">{classRequest.description}</h3>
        <div className="teacher-class-card__header-right">
          {classRequest.status === 'accepted' && (
            <span className="teacher-class-card__status">Accepted</span>
          )}
          <span className="teacher-class-card__elapsed">
            {classRequest.status === 'accepted' && classRequest.acceptedAt 
              ? `Accepted ${formatElapsedTime(classRequest.acceptedAt)}`
              : formatElapsedTime(classRequest.createdAt)
            }
          </span>
        </div>
      </div>

      <div className="teacher-class-card__details">
        <div className="teacher-class-card__detail-row">
          <div className="teacher-class-card__detail-item">
            <span className="teacher-class-card__detail-label">People:</span>
            <span className="teacher-class-card__detail-value">{classRequest.studentCount}</span>
          </div>
          
          <div className="teacher-class-card__detail-item">
            <span className="teacher-class-card__detail-label">Amount:</span>
            <div className="teacher-class-card__amount">
              <span className="teacher-class-card__amount-eth">{classRequest.totalAmount} ETH</span>
              {formattedFiat && (
                <span className="teacher-class-card__amount-fiat">({formattedFiat})</span>
              )}
            </div>
          </div>
        </div>

        <div className="teacher-class-card__location">
          <span className="teacher-class-card__detail-label">Location:</span>
          <span className="teacher-class-card__detail-value">{classRequest.location}</span>
        </div>

        <div className="teacher-class-card__time">
          <span className="teacher-class-card__detail-label">Time:</span>
          <span className="teacher-class-card__detail-value">{formatTimeFromTimestamp(classRequest.time)}</span>
        </div>
      </div>

      {classRequest.status === 'pending' && (
        <div className="teacher-class-card__actions">
          <button 
            className="teacher-class-card__action teacher-class-card__action--accept"
            onClick={() => onAccept?.(classRequest.id)}
          >
            Accept
          </button>
          <button 
            className="teacher-class-card__action teacher-class-card__action--ignore"
            onClick={() => onIgnore?.(classRequest.id)}
          >
            Ignore
          </button>
        </div>
      )}
    </div>
  )
}