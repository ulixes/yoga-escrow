import React from 'react'
import { BookingsList } from '@yoga/ui'
import { useEscrowHistory } from '../hooks/useEscrowHistory'
import { useETHPrice } from '../hooks/useETHPrice'
import { useSendTransaction } from '@privy-io/react-auth'
import { encodeFunctionData, parseEther } from 'viem'
import { YOGA_ESCROW_CONTRACT_ADDRESS, CHAIN_ID } from '../config'

// Contract ABI for student actions
const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "escrowId", "type": "uint256"}],
    "name": "cancelClass",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "escrowId", "type": "uint256"}],
    "name": "releasePayment", 
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export function History({ studentAddress }: { studentAddress?: `0x${string}` }) {
  const { items, loading, error, refreshData } = useEscrowHistory(studentAddress)
  const { usdPrice: ethPrice } = useETHPrice()
  const { sendTransaction } = useSendTransaction()

  const handleCancel = async (escrowId: number) => {
    try {
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'cancelClass',
        args: [BigInt(escrowId)]
      })

      const txRequest = {
        to: YOGA_ESCROW_CONTRACT_ADDRESS as `0x${string}`,
        data,
        value: parseEther('0'),
        chainId: CHAIN_ID
      }

      const tx = await sendTransaction(txRequest)
      console.log('Class cancelled successfully, tx hash:', tx.hash)
      
      // Refresh immediately and again after a short delay
      refreshData()
      setTimeout(() => refreshData(), 1000)
    } catch (error) {
      console.error('Failed to cancel class:', error)
      throw error
    }
  }

  const handleReleasePayment = async (escrowId: number) => {
    try {
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'releasePayment',
        args: [BigInt(escrowId)]
      })

      const txRequest = {
        to: YOGA_ESCROW_CONTRACT_ADDRESS as `0x${string}`,
        data,
        value: parseEther('0'),
        chainId: CHAIN_ID
      }

      const tx = await sendTransaction(txRequest)
      console.log('Payment released successfully, tx hash:', tx.hash)
      
      // Refresh immediately and again after a short delay
      refreshData()
      setTimeout(() => refreshData(), 1000)
    } catch (error) {
      console.error('Failed to release payment:', error)
      throw error
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h2>My Bookings</h2>
      {loading && <div>Loading your bookings…</div>}
      {error && <div style={{ color: 'crimson' }}>Error loading bookings: {error}</div>}
      {!loading && !error && (
        <BookingsList
          bookings={items}
          ethToFiatRate={ethPrice}
          onCancel={handleCancel}
          onReleasePayment={handleReleasePayment}
        />
      )}
    </div>
  )
}
