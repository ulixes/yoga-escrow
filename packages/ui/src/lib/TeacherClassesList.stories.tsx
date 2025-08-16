import type { Meta, StoryObj } from '@storybook/react'
import { TeacherClassesList } from './TeacherClassesList'
import { GroupedOpportunity, AcceptedClass } from './types'

const meta: Meta<typeof TeacherClassesList> = {
  title: 'Teacher/TeacherClassesList',
  component: TeacherClassesList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    onAcceptOpportunity: { action: 'acceptOpportunity' },
    onAcceptGroup: { action: 'acceptGroup' },
    onViewDetails: { action: 'viewDetails' },
    onViewClassDetails: { action: 'viewClassDetails' },
    onCancelClass: { action: 'cancelClass' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Mock upcoming classes data (accepted/confirmed classes)
const createMockUpcomingClasses = (): AcceptedClass[] => {
  const baseTime = Math.floor(Date.now() / 1000)
  
  return [
    {
      escrowId: 201,
      studentAddress: '0xStudent101',
      classTime: baseTime + 3600, // 1 hour from now
      location: 'Vake Park, Tbilisi',
      description: 'Morning Vinyasa Flow',
      payout: '0.003',
      acceptedAt: baseTime - 7200, // Accepted 2 hours ago
      status: 'accepted' as const
    },
    {
      escrowId: 202,
      studentAddress: '0xStudent102',
      classTime: baseTime + 86400, // Tomorrow
      location: 'Rustaveli Studio',
      description: 'Power Yoga Session',
      payout: '0.0025',
      acceptedAt: baseTime - 3600, // Accepted 1 hour ago
      status: 'accepted' as const
    },
    {
      escrowId: 203,
      studentAddress: '0xStudent103',
      classTime: baseTime + 172800, // Day after tomorrow
      location: 'Saburtalo Center',
      description: 'Beginner Hatha Yoga',
      payout: '0.004',
      acceptedAt: baseTime - 1800, // Accepted 30 minutes ago
      status: 'accepted' as const
    }
  ]
}

// Mock opportunity data based on the escrow transformation model
const createMockOpportunities = (): GroupedOpportunity[] => {
  const baseTime = Math.floor(Date.now() / 1000)
  
  return [
    // Group opportunity - 2 students want same location/time
    {
      groupKey: 'Vake Park-' + (baseTime + 86400),
      location: 'Vake Park, Tbilisi',
      proposedTime: baseTime + 86400, // Tomorrow
      totalPayout: '0.006', // 2 students × 0.003 ETH
      studentCount: 2,
      isGroup: true,
      opportunities: [
        {
          opportunityId: '101-teacherX-0',
          escrowId: 101,
          studentAddress: '0xStudent1',
          location: 'Vake Park, Tbilisi',
          proposedTime: baseTime + 86400,
          timeIndex: 0,
          payout: '0.003',
          teacherHandle: 'teacherX',
          createdAt: baseTime - 3600
        },
        {
          opportunityId: '102-teacherX-1',
          escrowId: 102,
          studentAddress: '0xStudent2',
          location: 'Vake Park, Tbilisi',
          proposedTime: baseTime + 86400,
          timeIndex: 1,
          payout: '0.003',
          teacherHandle: 'teacherX',
          createdAt: baseTime - 1800
        }
      ]
    },
    
    // Individual opportunity - single student
    {
      groupKey: 'Rustaveli Studio-' + (baseTime + 172800),
      location: 'Rustaveli Studio',
      proposedTime: baseTime + 172800, // Day after tomorrow
      totalPayout: '0.0025',
      studentCount: 1,
      isGroup: false,
      opportunities: [
        {
          opportunityId: '103-teacherX-0',
          escrowId: 103,
          studentAddress: '0xStudent3',
          location: 'Rustaveli Studio',
          proposedTime: baseTime + 172800,
          timeIndex: 0,
          payout: '0.0025',
          teacherHandle: 'teacherX',
          createdAt: baseTime - 900
        }
      ]
    },
    
    // High-value group opportunity
    {
      groupKey: 'Saburtalo Center-' + (baseTime + 259200),
      location: 'Saburtalo Center',
      proposedTime: baseTime + 259200, // 3 days from now
      totalPayout: '0.012', // 3 students × 0.004 ETH
      studentCount: 3,
      isGroup: true,
      opportunities: [
        {
          opportunityId: '104-teacherX-2',
          escrowId: 104,
          studentAddress: '0xStudent4',
          location: 'Saburtalo Center',
          proposedTime: baseTime + 259200,
          timeIndex: 2,
          payout: '0.004',
          teacherHandle: 'teacherX',
          createdAt: baseTime - 2700
        },
        {
          opportunityId: '105-teacherX-0',
          escrowId: 105,
          studentAddress: '0xStudent5',
          location: 'Saburtalo Center',
          proposedTime: baseTime + 259200,
          timeIndex: 0,
          payout: '0.004',
          teacherHandle: 'teacherX',
          createdAt: baseTime - 1200
        },
        {
          opportunityId: '106-teacherX-1',
          escrowId: 106,
          studentAddress: '0xStudent6',
          location: 'Saburtalo Center',
          proposedTime: baseTime + 259200,
          timeIndex: 1,
          payout: '0.004',
          teacherHandle: 'teacherX',
          createdAt: baseTime - 600
        }
      ]
    },
    
    // Another individual opportunity
    {
      groupKey: 'Old Tbilisi-' + (baseTime + 345600),
      location: 'Old Tbilisi',
      proposedTime: baseTime + 345600, // 4 days from now
      totalPayout: '0.008', // High-value individual
      studentCount: 1,
      isGroup: false,
      opportunities: [
        {
          opportunityId: '107-teacherX-0',
          escrowId: 107,
          studentAddress: '0xStudent7',
          location: 'Old Tbilisi',
          proposedTime: baseTime + 345600,
          timeIndex: 0,
          payout: '0.008',
          teacherHandle: 'teacherX',
          createdAt: baseTime - 300
        }
      ]
    }
  ]
}

export const Default: Story = {
  args: {
    opportunities: createMockOpportunities(),
    upcomingClasses: createMockUpcomingClasses(),
    teacherHandle: '@yoga_master',
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const EmptyState: Story = {
  args: {
    opportunities: [],
    teacherHandle: '@yoga_master',
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const OnlyUpcomingClasses: Story = {
  args: {
    opportunities: [],
    upcomingClasses: createMockUpcomingClasses(),
    teacherHandle: '@yoga_master',
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}

export const HighValueFilter: Story = {
  args: {
    opportunities: createMockOpportunities(),
    upcomingClasses: createMockUpcomingClasses(),
    teacherHandle: '@yoga_master',
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    initialFilter: 'high-value',
  },
}

export const GroupClassesFilter: Story = {
  args: {
    opportunities: createMockOpportunities(),
    teacherHandle: '@yoga_master',
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    initialFilter: 'group-classes',
  },
}

export const SortByAmount: Story = {
  args: {
    opportunities: createMockOpportunities(),
    teacherHandle: '@yoga_master',
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
    initialSort: 'amount',
  },
}

export const WithoutFiatRate: Story = {
  args: {
    opportunities: createMockOpportunities().slice(0, 2),
    teacherHandle: '@yoga_master',
  },
}

export const ManyOpportunities: Story = {
  args: {
    opportunities: [
      ...createMockOpportunities(),
      // Add more mock opportunities
      ...Array.from({ length: 5 }, (_, i) => {
        const baseTime = Math.floor(Date.now() / 1000)
        const isGroup = Math.random() > 0.5
        const studentCount = isGroup ? Math.floor(Math.random() * 3) + 2 : 1
        const baseAmount = 0.002 + (Math.random() * 0.006)
        
        return {
          groupKey: `Location${i + 8}-${baseTime + (i + 5) * 86400}`,
          location: ['Mtatsminda Park', 'Freedom Square', 'Rike Park', 'Turtle Lake', 'Botanical Garden'][i % 5],
          proposedTime: baseTime + (i + 5) * 86400,
          totalPayout: (baseAmount * studentCount).toFixed(4),
          studentCount,
          isGroup,
          opportunities: Array.from({ length: studentCount }, (_, j) => ({
            opportunityId: `${108 + i * 10 + j}-teacherX-${j}`,
            escrowId: 108 + i * 10 + j,
            studentAddress: `0xStudent${8 + i * 10 + j}`,
            location: ['Mtatsminda Park', 'Freedom Square', 'Rike Park', 'Turtle Lake', 'Botanical Garden'][i % 5],
            proposedTime: baseTime + (i + 5) * 86400,
            timeIndex: j,
            payout: baseAmount.toFixed(4),
            teacherHandle: 'teacherX',
            createdAt: baseTime - (i + 1) * 300
          }))
        } as GroupedOpportunity
      })
    ],
    teacherHandle: '@yoga_master',
    ethToFiatRate: 2500,
    fiatCurrency: 'USD',
  },
}