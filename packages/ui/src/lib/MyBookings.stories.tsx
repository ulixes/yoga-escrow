import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MyBookings } from './MyBookings'
import type { StudentEscrow } from './ClassItem'

const meta: Meta<typeof MyBookings> = {
  title: 'Ulyx/MyBookings',
  component: MyBookings,
}
export default meta

type Story = StoryObj<typeof MyBookings>

const now = Math.floor(Date.now() / 1000)
const mkSlot = (offsetHours: number) => ({ startTime: now + offsetHours * 3600, durationMinutes: 60, timezoneOffset: 0 })
const mkLoc = (specificLocation: string) => ({ country: 'Georgia', city: 'Tbilisi', specificLocation })

const demo: StudentEscrow[] = [
  {
    id: 1n,
    payer: '0xabc0000000000000000000000000000000000000',
    amountWei: 0n,
    status: 'Created',
    createdAt: now - 3600,
    expiresAt: now + 72 * 3600,
    description: 'Morning flow',
    teacherHandles: ['@lena', '@zoe', '@amir'],
    yogaTypes: ['Vinyasa','Yin','Hatha'],
    timeSlots: [mkSlot(24), mkSlot(30), mkSlot(48)],
    locations: [mkLoc('Vake Park'), mkLoc('Lisi Lake'), mkLoc('Turtle Lake')],
    selected: {},
    amountEth: '0.05',
    isExpired: false,
    timeToExpireMs: 1000 * 60 * 60 * 72,
    canAssign: true,
    canCancel: true,
    canRelease: false,
    canDispute: false,
    canTriggerAutoRelease: false,
  },
  {
    id: 2n,
    payer: '0xabc0000000000000000000000000000000000000',
    amountWei: 0n,
    status: 'Assigned',
    createdAt: now - 7200,
    expiresAt: now + 24 * 3600,
    description: 'Deep stretch',
    teacherHandles: ['@maya', '@zoe', '@amir'],
    yogaTypes: ['Yin','Vinyasa','Hatha'],
    timeSlots: [mkSlot(18), mkSlot(26), mkSlot(40)],
    locations: [mkLoc('Vake Park'), mkLoc('Lisi Lake'), mkLoc('Turtle Lake')],
    selected: { payeeIndex: 0, yogaIndex: 0, timeIndex: 0, locationIndex: 1, handle: '@maya' },
    amountEth: '0.08',
    isExpired: false,
    timeToExpireMs: 1000 * 60 * 60 * 24,
    canAssign: false,
    canCancel: false,
    canRelease: true,
    canDispute: true,
    canTriggerAutoRelease: true,
  },
  {
    id: 3n,
    payer: '0xabc0000000000000000000000000000000000000',
    amountWei: 0n,
    status: 'Disputed',
    createdAt: now - 7200,
    expiresAt: now - 3600,
    description: 'Evening power',
    teacherHandles: ['@alex', '@zoe', '@amir'],
    yogaTypes: ['Power','Vinyasa','Hatha'],
    timeSlots: [mkSlot(-48), mkSlot(-24), mkSlot(-18)],
    locations: [mkLoc('Gym Central'), mkLoc('Lisi Lake'), mkLoc('Turtle Lake')],
    selected: { payeeIndex: 0, yogaIndex: 0, timeIndex: 2, locationIndex: 0, handle: '@alex' },
    amountEth: '0.1',
    isExpired: true,
    timeToExpireMs: -1000 * 60 * 60,
    canAssign: false,
    canCancel: false,
    canRelease: false,
    canDispute: false,
    canTriggerAutoRelease: false,
  },
  {
    id: 4n,
    payer: '0xabc0000000000000000000000000000000000000',
    amountWei: 0n,
    status: 'Cancelled',
    createdAt: now - 86400, // 1 day ago
    expiresAt: now - 3600,
    description: 'Beginner Hatha Yoga',
    teacherHandles: ['@lena', '@maya', '@alex'],
    yogaTypes: ['Hatha','Yin','Vinyasa'],
    timeSlots: [mkSlot(-12), mkSlot(-6), mkSlot(2)],
    locations: [mkLoc('Vake Park'), mkLoc('Rustaveli Studio'), mkLoc('Old Town')],
    selected: { payeeIndex: 0, yogaIndex: 0, timeIndex: 0, locationIndex: 0, handle: '@lena' },
    amountEth: '0.0025',
    isExpired: true,
    timeToExpireMs: -1000 * 60 * 60,
    canAssign: false,
    canCancel: false,
    canRelease: false,
    canDispute: false,
    canTriggerAutoRelease: false,
  },
  {
    id: 5n,
    payer: '0xabc0000000000000000000000000000000000000',
    amountWei: 0n,
    status: 'Completed',
    createdAt: now - 172800, // 2 days ago
    expiresAt: now - 86400,
    description: 'Power Yoga Session',
    teacherHandles: ['@maya', '@alex', '@zoe'],
    yogaTypes: ['Power','Ashtanga','Vinyasa'],
    timeSlots: [mkSlot(-36), mkSlot(-30), mkSlot(-24)],
    locations: [mkLoc('Saburtalo Center'), mkLoc('Lisi Lake'), mkLoc('Gym Central')],
    selected: { payeeIndex: 1, yogaIndex: 0, timeIndex: 2, locationIndex: 0, handle: '@alex' },
    amountEth: '0.004',
    isExpired: true,
    timeToExpireMs: -1000 * 60 * 60 * 24,
    canAssign: false,
    canCancel: false,
    canRelease: false,
    canDispute: false,
    canTriggerAutoRelease: false,
  },
  {
    id: 6n,
    payer: '0xabc0000000000000000000000000000000000000',
    amountWei: 0n,
    status: 'Cancelled',
    createdAt: now - 259200, // 3 days ago
    expiresAt: now - 172800,
    description: 'Vinyasa Flow',
    teacherHandles: ['@zoe', '@lena', '@maya'],
    yogaTypes: ['Vinyasa','Yin','Hatha'],
    timeSlots: [mkSlot(-60), mkSlot(-54), mkSlot(-48)],
    locations: [mkLoc('Turtle Lake'), mkLoc('Vake Park'), mkLoc('Old Town')],
    selected: { payeeIndex: 0, yogaIndex: 0, timeIndex: 1, locationIndex: 2, handle: '@zoe' },
    amountEth: '0.003',
    isExpired: true,
    timeToExpireMs: -1000 * 60 * 60 * 48,
    canAssign: false,
    canCancel: false,
    canRelease: false,
    canDispute: false,
    canTriggerAutoRelease: false,
  },
]

export const Default: Story = {
  render: () => (
    <div data-skin="ulyxes" style={{ maxWidth: 760 }}>
      <MyBookings
        items={demo}
        onAssign={(id) => console.log('assign', id)}
        onCancel={(id) => console.log('cancel', id)}
        onRelease={(id) => console.log('release', id)}
        onDispute={(id) => console.log('dispute', id)}
        onAutoRelease={(id) => console.log('autoRelease', id)}
        onViewDetails={(id) => console.log('details', id)}
      />
    </div>
  ),
}

export const ClassHistory: Story = {
  render: () => (
    <div data-skin="ulyxes" style={{ maxWidth: 760 }}>
      <MyBookings
        items={demo}
        initialFilter="history"
        onAssign={(id) => console.log('assign', id)}
        onCancel={(id) => console.log('cancel', id)}
        onRelease={(id) => console.log('release', id)}
        onDispute={(id) => console.log('dispute', id)}
        onAutoRelease={(id) => console.log('autoRelease', id)}
        onViewDetails={(id) => console.log('details', id)}
      />
    </div>
  ),
}

export const CancelledOnly: Story = {
  render: () => (
    <div data-skin="ulyxes" style={{ maxWidth: 760 }}>
      <MyBookings
        items={demo}
        initialFilter="cancelled"
        onAssign={(id) => console.log('assign', id)}
        onCancel={(id) => console.log('cancel', id)}
        onRelease={(id) => console.log('release', id)}
        onDispute={(id) => console.log('dispute', id)}
        onAutoRelease={(id) => console.log('autoRelease', id)}
        onViewDetails={(id) => console.log('details', id)}
      />
    </div>
  ),
}
