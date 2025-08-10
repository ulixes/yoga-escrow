import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { BookingInfo } from './BookingInfo'
import { PasswordlessSignup } from './PasswordlessSignup'

const meta: Meta<typeof BookingInfo> = {
  title: 'Ulyx/BookingInfo',
  component: BookingInfo,
}
export default meta

type Story = StoryObj<typeof BookingInfo>

export const AboveLogin: Story = {
  render: () => (
    <div data-skin="ulyxes" style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
      <BookingInfo variant="full" />
      <PasswordlessSignup onSubmit={(e) => alert(e.email)} />
    </div>
  ),
}

export const SideBySide: Story = {
  render: () => (
    <div data-skin="ulyxes" style={{ display: 'grid', gap: 16 }}>
      <BookingInfo variant="side" />
    </div>
  ),
}

export const Accordion: Story = {
  render: () => (
    <div data-skin="ulyxes" style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
      <BookingInfo variant="accordion" />
      <PasswordlessSignup onSubmit={(e) => alert(e.email)} />
    </div>
  ),
}
