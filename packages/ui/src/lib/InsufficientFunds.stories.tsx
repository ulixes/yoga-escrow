import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { InsufficientFunds } from './InsufficientFunds'

const meta: Meta<typeof InsufficientFunds> = {
  title: 'Ulyx/InsufficientFunds',
  component: InsufficientFunds,
}
export default meta

type Story = StoryObj<typeof InsufficientFunds>

export const Default: Story = { render: () => (
  <div data-skin="ulyxes">
    <InsufficientFunds
      neededUSDC={1.75}
      onAddFunds={() => alert('Open funding guide...')}
      onConnectWallet={() => alert('Connect another wallet...')}
      onCancel={() => alert('Cancel booking')}
    />
  </div>
)}
