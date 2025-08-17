import React, { useState, useMemo } from 'react'
import { BookingRequestCard, Escrow, ClassStatus } from './BookingRequestCard'

export type BookingFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type BookingSortOption = 'newest' | 'class-date' | 'amount'

export interface BookingsListProps {
  bookings: Escrow[]
  onCancel?: (escrowId: number) => void
  onReleasePayment?: (escrowId: number) => void
  onCreateBooking?: () => void
  fiatCurrency?: string
  ethToFiatRate?: number
  formatFiat?: (fiatAmount: number, currency: string) => string
  className?: string
  initialFilter?: BookingFilter
  initialSort?: BookingSortOption
}

function applyFilter(bookings: Escrow[], filter: BookingFilter): Escrow[] {
  if (filter === 'all') return bookings
  
  const now = Math.floor(Date.now() / 1000)
  
  return bookings.filter(booking => {
    switch (filter) {
      case 'pending':
        return booking.status === ClassStatus.Pending
      case 'confirmed':
        return booking.status === ClassStatus.Accepted || 
               (booking.status === ClassStatus.Delivered && booking.classTime && booking.classTime > now)
      case 'completed':
        return booking.status === ClassStatus.Delivered && 
               (!booking.classTime || booking.classTime <= now)
      case 'cancelled':
        return booking.status === ClassStatus.Cancelled
      default:
        return true
    }
  })
}

function applySorting(bookings: Escrow[], sort: BookingSortOption): Escrow[] {
  const sorted = [...bookings]
  
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt - a.createdAt)
    case 'class-date':
      return sorted.sort((a, b) => {
        // Sort by class time, putting items without class time at the end
        if (!a.classTime && !b.classTime) return b.createdAt - a.createdAt
        if (!a.classTime) return 1
        if (!b.classTime) return -1
        return a.classTime - b.classTime
      })
    case 'amount':
      return sorted.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
    default:
      return sorted
  }
}

function getFilterCounts(bookings: Escrow[]) {
  const counts = {
    all: bookings.length,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  }
  
  const now = Math.floor(Date.now() / 1000)
  
  bookings.forEach(booking => {
    switch (booking.status) {
      case ClassStatus.Pending:
        counts.pending++
        break
      case ClassStatus.Accepted:
        counts.confirmed++
        break
      case ClassStatus.Delivered:
        // Only count as completed if class time has passed
        if (booking.classTime && booking.classTime <= now) {
          counts.completed++
        } else {
          // Future class with early payment - count as confirmed
          counts.confirmed++
        }
        break
      case ClassStatus.Cancelled:
        counts.cancelled++
        break
    }
  })
  
  return counts
}

export const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  onCancel,
  onReleasePayment,
  onCreateBooking,
  fiatCurrency = 'USD',
  ethToFiatRate,
  formatFiat,
  className,
  initialFilter = 'all',
  initialSort = 'newest'
}) => {
  const [filter, setFilter] = useState<BookingFilter>(initialFilter)
  const [sort, setSort] = useState<BookingSortOption>(initialSort)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAndSortedBookings = useMemo(() => {
    let result = applyFilter(bookings, filter)
    
    // Apply search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(booking => 
        booking.teacherHandles.some(handle => handle.toLowerCase().includes(searchLower)) ||
        booking.location.toLowerCase().includes(searchLower) ||
        booking.description.toLowerCase().includes(searchLower) ||
        booking.selectedHandle?.toLowerCase().includes(searchLower)
      )
    }
    
    return applySorting(result, sort)
  }, [bookings, filter, sort, searchTerm])

  const counts = useMemo(() => getFilterCounts(bookings), [bookings])

  const classes = ['bookings-list', className].filter(Boolean).join(' ')

  const filters: Array<{ key: BookingFilter; label: string; count: number }> = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'confirmed', label: 'Confirmed', count: counts.confirmed },
    { key: 'completed', label: 'Completed', count: counts.completed },
    { key: 'cancelled', label: 'Cancelled', count: counts.cancelled }
  ]

  const sortOptions: Array<{ key: BookingSortOption; label: string }> = [
    { key: 'newest', label: 'Newest first' },
    { key: 'class-date', label: 'Class date' },
    { key: 'amount', label: 'Amount' }
  ]

  return (
    <div className={classes}>
      <div className="bookings-list__header">
        <h2 className="bookings-list__title">Your Class Requests</h2>
        
        <div className="bookings-list__controls">
          <div className="bookings-list__search">
            <input
              type="text"
              placeholder="Search by teacher or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bookings-list__search-input"
            />
          </div>
          
          <div className="bookings-list__sort">
            <label htmlFor="sort-select" className="bookings-list__sort-label">Sort by:</label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as BookingSortOption)}
              className="bookings-list__sort-select"
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

      <div className="bookings-list__filters">
        {filters.map(filterOption => (
          <button
            key={filterOption.key}
            className={`bookings-list__filter ${filter === filterOption.key ? 'bookings-list__filter--active' : ''}`}
            onClick={() => setFilter(filterOption.key)}
          >
            {filterOption.label} ({filterOption.count})
          </button>
        ))}
      </div>

      <div className="bookings-list__content">
        {filteredAndSortedBookings.length === 0 ? (
          <div className="bookings-list__empty">
            {bookings.length === 0 ? (
              <div className="bookings-list__empty-state">
                <h3 className="bookings-list__empty-title">No bookings yet</h3>
                <p className="bookings-list__empty-text">
                  Ready to book your first yoga class? Start by creating a booking request.
                </p>
                {onCreateBooking && (
                  <button 
                    className="bookings-list__create-button"
                    onClick={onCreateBooking}
                  >
                    Create Booking
                  </button>
                )}
              </div>
            ) : (
              <div className="bookings-list__no-results">
                <h3 className="bookings-list__no-results-title">No bookings found</h3>
                <p className="bookings-list__no-results-text">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bookings-list__grid">
            {filteredAndSortedBookings.map(booking => (
              <BookingRequestCard
                key={booking.id}
                escrow={booking}
                onCancel={onCancel}
                onReleasePayment={onReleasePayment}
                fiatCurrency={fiatCurrency}
                ethToFiatRate={ethToFiatRate}
                formatFiat={formatFiat}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}