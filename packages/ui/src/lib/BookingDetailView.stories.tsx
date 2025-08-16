import type { Meta, StoryObj } from '@storybook/react'
import { BookingDetailView } from './BookingDetailView'
import { ClassStatus, type Escrow } from './BookingRequestCard'

const meta: Meta<typeof BookingDetailView> = {
  title: 'Components/BookingDetailView',
  component: BookingDetailView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onCancel: { action: 'cancel' },
    onReleasePayment: { action: 'release-payment' },
    onClose: { action: 'close' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock data
const baseEscrow: Escrow = {
  id: 1,
  student: '0x1234567890123456789012345678901234567890',
  amount: '0.002',
  status: ClassStatus.Pending,
  createdAt: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
  description: 'Private Vinyasa Flow Session',
  location: 'Vake Park, Tbilisi (near the fountain)',
  studentEmail: 'student@example.com',
  teacherHandles: ['@yoga_master_tbilisi', '@zen_teacher_flow', '@ashtanga_guru'],
  timeSlots: [
    Math.floor(Date.now() / 1000) + 86400, // Tomorrow 
    Math.floor(Date.now() / 1000) + 172800, // Day after tomorrow
    Math.floor(Date.now() / 1000) + 259200, // 3 days from now
  ],
}

export const PendingBooking: Story = {
  args: {
    escrow: baseEscrow,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockExplorerUrl: 'https://sepolia.basescan.org',
  },
}

export const AcceptedBooking: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      id: 2,
      status: ClassStatus.Accepted,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) + 86400, // Tomorrow
      selectedTimeIndex: 0,
      selectedHandle: '@yoga_master_tbilisi',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockExplorerUrl: 'https://sepolia.basescan.org',
  },
}

export const DeliveredBooking: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      id: 3,
      status: ClassStatus.Delivered,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago (class completed)
      selectedTimeIndex: 1,
      selectedHandle: '@zen_teacher_flow',
      description: 'Power Yoga Session with Meditation',
      amount: '0.0035',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    blockExplorerUrl: 'https://sepolia.basescan.org',
  },
}

export const CancelledBooking: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      id: 4,
      status: ClassStatus.Cancelled,
      description: 'Yin Yoga and Breathwork Session',
      location: 'Botanical Garden Pavilion, Tbilisi',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    transactionHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    blockExplorerUrl: 'https://sepolia.basescan.org',
  },
}

export const WithoutTransactionInfo: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      status: ClassStatus.Accepted,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) + 86400,
      selectedTimeIndex: 2,
      selectedHandle: '@ashtanga_guru',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const WithoutFiatRate: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      status: ClassStatus.Accepted,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) + 86400,
      selectedTimeIndex: 0,
      selectedHandle: '@yoga_master_tbilisi',
    },
  },
}

export const CustomFiatFormat: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      status: ClassStatus.Delivered,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) - 3600,
      selectedTimeIndex: 0,
      selectedHandle: '@yoga_master_tbilisi',
      amount: '0.004',
    },
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => `${amount.toFixed(2)} ${currency}`,
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockExplorerUrl: 'https://sepolia.basescan.org',
  },
}

export const LongDescription: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      description: 'Advanced Ashtanga Yoga Session with Pranayama Breathing Techniques and Meditation Practice for Intermediate to Advanced Students',
      location: 'Mtatsminda Park Yoga Pavilion, Tbilisi (near the Ferris wheel, take the cable car up)',
      status: ClassStatus.Accepted,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) + 86400,
      selectedTimeIndex: 0,
      selectedHandle: '@ashtanga_guru',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}