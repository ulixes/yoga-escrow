import React from 'react'
import { GroupClassOpportunity } from './TeacherClassesList'

export interface GroupClassCardProps {
  groupClass: GroupClassOpportunity
  onAcceptGroup?: (timeSlot: number, studentIds: number[]) => void
  onViewDetails?: (timeSlot: number) => void
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
  return `${dayName} ${time}`
}

export const GroupClassCard: React.FC<GroupClassCardProps> = ({
  groupClass,
  onAcceptGroup,
  onViewDetails,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat,
  className
}) => {
  const classes = ['group-class-card', className].filter(Boolean).join(' ')
  
  const fiatAmount = ethToFiatRate ? parseFloat(groupClass.totalAmount) * ethToFiatRate : null
  const formattedFiat = fiatAmount && formatFiat 
    ? formatFiat(fiatAmount, fiatCurrency)
    : fiatAmount 
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency: fiatCurrency }).format(fiatAmount)
    : null

  const studentIds = groupClass.students.map(s => s.escrowId)

  return (
    <div className={classes}>
      <div className="group-class-card__priority">
        <span className="group-class-card__label">GROUP OPPORTUNITY</span>
      </div>
      
      <div className="group-class-card__header">
        <h3 className="group-class-card__title">
          Group Class - {formatTimeFromTimestamp(groupClass.timeSlot)}
        </h3>
      </div>

      <div className="group-class-card__details">
        <div className="group-class-card__meta">
          <span className="group-class-card__students">
            {groupClass.studentCount} student{groupClass.studentCount > 1 ? 's' : ''}
          </span>
          <span className="group-class-card__separator">•</span>
          <span className="group-class-card__amount">
            {groupClass.totalAmount} ETH total
            {formattedFiat && (
              <span className="group-class-card__fiat"> ({formattedFiat})</span>
            )}
          </span>
        </div>
        
        <div className="group-class-card__location">
          <span className="group-class-card__detail-label">Location:</span>
          <span className="group-class-card__detail-value">{groupClass.location}</span>
        </div>
      </div>

      <div className="group-class-card__actions">
        <button 
          className="group-class-card__action group-class-card__action--details"
          onClick={() => onViewDetails?.(groupClass.timeSlot)}
        >
          View Details
        </button>
        <button 
          className="group-class-card__action group-class-card__action--accept"
          onClick={() => onAcceptGroup?.(groupClass.timeSlot, studentIds)}
        >
          Accept Group Class
        </button>
      </div>
    </div>
  )
}