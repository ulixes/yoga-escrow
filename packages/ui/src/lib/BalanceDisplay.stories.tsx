import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { BalanceDisplay } from './BalanceDisplay'

const meta: Meta<typeof BalanceDisplay> = {
  title: 'Ulyx/BalanceDisplay',
  component: BalanceDisplay,
}
export default meta

type Story = StoryObj<typeof BalanceDisplay>

export const ExactlySufficient: Story = { render: () => (
  <div data-skin="ulyxes"><BalanceDisplay balanceUSDC={10} minimumUSDC={10} /></div>
)}

export const Sufficient: Story = { render: () => (
  <div data-skin="ulyxes"><BalanceDisplay balanceUSDC={12.5} minimumUSDC={10} /></div>
)}

export const Insufficient: Story = { render: () => (
  <div data-skin="ulyxes"><BalanceDisplay balanceUSDC={8.25} minimumUSDC={10} /></div>
)}
