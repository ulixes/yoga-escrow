import type { Meta, StoryObj } from '@storybook/react'
import { GroupClassDataExample } from './GroupClassDataExample'

const meta: Meta<typeof GroupClassDataExample> = {
  title: 'Teacher/GroupClassDataExample',
  component: GroupClassDataExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# 🚨 GROUP CLASS DATA STRUCTURE GUIDE

This component demonstrates the **EXACT** data structure needed to fix group class display issues.

## ❌ Current Issue

The frontend developer is seeing:
- \`Student: 2 stud...ents\` (wrong)
- \`Payout: 0.002232 ETH\` (individual amount, not total)
- No "View Roster" button
- No expandable roster functionality

## ✅ Solution

Use this **exact** data structure for group classes:

\`\`\`typescript
const groupClass: AcceptedClass = {
  // Standard fields
  escrowId: 0,
  studentAddress: '0x...',
  classTime: 1234567890,
  location: 'Vake Park, Tbilisi',
  description: 'Group yoga class booking',
  payout: '0.002232',
  acceptedAt: 1234567890,
  status: 'accepted',
  
  // 🎯 REQUIRED GROUP FIELDS
  isGroup: true,                    // Must be true
  students: [                       // Must contain ClassStudent[]
    { escrowId: 0, studentAddress: '0x...', payout: '0.002232', status: 'accepted' },
    { escrowId: 1, studentAddress: '0x...', payout: '0.002227', status: 'accepted' }
  ],
  totalStudents: 2,                 // Total count
  totalPayout: '0.004459',          // Sum of all payouts
}
\`\`\`

## 🎯 Expected Results

With correct data structure, you'll see:
- **Students: 2 Students** (not truncated address)
- **Total Payout: 0.004459 ETH** (combined amount)
- **View Roster ▼** (expandable button)
- **Individual student management** in roster

The UI package already supports everything - it's just a data structure issue!
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const SideBySideComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: `
This story shows the difference between correct and incorrect data structures for group classes.

**Top card (✅ Correct):** Shows proper group display with total payout and roster functionality.

**Bottom card (❌ Wrong):** Shows how it looks when group data is missing - falls back to single student display.

Copy the data structure from the top example to fix the group class display issues.
        `,
      },
    },
  },
}