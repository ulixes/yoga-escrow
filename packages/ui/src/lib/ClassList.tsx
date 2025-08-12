import React from 'react'
import type { ClassItemProps, StudentEscrow } from './ClassItem'
import { ClassItem } from './ClassItem'

export interface ClassListProps extends Pick<ClassItemProps, 'onAssign' | 'onCancel' | 'onRelease' | 'onDispute' | 'onAutoRelease' | 'onViewDetails' | 'skin' | 'showActions' | 'fiatCurrency' | 'ethToFiatRate' | 'formatFiat'> {
  items: StudentEscrow[]
  emptyState?: React.ReactNode
}

export function ClassList({ items, emptyState, skin = 'ulyxes', showActions = true, ...handlers }: ClassListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="yui-class-list" data-skin={skin}>
        {emptyState ?? <div className="yui-empty">No bookings yet</div>}
      </div>
    )
  }

  return (
    <div className="yui-class-list" data-skin={skin}>
      {items.map(escrow => (
        <div key={escrow.id.toString()} className="yui-class-list__item">
          <ClassItem escrow={escrow} skin={skin} showActions={showActions} {...handlers} />
        </div>
      ))}
    </div>
  )
}
