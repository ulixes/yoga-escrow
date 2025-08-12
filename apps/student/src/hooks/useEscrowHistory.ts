import { useEffect, useState, useMemo } from 'react'
import { createPublicClient, http, type Address } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { NETWORK, YOGA_ESCROW_CONTRACT_ADDRESS } from '../config/constants'
import { adaptEscrow } from '../adapters/escrowAdapter'

// Efficient ABI with the new wallet-specific functions
const ABI = [
  {
    type: 'function',
    name: 'getEscrowsByPayer',
    stateMutability: 'view',
    inputs: [{ name: 'payer', type: 'address' }],
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
          { name: 'payer', type: 'address' },
          { name: 'payee', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'status', type: 'uint8' },
          { name: 'createdAt', type: 'uint64' },
          { name: 'expiresAt', type: 'uint64' },
          { name: 'description', type: 'string' },
          { name: 'teacherHandles', type: 'string[3]' },
          { name: 'yogaTypes', type: 'uint8[3]' },
          {
            name: 'timeSlots',
            type: 'tuple[3]',
            components: [
              { name: 'startTime', type: 'uint64' },
              { name: 'durationMinutes', type: 'uint32' },
              { name: 'timezoneOffset', type: 'int16' },
            ],
          },
          {
            name: 'locations',
            type: 'tuple[3]',
            components: [
              { name: 'country', type: 'string' },
              { name: 'city', type: 'string' },
              { name: 'specificLocation', type: 'string' },
            ],
          },
          { name: 'selectedPayeeIndex', type: 'uint8' },
          { name: 'selectedYogaIndex', type: 'uint8' },
          { name: 'selectedTimeIndex', type: 'uint8' },
          { name: 'selectedLocationIndex', type: 'uint8' },
          { name: 'selectedHandle', type: 'string' },
        ],
      },
    ],
  },
] as const

export function useEscrowHistory(studentAddress?: Address) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<ReturnType<typeof adaptEscrow>[]>([])

  const client = useMemo(() => createPublicClient({
    chain: NETWORK === 'base' ? base : baseSepolia,
    transport: http(),
  }), [])

  useEffect(() => {
    if (!studentAddress) return
    let mounted = true
    ;(async () => {
      try {
        setLoading(true); setError(null)
        const nowSec = Math.floor(Date.now() / 1000)

        // Get all escrow IDs for this payer using the new efficient function
        const escrowIds = await client.readContract({
          address: YOGA_ESCROW_CONTRACT_ADDRESS,
          abi: ABI,
          functionName: 'getEscrowsByPayer',
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
        const results = escrowsData.map((raw, index) => 
          adaptEscrow(raw, escrowIds[index], nowSec)
        )

        if (mounted) setItems(results.sort((a,b) => b.createdAt - a.createdAt))
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Failed to fetch history')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [client, studentAddress])

  return { items, loading, error }
}
