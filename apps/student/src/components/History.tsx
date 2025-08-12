import React from 'react'
import { ClassList } from '@yoga/ui'
import { useEscrowHistory } from '../hooks/useEscrowHistory'

export function History({ studentAddress }: { studentAddress?: `0x${string}` }) {
  const { items, loading, error } = useEscrowHistory(studentAddress)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h2>My bookings</h2>
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      {!loading && !error && (
        <ClassList
          items={items}
          emptyState={<div>No bookings yet</div>}
          onAssign={(id) => { /* open assign flow */ }}
          onCancel={(id) => { /* call cancel */ }}
          onRelease={(id) => { /* call release */ }}
          onDispute={(id) => { /* call dispute */ }}
          onAutoRelease={(id) => { /* call autoRelease */ }}
          onViewDetails={(id) => { /* open details modal/page */ }}
          skin="ulyxes"
        />
      )}
    </div>
  )
}
