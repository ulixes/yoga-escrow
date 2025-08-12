import { useEffect, useState, useMemo } from 'react'
import { createPublicClient, http, parseAbi, type Address } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { NETWORK, YOGA_ESCROW_CONTRACT_ADDRESS } from '../config/constants'
import { adaptEscrow } from '../adapters/escrowAdapter'

const ABI = parseAbi([
  'event EscrowCreated(uint256 escrowId, address payer, uint256 amount, uint64 expiresAt)',
  'function getEscrow(uint256) view returns (tuple(address payer,address payee,uint256 amount,uint8 status,uint64 createdAt,uint64 expiresAt,string description,string[3] teacherHandles,uint8[3] yogaTypes,tuple(uint64 startTime,uint32 durationMinutes,int16 timezoneOffset)[3] timeSlots,tuple(string country,string city,string specificLocation)[3] locations,uint8 selectedPayeeIndex,uint8 selectedYogaIndex,uint8 selectedTimeIndex,uint8 selectedLocationIndex,string selectedHandle))',
])

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
