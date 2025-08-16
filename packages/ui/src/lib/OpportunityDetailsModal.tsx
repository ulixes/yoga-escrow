import React from 'react'
import { GroupedOpportunity, ClassOpportunity } from './types'

export interface OpportunityDetailsModalProps {
  opportunity: GroupedOpportunity | null
  isOpen: boolean
  onClose: () => void
  onAcceptOpportunity?: (opportunityId: string, escrowId: number, timeIndex: number) => void
  onAcceptGroup?: (groupKey: string) => void
  fiatCurrency?: string
  ethToFiatRate?: number
  formatFiat?: (fiatAmount: number, currency: string) => string
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

export const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onAcceptOpportunity,
  onAcceptGroup,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat
}) => {
  if (!isOpen || !opportunity) return null

  const formatFiatAmount = (ethAmount: number) => {
    if (!ethToFiatRate) return null
    const fiatAmount = ethAmount * ethToFiatRate
    return formatFiat 
      ? formatFiat(fiatAmount, fiatCurrency)
      : new Intl.NumberFormat(undefined, { style: 'currency', currency: fiatCurrency }).format(fiatAmount)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="opportunity-details-modal__backdrop" onClick={handleBackdropClick}>
      <div className="opportunity-details-modal">
        <div className="opportunity-details-modal__header">
          <div className="opportunity-details-modal__title-section">
            {opportunity.isGroup && (
              <div className="opportunity-details-modal__group-badge">
                GROUP OPPORTUNITY
              </div>
            )}
            <h2 className="opportunity-details-modal__title">
              {opportunity.isGroup ? 'Group Class Details' : 'Class Details'}
            </h2>
            <p className="opportunity-details-modal__subtitle">
              {formatTimeFromTimestamp(opportunity.proposedTime)}
            </p>
          </div>
          <button 
            className="opportunity-details-modal__close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="opportunity-details-modal__content">
          <div className="opportunity-details-modal__overview">
            <div className="opportunity-details-modal__overview-item">
              <span className="opportunity-details-modal__label">Location:</span>
              <span className="opportunity-details-modal__value">{opportunity.location}</span>
            </div>
            <div className="opportunity-details-modal__overview-item">
              <span className="opportunity-details-modal__label">Students:</span>
              <span className="opportunity-details-modal__value">{opportunity.studentCount}</span>
            </div>
            <div className="opportunity-details-modal__overview-item">
              <span className="opportunity-details-modal__label">Total Payout:</span>
              <span className="opportunity-details-modal__value">
                {opportunity.totalPayout} ETH
                {formatFiatAmount(parseFloat(opportunity.totalPayout)) && (
                  <span className="opportunity-details-modal__fiat">
                    ({formatFiatAmount(parseFloat(opportunity.totalPayout))})
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="opportunity-details-modal__students">
            <h3 className="opportunity-details-modal__section-title">
              {opportunity.isGroup ? 'Students in Group' : 'Student Details'}
            </h3>
            
            <div className="opportunity-details-modal__student-list">
              {opportunity.opportunities.map((opp, index) => (
                <div key={opp.opportunityId} className="opportunity-details-modal__student-card">
                  <div className="opportunity-details-modal__student-header">
                    <h4 className="opportunity-details-modal__student-title">
                      Student {index + 1}
                    </h4>
                    <div className="opportunity-details-modal__student-address">
                      {formatStudentAddress(opp.studentAddress)}
                    </div>
                  </div>
                  
                  <div className="opportunity-details-modal__student-details">
                    <div className="opportunity-details-modal__student-detail">
                      <span className="opportunity-details-modal__detail-label">Payout:</span>
                      <span className="opportunity-details-modal__detail-value">
                        {opp.payout} ETH
                        {formatFiatAmount(parseFloat(opp.payout)) && (
                          <span className="opportunity-details-modal__detail-fiat">
                            ({formatFiatAmount(parseFloat(opp.payout))})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="opportunity-details-modal__student-detail">
                      <span className="opportunity-details-modal__detail-label">Escrow ID:</span>
                      <span className="opportunity-details-modal__detail-value">#{opp.escrowId}</span>
                    </div>
                    <div className="opportunity-details-modal__student-detail">
                      <span className="opportunity-details-modal__detail-label">Time Slot:</span>
                      <span className="opportunity-details-modal__detail-value">Index {opp.timeIndex}</span>
                    </div>
                  </div>

                  {!opportunity.isGroup && (
                    <div className="opportunity-details-modal__student-actions">
                      <button 
                        className="opportunity-details-modal__action opportunity-details-modal__action--accept"
                        onClick={() => onAcceptOpportunity?.(opp.opportunityId, opp.escrowId, opp.timeIndex)}
                      >
                        Accept This Class
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="opportunity-details-modal__footer">
          <button 
            className="opportunity-details-modal__action opportunity-details-modal__action--secondary"
            onClick={onClose}
          >
            Close
          </button>
          
          {opportunity.isGroup && (
            <button 
              className="opportunity-details-modal__action opportunity-details-modal__action--accept"
              onClick={() => onAcceptGroup?.(opportunity.groupKey)}
            >
              Accept All Students ({opportunity.studentCount})
            </button>
          )}
        </div>
      </div>
    </div>
  )
}