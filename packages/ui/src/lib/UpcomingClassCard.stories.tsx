import type { Meta, StoryObj } from '@storybook/react'
import { UpcomingClassCard } from './UpcomingClassCard'
import { type AcceptedClass, type ClassStudent } from './types'

const meta: Meta<typeof UpcomingClassCard> = {
  title: 'Teacher/UpcomingClassCard',
  component: UpcomingClassCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onViewDetails: { action: 'viewDetails' },
    onCancel: { action: 'cancel' },
    onViewStudentDetails: { action: 'viewStudentDetails' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock data for single student class
const baseSingleClass: AcceptedClass = {
  escrowId: 0,
  studentAddress: '0x742d35Cc6344C4532BDAA8A4C30fF0AB5c234567',
  classTime: Math.floor(Date.now() / 1000) + 86400, // Tomorrow
  location: 'Vake Park, Tbilisi',
  description: 'Private Vinyasa Flow Session',
  payout: '0.002232',
  acceptedAt: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
  status: 'accepted',
}

// Mock students for group classes
const groupStudents: ClassStudent[] = [
  {
    escrowId: 0,
    studentAddress: '0x742d35Cc6344C4532BDAA8A4C30fF0AB5c234567',
    payout: '0.002232',
    status: 'accepted',
  },
  {
    escrowId: 1,
    studentAddress: '0x8b3f21CC9c6F4B7A5D2E3F1A8C9D0E1F2A3B4C5D',
    payout: '0.002227',
    status: 'accepted',
  },
]

const mixedStatusStudents: ClassStudent[] = [
  {
    escrowId: 5,
    studentAddress: '0x742d35Cc6344C4532BDAA8A4C30fF0AB5c234567',
    payout: '0.003',
    status: 'completed',
  },
  {
    escrowId: 6,
    studentAddress: '0x8b3f21CC9c6F4B7A5D2E3F1A8C9D0E1F2A3B4C5D',
    payout: '0.003',
    status: 'cancelled',
  },
  {
    escrowId: 7,
    studentAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    payout: '0.003',
    status: 'awaiting_release',
  },
]

// Group class with expandable roster
const groupClass: AcceptedClass = {
  escrowId: 0, // Primary escrow ID
  studentAddress: '0x742d35Cc6344C4532BDAA8A4C30fF0AB5c234567', // Not used for display
  classTime: Math.floor(Date.now() / 1000) + 86400, // Tomorrow
  location: 'Saburtalo Fitness Center',
  description: 'Group Vinyasa Flow',
  payout: '0.002232', // Not used for display
  acceptedAt: Math.floor(Date.now() / 1000) - 3600,
  status: 'accepted',
  isGroup: true,
  students: groupStudents,
  totalStudents: 2,
  totalPayout: '0.004459',
}

export const SingleStudent: Story = {
  args: {
    acceptedClass: baseSingleClass,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const GroupClassCollapsed: Story = {
  args: {
    acceptedClass: groupClass,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const GroupClassWithMixedStatus: Story = {
  args: {
    acceptedClass: {
      ...groupClass,
      escrowId: 5,
      description: 'Group Power Yoga',
      location: 'Central Park',
      students: mixedStatusStudents,
      totalStudents: 3,
      totalPayout: '0.009',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const LargeGroupClass: Story = {
  args: {
    acceptedClass: {
      ...groupClass,
      escrowId: 10,
      description: 'Group Hatha Yoga',
      location: 'Rustaveli Avenue Studio',
      students: [
        ...groupStudents,
        { escrowId: 2, studentAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', payout: '0.002', status: 'accepted' as const },
        { escrowId: 3, studentAddress: '0x9f8e7d6c5b4a3928716051423364758c9d0e1f2a', payout: '0.002', status: 'accepted' as const },
        { escrowId: 4, studentAddress: '0x5c4b3a2918273645192837465102948576839201', payout: '0.002', status: 'accepted' as const },
      ],
      totalStudents: 5,
      totalPayout: '0.012459',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const PastDueClass: Story = {
  args: {
    acceptedClass: {
      ...baseSingleClass,
      escrowId: 10,
      classTime: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      description: 'Overdue Hatha Yoga Session',
      status: 'accepted',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const CompletedClass: Story = {
  args: {
    acceptedClass: {
      ...baseSingleClass,
      escrowId: 15,
      classTime: Math.floor(Date.now() / 1000) - 86400, // Yesterday
      description: 'Completed Power Yoga Session',
      status: 'completed',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const WithoutFiatRate: Story = {
  args: {
    acceptedClass: groupClass,
  },
}

export const CustomFiatFormat: Story = {
  args: {
    acceptedClass: {
      ...groupClass,
      totalPayout: '0.008',
    },
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => `${amount.toFixed(2)} ${currency}`,
  },
}

// Story demonstrating the group class UI approach
export const GroupClassUIDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the group class UI pattern:

**Collapsed View (Default):**
- Shows aggregated information: "3 Students", "Total Payout: 1.5 ETH"
- Clean, single-card view for group sessions
- "View Roster ▼" button to expand details

**Expanded View (Click "View Roster"):**
- Shows individual student roster
- Each student's escrow ID, payout, and status
- Handles mixed statuses: Accepted, Paid, Cancelled, Awaiting Release
- Click individual escrow IDs for student-specific actions

**Key Features:**
- Single card represents entire group session
- Expandable roster for detailed management
- Individual escrow status tracking
- Clean aggregation of financial data
- Maintains individual escrow independence

**Data Structure:**
\`\`\`javascript
const groupClass = {
  isGroup: true,
  students: [
    { escrowId: 0, studentAddress: "0x742d35...", payout: "0.002232", status: "accepted" },
    { escrowId: 1, studentAddress: "0x8b3f21...", payout: "0.002227", status: "accepted" }
  ],
  totalStudents: 2,
  totalPayout: "0.004459"
}
\`\`\`
        `,
      },
    },
  },
  args: {
    acceptedClass: groupClass,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}