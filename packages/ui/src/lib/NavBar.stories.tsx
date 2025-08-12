import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { NavBar } from './NavBar'

const meta: Meta<typeof NavBar> = {
  title: 'Ulyx/NavBar',
  component: NavBar,
}
export default meta

type Story = StoryObj<typeof NavBar>

export const Default: Story = {
  render: () => (
    <div data-skin="ulyxes" style={{ minHeight: 240, background: 'linear-gradient(180deg, #fff, #f7f7f9)' }}>
      <NavBar
        skin="ulyxes"
        logoVariant="wave"
        onOpenBookings={() => console.log('Open bookings')}
        onLogout={() => console.log('Logout')}
      />
      <div style={{ padding: 16 }}>
        <p>Content area — imagine stars, breath and space guiding the flow.</p>
      </div>
    </div>
  ),
}

export const Brandless: Story = {
  render: () => (
    <div data-skin="ulyxes" style={{ minHeight: 240, background: '#fff' }}>
      <NavBar
        skin="ulyxes"
        showBrand={false}
        bookingsLabel="Bookings"
        logoutLabel="Sign out"
        onOpenBookings={() => alert('Go to bookings')}
        onLogout={() => alert('Signed out')}
      />
      <div style={{ padding: 16 }}>
        <p>Minimal top bar with burger menu (top-right).</p>
      </div>
    </div>
  ),
}
