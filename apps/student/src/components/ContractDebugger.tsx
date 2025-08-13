import React, { useState } from 'react'
import { useWalletBalance } from '../hooks/useWalletBalance'
import { useYogaEscrow } from '../hooks/useYogaEscrow'
import { validateContractPayload, simulateContractCall, createMinimalValidPayload } from '../utils/contractDebugger'

export function ContractDebugger() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { walletAddress } = useWalletBalance()
  const { createEscrow } = useYogaEscrow()

  const runTest = async (testType: 'validate' | 'simulate' | 'create') => {
    if (!walletAddress) {
      setResult('❌ No wallet connected')
      return
    }

    setLoading(true)
    setResult('⏳ Running test...')

    try {
      const payload = createMinimalValidPayload()
      console.log('Test payload:', payload)

      if (testType === 'validate') {
        const validation = validateContractPayload(payload)
        setResult(`✅ Validation Result:
Valid: ${validation.isValid}
Errors: ${validation.errors.length > 0 ? validation.errors.join(', ') : 'None'}
Warnings: ${validation.warnings.length > 0 ? validation.warnings.join(', ') : 'None'}`)
      
      } else if (testType === 'simulate') {
        const simulation = await simulateContractCall(payload, walletAddress as `0x${string}`)
        setResult(`🧪 Simulation Result:
Success: ${simulation.success}
${simulation.error ? `Error: ${simulation.error}` : ''}
${simulation.gasEstimate ? `Gas Estimate: ${simulation.gasEstimate.toString()}` : ''}`)
      
      } else if (testType === 'create') {
        const tx = await createEscrow(payload)
        setResult(`🚀 Transaction Result:
Hash: ${tx.hash}
Check on Base Sepolia: https://sepolia.basescan.org/tx/${tx.hash}`)
      }

    } catch (error: any) {
      setResult(`❌ Test failed: ${error.message}`)
      console.error('Debug test error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!walletAddress) {
    return (
      <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, margin: 16 }}>
        <h3>Contract Debugger</h3>
        <p>Connect wallet to test contract interactions</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, margin: 16 }}>
      <h3>Contract Debugger</h3>
      <p>Test contract interactions with minimal valid payload</p>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button 
          onClick={() => runTest('validate')}
          disabled={loading}
          style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: 4 }}
        >
          Validate Payload
        </button>
        
        <button 
          onClick={() => runTest('simulate')}
          disabled={loading}
          style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: 4 }}
        >
          Simulate Call
        </button>
        
        <button 
          onClick={() => runTest('create')}
          disabled={loading}
          style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: 4, backgroundColor: '#007bff', color: 'white' }}
        >
          Create Escrow
        </button>
      </div>

      {result && (
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: 12, 
          borderRadius: 4, 
          whiteSpace: 'pre-wrap',
          fontSize: 14,
          fontFamily: 'monospace'
        }}>
          {result}
        </pre>
      )}
    </div>
  )
}