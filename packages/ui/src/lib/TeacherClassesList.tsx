import React, { useState, useMemo } from 'react'
import { GroupedOpportunity, AcceptedClass } from './types'
import { OpportunityDetailsModal } from './OpportunityDetailsModal'
import { UpcomingClassCard } from './UpcomingClassCard'

export type TeacherFilter = 'all' | 'high-value' | 'group-classes'
export type TeacherSortOption = 'newest' | 'amount' | 'earliest-class'

export interface TeacherClassesListProps {
  opportunities: GroupedOpportunity[]
  upcomingClasses?: AcceptedClass[]
  classHistory?: AcceptedClass[]
  teacherHandle: string
  onAcceptOpportunity?: (opportunityId: string, escrowId: number, timeIndex: number) => void
  onAcceptGroup?: (groupKey: string) => void
  onViewDetails?: (opportunity: GroupedOpportunity) => void
  onViewClassDetails?: (escrowId: number) => void
  onCancelClass?: (escrowId: number) => void
  fiatCurrency?: string
  ethToFiatRate?: number
  formatFiat?: (fiatAmount: number, currency: string) => string
  className?: string
  initialFilter?: TeacherFilter
  initialSort?: TeacherSortOption
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

export const TeacherClassesList: React.FC<TeacherClassesListProps> = ({
  opportunities = [],
  upcomingClasses = [],
  classHistory = [],
  teacherHandle,
  onAcceptOpportunity,
  onAcceptGroup,
  onViewDetails,
  onViewClassDetails,
  onCancelClass,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat,
  className,
  initialFilter = 'all',
  initialSort = 'newest'
}) => {
  const [filter, setFilter] = useState<TeacherFilter>(initialFilter)
  const [sort, setSort] = useState<TeacherSortOption>(initialSort)
  const [selectedOpportunity, setSelectedOpportunity] = useState<GroupedOpportunity | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleViewDetails = (opportunity: GroupedOpportunity) => {
    setSelectedOpportunity(opportunity)
    setIsDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setIsDetailsOpen(false)
    setSelectedOpportunity(null)
  }

  const filteredAndSorted = useMemo(() => {
    // Ensure opportunities is always an array
    const safeOpportunities = Array.isArray(opportunities) ? opportunities : []
    let filtered = safeOpportunities

    // Apply filters
    if (filter === 'high-value') {
      filtered = safeOpportunities.filter(opp => parseFloat(opp.totalPayout) >= 0.005)
    } else if (filter === 'group-classes') {
      filtered = safeOpportunities.filter(opp => opp.isGroup)
    }

    // Apply sorting
    const sorted = [...filtered]
    if (sort === 'amount') {
      return sorted.sort((a, b) => parseFloat(b.totalPayout) - parseFloat(a.totalPayout))
    } else if (sort === 'earliest-class') {
      return sorted.sort((a, b) => a.proposedTime - b.proposedTime)
    } else {
      // newest - sort by creation time of first opportunity
      return sorted.sort((a, b) => {
        const aCreated = Math.min(...a.opportunities.map(o => o.createdAt))
        const bCreated = Math.min(...b.opportunities.map(o => o.createdAt))
        return bCreated - aCreated
      })
    }
  }, [opportunities, filter, sort])

  const counts = useMemo(() => {
    const safeOpportunities = Array.isArray(opportunities) ? opportunities : []
    return {
      all: safeOpportunities.length,
      'high-value': safeOpportunities.filter(opp => parseFloat(opp.totalPayout) >= 0.005).length,
      'group-classes': safeOpportunities.filter(opp => opp.isGroup).length
    }
  }, [opportunities])

  const totalPayout = useMemo(() => {
    return filteredAndSorted.reduce((sum, opp) => sum + parseFloat(opp.totalPayout), 0).toFixed(4)
  }, [filteredAndSorted])

  // Sort upcoming classes by classTime (soonest first)
  const sortedUpcomingClasses = useMemo(() => {
    const safeUpcomingClasses = Array.isArray(upcomingClasses) ? upcomingClasses : []
    return safeUpcomingClasses
      .filter(cls => cls.status === 'accepted') // Only show accepted classes
      .sort((a, b) => a.classTime - b.classTime) // Sort by classTime ascending
  }, [upcomingClasses])

  const classes = ['teacher-classes-list', className].filter(Boolean).join(' ')

  const filters: Array<{ key: TeacherFilter; label: string; count: number }> = [
    { key: 'all', label: 'All Opportunities', count: counts.all },
    { key: 'high-value', label: 'High Value (≥0.005 ETH)', count: counts['high-value'] },
    { key: 'group-classes', label: 'Group Classes', count: counts['group-classes'] }
  ]

  const sortOptions: Array<{ key: TeacherSortOption; label: string }> = [
    { key: 'newest', label: 'Newest First' },
    { key: 'amount', label: 'Highest Payout' },
    { key: 'earliest-class', label: 'Earliest Time' }
  ]

  const formatFiatAmount = (ethAmount: number) => {
    if (!ethToFiatRate) return null
    const fiatAmount = ethAmount * ethToFiatRate
    return formatFiat 
      ? formatFiat(fiatAmount, fiatCurrency)
      : new Intl.NumberFormat(undefined, { style: 'currency', currency: fiatCurrency }).format(fiatAmount)
  }

  return (
    <div className={classes}>
      <div className="teacher-classes-list__header">
        <div className="teacher-classes-list__title-section">
          <h1 className="teacher-classes-list__title">Teacher Dashboard - {teacherHandle}</h1>
          <div className="teacher-classes-list__summary">
            <span className="teacher-classes-list__count">
              {filteredAndSorted.length} opportunit{filteredAndSorted.length !== 1 ? 'ies' : 'y'}
            </span>
            {filteredAndSorted.length > 0 && (
              <span className="teacher-classes-list__total">
                Total Potential: {totalPayout} ETH
                {ethToFiatRate && (
                  <span className="teacher-classes-list__total-fiat">
                    ({formatFiatAmount(parseFloat(totalPayout))})
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
        
        <div className="teacher-classes-list__controls">
          <div className="teacher-classes-list__sort">
            <label htmlFor="teacher-sort-select" className="teacher-classes-list__sort-label">Sort:</label>
            <select
              id="teacher-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as TeacherSortOption)}
              className="teacher-classes-list__sort-select"
            >
              {sortOptions.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="teacher-classes-list__filters">
        {filters.map(filterOption => (
          <button
            key={filterOption.key}
            className={`teacher-classes-list__filter ${filter === filterOption.key ? 'teacher-classes-list__filter--active' : ''}`}
            onClick={() => setFilter(filterOption.key)}
          >
            {filterOption.label} ({filterOption.count})
          </button>
        ))}
      </div>

      {/* Upcoming Classes Section */}
      {sortedUpcomingClasses.length > 0 && (
        <div className="teacher-classes-list__upcoming-section">
          <h2 className="teacher-classes-list__section-title">
            Upcoming Classes ({sortedUpcomingClasses.length})
          </h2>
          <div className="teacher-classes-list__upcoming-grid">
            {sortedUpcomingClasses.map(acceptedClass => (
              <UpcomingClassCard
                key={acceptedClass.escrowId}
                acceptedClass={acceptedClass}
                onViewDetails={onViewClassDetails}
                onCancel={onCancelClass}
                fiatCurrency={fiatCurrency}
                ethToFiatRate={ethToFiatRate}
                formatFiat={formatFiat}
              />
            ))}
          </div>
        </div>
      )}

      {/* Class History Section */}
      {classHistory.length > 0 && (
        <div className="teacher-classes-list__history-section">
          <h2 className="teacher-classes-list__section-title">
            Class History ({classHistory.length})
          </h2>
          <div className="teacher-classes-list__history-grid">
            {classHistory
              .sort((a, b) => b.classTime - a.classTime) // Most recent first
              .map(historyClass => (
                <div key={historyClass.escrowId} className="teacher-history-card">
                  <div className="teacher-history-card__header">
                    <div className={`teacher-history-card__status teacher-history-card__status--${historyClass.status}`}>
                      {historyClass.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </div>
                    <div className="teacher-history-card__date">
                      {formatTimeFromTimestamp(historyClass.classTime)}
                    </div>
                  </div>
                  
                  <div className="teacher-history-card__details">
                    <div className="teacher-history-card__location">
                      {historyClass.location}
                    </div>
                    <div className="teacher-history-card__description">
                      {historyClass.description}
                    </div>
                    <div className="teacher-history-card__payout">
                      {historyClass.payout} ETH
                      {formatFiatAmount(parseFloat(historyClass.payout)) && (
                        <span className="teacher-history-card__fiat"> ({formatFiatAmount(parseFloat(historyClass.payout))})</span>
                      )}
                    </div>
                  </div>

                  <div className="teacher-history-card__actions">
                    <button 
                      className="teacher-history-card__action"
                      onClick={() => onViewClassDetails?.(historyClass.escrowId)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="teacher-classes-list__opportunities-section">
        <h2 className="teacher-classes-list__section-title">
          New Opportunities ({filteredAndSorted.length})
        </h2>
        <div className="teacher-classes-list__content">
          {filteredAndSorted.length === 0 ? (
          <div className="teacher-classes-list__empty">
            {opportunities.length === 0 ? (
              <div className="teacher-classes-list__empty-state">
                <h3 className="teacher-classes-list__empty-title">No class opportunities yet</h3>
                <p className="teacher-classes-list__empty-text">
                  When students create escrows with your handle <strong>{teacherHandle}</strong>, opportunities will appear here.
                </p>
              </div>
            ) : (
              <div className="teacher-classes-list__no-results">
                <h3 className="teacher-classes-list__no-results-title">No opportunities match your filters</h3>
                <p className="teacher-classes-list__no-results-text">
                  Try adjusting your filter settings.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="teacher-classes-list__grid">
            {filteredAndSorted.map(opportunity => (
              <div key={opportunity.groupKey} className="teacher-opportunity-card">
                <div className="teacher-opportunity-card__header">
                  {opportunity.isGroup && (
                    <div className="teacher-opportunity-card__group-badge">
                      GROUP OPPORTUNITY
                    </div>
                  )}
                  <h3 className="teacher-opportunity-card__title">
                    {opportunity.isGroup ? 'Group Class' : 'Private Class'} - {formatTimeFromTimestamp(opportunity.proposedTime)}
                  </h3>
                </div>

                <div className="teacher-opportunity-card__details">
                  <div className="teacher-opportunity-card__meta">
                    <span className="teacher-opportunity-card__students">
                      {opportunity.studentCount} student{opportunity.studentCount > 1 ? 's' : ''}
                    </span>
                    <span className="teacher-opportunity-card__separator">•</span>
                    <span className="teacher-opportunity-card__payout">
                      {opportunity.totalPayout} ETH
                      {formatFiatAmount(parseFloat(opportunity.totalPayout)) && (
                        <span className="teacher-opportunity-card__fiat"> ({formatFiatAmount(parseFloat(opportunity.totalPayout))})</span>
                      )}
                    </span>
                  </div>
                  
                  <div className="teacher-opportunity-card__location">
                    <span className="teacher-opportunity-card__detail-label">Location:</span>
                    <span className="teacher-opportunity-card__detail-value">{opportunity.location}</span>
                  </div>
                </div>

                <div className="teacher-opportunity-card__actions">
                  <button 
                    className="teacher-opportunity-card__action teacher-opportunity-card__action--details"
                    onClick={() => handleViewDetails(opportunity)}
                  >
                    View Details
                  </button>
                  
                  {opportunity.isGroup ? (
                    <button 
                      className="teacher-opportunity-card__action teacher-opportunity-card__action--accept"
                      onClick={() => onAcceptGroup?.(opportunity.groupKey)}
                    >
                      Accept Group ({opportunity.studentCount})
                    </button>
                  ) : (
                    <button 
                      className="teacher-opportunity-card__action teacher-opportunity-card__action--accept"
                      onClick={() => {
                        const firstOpp = opportunity.opportunities[0]
                        onAcceptOpportunity?.(firstOpp.opportunityId, firstOpp.escrowId, firstOpp.timeIndex)
                      }}
                    >
                      Accept Class
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      <OpportunityDetailsModal
        opportunity={selectedOpportunity}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onAcceptOpportunity={onAcceptOpportunity}
        onAcceptGroup={onAcceptGroup}
        fiatCurrency={fiatCurrency}
        ethToFiatRate={ethToFiatRate}
        formatFiat={formatFiat}
      />
    </div>
  )
}