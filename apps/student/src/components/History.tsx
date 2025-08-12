import React from 'react'
import { MyBookings } from '@yoga/ui'
import { useEscrowHistory } from '../hooks/useEscrowHistory'
import { useYogaEscrow } from '../hooks/useYogaEscrow'
import { useETHPrice } from '../hooks/useETHPrice'

export function History({ studentAddress }: { studentAddress?: `0x${string}` }) {
  const { items, loading, error } = useEscrowHistory(studentAddress)
  const { assignPayee, releasePayment, cancelEscrow, raiseDispute, autoRelease } = useYogaEscrow()
  const { ethPrice } = useETHPrice()

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h2>My bookings</h2>
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      {!loading && !error && (
        <MyBookings
          items={items}
          skin="ulyxes"
          fiatCurrency="USD"
          ethToFiatRate={ethPrice}
          emptyState={<div className="yui-empty">No bookings yet. Start by creating your first yoga class booking!</div>}
          onAssign={async (id, teacherAddress, teacherHandle, yogaIndex, timeIndex, locationIndex) => {
            try {
              console.log('Assigning teacher:', { id, teacherAddress, teacherHandle, yogaIndex, timeIndex, locationIndex })
              await assignPayee({
                escrowId: id,
                teacherAddress,
                teacherHandle,
                yogaIndex,
                timeIndex,
                locationIndex
              })
              console.log('Teacher assigned successfully')
            } catch (error) {
              console.error('Failed to assign teacher:', error)
              alert('Failed to assign teacher. Please try again.')
            }
          }}
          onCancel={async (id) => {
            try {
              console.log('Cancelling escrow:', id)
              await cancelEscrow(id)
              console.log('Escrow cancelled successfully')
            } catch (error) {
              console.error('Failed to cancel escrow:', error)
              alert('Failed to cancel booking. Please try again.')
            }
          }}
          onRelease={async (id) => {
            try {
              console.log('Releasing payment:', id)
              await releasePayment(id)
              console.log('Payment released successfully')
            } catch (error) {
              console.error('Failed to release payment:', error)
              alert('Failed to release payment. Please try again.')
            }
          }}
          onDispute={async (id) => {
            try {
              console.log('Raising dispute:', id)
              await raiseDispute(id)
              console.log('Dispute raised successfully')
            } catch (error) {
              console.error('Failed to raise dispute:', error)
              alert('Failed to raise dispute. Please try again.')
            }
          }}
          onAutoRelease={async (id) => {
            try {
              console.log('Triggering auto-release:', id)
              await autoRelease(id)
              console.log('Auto-release triggered successfully')
            } catch (error) {
              console.error('Failed to trigger auto-release:', error)
              alert('Failed to trigger auto-release. Please try again.')
            }
          }}
          onViewDetails={(id) => {
            console.log('Viewing details for escrow:', id)
            // TODO: Implement details modal/page
            alert(`Viewing details for booking #${id.toString()}`)
          }}
        />
      )}
    </div>
  )
}
