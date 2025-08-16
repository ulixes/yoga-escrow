import type { Meta, StoryObj } from '@storybook/react'
import { BookingRequestCard, ClassStatus, type Escrow } from './BookingRequestCard'

const meta: Meta<typeof BookingRequestCard> = {
  title: 'Components/BookingRequestCard',
  component: BookingRequestCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onCancel: { action: 'cancel' },
    onReleasePayment: { action: 'release-payment' },
    onViewDetails: { action: 'view-details' },
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
  createdAt: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
  description: 'Private yoga class booking',
  location: 'Vake Park, Tbilisi',
  studentEmail: 'student@example.com',
  teacherHandles: ['@yoga_master', '@zen_teacher', '@flow_guru'],
  timeSlots: [
    Math.floor(Date.now() / 1000) + 86400, // Tomorrow
    Math.floor(Date.now() / 1000) + 172800, // Day after tomorrow
    Math.floor(Date.now() / 1000) + 259200, // 3 days from now
  ],
}

export const Pending: Story = {
  args: {
    escrow: baseEscrow,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const Accepted: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      id: 2,
      status: ClassStatus.Accepted,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) + 86400, // Tomorrow
      selectedTimeIndex: 0,
      selectedHandle: '@yoga_master',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const Delivered: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      id: 3,
      status: ClassStatus.Delivered,
      teacher: '0x0987654321098765432109876543210987654321',
      classTime: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      selectedTimeIndex: 0,
      selectedHandle: '@yoga_master',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const Cancelled: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      id: 4,
      status: ClassStatus.Cancelled,
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const WithoutFiatRate: Story = {
  args: {
    escrow: baseEscrow,
  },
}

export const CustomFiatFormat: Story = {
  args: {
    escrow: baseEscrow,
    ethToFiatRate: 2500,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => `${amount.toFixed(2)} ${currency}`,
  },
}

export const LongTeacherHandles: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      teacherHandles: ['@very_long_teacher_handle_name', '@another_extremely_long_handle', '@short'],
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const HighAmount: Story = {
  args: {
    escrow: {
      ...baseEscrow,
      amount: '0.25',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}