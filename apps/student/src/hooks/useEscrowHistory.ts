import { useEffect, useState, useMemo } from 'react'
import { createPublicClient, http, type Address } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { NETWORK, YOGA_ESCROW_CONTRACT_ADDRESS } from '../config/constants'
import { adaptEscrow } from '../adapters/escrowAdapter'

const ABI = [
  {
    type: 'event',
    name: 'EscrowCreated',
    inputs: [
      { indexed: false, name: 'escrowId', type: 'uint256' },
      { indexed: false, name: 'payer', type: 'address' },
      { indexed: false, name: 'amount', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getEscrow',
    stateMutability: 'view',
    inputs: [{ name: 'escrowId', type: 'uint256' }],
    outputs: [
      {
        type: 'tuple',
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

        const logs = await client.getLogs({
          address: YOGA_ESCROW_CONTRACT_ADDRESS,
          abi: ABI as any,
          eventName: 'EscrowCreated',
          fromBlock: 'earliest',
          toBlock: 'latest',
          args: { payer: studentAddress },
        } as any)

        const ids = (logs as any[]).map((l) => (l as any).args.escrowId as bigint)

        const results = await Promise.all(ids.map(async (id) => {
          const raw = await client.readContract({
            address: YOGA_ESCROW_CONTRACT_ADDRESS,
            abi: ABI,
            functionName: 'getEscrow',
            args: [id],
          })
          return adaptEscrow(raw as any, id, nowSec)
        }))

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
