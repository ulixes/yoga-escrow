import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TransactionConfirmation } from './TransactionConfirmation'

const meta: Meta<typeof TransactionConfirmation> = {
  title: 'Ulyx/TransactionConfirmation',
  component: TransactionConfirmation,
}
export default meta

type Story = StoryObj<typeof TransactionConfirmation>

export const Default: Story = { render: () => (
  <div data-skin="ulyxes">
    <TransactionConfirmation
      transactionHash="0xabc1234567890defabc1234567890defabc1234567890defabc1234567890def"
      escrowId="42"
      onBackToHome={() => alert('Back to home')}
    />
  </div>
)}
