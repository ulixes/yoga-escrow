import React from 'react'
import { UpcomingClassCard } from './UpcomingClassCard'
import { AcceptedClass, ClassStudent } from './types'

/**
 * This file demonstrates the EXACT data structure needed for group classes.
 * Copy this pattern to fix the group class display issues.
 */

// ✅ CORRECT: Individual students data
const students: ClassStudent[] = [
  {
    escrowId: 0,
    studentAddress: '0x3bF4d7E8A9B2C1D3E4F5A6B7C8D9E0F1A2B3C4D5',
    payout: '0.002232',
    status: 'accepted',
  },
  {
    escrowId: 1,
    studentAddress: '0x9595e8f7d6c5b4a3928716051423364758c9d0e1',
    payout: '0.002227',
    status: 'accepted',
  },
]

// ✅ CORRECT: Group class data structure
const correctGroupClassData: AcceptedClass = {
  // Standard AcceptedClass fields
  escrowId: 0, // Primary escrow ID for callbacks
  studentAddress: '0x3bF4d7E8A9B2C1D3E4F5A6B7C8D9E0F1A2B3C4D5', // Not used for display in groups
  classTime: Math.floor(Date.now() / 1000) + 86400, // Tuesday, Aug 19 at 11:00 AM
  location: 'Vake Park, Tbilisi',
  description: 'Group yoga class booking',
  payout: '0.002232', // Not used for display in groups
  acceptedAt: Math.floor(Date.now() / 1000) - 3600,
  status: 'accepted',
  
  // 🎯 REQUIRED GROUP FIELDS - All three must be set!
  isGroup: true, // ✅ Must be true
  students: students, // ✅ Must contain ClassStudent array
  totalStudents: 2, // ✅ Total count (can be calculated from students.length)
  totalPayout: '0.004459', // ✅ Sum of all individual payouts (0.002232 + 0.002227)
}

// ❌ WRONG: Missing group fields (will display as single student)
const incorrectGroupClassData: AcceptedClass = {
  escrowId: 0,
  studentAddress: '2 students', // ❌ This alone doesn't make it a group
  classTime: Math.floor(Date.now() / 1000) + 86400,
  location: 'Vake Park, Tbilisi',
  description: 'Group yoga class booking',
  payout: '0.004459', // ❌ Without isGroup=true, this won't show as total
  acceptedAt: Math.floor(Date.now() / 1000) - 3600,
  status: 'accepted',
  // ❌ Missing: isGroup, students, totalStudents, totalPayout
}

export const GroupClassDataExample: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <div>
        <h3>✅ CORRECT: Group Class with Full Data Structure</h3>
        <p>This will show:</p>
        <ul>
          <li>Students: 2 Students</li>
          <li>Total Payout: 0.004459 ETH (sum of both students)</li>
          <li>"View Roster ▼" button</li>
          <li>Expandable roster with individual student details</li>
        </ul>
        <UpcomingClassCard 
          acceptedClass={correctGroupClassData}
          ethToFiatRate={2500}
          fiatCurrency="USD"
          onViewStudentDetails={(escrowId) => console.log('View student details:', escrowId)}
        />
      </div>
      
      <div>
        <h3>❌ WRONG: Missing Group Data (displays as single student)</h3>
        <p>This will incorrectly show:</p>
        <ul>
          <li>Student: 2 stud...ents (truncated as address)</li>
          <li>Payout: 0.004459 ETH (individual, not marked as total)</li>
          <li>Escrow ID: #0</li>
          <li>No "View Roster" button</li>
        </ul>
        <UpcomingClassCard 
          acceptedClass={incorrectGroupClassData}
          ethToFiatRate={2500}
          fiatCurrency="USD"
        />
      </div>
      
      <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h4>🔧 How to Fix Your Data Transformation:</h4>
        <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
{`// ✅ CORRECT transformation from multiple escrows to group class:
const transformToGroupClass = (escrows: AcceptedClass[]): AcceptedClass => {
  const totalPayout = escrows.reduce((sum, escrow) => 
    sum + parseFloat(escrow.payout), 0
  ).toString()
  
  const students: ClassStudent[] = escrows.map(escrow => ({
    escrowId: escrow.escrowId,
    studentAddress: escrow.studentAddress,
    payout: escrow.payout,
    status: escrow.status
  }))
  
  return {
    ...escrows[0], // Use first escrow as base
    isGroup: true, // 🎯 REQUIRED
    students: students, // 🎯 REQUIRED
    totalStudents: escrows.length, // 🎯 REQUIRED
    totalPayout: totalPayout, // 🎯 REQUIRED
    description: \`Group yoga class booking (\${escrows.length} students)\`
  }
}`}
        </pre>
      </div>
    </div>
  )
}

/**
 * Data structure summary for developers:
 * 
 * ✅ Required fields for group classes:
 * - isGroup: true
 * - students: ClassStudent[] (array of individual student data)
 * - totalStudents: number
 * - totalPayout: string (sum of all individual payouts)
 * 
 * ✅ What you'll get with correct data:
 * - "Students: X Students" display
 * - "Total Payout: X.XXX ETH" (combined amount)
 * - "View Roster ▼" expandable button
 * - Individual student management in roster
 * 
 * ❌ What happens with incorrect data:
 * - Falls back to single student display
 * - Shows individual payout instead of total
 * - No roster expansion
 * - No individual student management
 */