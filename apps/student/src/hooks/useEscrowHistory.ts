import { useEffect, useState, useMemo } from 'react'
import { createPublicClient, http, type Address } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { NETWORK, YOGA_ESCROW_CONTRACT_ADDRESS } from '../config'
import { adaptEscrow } from '../adapters/escrowAdapter'

// Updated ABI for new YogaClassEscrow contract
const ABI = [
  {
    type: 'function',
    name: 'getEscrowsByStudent',
    stateMutability: 'view',
    inputs: [{ name: 'student', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
  {
    type: 'function',
    name: 'getMultipleEscrows',
    stateMutability: 'view',
    inputs: [{ name: 'escrowIds', type: 'uint256[]' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'student', type: 'address' },
          { name: 'teacher', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'status', type: 'uint8' },
          { name: 'createdAt', type: 'uint64' },
          { name: 'classTime', type: 'uint64' },
          { name: 'description', type: 'string' },
          { name: 'location', type: 'string' },
          { name: 'studentEmail', type: 'string' },
          { name: 'teacherHandles', type: 'string[]' },
          { name: 'timeSlots', type: 'uint64[3]' },
          { name: 'selectedTimeIndex', type: 'uint8' },
          { name: 'selectedHandle', type: 'string' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'canTeacherRelease',
    stateMutability: 'view',
    inputs: [{ name: 'escrowId', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

export function useEscrowHistory(studentAddress?: Address) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<ReturnType<typeof adaptEscrow>[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const client = useMemo(() => createPublicClient({
    chain: NETWORK === 'base' ? base : baseSepolia,
    transport: http(),
  }), [])

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    if (!studentAddress) return
    let mounted = true
    ;(async () => {
      try {
        setLoading(true); setError(null)
        const nowSec = Math.floor(Date.now() / 1000)

        // Get all escrow IDs for this student using the new efficient function
        const escrowIds = await client.readContract({
          address: YOGA_ESCROW_CONTRACT_ADDRESS,
          abi: ABI,
          functionName: 'getEscrowsByStudent',
          args: [studentAddress],
        }) as bigint[]

        if (escrowIds.length === 0) {
          if (mounted) setItems([])
          return
        }

        // Get full escrow details for all IDs in one call
        const escrowsData = await client.readContract({
          address: YOGA_ESCROW_CONTRACT_ADDRESS,
          abi: ABI,
          functionName: 'getMultipleEscrows',
          args: [escrowIds],
        }) as any[]

        // Adapt the escrow data to our format
        const results = escrowsData.map((raw, index) => {
          const adapted = adaptEscrow(raw, escrowIds[index], nowSec)
          console.log('Escrow data:', { id: adapted.id, status: adapted.status, raw: raw.status })
          return adapted
        })

        if (mounted) setItems(results.sort((a,b) => b.createdAt - a.createdAt))
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to fetch history')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [client, studentAddress, refreshTrigger])

  return { items, loading, error, refreshData }
}
