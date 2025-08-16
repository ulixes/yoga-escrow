import type { Meta, StoryObj } from '@storybook/react'
import { BookingsList } from './BookingsList'
import { ClassStatus, type Escrow } from './BookingRequestCard'

const meta: Meta<typeof BookingsList> = {
  title: 'Components/BookingsList',
  component: BookingsList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onCancel: { action: 'cancel' },
    onReleasePayment: { action: 'release-payment' },
    onViewDetails: { action: 'view-details' },
    onCreateBooking: { action: 'create-booking' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock data generator
function createMockEscrow(id: number, overrides: Partial<Escrow> = {}): Escrow {
  const baseTime = Math.floor(Date.now() / 1000)
  return {
    id,
    student: '0x1234567890123456789012345678901234567890',
    amount: '0.002',
    status: ClassStatus.Pending,
    createdAt: baseTime - (id * 3600), // Stagger creation times
    description: 'Private yoga class booking',
    location: 'Vake Park, Tbilisi',
    studentEmail: 'student@example.com',
    teacherHandles: ['@yoga_master', '@zen_teacher', '@flow_guru'],
    timeSlots: [
      baseTime + 86400 + (id * 3600), // Tomorrow plus offset
      baseTime + 172800 + (id * 3600), // Day after tomorrow plus offset
      baseTime + 259200 + (id * 3600), // 3 days from now plus offset
    ],
    ...overrides,
  }
}

const mockBookings: Escrow[] = [
  createMockEscrow(1, {
    status: ClassStatus.Pending,
    description: 'Vinyasa Flow Session',
    location: 'Vake Park, Tbilisi',
  }),
  createMockEscrow(2, {
    status: ClassStatus.Accepted,
    description: 'Hatha Yoga Class',
    location: 'Rustaveli Avenue Studio',
    teacher: '0x0987654321098765432109876543210987654321',
    classTime: Math.floor(Date.now() / 1000) + 86400,
    selectedTimeIndex: 0,
    selectedHandle: '@yoga_master',
  }),
  createMockEscrow(3, {
    status: ClassStatus.Delivered,
    description: 'Power Yoga Session',
    location: 'Saburtalo Fitness Center',
    teacher: '0x0987654321098765432109876543210987654321',
    classTime: Math.floor(Date.now() / 1000) - 3600,
    selectedTimeIndex: 1,
    selectedHandle: '@zen_teacher',
    amount: '0.0035',
  }),
  createMockEscrow(4, {
    status: ClassStatus.Cancelled,
    description: 'Yin Yoga Class',
    location: 'Old Tbilisi Courtyard',
  }),
  createMockEscrow(5, {
    status: ClassStatus.Pending,
    description: 'Ashtanga Practice',
    location: 'Mtatsminda Park',
    amount: '0.003',
  }),
  createMockEscrow(6, {
    status: ClassStatus.Accepted,
    description: 'Restorative Yoga',
    location: 'Vere Valley',
    teacher: '0x1111111111111111111111111111111111111111',
    classTime: Math.floor(Date.now() / 1000) + 172800,
    selectedTimeIndex: 2,
    selectedHandle: '@flow_guru',
    amount: '0.0025',
  }),
]

export const Default: Story = {
  args: {
    bookings: mockBookings,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const EmptyState: Story = {
  args: {
    bookings: [],
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const OnlyPending: Story = {
  args: {
    bookings: mockBookings.filter(b => b.status === ClassStatus.Pending),
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    initialFilter: 'pending',
  },
}

export const OnlyConfirmed: Story = {
  args: {
    bookings: mockBookings.filter(b => b.status === ClassStatus.Accepted),
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    initialFilter: 'confirmed',
  },
}

export const SortByAmount: Story = {
  args: {
    bookings: mockBookings,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    initialSort: 'amount',
  },
}

export const WithoutFiatRate: Story = {
  args: {
    bookings: mockBookings.slice(0, 3),
  },
}

export const ManyBookings: Story = {
  args: {
    bookings: [
      ...mockBookings,
      ...Array.from({ length: 10 }, (_, i) => 
        createMockEscrow(i + 10, {
          status: [ClassStatus.Pending, ClassStatus.Accepted, ClassStatus.Delivered, ClassStatus.Cancelled][i % 4],
          description: `Yoga Class ${i + 10}`,
          location: ['Vake Park', 'Rustaveli Studio', 'Saburtalo Center', 'Old Town'][i % 4],
          amount: (Math.random() * 0.01 + 0.001).toFixed(4),
        })
      ),
    ],
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const CustomFiatFormat: Story = {
  args: {
    bookings: mockBookings.slice(0, 4),
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => `${amount.toFixed(2)} ${currency}`,
  },
}