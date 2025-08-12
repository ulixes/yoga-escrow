import React from 'react'
import { ClassList } from './ClassList'
import type { ClassItemProps, StudentEscrow, EscrowStatus } from './ClassItem'

export type MyBookingsFilter = 'all' | 'active' | 'created' | 'assigned' | 'completed' | 'cancelled' | 'disputed'

export interface MyBookingsProps extends Pick<ClassItemProps, 'onAssign' | 'onCancel' | 'onRelease' | 'onDispute' | 'onAutoRelease' | 'onViewDetails' | 'fiatCurrency' | 'ethToFiatRate' | 'formatFiat'> {
  items: StudentEscrow[]
  initialFilter?: MyBookingsFilter
  skin?: 'ulyxes' | 'default'
  className?: string
  emptyState?: React.ReactNode
}

function applyFilter(items: StudentEscrow[], filter: MyBookingsFilter): StudentEscrow[] {
  if (filter === 'all') return items
  if (filter === 'active') return items.filter((i) => i.status === 'Created' || i.status === 'Assigned')
  const mapping: Record<Exclude<MyBookingsFilter, 'all' | 'active'>, EscrowStatus> = {
    created: 'Created',
    assigned: 'Assigned',
    completed: 'Completed',
    cancelled: 'Cancelled',
    disputed: 'Disputed',
  }
  return items.filter((i) => i.status === mapping[filter as keyof typeof mapping])
}

export const MyBookings: React.FC<MyBookingsProps> = ({
  items,
  initialFilter = 'active',
  skin = 'ulyxes',
  className,
  emptyState,
  ...handlers
}) => {
  const [filter, setFilter] = React.useState<MyBookingsFilter>(initialFilter)
  const filtered = React.useMemo(() => applyFilter(items ?? [], filter), [items, filter])

  const totalActive = React.useMemo(() => items?.filter((i) => i.status === 'Created' || i.status === 'Assigned').length ?? 0, [items])

  const classes = ['yui-bookings', className].filter(Boolean).join(' ')

  const filters: Array<{ key: MyBookingsFilter; label: string; count?: number }> = [
    { key: 'active', label: 'Active', count: totalActive },
    { key: 'created', label: 'Created' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'completed', label: 'Completed' },
    { key: 'disputed', label: 'Disputed' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'all', label: 'All' },
  ]

  return (
    <section className={classes} data-skin={skin} aria-label="My bookings">
      <header className="yui-bookings__header">
        <div className="yui-bookings__title">Your bookings</div>
        <div className="yui-bookings__filters" role="tablist" aria-label="Filter bookings">
          {filters.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              className="yui-tab"
              data-active={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}{typeof f.count === 'number' ? ` (${f.count})` : ''}
            </button>
          ))}
        </div>
      </header>

      <ClassList items={filtered} skin={skin} emptyState={emptyState ?? <div className="yui-empty">No bookings</div>} {...handlers} />
    </section>
  )
}
