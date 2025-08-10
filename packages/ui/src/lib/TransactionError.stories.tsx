import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TransactionError } from './TransactionError'

const meta: Meta<typeof TransactionError> = {
  title: 'Ulyx/TransactionError',
  component: TransactionError,
}
export default meta

type Story = StoryObj<typeof TransactionError>

export const UserRejected: Story = { render: () => (
  <div data-skin="ulyxes">
    <TransactionError error="User rejected transaction" onRetry={() => alert('Retry')} onCancel={() => alert('Cancel')} />
  </div>
)}

export const InsufficientGas: Story = { render: () => (
  <div data-skin="ulyxes">
    <TransactionError error="Insufficient ETH for gas" onRetry={() => alert('Retry')} />
  </div>
)}
