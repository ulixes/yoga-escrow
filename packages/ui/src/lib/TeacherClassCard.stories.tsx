import type { Meta, StoryObj } from '@storybook/react'
import { TeacherClassCard, type TeacherClassRequest } from './TeacherClassCard'

const meta: Meta<typeof TeacherClassCard> = {
  title: 'Teacher/TeacherClassCard',
  component: TeacherClassCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onAccept: { action: 'accept' },
    onIgnore: { action: 'ignore' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock data
const baseRequest: TeacherClassRequest = {
  id: 1,
  teacherHandle: '@yoga_master',
  studentCount: 1,
  totalAmount: '0.002',
  location: 'Vake Park, Tbilisi',
  time: Math.floor(Date.now() / 1000) + 86400, // Tomorrow
  description: 'Private Vinyasa Flow Session',
  createdAt: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
  status: 'pending' as const,
}

export const SingleStudent: Story = {
  args: {
    classRequest: baseRequest,
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const MultipleStudents: Story = {
  args: {
    classRequest: {
      ...baseRequest,
      id: 2,
      studentCount: 3,
      totalAmount: '0.006',
      description: 'Group Hatha Yoga Class',
      location: 'Rustaveli Avenue Studio',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const HighValue: Story = {
  args: {
    classRequest: {
      ...baseRequest,
      id: 3,
      studentCount: 5,
      totalAmount: '0.015',
      description: 'Private Group Power Yoga',
      location: 'Saburtalo Fitness Center',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const RecentRequest: Story = {
  args: {
    classRequest: {
      ...baseRequest,
      id: 4,
      createdAt: Math.floor(Date.now() / 1000) - 600, // 10 minutes ago
      description: 'Beginner Yoga Session',
      location: 'Old Tbilisi Courtyard',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const WithoutFiatRate: Story = {
  args: {
    classRequest: baseRequest,
  },
}

export const AcceptedClass: Story = {
  args: {
    classRequest: {
      ...baseRequest,
      id: 5,
      status: 'accepted' as const,
      acceptedAt: Math.floor(Date.now() / 1000) - 1800, // 30 minutes ago
      description: 'Hatha Yoga Session',
      studentCount: 2,
      totalAmount: '0.004',
    },
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const CustomFiatFormat: Story = {
  args: {
    classRequest: {
      ...baseRequest,
      totalAmount: '0.004',
    },
    ethToFiatRate: 2200,
    fiatCurrency: 'EUR',
    formatFiat: (amount: number, currency: string) => `${amount.toFixed(2)} ${currency}`,
  },
}