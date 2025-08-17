import { useState, useCallback } from 'react'
import { useSendTransaction, useWallets, usePrivy } from '@privy-io/react-auth'
import { encodeFunctionData } from 'viem'
import { YOGA_ESCROW_CONTRACT_ADDRESS, CHAIN_ID } from '../config'

// Contract ABI for teacher actions
const TEACHER_ACTION_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "escrowId", "type": "uint256"},
      {"internalType": "string", "name": "teacherHandle", "type": "string"},
      {"internalType": "uint8", "name": "timeIndex", "type": "uint8"}
    ],
    "name": "acceptClass",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256[]", "name": "escrowIds", "type": "uint256[]"},
      {"internalType": "string", "name": "teacherHandle", "type": "string"},
      {"internalType": "uint8", "name": "timeIndex", "type": "uint8"}
    ],
    "name": "batchAcceptClass",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "escrowId", "type": "uint256"}],
    "name": "teacherRelease",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export interface TeacherActionState {
  isLoading: boolean
  error: string | null
  txHash: string | null
}

export function useTeacherActions() {
  const { sendTransaction } = useSendTransaction()
  const { wallets } = useWallets()
  const { createWallet } = usePrivy()
  
  const [actionState, setActionState] = useState<TeacherActionState>({
    isLoading: false,
    error: null,
    txHash: null
  })

  const acceptClass = useCallback(async (args: {
    escrowId: number
    teacherHandle: string
    timeIndex: number // 0, 1, or 2 for which time slot to select
  }) => {
    try {
      setActionState({
        isLoading: true,
        error: null,
        txHash: null
      })

      console.log('Accepting class with args:', args)
      console.log('Available wallets:', wallets)

      // Check for embedded wallet or create one
      let embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
      
      if (!embeddedWallet) {
        console.log('No embedded wallet found, creating one...')
        try {
          const newWallet = await createWallet()
          console.log('Created embedded wallet:', newWallet)
          // Wait for the wallet to be connected and appear in the wallets list
          await new Promise(resolve => setTimeout(resolve, 1000))
          embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
          if (!embeddedWallet) {
            throw new Error('Created wallet not found in wallets list')
          }
        } catch (error) {
          console.error('Failed to create embedded wallet:', error)
          throw new Error('Failed to create embedded wallet. Please try logging out and back in.')
        }
      }

      // Validate time index
      if (args.timeIndex < 0 || args.timeIndex > 2) {
        throw new Error('Time index must be 0, 1, or 2')
      }

      // Encode the contract call
      const data = encodeFunctionData({
        abi: TEACHER_ACTION_ABI,
        functionName: 'acceptClass',
        args: [
          BigInt(args.escrowId),
          args.teacherHandle,
          args.timeIndex
        ]
      })

      // Send transaction
      const tx = await sendTransaction({
        to: YOGA_ESCROW_CONTRACT_ADDRESS,
        data,
        chainId: CHAIN_ID
      })

      console.log('Accept class transaction sent:', tx)

      setActionState({
        isLoading: false,
        error: null,
        txHash: tx.hash
      })

      return tx

    } catch (error) {
      console.error('Error accepting class:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to accept class'
      
      setActionState({
        isLoading: false,
        error: errorMessage,
        txHash: null
      })
      
      throw error
    }
  }, [sendTransaction])

  const releasePayment = useCallback(async (escrowId: number) => {
    try {
      setActionState({
        isLoading: true,
        error: null,
        txHash: null
      })

      console.log('Releasing payment for escrow:', escrowId)

      // Encode the contract call
      const data = encodeFunctionData({
        abi: TEACHER_ACTION_ABI,
        functionName: 'teacherRelease',
        args: [BigInt(escrowId)]
      })

      // Send transaction
      const tx = await sendTransaction({
        to: YOGA_ESCROW_CONTRACT_ADDRESS,
        data,
        chainId: CHAIN_ID
      })

      console.log('Release payment transaction sent:', tx)

      setActionState({
        isLoading: false,
        error: null,
        txHash: tx.hash
      })

      return tx

    } catch (error) {
      console.error('Error releasing payment:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to release payment'
      
      setActionState({
        isLoading: false,
        error: errorMessage,
        txHash: null
      })
      
      throw error
    }
  }, [sendTransaction])

  const batchAcceptClass = useCallback(async (args: {
    escrowIds: number[]
    teacherHandle: string
    timeIndex: number // 0, 1, or 2 for which time slot to select
  }) => {
    try {
      setActionState({
        isLoading: true,
        error: null,
        txHash: null
      })

      console.log('Batch accepting classes with args:', args)
      console.log('Available wallets:', wallets)

      // Check for embedded wallet or create one
      let embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
      
      if (!embeddedWallet) {
        console.log('No embedded wallet found, creating one...')
        try {
          const newWallet = await createWallet()
          console.log('Created embedded wallet:', newWallet)
          // Wait for the wallet to be connected and appear in the wallets list
          await new Promise(resolve => setTimeout(resolve, 1000))
          embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
          if (!embeddedWallet) {
            throw new Error('Created wallet not found in wallets list')
          }
        } catch (error) {
          console.error('Failed to create embedded wallet:', error)
          throw new Error('Failed to create embedded wallet. Please try logging out and back in.')
        }
      }

      // Validate inputs
      if (args.escrowIds.length === 0) {
        throw new Error('No escrow IDs provided')
      }
      if (args.escrowIds.length > 20) {
        throw new Error('Too many escrow IDs (max 20)')
      }
      if (args.timeIndex < 0 || args.timeIndex > 2) {
        throw new Error('Time index must be 0, 1, or 2')
      }

      // Encode the contract call
      const data = encodeFunctionData({
        abi: TEACHER_ACTION_ABI,
        functionName: 'batchAcceptClass',
        args: [
          args.escrowIds.map(id => BigInt(id)),
          args.teacherHandle,
          args.timeIndex
        ]
      })

      // Send transaction
      const tx = await sendTransaction({
        to: YOGA_ESCROW_CONTRACT_ADDRESS,
        data,
        chainId: CHAIN_ID
      })

      console.log('Batch accept class transaction sent:', tx)

      setActionState({
        isLoading: false,
        error: null,
        txHash: tx.hash
      })

      return tx

    } catch (error) {
      console.error('Error batch accepting classes:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to batch accept classes'
      
      setActionState({
        isLoading: false,
        error: errorMessage,
        txHash: null
      })
      
      throw error
    }
  }, [sendTransaction, wallets, createWallet])

  const resetActionState = useCallback(() => {
    setActionState({
      isLoading: false,
      error: null,
      txHash: null
    })
  }, [])

  return {
    acceptClass,
    batchAcceptClass,
    releasePayment,
    actionState,
    resetActionState
  }
}