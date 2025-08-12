import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { NavigationMenu } from './NavigationMenu'
import { ClassList } from './ClassList'
import type { StudentEscrow } from './ClassItem'

const meta: Meta<typeof NavigationMenu> = {
  title: 'Ulyxes/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

function makeDemoItems(): StudentEscrow[] {
  const now = Math.floor(Date.now() / 1000)
  return [
    {
      id: 1n,
      payer: '0x1111111111111111111111111111111111111111',
      payee: undefined,
      amountWei: 2000000000000000n,
      amountEth: '0.002',
      status: 'Created',
      createdAt: now - 3600,
      expiresAt: now + 86400,
      description: 'Traveler · Mobility reset',
      teacherHandles: ['@a','@b','@c'],
      yogaTypes: ['Vinyasa','Hatha','Yin'],
      timeSlots: [
        { startTime: now + 2*86400, durationMinutes: 60, timezoneOffset: -180 },
        { startTime: now + 3*86400, durationMinutes: 60, timezoneOffset: -180 },
        { startTime: now + 4*86400, durationMinutes: 60, timezoneOffset: -180 },
      ],
      locations: [
        { country: 'GE', city: 'Tbilisi', specificLocation: 'Vake Park' },
        { country: 'GE', city: 'Tbilisi', specificLocation: 'Lisi Lake' },
        { country: 'GE', city: 'Tbilisi', specificLocation: 'Turtle Lake' },
      ],
      selected: {},
      isExpired: false,
      timeToExpireMs: 86400*1000,
      canAssign: true,
      canCancel: true,
      canRelease: false,
      canDispute: false,
      canTriggerAutoRelease: false,
    },
    {
      id: 2n,
      payer: '0x1111111111111111111111111111111111111111',
      payee: '0x2222222222222222222222222222222222222222',
      amountWei: 2000000000000000n,
      amountEth: '0.002',
      status: 'Assigned',
      createdAt: now - 7200,
      expiresAt: now + 3600,
      description: 'Runner · Strength & breath',
      teacherHandles: ['@y1','@y2','@y3'],
      yogaTypes: ['Yin','Vinyasa','Hatha'],
      timeSlots: [
        { startTime: now + 86400, durationMinutes: 60, timezoneOffset: -180 },
        { startTime: now + 2*86400, durationMinutes: 60, timezoneOffset: -180 },
        { startTime: now + 3*86400, durationMinutes: 60, timezoneOffset: -180 },
      ],
      locations: [
        { country: 'GE', city: 'Tbilisi', specificLocation: 'Studio A' },
        { country: 'GE', city: 'Tbilisi', specificLocation: 'Studio B' },
        { country: 'GE', city: 'Tbilisi', specificLocation: 'Online' },
      ],
      selected: { payeeIndex: 0, yogaIndex: 1, timeIndex: 0, locationIndex: 0, handle: '@y1' },
      isExpired: false,
      timeToExpireMs: 3600*1000,
      canAssign: false,
      canCancel: false,
      canRelease: true,
      canDispute: true,
      canTriggerAutoRelease: false,
    },
  ]
}

export const Demo: StoryObj<typeof NavigationMenu> = {
  render: () => {
    const [loggedOut, setLoggedOut] = useState(false)
    const [items] = useState(makeDemoItems())

    return (
      <div>
        <NavigationMenu
          title="Ulyxes"
          slogan="Yoga everywhere.. anytime.."
          user={loggedOut ? undefined : { name: 'Sam', email: 'sam@example.com' }}
          items={[
            { id: 'home', label: 'Home', onClick: () => {} },
            { id: 'book', label: 'Book a class', onClick: () => {} },
            { id: 'history', label: 'My bookings', onClick: () => {} },
          ]}
          onLogout={() => setLoggedOut(true)}
        />

        <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
          <h3 style={{ marginBottom: 12 }}>My bookings</h3>
          <ClassList items={items} />
        </div>
      </div>
    )
  },
}
