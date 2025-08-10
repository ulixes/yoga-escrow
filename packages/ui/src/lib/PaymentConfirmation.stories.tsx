import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { PaymentConfirmation } from './PaymentConfirmation'

const meta: Meta<typeof PaymentConfirmation> = {
  title: 'Ulyx/PaymentConfirmation',
  component: PaymentConfirmation,
}
export default meta

type Story = StoryObj<typeof PaymentConfirmation>

export const ExactBalance: Story = { render: () => (
  <div data-skin="ulyxes">
    <PaymentConfirmation
      summary={{ costUSDC: 10, currentBalanceUSDC: 10 }}
    />
  </div>
)}

export const PlentyLeft: Story = { render: () => (
  <div data-skin="ulyxes">
    <PaymentConfirmation
      summary={{ costUSDC: 10, currentBalanceUSDC: 25.75 }}
    />
  </div>
)}
