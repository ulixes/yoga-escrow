import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { InsufficientFunds } from './InsufficientFunds'

const meta: Meta<typeof InsufficientFunds> = {
  title: 'Ulyx/InsufficientFunds',
  component: InsufficientFunds,
}
export default meta

type Story = StoryObj<typeof InsufficientFunds>

export const SmallShortfall: Story = { render: () => (
  <div data-skin="ulyxes">
    <InsufficientFunds
      neededUSDC={1.75}
      onAddFunds={() => alert('Open funding guide...')}
      onCancel={() => alert('Cancel booking')}
    />
  </div>
)}

export const LargeShortfall: Story = { render: () => (
  <div data-skin="ulyxes">
    <InsufficientFunds
      neededUSDC={10}
      onAddFunds={() => alert('Open funding guide...')}
      onCancel={() => alert('Cancel booking')}
    />
  </div>
)}
