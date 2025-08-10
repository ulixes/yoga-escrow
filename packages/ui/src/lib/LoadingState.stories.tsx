import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LoadingState } from './LoadingState'

const meta: Meta<typeof LoadingState> = {
  title: 'Ulyx/LoadingState',
  component: LoadingState,
}
export default meta

type Story = StoryObj<typeof LoadingState>

export const CheckingBalance: Story = { render: () => (
  <div data-skin="ulyxes"><LoadingState message="Checking balance…" /></div>
)}

export const ProcessingPayment: Story = { render: () => (
  <div data-skin="ulyxes"><LoadingState message="Processing payment…" /></div>
)}

export const TransactionPending: Story = { render: () => (
  <div data-skin="ulyxes"><LoadingState message="Transaction pending…" /></div>
)}
