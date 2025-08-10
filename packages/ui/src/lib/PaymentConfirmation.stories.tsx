import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { PaymentConfirmation } from './PaymentConfirmation'

const meta: Meta<typeof PaymentConfirmation> = {
  title: 'Ulyx/PaymentConfirmation',
  component: PaymentConfirmation,
}
export default meta

type Story = StoryObj<typeof PaymentConfirmation>

export const Default: Story = { render: () => (
  <div data-skin="ulyxes">
    <PaymentConfirmation
      summary={{ costUSDC: 10, currentBalanceUSDC: 18.5 }}
      onConfirm={() => alert('Confirm payment')}
      onCancel={() => alert('Cancel')}
    />
  </div>
)}
